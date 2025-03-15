import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ImageProcessor = () => {
  const [files, setFiles] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [totalSizeBytes, setTotalSizeBytes] = useState(0);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    const dropZone = document.querySelector('.upload-section');
    dropZone.classList.add('dragover');
  }, []);

  const handleDragLeave = useCallback(() => {
    const dropZone = document.querySelector('.upload-section');
    dropZone.classList.remove('dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const dropZone = document.querySelector('.upload-section');
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleFileInputChange = useCallback((e) => {
    handleFiles(e.target.files);
  }, []);

  const handleFiles = useCallback((files) => {
    if (!files || files.length === 0) {
      console.error('No files selected!');
      return;
    }

    const newFiles = [...files];
    setFiles(newFiles);
    setFileCount(newFiles.length);
    setTotalSizeBytes(newFiles.reduce((acc, file) => acc + file.size, 0));
    displayPreviews(newFiles);
  }, []);

  const displayPreviews = useCallback((files) => {
    const previewContainer = document.querySelector('.image-preview');
    if (!previewContainer) {
      console.error('Preview container not found!');
      return;
    }

    previewContainer.innerHTML = ''; // Clear existing previews

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewItem = createPreviewItem(e.target.result, file.name, index);
        previewContainer.appendChild(previewItem);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const createPreviewItem = useCallback((imageSrc, fileName, index) => {
    const item = document.createElement('div');
    item.className = 'preview-item';
    item.innerHTML = `
      <img src="${imageSrc}" alt="${fileName}" style="width:100%" loading="lazy">
      <div class="processing-overlay" style="display:none">
        <div class="loader"></div>
      </div>
      <img src="img/Delete.svg" alt="Delete" class="delete-btn" data-index="${index}">×>
    `;

    const deleteBtn = item.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteImage(index);
    });

    return item;
  }, []);

  const deleteImage = useCallback((index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setFileCount(newFiles.length);
    setTotalSizeBytes(newFiles.reduce((acc, file) => acc + file.size, 0));
    displayPreviews(newFiles);
  }, [files]);

  const processImages = useCallback(async (processFn) => {
    const previewItems = document.querySelectorAll('.preview-item');
    if (previewItems.length === 0) {
      console.error('No images to process!');
      return;
    }

    const promises = files.map(async (file, index) => {
      const previewItem = previewItems[index];
      if (!previewItem) {
        console.error('Preview item not found for file:', file.name);
        return null;
      }

      const overlay = previewItem.querySelector('.processing-overlay');
      if (overlay) {
        overlay.style.display = 'flex';
      }

      try {
        const processedBlob = await processFn(file);
        if (overlay) {
          overlay.style.display = 'none';
        }
        return { blob: processedBlob, name: file.name };
      } catch (error) {
        console.error('Processing error:', error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter(result => result !== null);
  }, [files]);

  const downloadFiles = useCallback((processedFiles) => {
    if (!processedFiles || processedFiles.length === 0) {
      console.error('No files to download!');
      return;
    }

    if (processedFiles.length === 1) {
      downloadSingle(processedFiles[0]);
    } else {
      downloadZip(processedFiles);
    }
  }, []);

  const downloadSingle = useCallback((file) => {
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getOutputName(file.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const downloadZip = useCallback(async (files) => {
    const zip = new JSZip();

    files.forEach(file => {
      zip.file(getOutputName(file.name), file.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'processed-images.zip');
  }, []);

  const getOutputName = useCallback((originalName) => {
    return originalName;
  }, []);

  const formatSizeUnits = useCallback((bytes) => {
    if (bytes >= 1e12) {
      return (bytes / 1e12).toFixed(2) + ' TB';
    } else if (bytes >= 1e9) {
      return (bytes / 1e9).toFixed(2) + ' GB';
    } else if (bytes >= 1e6) {
      return (bytes / 1e6).toFixed(2) + ' MB';
    } else if (bytes >= 1e3) {
      return (bytes / 1e3).toFixed(2) + ' KB';
    } else {
      return bytes + ' B';
    }
  }, []);

  return (
    <div>
      <div className="upload-section" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <input type="file" id="file-input" onChange={handleFileInputChange} multiple />
        <p>Drag & drop files here or click to upload</p>
      </div>
      <div className="image-preview"></div>
      <div>
        <p>Files: {fileCount}</p>
        <p>Total Size: {formatSizeUnits(totalSizeBytes)}</p>
      </div>
    </div>
  );
};

export default ImageProcessor;