// src/App.js (갤러리 페이지 추가)
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Viewer360 from './pages/Viewer360/Viewer360';
import Gallery from './pages/Viewer360/Gallery/Gallery';  
import Footer from './components/common/Footer/Footer';
import './App.scss';

// 기본 페이지 컴포넌트들
const HomePage = () => (
  <div className="page-content">
    <h1>360도 뷰어 메인</h1>
    <p>이미지를 업로드하여 360도 뷰어를 만들어보세요!</p>
    <div style={{ marginTop: '20px' }}>
      <Link to="/viewer" style={{ 
        color: '#4285f4', 
        textDecoration: 'none',
        padding: '10px 20px',
        border: '1px solid #4285f4',
        borderRadius: '4px',
        display: 'inline-block',
        marginRight: '10px'
      }}>
        360도 뷰어 시작하기 →
      </Link>
      <Link to="/gallery" style={{ 
        color: '#38a169', 
        textDecoration: 'none',
        padding: '10px 20px',
        border: '1px solid #38a169',
        borderRadius: '4px',
        display: 'inline-block'
      }}>
        갤러리 보기 →
      </Link>
    </div>
  </div>
);

const UploadPage = () => (
  <div className="page-content">
    <h1>이미지 업로드</h1>
    <p>360도 뷰어용 이미지를 업로드하는 페이지입니다.</p>
  </div>
);

const GuidePage = () => (
  <div className="page-content">
    <h1>사용법</h1>
    <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
      <h3>1. 이미지 준비</h3>
      <p>• 상품을 중앙에 고정하고 카메라를 원형으로 이동하며 촬영</p>
      <p>• 20-36장의 이미지로 부드러운 회전 효과</p>
      
      <h3>2. 업로드</h3>
      <p>• 360도 뷰어 페이지에서 여러 이미지를 한번에 선택</p>
      <p>• 드래그 앤 드롭으로 간편하게 업로드</p>
      
      <h3>3. 뷰어 조작</h3>
      <p>• 마우스 드래그로 좌우 회전</p>
      <p>• 슬라이더로 특정 프레임 이동</p>
      <p>• 자동 회전 및 비디오 변환 기능</p>
      
      <h3>4. 갤러리 저장</h3>
      <p>• "갤러리에 저장" 버튼으로 비디오 보관</p>
      <p>• 갤러리에서 저장된 비디오 재생 및 관리</p>
    </div>
  </div>
);

// 헤더 컴포넌트
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <Link to="/" className="header__logo">
            <span className="logo-text">SEWON</span>
            <span className="logo-text">360</span>
          </Link>
          
          <nav className="header__nav">
            <Link 
              to="/viewer" 
              className={`nav-link ${isActive('/viewer') ? 'active' : ''}`}
            >
              360도 뷰어
            </Link>
            <Link 
              to="/gallery" 
              className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
            >
              갤러리
            </Link>
            <Link 
              to="/guide" 
              className={`nav-link ${isActive('/guide') ? 'active' : ''}`}
            >
              사용법
            </Link>
          </nav>
        </div>
        
        <div className="header__right">
          <button className="btn btn--secondary">로그인</button>
          <button className="btn btn--primary">가입하기</button>
          <div 
            className={`header__menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      
      {/* 모바일 메뉴 */}
      <nav className={`header__nav--mobile ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link 
          to="/upload" 
          className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          이미지 업로드
        </Link>
        <Link 
          to="/viewer" 
          className={`nav-link ${isActive('/viewer') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          360도 뷰어
        </Link>
        <Link 
          to="/gallery" 
          className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          갤러리
        </Link>
        <Link 
          to="/guide" 
          className={`nav-link ${isActive('/guide') ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          사용법
        </Link>
      </nav>
    </header>
  );
};

// 메인 앱 컴포넌트
const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/viewer" element={<Viewer360 />} />
            <Route path="/gallery" element={<Gallery />} />  {/* 추가 */}
            <Route path="/guide" element={<GuidePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;