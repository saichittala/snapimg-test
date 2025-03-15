import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function Convertjpg() {
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file input change
  const handleFileInputChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(newFiles);
  }, []);

  // Convert image to JPG
  const convertImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image.'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.85
        );
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Error loading image.'));
      };
    });
  }, []);

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
        const processedBlob = await convertImage(file);
        newProcessedFiles.push({ blob: processedBlob, name: file.name });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }

      processedCount++;
      const newProgress = Math.floor((processedCount / totalFiles) * 100);
      setProgress(newProgress);
    }

    setProcessedFiles(newProcessedFiles);
    setIsProcessing(false);

    if (newProcessedFiles.length > 0) {
      alert('Processing complete! Files will download automatically in 5 seconds.');
      setTimeout(() => {
        downloadProcessedFiles();
      }, 5000); // 5-second delay before auto-download
    } else {
      alert('No valid images were processed.');
    }
  }, [files, convertImage, downloadProcessedFiles]);

  // Download processed files
  const downloadProcessedFiles = useCallback(async () => {
    if (!processedFiles.length) {
      alert('No processed files to download. Please process images first.');
      return;
    }

    if (processedFiles.length === 1) {
      const file = processedFiles[0];
      saveAs(file.blob, getOutputName(file.name));
    } else {
      const zip = new JSZip();
      processedFiles.forEach((file) => {
        zip.file(getOutputName(file.name), file.blob, { binary: true });
      });

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'snapimg_processed-images.zip');
    }

    // Reset UI
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
  }, [processedFiles]);

  // Generate output file name
  const getOutputName = useCallback((originalName) => {
    return originalName.replace(/\.[^/.]+$/, '') + '_converted.jpg';
  }, []);

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Convert to JPG</h1>
        <p className="heading-desc">
          Drag and drop your images below to convert them to JPG format
        </p>
      </div>

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
          <img src="img/upload.svg" alt="Upload" className="upload-icon" />
          <h3>Drag & Drop Images</h3>
          <p>or click to browse files</p>
          <p className="support-text">Supports: PNG, WEBP, GIF</p>
        </div>
      </div>

      <div className="action-bar">
        <button
          className="btn-4"
          id="process-btn"
          onClick={processImages}
          disabled={isProcessing || files.length === 0}
        >
          {isProcessing ? 'Processing...' : 'Convert to JPG'}
        </button>
        <button
          className="btn-4"
          id="download-btn"
          onClick={downloadProcessedFiles}
          disabled={processedFiles.length === 0}
        >
          Download
        </button>
        <div className="file-counter" id="file-counter">
          {files.length} files selected
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text" id="progress-text">
          {progress}% Complete
        </div>
      </div>
    </div>
  );
}

export default Convertjpg;