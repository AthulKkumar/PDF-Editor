import React, { useState } from "react";
import axios from "axios";

import styles from "./PdfUploader.module.css";
import PdfViewer from "../PdfViewer/PdfViewer";

const PdfUploader = () => {
  const [pdf, setPdf] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("myfile", pdf);
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload-pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully: ", result.data);
      setUploadedFile(result.data);
      setError(null); // Reset error state
    } catch (error) {
      console.error("Error uploading the file: ", error);
      setError("Error uploading the file. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.uploaderContainer}>
        <h4>Upload your PDF</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setPdf(e.target.files[0])}
          />
          <div className={styles.buttonSection}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      {uploadedFile && <PdfViewer file={uploadedFile} />}
      {error && <p className="error">{error}</p>}
    </>
  );
};

export default PdfUploader;
