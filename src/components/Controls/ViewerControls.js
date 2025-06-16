// pages/Viewer360/components/Controls/ViewerControls.jsx
import React from 'react';
import './ViewerControls.scss';

const ViewerControls = ({ 
  speed, 
  onSpeedChange, 
  onConvertToVideo, 
  onSaveVideo,
  onAutoRotate, 
  disabled,
  isConverting
}) => {
  return (
    <div className="viewer-controls">
      <div className="viewer-controls__section">
        <h3 className="viewer-controls__title">뷰어 컨트롤</h3>
        
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
          className="viewer-controls__btn viewer-controls__btn--accent"
          onClick={onSaveVideo}
          disabled={disabled || isConverting}
        >
          <span className="btn-icon">💾</span>
          {isConverting ? '저장 중...' : '갤러리에 저장'}
        </button>

        <button
          className="viewer-controls__btn viewer-controls__btn--primary"
          onClick={onConvertToVideo}
          disabled={disabled || isConverting}
        >
          <span className="btn-icon">🎥</span>
          {isConverting ? '생성 중...' : '비디오 다운로드'}
        </button>
      </div>

      {isConverting && (
        <div className="viewer-controls__loading">
          <div className="loading-spinner"></div>
          <span>비디오를 생성하고 있습니다...</span>
        </div>
      )}
    </div>
  );
};

export default ViewerControls;