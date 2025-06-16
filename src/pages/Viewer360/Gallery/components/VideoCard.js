// src/pages/Gallery/components/VideoCard.js
import React from 'react';

const VideoCard = ({ video, onClick, onDelete, onDownload, formatFileSize }) => {
  // 이벤트 버블링 방지
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onDelete();
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    onDownload();
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="video-card" onClick={onClick}>
      {/* 썸네일 영역 */}
      <div className="video-card__thumbnail">
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.name}
            className="thumbnail-image"
          />
        ) : (
          <div className="thumbnail-placeholder">
            <span className="placeholder-icon">🎥</span>
          </div>
        )}
        
        {/* 호버 시 재생 버튼 */}
        <div className="video-card__overlay">
          <button 
            className="play-button"
            onClick={onClick}
            aria-label="비디오 재생"
          >
            ▶️
          </button>
        </div>

        {/* 액션 버튼들 */}
        <div className="video-card__actions">
          <button
            className="action-btn download-btn"
            onClick={handleDownloadClick}
            title="다운로드"
          >
            📥
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDeleteClick}
            title="삭제"
          >
            🗑️
          </button>
        </div>

        {/* 비디오 타입 뱃지 */}
        <div className="video-card__type-badge">
          {video.type.includes('mp4') ? 'MP4' : 'WebM'}
        </div>
      </div>

      {/* 비디오 정보 */}
      <div className="video-card__info">
        <h3 className="video-card__title">{video.name}</h3>
        
        {video.description && (
          <p className="video-card__description">{video.description}</p>
        )}

        <div className="video-card__meta">
          <div className="meta-row">
            <span className="meta-label">📅 생성일:</span>
            <span className="meta-value">{formatDate(video.createdAt)}</span>
          </div>
          
          <div className="meta-row">
            <span className="meta-label">📊 크기:</span>
            <span className="meta-value">{formatFileSize(video.size)}</span>
          </div>
          
          <div className="meta-row">
            <span className="meta-label">⏱️ 길이:</span>
            <span className="meta-value">{video.duration}</span>
          </div>
          
          {video.frameCount > 0 && (
            <div className="meta-row">
              <span className="meta-label">🖼️ 프레임:</span>
              <span className="meta-value">{video.frameCount}개</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;