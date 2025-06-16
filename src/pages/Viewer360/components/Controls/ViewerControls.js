// src/components/Controls/ViewerControls.js
import React, { useState } from 'react';

const ViewerControls = ({ 
  speed, 
  onSpeedChange, 
  onConvertToVideo,
  onSaveToGallery,
  onAutoRotate, 
  disabled,
  isConverting 
}) => {
  // 비디오 설정 상태
  const [videoDuration, setVideoDuration] = useState(4); // 기본 4초
  const [videoName, setVideoName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // 갤러리 저장 모달 열기
  const handleSaveClick = () => {
    const defaultName = `360도 뷰어 ${new Date().toLocaleDateString('ko-KR')}`;
    setVideoName(defaultName);
    setShowSaveModal(true);
  };

  // 갤러리 저장 확인
  const handleSaveConfirm = () => {
    const finalName = videoName.trim() || `360도 뷰어 ${new Date().toLocaleDateString('ko-KR')}`;
    onSaveToGallery(finalName, videoDuration);
    setShowSaveModal(false);
    setVideoName('');
  };

  // 모달 취소
  const handleSaveCancel = () => {
    setShowSaveModal(false);
    setVideoName('');
  };

  return (
    <div className="viewer-controls">
      <div className="viewer-controls__section">
        <h3 className="viewer-controls__title">뷰어 컨트롤</h3>
        
        {/* 회전 속도 설정 */}
        <div className="viewer-controls__group">
          <label htmlFor="speedRange" className="viewer-controls__label">
            회전 속도: <span className="speed-value">{speed}ms</span>
          </label>
          <input
            type="range"
            id="speedRange"
            className="viewer-controls__range"
            min="30"
            max="200"
            step="10"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          />
          <div className="viewer-controls__range-labels">
            <span>빠름</span>
            <span>느림</span>
          </div>
        </div>

        {/* 비디오 길이 설정 */}
        <div className="viewer-controls__group">
          <label htmlFor="durationRange" className="viewer-controls__label">
            비디오 길이: <span className="duration-value">{videoDuration}초</span>
          </label>
          <input
            type="range"
            id="durationRange"
            className="viewer-controls__range"
            min="2"
            max="15"
            step="1"
            value={videoDuration}
            onChange={(e) => setVideoDuration(Number(e.target.value))}
          />
          <div className="viewer-controls__range-labels">
            <span>2초</span>
            <span>15초</span>
          </div>
        </div>
      </div>

      <div className="viewer-controls__actions">
        <button
          className="viewer-controls__btn viewer-controls__btn--secondary"
          onClick={onAutoRotate}
          disabled={disabled || isConverting}
        >
          <span className="btn-icon">🔄</span>
          한바퀴 회전
        </button>

        <button
          className="viewer-controls__btn viewer-controls__btn--save"
          onClick={handleSaveClick}
          disabled={disabled || isConverting}
        >
          <span className="btn-icon">💾</span>
          {isConverting ? '저장 중...' : '갤러리에 저장'}
        </button>

        <button
          className="viewer-controls__btn viewer-controls__btn--primary"
          onClick={() => onConvertToVideo(videoDuration)}
          disabled={disabled || isConverting}
        >
          <span className="btn-icon">🎥</span>
          {isConverting ? '생성 중...' : '비디오 다운로드'}
        </button>
      </div>

      {/* 저장 모달 */}
      {showSaveModal && (
        <div className="save-modal-overlay">
          <div className="save-modal">
            <div className="save-modal__header">
              <h3>비디오 저장</h3>
              <button 
                className="save-modal__close"
                onClick={handleSaveCancel}
              >
                ✕
              </button>
            </div>
            
            <div className="save-modal__body">
              <div className="input-group">
                <label htmlFor="videoName">비디오 이름</label>
                <input
                  type="text"
                  id="videoName"
                  value={videoName}
                  onChange={(e) => setVideoName(e.target.value)}
                  placeholder="비디오 이름을 입력하세요"
                  maxLength="50"
                />
                <small>{videoName.length}/50</small>
              </div>
              
              <div className="info-group">
                <div className="info-item">
                  <span>비디오 길이:</span>
                  <strong>{videoDuration}초</strong>
                </div>
                <div className="info-item">
                  <span>회전 속도:</span>
                  <strong>{speed}ms</strong>
                </div>
              </div>
            </div>
            
            <div className="save-modal__actions">
              <button 
                className="modal-btn modal-btn--cancel"
                onClick={handleSaveCancel}
              >
                취소
              </button>
              <button 
                className="modal-btn modal-btn--save"
                onClick={handleSaveConfirm}
                disabled={isConverting}
              >
                {isConverting ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isConverting && (
        <div className="viewer-controls__loading">
          <div className="loading-spinner"></div>
          <span>비디오를 생성하고 있습니다... ({videoDuration}초)</span>
        </div>
      )}
    </div>
  );
};

export default ViewerControls;