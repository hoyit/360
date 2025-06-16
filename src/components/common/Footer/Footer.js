// components/common/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* 로고 및 회사 정보 */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="logo-text">SEWON</span>
              <span className="logo-text">360</span>
            </div>
            <p className="footer__description">
              간편하고 강력한 360도 뷰어 제작 도구
            </p>
            <div className="footer__social">
              <a href="#" className="social-link" aria-label="Facebook">
                📘
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                🐦
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                📷
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                📺
              </a>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div className="footer__links">
            <div className="footer__column">
              <h3 className="footer__title">서비스</h3>
              <ul className="footer__list">
                <li><Link to="/viewer" className="footer__link">360도 뷰어</Link></li>
                <li><Link to="/upload" className="footer__link">이미지 업로드</Link></li>
                <li><Link to="/gallery" className="footer__link">갤러리</Link></li>
                <li><a href="#" className="footer__link">프리미엄</a></li>
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__title">고객지원</h3>
              <ul className="footer__list">
                <li><Link to="/guide" className="footer__link">사용법</Link></li>
                <li><a href="#" className="footer__link">FAQ</a></li>
                <li><a href="#" className="footer__link">고객센터</a></li>
                <li><a href="#" className="footer__link">문의하기</a></li>
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__title">회사</h3>
              <ul className="footer__list">
                <li><a href="#" className="footer__link">회사소개</a></li>
                <li><a href="#" className="footer__link">채용정보</a></li>
                <li><a href="#" className="footer__link">뉴스</a></li>
                <li><a href="#" className="footer__link">파트너</a></li>
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__title">법적고지</h3>
              <ul className="footer__list">
                <li><a href="#" className="footer__link">이용약관</a></li>
                <li><a href="#" className="footer__link">개인정보처리방침</a></li>
                <li><a href="#" className="footer__link">쿠키정책</a></li>
                <li><a href="#" className="footer__link">라이센스</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>&copy; {currentYear} SEWON360. 모든 권리 보유.</p>
          </div>
          <div className="footer__info">
            <span>한국어</span>
            <span className="footer__separator">|</span>
            <span>KRW ₩</span>
            <span className="footer__separator">|</span>
            <span>대한민국</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;