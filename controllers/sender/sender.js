const { selectZone } = require("./model");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const getByZone = async (req, res) => {
  const { zone_name } = req.query;
  if (!zone_name)
    return res.status(400).json({ message: "please send zone_name" });
  try {
    const result = await selectZone(zone_name);
    const formattedResult = result.map((user) => ({
      ID: user.id,
      ismi: user.name,
      mahsulot_nomi: user.product_name,
      narxi: user.cost,
      telefon_raqami_1: user.phone_number,
      telefon_raqami_2: user.phone_number2,
      manzili: user.zone,
      ishlash_joyi: user.workplace,
      tolagan_summasi: user.payment,
      qancha_qolgan: user.cost - user.payment,
      berilgan_vaqti: user.given_day,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedResult);

    worksheet["!cols"] = [
      { wch: 5 }, // ID (5 belgilik kenglik)
      { wch: 20 }, // Ismi (15 belgilik kenglik)
      { wch: 25 }, // Mahsulot_nomi (25 belgilik kenglik)
      { wch: 20 }, // Narxi (10 belgilik kenglik)
      { wch: 18 }, // Telefon_raqami_1 (18 belgilik kenglik)
      { wch: 18 }, // Telefon_raqami_2 (18 belgilik kenglik)
      { wch: 20 }, // Ishlash_joyi (20 belgilik kenglik)
      { wch: 20 },
      { wch: 20 },
      { wch: 15 }, // Tolagan_summasi (15 belgilik kenglik)
      { wch: 15 }, // Berilgan_vaqti (15 belgilik kenglik)
    ];
    // Kitob (workbook) yaratish
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${zone_name}'s users`);

    // Excel faylni vaqtinchalik saqlash
    const filePath = path.join(__dirname, "users.xlsx");
    XLSX.writeFile(workbook, filePath);
    // Faylni foydalanuvchiga jo'natish
    res.download(filePath, "users.xlsx", (err) => {
      if (err) {
        console.error("Faylni jo'natishda xatolik:", err);
        res.status(500).send("Faylni jo'natishda xatolik yuz berdi.");
      }

      // Faylni vaqtinchalik saqlangan joydan o'chirish
      fs.unlinkSync(filePath);
    });
  } catch (e) {
    res.status(500).json({ message: "Error from getByZone", error: e.message });
  }
};
module.exports = { getByZone };
