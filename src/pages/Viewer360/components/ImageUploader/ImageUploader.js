// pages/Viewer360/components/ImageUploader/ImageUploader.jsx
import React, { useRef, useState } from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      onImageUpload({ target: { files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files);
  };

  return (
    <div className="image-uploader">
      <div
        className={`image-uploader__dropzone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="image-uploader__content">
          <div className="image-uploader__icon">📁</div>
          <h3 className="image-uploader__title">이미지 업로드</h3>
          <p className="image-uploader__description">
            여러 장의 이미지를 선택하거나<br />
            이곳에 드래그하여 업로드하세요
          </p>
          <button className="image-uploader__button">
            파일 선택
          </button>
          <div className="image-uploader__formats">
            지원 형식: JPG, PNG, GIF, WEBP
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="image-uploader__input"
          onChange={handleFileChange}
        />
      </div>

      <div className="image-uploader__tips">
        <h4>💡 촬영 팁</h4>
        <ul>
          <li>상품을 중앙에 고정하고 카메라를 원형으로 이동하며 촬영</li>
          <li>20-36장의 이미지로 부드러운 회전 효과</li>
          <li>일정한 간격으로 촬영하여 자연스러운 애니메이션</li>
          <li>조명과 배경을 일정하게 유지</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;