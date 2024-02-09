const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const http = require("http");

class PdfController {
  /**
   * Handle file upload
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response
   */
  async uploadPdf(req, res) {
    // Set up multer storage configuration
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "files/");
      },
      filename: function (req, file, cb) {
        // Generate a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        cb(null, file.fieldname + "-" + uniqueSuffix);
      },
    });

    // Initialize multer for file upload
    const upload = multer({
      storage,
      limits: { fileSize: 1000000 * 100 }, // Limit file size to 100MB
    }).single("myfile");

    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message }); // Handle upload error
      }

      if (!req.file) {
        return res.json({ error: "No file uploaded" }); // Handle case where no file is uploaded
      }

      // Respond with success message and uploaded filename
      res.json({
        success: "File uploaded successfully",
        filename: req.file.filename,
      });
    });
  }

  /**
   * Retrieve uploaded PDF file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} File response
   */
  async getUploadedPdf(req, res) {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({ error: "No filename provided" });
    }

    const filePath = path.join(__dirname, `../files/${filename}`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Send the file if it exists
    res.status(200).sendFile(filePath);
  }

  /**
   * Extract selected pages from PDF and save as a new file
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response
   */
  async extractPdf(req, res) {
    const { filename, extractPages } = req.body;

    // Check if filename is provided
    if (!filename) {
      return res.status(400).json({ error: "No filename provided" });
    }

    try {
      // Read the existing PDF file
      const existingPdfBytes = fs.readFileSync(
        path.join(__dirname, `../files/${filename}`)
      );

      // Load the PDF document
      const existingPdfDoc = await PDFDocument.load(existingPdfBytes);
      const pdfDoc = await PDFDocument.create();

      // Copy selected pages to the new document
      const copiedPages = await pdfDoc.copyPages(existingPdfDoc, extractPages);
      copiedPages.forEach((page) => pdfDoc.addPage(page));

      // Save the new PDF document
      const pdfBytes = await pdfDoc.save();
      const outputFilePath = path.join(
        __dirname,
        `../files/updated/${Date.now()}-extracted.pdf`
      );
      fs.writeFileSync(outputFilePath, pdfBytes);

      // Respond with success message and new file details
      res.json({
        success: "PDF extracted successfully",
        fileName: path.basename(outputFilePath),
        filePath: `/static/updated/${path.basename(outputFilePath)}`,
      });
    } catch (error) {
      // Handle extraction error
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PdfController();
