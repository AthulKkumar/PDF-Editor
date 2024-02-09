const router = require("express").Router();

const pdfController = require("./controllers/pdf-controller");

// router.post("/generate-pdf", pdfController.generatePdf);
router.post("/upload-pdf", pdfController.uploadPdf);
router.get("/get-uploaded-pdf/:filename", pdfController.getUploadedPdf);
router.post("/extract-pdf", pdfController.extractPdf);

module.exports = router;
