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
      manzili: user.zone_name,
      ishlash_joyi: user.workplace_name,
      tolagan_summasi: user.payment,
      qancha_qolgan: user.cost - user.payment,
      berilgan_vaqti: user.given_day,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedResult);

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
    ];
    // Kitob (workbook) yaratish
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${zone_name}'s users`);

    // Excel faylni vaqtinchalik saqlash
    const filePath = path.join(__dirname, `${zone_name}.xlsx`);
    XLSX.writeFile(workbook, filePath);
    // Faylni foydalanuvchiga jo'natish
    res.download(filePath, `${zone_name}.xlsx`, (err) => {
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
