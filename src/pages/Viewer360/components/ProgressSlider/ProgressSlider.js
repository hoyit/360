// pages/Viewer360/components/ProgressSlider/ProgressSlider.jsx
import React from 'react';

const ProgressSlider = ({ min, max, value, onChange }) => {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="progress-slider">
      <div className="progress-slider__header">
        <label className="progress-slider__label">프레임 탐색</label>
        <span className="progress-slider__counter">
          {value + 1} / {max + 1}
        </span>
      </div>
      
      <div className="progress-slider__container">
        <input
          type="range"
          className="progress-slider__input"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
        />
        <div 
          className="progress-slider__track"
          style={{ '--progress': `${percentage}%` }}
        >
          <div className="progress-slider__fill"></div>
          <div className="progress-slider__thumb"></div>
        </div>
      </div>
      
      <div className="progress-slider__markers">
        <span>시작</span>
        <span>끝</span>
      </div>
    </div>
  );
};

export default ProgressSlider;