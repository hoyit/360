// pages/Viewer360/components/Canvas/Canvas360.jsx
import React, { forwardRef } from 'react';

const Canvas360 = forwardRef(({ images, dragHandlers }, ref) => {
  const {
    handleStart,
    handleMove,
    handleEnd
  } = dragHandlers;

  return (
    <div className="canvas360">
      <div
        className="canvas360__wrapper"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <canvas
          ref={ref}
          width="600"
          height="400"
          className="canvas360__canvas"
        />
        
        {images.length === 0 && (
          <div className="canvas360__placeholder">
            <div className="canvas360__placeholder-content">
              <div className="canvas360__icon">🖼️</div>
              <h3>이미지를 업로드하세요</h3>
              <p>여러 장의 이미지를 업로드하면<br />360도 뷰어가 나타납니다</p>
              <div className="canvas360__instruction">
                <span>💡 드래그하여 회전할 수 있습니다</span>
              </div>
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="canvas360__overlay">
            <div className="canvas360__info">
              <span className="canvas360__frame-count">
                {images.length} 프레임
              </span>
              <span className="canvas360__drag-hint">
                ← 드래그하여 회전 →
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Canvas360.displayName = 'Canvas360';

export default Canvas360;