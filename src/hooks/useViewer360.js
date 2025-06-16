// src/hooks/useViewer360.js
import { useState, useRef, useEffect, useCallback } from 'react';

export const useViewer360 = () => {
  const [images, setImages] = useState([]);
  const [speed, setSpeed] = useState(100);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const canvasRef = useRef(null);

  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isAutoPlayingRef = useRef(false);

  // 캔버스에 이미지 그리기
  const drawImageByIndex = useCallback((index) => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = images[index];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [images]);

  // 이미지가 변경될 때마다 캔버스 업데이트
  useEffect(() => {
    if (images.length > 0) {
      drawImageByIndex(frameIndex);
    }
  }, [images, frameIndex, drawImageByIndex]);

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(urls);
    setFrameIndex(0);

    // 업로드 후 자동으로 한바퀴 회전
    setTimeout(() => {
      autoRotateOnce(urls.length);
    }, 500);
  };

  // 드래그 시작
  const handleStart = (clientX) => {
    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
  };

  // 드래그 이동
  const handleMove = (clientX) => {
    if (!isDraggingRef.current || isAutoPlayingRef.current) return;
    const dx = clientX - dragStartXRef.current;
    const frameShift = Math.floor(dx / 10);
    if (frameShift !== 0) {
      dragStartXRef.current = clientX;
      setFrameIndex((prev) => (prev + frameShift + images.length) % images.length);
    }
  };

  // 드래그 종료
  const handleEnd = () => {
    isDraggingRef.current = false;
  };

  // 자동 회전 (한바퀴)
  const autoRotateOnce = (frameTotal) => {
    if (frameTotal === 0) return;
    isAutoPlayingRef.current = true;
    let index = 0;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameTotal);
      index++;
      if (index >= frameTotal) {
        clearInterval(interval);
        isAutoPlayingRef.current = false;
      }
    }, 100);
  };

  // 슬라이더 변경
  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    if (images.length > 0) {
      setFrameIndex(value);
    }
  };

  // 썸네일 생성 (갤러리용)
  const generateThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    // 작은 캔버스로 썸네일 생성 (160x120 크기)
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = 160;
    thumbCanvas.height = 120;
    const thumbCtx = thumbCanvas.getContext('2d');
    
    // 현재 캔버스 내용을 썸네일 크기로 복사
    thumbCtx.drawImage(canvas, 0, 0, 160, 120);
    
    // Base64 이미지로 반환 (JPEG, 70% 품질)
    return thumbCanvas.toDataURL('image/jpeg', 0.7);
  };

  // 비디오 Blob 생성 (갤러리 저장용) - 개선된 버전
  const convertToVideoBlob = async (duration = 4, customName = null) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) {
      throw new Error('이미지를 먼저 업로드해주세요.');
    }

    setIsConverting(true);
    console.log(`비디오 생성 시작: ${duration}초, 이름: ${customName || '기본'}`);
    
    try {
      const stream = canvas.captureStream(30); // 30fps
      
      // 브라우저가 지원하는 최적의 비디오 형식 선택
      const supportedTypes = [
        'video/mp4;codecs=h264',
        'video/mp4;codecs=avc1.42E01E',
        'video/mp4',
        'video/webm;codecs=vp9', 
        'video/webm;codecs=vp8',
        'video/webm'
      ];

      let selectedType = 'video/webm';
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedType = type;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType: selectedType,
        videoBitsPerSecond: 3000000 // 3Mbps 고품질
      });
      
      const chunks = [];

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: selectedType });
          resolve({
            blob,
            type: selectedType,
            extension: selectedType.includes('mp4') ? 'mp4' : 'webm',
            duration: `${duration}초`,
            customName: customName
          });
        };

        mediaRecorder.onerror = reject;

        // 녹화 시작
        mediaRecorder.start();
        
        // 지정된 시간만큼 360도 회전 애니메이션 실행
        startViewerAndCapture(duration, () => {}).then(() => {
          setTimeout(() => {
            mediaRecorder.stop();
          }, 100);
        }).catch(reject);
      });
      
    } catch (error) {
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  // 비디오 다운로드 (기존 기능) - 개선된 버전
  const convertToVideo = async (duration = 4) => {
    try {
      const result = await convertToVideoBlob(duration);
      const timestamp = new Date().getTime();
      const filename = `360video_${duration}s_${timestamp}.${result.extension}`;
      
      downloadVideo(result.blob, filename);
      
      const formatName = result.extension.toUpperCase();
      alert(`🎥 ${duration}초 ${formatName} 비디오가 성공적으로 다운로드되었습니다!`);
    } catch (error) {
      console.error('비디오 다운로드 오류:', error);
      alert('비디오 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 비디오 다운로드 함수
  const downloadVideo = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // 뷰어 실행 및 캡처 (개선된 버전)
  const startViewerAndCapture = async (duration, drawOnceCallback) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const durationMs = duration * 1000; // 초를 밀리초로 변환
    const frameDelay = speed;
    const totalFrames = Math.floor(durationMs / frameDelay);
    
    console.log(`애니메이션 시작: ${duration}초 (${totalFrames} 프레임)`);

    for (let i = 0; i < totalFrames; i++) {
      const imageIndex = i % images.length;
      const img = new Image();
      img.src = images[imageIndex];

      await new Promise((resolve) => {
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // UI 동기화
          setFrameIndex(imageIndex);
          
          if (drawOnceCallback) drawOnceCallback();
          
          setTimeout(resolve, frameDelay);
        };
        
        img.onerror = () => {
          console.warn(`이미지 로드 실패: ${img.src}`);
          resolve();
        };
      });
    }
    
    console.log('애니메이션 완료');
  };

  // 드래그 핸들러들
  const dragHandlers = {
    handleStart,
    handleMove,
    handleEnd
  };

  return {
    images,
    speed,
    frameIndex,
    canvasRef,
    isConverting,
    handleImageUpload,
    handleSliderChange,
    setSpeed,
    convertToVideo,        // 이제 duration 파라미터 지원
    convertToVideoBlob,    // 이제 duration과 customName 파라미터 지원
    generateThumbnail,
    autoRotateOnce,
    dragHandlers
  };
};