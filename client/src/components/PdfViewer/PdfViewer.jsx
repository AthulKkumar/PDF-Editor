import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

import styles from "./PdfViewer.module.css";
import ExtractButton from "../ExtractButton/ExtractButton";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [extractPages, setExtractPages] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-uploaded-pdf/${file.filename}`,
          {
            responseType: "blob",
          }
        );
        setPdfFile(response.data);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, [file]);

  const handleCheckbox = (e, pageNumber) => {
    pageNumber = pageNumber - 1;
    const isChecked = e.target.checked;
    if (isChecked) {
      setExtractPages((prevPages) => [...prevPages, pageNumber]);
    } else {
      setExtractPages((prevPages) =>
        prevPages.filter((page) => page !== pageNumber)
      );
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Render single pages
  const renderPages = () => {
    const pages = [];
    for (let i = 0; i <= numPages; i++) {
      const pageNumber = i;
      pages.push(
        <div key={i} className={styles.singlePage}>
          <Page
            pageNumber={i}
            onLoadError={(error) => console.error("Error loading page:", error)}
            onItemClick={(e) => console.log("Clicked on page:", e)}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
          <label>
            Page {i}
            <input
              type="checkbox"
              onChange={(e) => handleCheckbox(e, pageNumber)}
            />
          </label>
        </div>
      );
    }
    return pages;
  };

  return (
    <>
      <div className={styles.pdfViewerContainer}>
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) =>
            console.error("Error loading document:", error)
          }
        >
          <div className={styles.pageContainer}>{renderPages()}</div>
        </Document>
        <p>
          Page {extractPages.join(", ")} selected out of {numPages}
        </p>
      </div>
      <ExtractButton filename={file.filename} extractPages={extractPages} />
    </>
  );
};

export default PdfViewer;
