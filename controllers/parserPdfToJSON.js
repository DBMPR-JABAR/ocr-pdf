const fs = require("fs");
var pdf_table_extractor = require("pdf-table-extractor");

var jsonData;
const pdfController = {
  parse: async (req, res) => {
    try {
      const file = req.file;
      var tableRow = [];
      await pdf_table_extractor(file.path, success, error);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await jsonData.pageTables.forEach((table) => {
        table.tables.forEach((row) => {
          tableRow.push(row);
        });
      });

      var fixValue = [];
      tableRow.forEach((table) => {
        if (table.filter(detectFloatingNumber).length > 0) {
          fixValue.push(table.filter(detectFloatingNumber));
        }
      });

      return res.status(200).json({
        message: "Success",
        data: {
          rencana:
            parseFloat(fixValue[0][0]) +
            parseFloat(fixValue[0][3] == null ? 0 : fixValue[0][3]),
          realisasi:
            parseFloat(fixValue[0][1]) +
            parseFloat(fixValue[0][4] == null ? 0 : fixValue[0][4]),
          deviasi:
            parseFloat(fixValue[0][2]) +
            parseFloat(fixValue[0][5] == null ? 0 : fixValue[0][5]),
        },
      });
    } catch (error) {
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

//PDF parsed
function success(result) {
  jsonData = result;
}

//Error
function error(err) {
  console.error("Error: " + err);
}

module.exports = pdfController;
