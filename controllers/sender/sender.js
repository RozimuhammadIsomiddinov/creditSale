const { selectZone, selectAllZone } = require("./model");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const getByZone = async (req, res) => {
  const { zone_name } = req.query;
  /*  if (!zone_name)
    return res.status(400).json({ message: "please send zone_name" });
  */ try {
    const result = await selectZone(zone_name);
    const formattedResult = result.map((user) => ({
      ID: user.id,
      ismi: user.name,
      "mahsulot nomi": user.product_name,
      narxi: user.cost.toLocaleString("en-US").replace(/,/g, " "),
      "1-telefon raqami": user.phone_number,
      "2-telefon raqami": user.phone_number2,
      "ishlash joyi": user.workplace_name,
      "tolagan summasi": user.payment
        .toLocaleString("en-US")
        .replace(/,/g, " "),
      "qancha qolgan": (user.cost - user.payment)
        .toLocaleString("en-US")
        .replace(/,/g, " "),
      "bu oydagi oxirgi to'lov": user.last_payment_amount
        ? user.last_payment_amount.toLocaleString("en-US").replace(/,/g, " ")
        : "0",
      "tovar berilgan vaqti": user.given_day,
      "to'lov vaqti": user.last_payment_date
        ? user.last_payment_date
        : "    to'lov yo'q",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedResult);

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 11 },
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
        res
          .status(500)
          .send("Faylni jo'natishda xatolik yuz berdi.\n" + err.message);
      }

      // Faylni vaqtinchalik saqlangan joydan o'chirish
      fs.unlinkSync(filePath);
    });
  } catch (e) {
    res.status(500).json({ message: "Error from getByZone", error: e.message });
  }
};

const getAllZoneXLSX = async (req, res) => {
  try {
    const result = await selectAllZone();
    const formattedResult = result.map((user) => ({
      ID: user.id,
      ismi: user.name,
      manzili: user.zone_name,
      "mahsulot nomi": user.product_name,
      narxi: user.cost.toLocaleString("en-US").replace(/,/g, " "),
      "1-telefon raqami": user.phone_number,
      "2-telefon raqami": user.phone_number2,
      "tovar berilgan vaqti": user.given_day,
      "ishlash joyi": user.workplace_name,
      "tolagan summasi": user.payment
        .toLocaleString("en-US")
        .replace(/,/g, " "),
      "qancha qolgan": (user.cost - user.payment)
        .toLocaleString("en-US")
        .replace(/,/g, " "),
      "bu oydagi to'lov": user.last_payment_amount
        ? user.last_payment_amount.toLocaleString("en-US").replace(/,/g, " ")
        : "0",
      "to'lov vaqti": user.last_payment_date
        ? user.last_payment_date
        : "    to'lov yo'q",
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedResult);

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 11 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 11 },
    ];

    const workbook = XLSX.utils.book_new();

    const filePath = path.join(__dirname, `hamma_xaridorlar.xlsx`);
    XLSX.utils.book_append_sheet(workbook, worksheet);

    XLSX.writeFile(workbook, filePath);
    res.download(filePath, (e) => {
      if (e) {
        res
          .status(500)
          .send("Faylni jo'natishda xatolik yuz berdi.\n" + e.message);
      }
      fs.unlinkSync(filePath);
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error from getAllZone", error: e.message });
  }
};
module.exports = { getByZone, getAllZoneXLSX };
