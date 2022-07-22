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

      const headers = [
        "Rencana",
        "Realisasi",
        "Deviasi",
        "Rencana K3",
        "Realisasi K3",
        "Deviasi K3",
      ];
      var fixValue = [];
      tableRow.forEach((table) => {
        if (table.filter(detectFloatingNumber).length > 0) {
          fixValue.push(table.filter(detectFloatingNumber));
        }
      });
      fixValue.forEach((table) => {
        table.length = headers.length;
      });

      return res.status(200).json({
        message: "Success",
        data: {
          headers,
          fixValue,
        },
      });
    } catch (error) {
      console.log(error);
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
