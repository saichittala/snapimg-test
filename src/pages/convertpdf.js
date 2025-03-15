import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

function ConvertToPdf() {
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [combinePdf, setCombinePdf] = useState(true); // Toggle for combining PDFs

  // Handle file input change
  const handleFileInputChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  // Helper function to format file size
const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

// Function to calculate total size of uploaded images
const getTotalSize = () => files.reduce((total, file) => total + file.size, 0);
  // Convert image to PDF
  const convertImageToPdf = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = () => {
        const pdf = new jsPDF('p', 'mm', 'a4'); // Create a new PDF in portrait mode, A4 size
        const width = pdf.internal.pageSize.getWidth(); // Get PDF page width
        const height = pdf.internal.pageSize.getHeight(); // Get PDF page height

        // Calculate aspect ratio to fit the image within the PDF page
        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = imgWidth / imgHeight;
        const pdfWidth = width;
        const pdfHeight = pdfWidth / ratio;

        // Add the image to the PDF
        pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        // Generate the PDF blob
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);
        URL.revokeObjectURL(url);
      };

      img.onerror = (err) => {
        console.error('Error loading image:', err);
        URL.revokeObjectURL(url);
        reject(new Error('Error loading image.'));
      };
    });
  }, []);

  // Generate output file name
  const getOutputName = useCallback((originalName) => {
    return originalName.replace(/\.[^/.]+$/, '') + '_converted.pdf'; // Change extension to PDF
  }, []);

  // Download processed files
  const downloadProcessedFiles = useCallback(async () => {
    if (processedFiles.length === 0) {
      alert('No processed files to download.');
      return;
    }

    if (combinePdf) {
      // Combine all images into one PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      for (let i = 0; i < processedFiles.length; i++) {
        const file = processedFiles[i];
        const img = new Image();
        const url = URL.createObjectURL(file.blob);
        img.src = url;

        await new Promise((resolve) => {
          img.onload = () => {
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            const ratio = img.width / img.height;
            const pdfWidth = width;
            const pdfHeight = pdfWidth / ratio;

            pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            if (i < processedFiles.length - 1) {
              pdf.addPage(); // Add a new page for the next image
            }
            URL.revokeObjectURL(url);
            resolve();
          };
        });
      }

      const pdfBlob = pdf.output('blob');
      saveAs(pdfBlob, 'combined-images.pdf');
    } else {
      // Save each image as a separate PDF file
      if (processedFiles.length === 1) {
        const file = processedFiles[0];
        saveAs(file.blob, getOutputName(file.name));
      } else {
        const zip = new JSZip();
        for (const file of processedFiles) {
          zip.file(getOutputName(file.name), file.blob);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, 'snapimg-processed-pdfs.zip');
      }
    }

    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setIsProcessed(false);
  }, [processedFiles, combinePdf, getOutputName]);

  // Process all images
  const processImages = useCallback(async () => {
    if (!files || files.length === 0) {
      alert('No files selected. Please upload images first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const supportedTypes = ['image/png', 'image/webp', 'image/gif', 'image/jpeg'];
    const totalFiles = files.length;
    let processedCount = 0;
    const newProcessedFiles = [];

    for (let file of files) {
      if (!supportedTypes.includes(file.type)) {
        alert(`Unsupported file type: ${file.name}. Only PNG, WEBP, GIF, and JPEG allowed.`);
        continue;
      }

      try {
        const pdfBlob = await convertImageToPdf(file);
        newProcessedFiles.push({ blob: pdfBlob, name: file.name });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }

      processedCount++;
      setProgress(Math.floor((processedCount / totalFiles) * 100));
    }

    setProcessedFiles(newProcessedFiles);
    setIsProcessing(false);
    setIsProcessed(newProcessedFiles.length > 0);

    if (newProcessedFiles.length > 0) {
      // alert('Processing complete! You can now download the files.');
    } else {
      alert('No valid images were processed.');
    }
  }, [files, convertImageToPdf]);

  // Delete a file from the list
  const deleteFile = useCallback((index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file));
    };
  }, [files]);

  useEffect(() => {
    const dropZone = document.getElementById('drop-zone');

    const handleDragOver = (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    };

    const handleDragLeave = () => {
      dropZone.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');

      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  const resetState = () => {
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setIsProcessed(false);
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Convert to PDF</h1>
        <p className="heading-desc">
          Drag and drop your images below to convert them to PDF format
        </p>
      </div>

      <div className='main-container-div'>
        <div className='middle-container'>
          <div className="upload-section" id="drop-zone">
            <input
              type="file"
              id="file-input"
              multiple
              onChange={handleFileInputChange}
              hidden
            />
            <div
              className="upload-content"
              onClick={() => document.getElementById('file-input').click()}
            >
              <img src="/img/upload.svg" alt="Upload" className="upload-icon" />
              <h3>Drag & Drop Images</h3>
              <p>or click to browse files</p>
              <p className="support-text">Supports: PNG, WEBP, GIF, JPEG</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="image-preview-main">
              <div className='image-preview-sub'>
                <h3>Uploaded Images</h3>
                <div className="file-counter">
                  {files.length} files uploaded | {formatFileSize(getTotalSize())}
                </div>
              </div>
              <div className='image-preview-grid'>
                {files.map((file, index) => (
                  <div key={index} className="preview-item">
                    <span className='filesize-img'>{formatFileSize(file.size)}</span>

                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="preview-image"
                    />
                    <button
                      className="delete-btn"
                      onClick={() => deleteFile(index)}
                    >
                      <img src="/img/delete.svg" alt="Delete" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Combine PDF Option */}
        <div className='right-options-container'>
          <div>
            <h3 className='right-options-heading'>Progress</h3>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="progress-text" id="progress-text">
                {progress}% Completed
              </div>
            </div>
          </div>
          <div>
            <h3 className='right-options-heading'>Actions</h3>
            <div className="action-bar">
              {!isProcessed ? (
                <button className="btn-4" onClick={processImages} disabled={isProcessing || files.length === 0}>
                  {isProcessing ? 'Processing...' : 'Convert to PDF'}
                </button>
              ) : (
                <button className="btn-4" onClick={downloadProcessedFiles}>
                  Download
                </button>
              )}

              {isProcessed && (
                <button className="btn-2" onClick={resetState} style={{ marginLeft: '10px' }}>
                  Reset
                </button>
              )}
            </div>
          </div>
          <div className="compression-options">
            <div>
              <h3 className='right-options-heading'>Image Merge</h3>
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    checked={combinePdf}
                    onChange={() => setCombinePdf(!combinePdf)}
                  />
                  Enable
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ConvertToPdf;