import React, { useState } from "react";
import axios from "axios";

import styles from "./ExtractButton.module.css";

const ExtractButton = ({ filename, extractPages }) => {
  const [extractedPdfUrl, setExtractedPdfUrl] = useState(null);
  const [extracting, setExtracting] = useState(false);

  async function extractPdf() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/extract-pdf`,
        { filename, extractPages },
        { responseType: "json" }
      );
      const fileUrl = `${import.meta.env.VITE_API_URL}${
        response.data.filePath
      }`;
      setExtractedPdfUrl(fileUrl);
      setExtracting(true);
    } catch (error) {
      console.error("Error extracting PDF:", error);
      setExtracting(false);
    }
  }

  const handleViewPdf = () => {
    window.open(extractedPdfUrl, "_blank");
  };

  return (
    <div>
      {extracting ? (
        <>
          <button className={styles.button} onClick={handleViewPdf}>
            View & Download
          </button>
        </>
      ) : (
        <button className={styles.button} onClick={extractPdf}>
          Extract
        </button>
      )}
    </div>
  );
};

export default ExtractButton;
