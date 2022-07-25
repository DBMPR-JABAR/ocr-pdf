const fs = require("fs");
const { PdfReader } = require("pdfreader");

const pdfController = {
  parse: async (req, res) => {
    try {
      const file = req.file;
      const data = await readFile(file.path);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      var fixValue = [];
      data.forEach((text) => {
        if (detectFloatingNumber(text)) {
          fixValue.push(text.includes(".") ? text : text.replace(",", "."));
        }
      });
      return res.status(200).json({
        message: "Success",
        data: {
          rencana: parseFloat(fixValue[0]),
          realisasi: parseFloat(fixValue[1]),
          deviasi: parseFloat(fixValue[2]),
          filePath: file.path,
        },
      });
    } catch (error) {
      fs.unlink(file.path, (err) => {
        if (err) throw err;
      });
      return res.status(500).json({
        message: "Error",
        data: {
          error,
        },
      });
    }
  },
};

function getRowRencana(row) {
  return row.includes("Nama Paket");
}

function detectFloatingNumber(text) {
  const regex = /^[+-]?([0-9]{1,2})(([,.]{1})([0-9]{1,3}))?$/;
  return text.length >= 5 && text.length <= 6 && regex.test(text);
}

async function readFile(path) {
  const jsonData = [];
  Promise.resolve(
    new PdfReader().parseFileItems(path, (err, item) => {
      if (err) console.error("error:", err);
      else if (!item) console.warn("end of file");
      else if (item.text) {
        jsonData.push(item.text);
      }
    })
  );
  return jsonData;
}

module.exports = pdfController;
