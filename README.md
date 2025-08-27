# Waitlist Website with GrapesJS Editor

Parcel 기반의 정적 대기자 명단 웹사이트입니다. GrapesJS를 통한 시각적 편집 기능이 포함되어 있으며, JavaScript 사용을 최소화하여 가볍고 빠른 로딩을 제공합니다.

## 📋 주요 기능

- 📱 **완전 반응형** 디자인 (모바일/태블릿/데스크톱)
- 🎨 **GrapesJS 시각적 에디터** 내장
- ✨ **모던하고 깔끔한** UI/UX
- 🚀 **빠른 로딩** 속도 (Parcel 최적화)
- 📧 **이메일 유효성 검사**
- 💫 **부드러운 애니메이션**
- 🎯 **최소한의 JavaScript** 사용
- 🗺️ **사이트맵** 기반 구조화
- 💾 **로컬 저장** 기능 (에디터)

## 🛠 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행

**메인 페이지 (Waitlist)**
```bash
npm start
# 또는
npm run dev
```

**에디터 페이지 (GrapesJS)**
```bash
npm run editor
```

**사이트맵 페이지**
```bash
npm run sitemap
```

**모든 페이지 동시 실행**
```bash
npm run dev:all
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

## 📁 프로젝트 구조

```
waitlist/
├── src/                        # 소스 코드
│   ├── pages/                  # HTML 페이지들
│   │   ├── index.html          # 메인 waitlist 페이지
│   │   ├── editor.html         # GrapesJS 에디터 페이지
│   │   └── sitemap.html        # 사이트맵 페이지
│   ├── assets/                 # 정적 자원
│   │   ├── css/               # 스타일시트
│   │   │   ├── styles.css     # 메인 스타일
│   │   │   ├── editor.css     # 에디터 스타일
│   │   │   └── sitemap.css    # 사이트맵 스타일
│   │   ├── js/                # JavaScript 파일
│   │   │   ├── script.js      # 메인 로직
│   │   │   ├── editor.js      # 에디터 로직
│   │   │   └── sitemap.js     # 사이트맵 로직
│   │   └── images/            # 이미지 파일
│   └── templates/             # 재사용 템플릿
│       └── base.html          # 기본 템플릿
├── dist/                      # 빌드 출력
├── package.json               # NPM 설정
├── .parcelrc                  # Parcel 설정
├── .gitignore                # Git 무시 파일
└── README.md                 # 프로젝트 설명
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
