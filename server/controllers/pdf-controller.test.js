const pdfController = require("./pdf-controller");
const path = require("path");
const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");

describe("GET /uploaded-pdf/:filename (getUploadedPdf)", () => {
  const filesDir = path.join(__dirname, "../server/files");
  const tempFilePath = path.join(filesDir, "temp.pdf");

  beforeEach(async () => {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < 4; i++) {
      pdfDoc.addPage([300, 400]);
    }
    const pdfBytes = await pdfDoc.save();

    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }

    fs.writeFileSync(tempFilePath, pdfBytes);
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  test("should return 400 if no filename is provided", async () => {
    const req = { params: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await pdfController.getUploadedPdf(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "No filename provided" });
  });

  test("should return 404 if file does not exist", async () => {
    const req = { params: { filename: "nonexistent.pdf" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendFile: jest.fn(),
    };
    await pdfController.getUploadedPdf(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "File not found" });
  });

  test("should return the file path if file exists", async () => {
    const req = { params: { filename: "temp.pdf" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendFile: jest.fn(),
    };
    await pdfController.getUploadedPdf(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.sendFile).strign(filePath);
  });
});

describe("POST /extract-pdf (extractPdf)", () => {
  let filePath;

  beforeEach(async () => {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < 4; i++) {
      pdfDoc.addPage([300, 400]);
    }
    const pdfBytes = await pdfDoc.save();
    filePath = path.join(__dirname, "temp.pdf");
    fs.writeFileSync(filePath, pdfBytes);
  });

  afterEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  test("should return 400 if no filename is provided", async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await pdfController.extractPdf(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "No filename provided" });
  });
});
