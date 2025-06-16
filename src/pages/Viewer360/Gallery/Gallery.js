// src/pages/Gallery/Gallery.js
import React, { useState } from 'react';
import { useVideoStorage } from '../../../hooks/useVideoStorage';
import VideoCard from './components/VideoCard';
import VideoModal from './components/VideoModal';
import './Gallery.scss';

const Gallery = () => {
  const { savedVideos, deleteVideo, downloadVideo, formatFileSize } = useVideoStorage();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'size'

  // 비디오 정렬
  const sortedVideos = [...savedVideos].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return b.size - a.size;
      case 'date':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // 비디오 상세 보기
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // 비디오 삭제
  const handleDeleteVideo = (videoId) => {
    if (window.confirm('정말로 이 비디오를 삭제하시겠습니까?')) {
      deleteVideo(videoId);
      // 현재 열린 모달의 비디오가 삭제된 경우 모달 닫기
      if (selectedVideo && selectedVideo.id === videoId) {
        handleCloseModal();
      }
    }
  };

  return (
    <div className="gallery">
      <div className="gallery__container">
        <header className="gallery__header">
          <h1>🎬 비디오 갤러리</h1>
          <p>360도 뷰어로 생성한 비디오들을 확인하고 관리하세요</p>
          
          {savedVideos.length > 0 && (
            <div className="gallery__stats">
              <span className="stats-item">
                📹 총 {savedVideos.length}개 비디오
              </span>
              <span className="stats-item">
                💾 총 용량: {formatFileSize(
                  savedVideos.reduce((total, video) => total + video.size, 0)
                )}
              </span>
            </div>
          )}
        </header>

        {savedVideos.length === 0 ? (
          <div className="gallery__empty">
            <div className="empty-content">
              <div className="empty-icon">📂</div>
              <h3>저장된 비디오가 없습니다</h3>
              <p>360도 뷰어에서 비디오를 생성하고 "갤러리에 저장" 버튼을 눌러보세요!</p>
              <a href="/viewer" className="empty-link">
                360도 뷰어로 이동 →
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="gallery__controls">
              <div className="sort-controls">
                <label htmlFor="sortBy">정렬 기준:</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="date">생성일 순</option>
                  <option value="name">이름 순</option>
                  <option value="size">크기 순</option>
                </select>
              </div>
            </div>

            <div className="gallery__grid">
              {sortedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => handleVideoClick(video)}
                  onDelete={() => handleDeleteVideo(video.id)}
                  onDownload={() => downloadVideo(video)}
                  formatFileSize={formatFileSize}
                />
              ))}
            </div>
          </>
        )}

        {/* 비디오 상세 모달 */}
        {isModalOpen && selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onClose={handleCloseModal}
            onDelete={() => handleDeleteVideo(selectedVideo.id)}
            onDownload={() => downloadVideo(selectedVideo)}
            formatFileSize={formatFileSize}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;