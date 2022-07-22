const router = require("express").Router();
const pdfCtrl = require("../controllers/parserPdfToJSON");
const upload = require("../middleware/uploadPdf");

router.post("/", upload.single("filePdf"), pdfCtrl.parse);

module.exports = router;
