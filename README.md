# Waitlist Website with GrapesJS Editor

**빌드 과정 없이 바로 실행 가능한** 정적 대기자 명단 웹사이트입니다. GrapesJS를 통한 시각적 편집 기능이 포함되어 있으며, JavaScript 사용을 최소화하여 가볍고 빠른 로딩을 제공합니다.

## 📋 주요 기능

- ⚡ **빌드 과정 불필요** - 바로 실행 가능한 정적 파일
- 📱 **완전 반응형** 디자인 (모바일/태블릿/데스크톱)  
- 🎨 **GrapesJS 시각적 에디터** 내장 (CDN 로드)
- ✨ **모던하고 깔끔한** UI/UX
- 🚀 **즉시 실행** 가능 (정적 서버만 필요)
- 📧 **이메일 유효성 검사**
- 💫 **부드러운 애니메이션**
- 🎯 **최소한의 JavaScript** 사용
- 🗺️ **사이트맵** 기반 구조화
- 💾 **브라우저 로컬 저장** 기능

## 🛠 빠른 시작 (빌드 불필요!)

### 방법 1: Python 내장 서버 (권장)
```bash
# 프로젝트 폴더에서 실행
python3 -m http.server 8080

# 또는 npm 스크립트 사용
npm start
```
➡️ **http://localhost:8080** 에서 확인

### 방법 2: Node.js HTTP 서버
```bash
# http-server 설치 (한 번만)
npm install -g http-server

# 서버 실행
http-server . -p 8080 -o

# 또는 npm 스크립트 사용
npm run serve-node
```

### 방법 3: PHP 내장 서버
```bash
php -S localhost:8080

# 또는 npm 스크립트 사용  
npm run serve-php
```

### 방법 4: VS Code Live Server
1. VS Code에서 `index.html` 우클릭
2. "Open with Live Server" 선택

> **💡 참고**: 어떤 방법을 사용하든 **빌드 과정이 없어** 파일을 수정하면 새로고침만으로 바로 반영됩니다!

## ⚙️ API 설정

`assets/js/script.js` 파일에서 API 엔드포인트를 실제 서버 URL로 변경하세요:

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

## 🎨 GrapesJS 에디터 사용법

### 에디터 접속
```bash
npm run editor
```
또는 브라우저에서 `/editor.html`로 접속

### 주요 기능
- **드래그 앤 드롭** 컴포넌트 배치
- **반응형 미리보기** (Desktop/Tablet/Mobile)
- **실시간 편집** 및 **즉시 미리보기**
- **로컬 저장** 기능 (LocalStorage)
- **CSS 스타일 편집**
- **HTML 구조 편집**

### 키보드 단축키
- `Ctrl/Cmd + S`: 저장
- `Ctrl/Cmd + P`: 미리보기

### 저장된 페이지 관리
- 에디터에서 편집한 내용은 브라우저 LocalStorage에 저장됩니다
- 사이트맵 페이지에서 저장된 모든 페이지를 확인할 수 있습니다
- 각 페이지별로 개별 편집/미리보기/삭제가 가능합니다

## 📁 프로젝트 구조 (정적 파일)

```
waitlist/
├── index.html                 # 🏠 메인 waitlist 페이지
├── editor.html                # 🎨 GrapesJS 에디터 페이지  
├── sitemap.html               # 🗺️ 사이트맵 페이지
├── start.html                 # 🚀 시작 페이지 (런처)
├── assets/                    # 정적 자원
│   ├── css/                  # 스타일시트
│   │   ├── styles.css        # 메인 스타일
│   │   ├── editor.css        # 에디터 스타일
│   │   └── sitemap.css       # 사이트맵 스타일
│   ├── js/                   # JavaScript 파일
│   │   ├── script.js         # 메인 로직
│   │   ├── editor.js         # GrapesJS 에디터 로직
│   │   └── sitemap.js        # 사이트맵 로직
│   └── images/               # 이미지 파일
├── package.json              # NPM 설정 (정적 서버용)
├── .gitignore               # Git 무시 파일
└── README.md                # 프로젝트 설명

✨ 특징: 빌드 도구 없이 바로 실행 가능!
```

## 🎨 커스터마이징

### 색상 변경
`assets/css/styles.css`에서 다음 그라데이션 색상을 변경할 수 있습니다:

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

## 🚀 배포 (초간단!)

**빌드 과정이 없어** 프로젝트 폴더를 그대로 업로드하면 됩니다:

### 무료 호스팅
- **Netlify**: 폴더 드래그 앤 드롭으로 즉시 배포
- **Vercel**: Git 연동 또는 폴더 업로드
- **GitHub Pages**: Repository 업로드 후 Settings에서 활성화
- **Firebase Hosting**: `firebase deploy` 한 번으로 배포

### 서버 호스팅
- **일반 웹호스팅**: FTP로 파일 업로드
- **AWS S3**: 정적 웹사이트 호스팅 설정
- **Cloudflare Pages**: Git 연동 배포

> **💡 장점**: `node_modules`, `.parcel-cache`, `dist` 폴더가 없어 업로드 용량이 작고 빠릅니다!

## 🔧 기술 스택

- **구조**: 순수 HTML5 정적 파일
- **에디터**: GrapesJS (CDN 로드)
- **스타일링**: 순수 CSS3 (CSS Grid, Flexbox)  
- **JavaScript**: 최소한의 바닐라 JS
- **반응형**: CSS Media Queries
- **서버**: Python/Node.js/PHP 내장 서버

## 📄 라이선스

MIT License
