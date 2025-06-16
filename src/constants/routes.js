// constants/routes.js
export const ROUTES = {
  HOME: '/',
  UPLOAD: '/upload',
  VIEWER: '/viewer',
  GALLERY: '/gallery',
  GUIDE: '/guide'
};

export const NAVIGATION_ITEMS = [
  { path: ROUTES.UPLOAD, label: '이미지 업로드' },
  { path: ROUTES.VIEWER, label: '360도 뷰어' },
  { path: ROUTES.GALLERY, label: '갤러리' },
  { path: ROUTES.GUIDE, label: '사용법' }
];