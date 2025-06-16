// src/hooks/useVideoStorage.js
import { useState, useEffect, useCallback } from 'react';

export const useVideoStorage = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 저장된 비디오 목록 로드
  const loadSavedVideos = useCallback(() => {
    try {
      const saved = localStorage.getItem('saved360Videos');
      if (saved) {
        const videos = JSON.parse(saved);
        setSavedVideos(videos);
        console.log('저장된 비디오 로드:', videos.length, '개');
      }
    } catch (error) {
      console.error('저장된 비디오 로드 오류:', error);
    }
  }, []);

  // 컴포넌트 마운트 시 저장된 비디오 목록 로드
  useEffect(() => {
    loadSavedVideos();
  }, [loadSavedVideos]);

  // 비디오 저장 (메인 기능)
  const saveVideo = async (videoBlob, metadata = {}) => {
    setIsLoading(true);
    console.log('비디오 저장 시작...');
    
    try {
      // Blob을 Base64로 변환하여 로컬 스토리지에 저장
      const base64Video = await blobToBase64(videoBlob);
      
      const videoData = {
        id: Date.now().toString(),
        name: metadata.name || `360도 비디오 ${new Date().toLocaleDateString()}`,
        description: metadata.description || '360도 뷰어로 생성된 비디오',
        createdAt: new Date().toISOString(),
        size: videoBlob.size,
        type: videoBlob.type,
        duration: metadata.duration || '4초',
        frameCount: metadata.frameCount || 0,
        data: base64Video, // Base64로 인코딩된 비디오 데이터
        thumbnail: metadata.thumbnail || null // 썸네일 이미지
      };

      // 기존 비디오 목록에 새 비디오 추가 (최신 순)
      const updatedVideos = [videoData, ...savedVideos];
      setSavedVideos(updatedVideos);

      // 로컬 스토리지에 저장
      localStorage.setItem('saved360Videos', JSON.stringify(updatedVideos));
      
      console.log('비디오 저장 완료:', videoData.name);
      return videoData.id;
      
    } catch (error) {
      console.error('비디오 저장 오류:', error);
      throw new Error('비디오 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 비디오 삭제
  const deleteVideo = (videoId) => {
    try {
      const updatedVideos = savedVideos.filter(video => video.id !== videoId);
      setSavedVideos(updatedVideos);
      localStorage.setItem('saved360Videos', JSON.stringify(updatedVideos));
      console.log('비디오 삭제 완료:', videoId);
    } catch (error) {
      console.error('비디오 삭제 오류:', error);
    }
  };

  // 저장된 비디오 다운로드
  const downloadVideo = (video) => {
    try {
      // Base64를 다시 Blob으로 변환
      const blob = base64ToBlob(video.data, video.type);
      const url = URL.createObjectURL(blob);
      
      // 다운로드 링크 생성 및 클릭
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.name}.${getFileExtension(video.type)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // 메모리 정리
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
    } catch (error) {
      console.error('비디오 다운로드 오류:', error);
    }
  };

  // === 유틸리티 함수들 ===
  
  // Blob을 Base64로 변환
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Base64를 Blob으로 변환
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  // 파일 확장자 추출
  const getFileExtension = (mimeType) => {
    if (mimeType.includes('mp4')) return 'mp4';
    if (mimeType.includes('webm')) return 'webm';
    return 'video';
  };

  // 파일 크기 포맷팅 (바이트를 읽기 쉬운 형태로)
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 훅에서 반환하는 값들
  return {
    savedVideos,        // 저장된 비디오 목록
    isLoading,          // 로딩 상태
    saveVideo,          // 비디오 저장 함수
    deleteVideo,        // 비디오 삭제 함수
    downloadVideo,      // 비디오 다운로드 함수
    formatFileSize,     // 파일 크기 포맷팅 함수
    loadSavedVideos     // 비디오 목록 새로고침 함수
  };
};