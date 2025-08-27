# Waitlist Website

Parcel 기반의 정적 대기자 명단 웹사이트입니다. JavaScript 사용을 최소화하여 가볍고 빠른 로딩을 제공합니다.

## 📋 기능

- 📱 완전 반응형 디자인
- ✨ 모던하고 깔끔한 UI
- 🚀 빠른 로딩 속도
- 📧 이메일 유효성 검사
- 💫 부드러운 애니메이션
- 🎯 최소한의 JavaScript 사용

## 🛠 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm start
# 또는
npm run dev
```

### 3. 프로덕션 빌드
```bash
npm run build
```

### 4. 캐시 정리
```bash
npm run clean
```

## ⚙️ API 설정

`script.js` 파일에서 API 엔드포인트를 실제 서버 URL로 변경하세요:

```javascript
const API_ENDPOINT = 'https://your-api-endpoint.com/waitlist';
```

### API 요청 형식
웹사이트는 다음 형식으로 POST 요청을 보냅니다:

```json
{
  "email": "user@example.com",
  "name": "사용자 이름"
}
```

## 📁 프로젝트 구조

```
waitlist/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일
├── script.js           # JavaScript 로직
├── package.json        # NPM 설정
├── .gitignore         # Git 무시 파일
└── README.md          # 프로젝트 설명
```

## 🎨 커스터마이징

### 색상 변경
`styles.css`에서 다음 그라데이션 색상을 변경할 수 있습니다:

```css
/* 메인 배경 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 버튼 색상 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### 텍스트 수정
`index.html`에서 제목, 설명, 기능 설명 등을 원하는 대로 수정할 수 있습니다.

## 📱 반응형 지원

- 데스크톱: 1200px+
- 태블릿: 768px - 1199px  
- 모바일: 480px - 767px
- 소형 모바일: ~479px

## 🚀 배포

빌드된 `dist/` 폴더를 다음 플랫폼에 배포할 수 있습니다:

- **Netlify**: 드래그 앤 드롭으로 간편 배포
- **Vercel**: Git 연동 자동 배포
- **GitHub Pages**: 정적 호스팅
- **AWS S3**: 정적 웹사이트 호스팅

## 🔧 기술 스택

- **빌드 도구**: Parcel 2.12.0
- **스타일링**: 순수 CSS (CSS Grid, Flexbox)
- **JavaScript**: 최소한의 바닐라 JS
- **반응형**: CSS Media Queries

## 📄 라이선스

MIT License
