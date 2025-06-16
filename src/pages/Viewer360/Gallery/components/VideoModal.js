// src/pages/Gallery/components/VideoModal.js
import React, { useEffect, useRef } from 'react';

const VideoModal = ({ video, onClose, onDelete, onDownload, formatFileSize }) => {
  const modalRef = useRef(null);
  const videoRef = useRef(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 모달 외부 클릭으로 닫기
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  // 비디오 소스 URL 생성
  const getVideoUrl = () => {
    if (!video.data) return null;
    
    try {
      // Base64를 Blob으로 변환
      const byteCharacters = atob(video.data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: video.type });
      
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('비디오 URL 생성 오류:', error);
      return null;
    }
  };

  const videoUrl = getVideoUrl();

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 비디오를 삭제하시겠습니까?')) {
      onDelete();
    }
  };

  return (
    <div 
      ref={modalRef}
      className="video-modal" 
      onClick={handleBackdropClick}
    >
      <div className="video-modal__content">
        {/* 모달 헤더 */}
        <div className="video-modal__header">
          <h2 className="video-modal__title">{video.name}</h2>
          <button 
            className="video-modal__close"
            onClick={onClose}
            aria-label="모달 닫기"
          >
            ✕
          </button>
        </div>

        {/* 모달 바디 */}
        <div className="video-modal__body">
          {/* 비디오 플레이어 */}
          <div className="video-modal__player">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                loop
                className="video-player"
                onError={(e) => console.error('비디오 재생 오류:', e)}
              >
                브라우저가 비디오 재생을 지원하지 않습니다.
              </video>
            ) : (
              <div className="video-error">
                <span className="error-icon">⚠️</span>
                <p>비디오를 로드할 수 없습니다.</p>
              </div>
            )}
          </div>

          {/* 비디오 정보 */}
          <div className="video-modal__info">
            {video.description && (
              <div className="info-section">
                <h4>📝 설명</h4>
                <p>{video.description}</p>
              </div>
            )}

            <div className="info-section">
              <h4>📊 상세 정보</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">생성일:</span>
                  <span className="info-value">{formatDate(video.createdAt)}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">파일 크기:</span>
                  <span className="info-value">{formatFileSize(video.size)}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">비디오 길이:</span>
                  <span className="info-value">{video.duration}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">형식:</span>
                  <span className="info-value">
                    {video.type.includes('mp4') ? 'MP4' : 'WebM'}
                  </span>
                </div>
                
                {video.frameCount > 0 && (
                  <div className="info-item">
                    <span className="info-label">프레임 수:</span>
                    <span className="info-value">{video.frameCount}개</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 모달 액션 버튼들 */}
        <div className="video-modal__actions">
          <button 
            className="modal-btn modal-btn--secondary"
            onClick={onDownload}
          >
            📥 다운로드
          </button>
          
          <button 
            className="modal-btn modal-btn--danger"
            onClick={handleDelete}
          >
            🗑️ 삭제
          </button>
          
          <button 
            className="modal-btn modal-btn--primary"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;