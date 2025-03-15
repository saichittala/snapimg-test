import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function Compressimages() {
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [quality, setQuality] = useState(60); // Default quality for lossy compression
  const [isLossless, setIsLossless] = useState(false); // Toggle for lossless compression
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  // Handle file input change
  const handleFileInputChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files).filter(file =>
      file.type === 'image/png' ||
      file.type === 'image/webp' ||
      file.type === 'image/gif' ||
      file.type === 'image/jpeg'
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  // Compress image based on quality (lossy) or lossless
  const compressImage = useCallback((file, quality, isLossless) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url); // Cleanup URL
            if (!blob) {
              console.error('Failed to compress image:', file.name);
              reject(new Error('Failed to compress image.'));
              return;
            }
            resolve({ blob, name: file.name, size: blob.size });
          },
          mimeType,
          isLossless ? 1 : quality / 100
        );
      };

      img.onerror = (err) => {
        console.error('Error loading image:', err);
        URL.revokeObjectURL(url); // Ensure cleanup on error
        reject(new Error('Error loading image.'));
      };

      img.src = url; // Set src after event handlers
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

    const totalFiles = files.length;
    let processedCount = 0;
    const newProcessedFiles = [];

    for (let file of files) {
      try {
        const compressedBlob = await compressImage(file, quality, isLossless);
        newProcessedFiles.push(compressedBlob);
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
      // alert('Compression complete! You can now download the files.');
    } else {
      alert('No valid images were processed.');
    }
  }, [files, quality, isLossless, compressImage]);

  // Download processed files
  const downloadProcessedFiles = useCallback(async () => {
    if (processedFiles.length === 0) {
      alert('No processed files to download.');
      return;
    }

    if (processedFiles.length === 1) {
      const file = processedFiles[0];
      saveAs(file.blob, `compressed_${file.name}`);
    } else {
      const zip = new JSZip();
      for (const file of processedFiles) {
        zip.file(`compressed_${file.name}`, file.blob, { binary: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'compressed-images.zip');
    }

    // Reset UI
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setIsProcessed(false);
  }, [processedFiles]);

  // Delete a file from the list
  const deleteFile = useCallback((index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  // Reset the entire state
  const resetState = () => {
    setFiles([]);
    setProcessedFiles([]);
    setProgress(0);
    setIsProcessed(false);
  };

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
  

  return (
    <main className="tool-container">
      <div className="tool-header">
        <h1>Compress Images</h1>
        <p className="heading-desc">Drag and drop your images below to compress</p>
      </div>
      <div className='main-container-div'>
        <div className='middle-container'>
          <div className="upload-section" id="drop-zone">
            <input
              type="file"
              id="file-input"
              multiple
              onChange={handleFileInputChange}
              accept=".png,.webp,.gif,.jpeg,.jpg"
              hidden
            />
            <div
              className="upload-content"
              onClick={() => document.getElementById('file-input').click()}
            >
              <img src="img/upload.svg" alt="Upload" className="upload-icon" />
              <h3>Drag & Drop Images</h3>
              <p>or click to browse files</p>
              <p className="support-text">Supports: PNG, WebP, GIF, JPEG</p>
            </div>
          </div>

          {/* File Previews */}
          {files.length > 0 && (
          <div className="image-preview-main">
            <div className='image-preview-sub'>
              <h3>
                Uploaded Images
              </h3>
              <div className="file-counter">
                {files.length} files uploaded
              </div>
            </div>
            <div className='image-preview-grid'>
              {files.map((file, index) => (
                <div key={index} className="preview-item">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="preview-image"
                  />
                  <button
                    className="delete-btn"
                    onClick={() => deleteFile(index)}
                  >
                    <img src="img/delete.svg" alt="Delete" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
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
            <div>
              <h3 className='right-options-heading'>Actions</h3>
              <div className="action-bar">
                {!isProcessed ? (
                  <button
                    className="btn-4"
                    onClick={processImages}
                    disabled={isProcessing || files.length === 0}
                  >
                    {isProcessing ? 'Compressing...' : 'Compress Images'}
                  </button>
                ) : (
                  <>
                    <button
                      className="btn-4"
                      onClick={downloadProcessedFiles}
                    >
                      Download
                    </button>
                    <button
                      className="btn-2"
                      onClick={resetState}
                      style={{ marginLeft: '10px' }}
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>

          <div className="compression-options">
            <div>
              <h3 className='right-options-heading'>Lossless Compression</h3>
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    checked={isLossless}
                    onChange={() => setIsLossless(!isLossless)}
                  />
                  Enable
                </label>
              </div>
            </div>
          </div>
          {!isLossless && (
            <div>
              <><h3 className='right-options-heading'>Quality</h3><div className="quality-slider">
                <input
                  type="range"
                  id="quality-range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={isLossless} />
                <div className='quality-range-text'>
                  {quality}%
                </div>
              </div></>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default Compressimages;


