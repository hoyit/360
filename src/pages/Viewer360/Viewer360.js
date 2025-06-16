// src/pages/Viewer360/Viewer360.js
import React from 'react';
import Canvas360 from './components/Canvas/Canvas360';
import ViewerControls from './components/Controls/ViewerControls';
import ImageUploader from './components/ImageUploader/ImageUploader';
import ProgressSlider from './components/ProgressSlider/ProgressSlider';
import { useViewer360 } from '../../hooks/useViewer360';
import { useVideoStorage } from '../../hooks/useVideoStorage';
import './Viewer360.scss';

const Viewer360 = () => {
  const {
    images,
    speed,
    frameIndex,
    canvasRef,
    isConverting,
    handleImageUpload,
    handleSliderChange,
    setSpeed,
    convertToVideo,
    convertToVideoBlob,
    generateThumbnail,
    autoRotateOnce,
    dragHandlers
  } = useViewer360();

  const { saveVideo, isLoading: isSaving } = useVideoStorage();

  // 갤러리에 비디오 저장하는 함수 (이름과 시간 지원)
  const handleSaveToGallery = async (customName, duration) => {
    try {
      console.log('갤러리 저장 시작:', { customName, duration });
      
      // 1. 비디오 생성 (이름과 시간 전달)
      const result = await convertToVideoBlob(duration, customName);
      
      // 2. 썸네일 생성
      const thumbnail = generateThumbnail();
      
      // 3. 메타데이터 준비
      const metadata = {
        name: customName || `360도 뷰어 ${new Date().toLocaleDateString('ko-KR')}`,
        description: `${images.length}개 프레임으로 생성된 ${duration}초 360도 비디오`,
        duration: `${duration}초`,
        frameCount: images.length,
        thumbnail: thumbnail,
        createdSettings: {
          speed: speed,
          duration: duration,
          frameCount: images.length
        }
      };

      // 4. 갤러리에 저장
      const savedId = await saveVideo(result.blob, metadata);
      
      // 5. 성공 알림
      alert(`🎉 "${customName}"이(가) 갤러리에 저장되었습니다!\n갤러리 페이지에서 확인할 수 있습니다.`);
      console.log('갤러리 저장 완료:', { savedId, name: customName, duration });
      
    } catch (error) {
      console.error('갤러리 저장 오류:', error);
      alert('❌ 비디오 저장 중 오류가 발생했습니다.\n다시 시도해 주세요.');
    }
  };

  return (
    <div className="viewer360">
      <div className="viewer360__container">
        <header className="viewer360__header">
          <h1>360° 상품 뷰어</h1>
          <p>이미지를 업로드하고 드래그하여 360도로 회전해보세요.</p>
        </header>

        <main className="viewer360__content">
          <section className="viewer360__upload">
            <ImageUploader onImageUpload={handleImageUpload} />
          </section>

          <section className="viewer360__canvas">
            <Canvas360 
              ref={canvasRef}
              images={images}
              dragHandlers={dragHandlers}
            />
          </section>

          {images.length > 0 && (
            <>
              <section className="viewer360__slider">
                <ProgressSlider
                  min={0}
                  max={images.length - 1}
                  value={frameIndex}
                  onChange={handleSliderChange}
                />
              </section>

              <section className="viewer360__controls">
                <ViewerControls
                  speed={speed}
                  onSpeedChange={setSpeed}
                  onConvertToVideo={convertToVideo}        // duration 파라미터 지원
                  onSaveToGallery={handleSaveToGallery}    // name, duration 파라미터 지원
                  onAutoRotate={() => autoRotateOnce(images.length)}
                  disabled={images.length === 0}
                  isConverting={isConverting || isSaving}
                />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Viewer360;