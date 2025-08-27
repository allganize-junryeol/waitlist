# Waitlist Website

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

### 🚀 **권장 방법: Node.js serve** 
```bash
# serve 패키지 설치 (이미 완료!)
npm install

# 서버 실행 (자동으로 브라우저 열림)
npm run open

# 또는 브라우저 자동 열기 없이 실행
npm start
# 또는
npm run serve
```
➡️ **http://localhost:8080** 에서 확인

#### 🌟 **serve 패키지의 장점:**
- ⚡ **초고속 시작** (1초 내 실행)
- 🔄 **핫 리로딩** 자동 지원 (파일 변경 시 자동 새로고침)
- 📱 **모바일 테스트** 쉬움 (네트워크 IP 자동 제공)
- 🛡️ **HTTPS 지원** (프로덕션 테스트 가능)
- 📦 **매우 가벼움** (Python보다 빠름)
- 🎯 **SPA 지원** (Single Page Application 라우팅)
- 🔧 **설정 간편** (별도 설정 파일 불필요)

#### 🛠 **serve 고급 옵션들:**
```bash
# HTTPS로 실행 (PWA 테스트용)
npx serve -s . -l 8080 --ssl

# 다른 포트로 실행
npx serve -s . -l 3000

# 네트워크 접근 허용 (모바일 테스트)
npx serve -s . -l 8080 --host 0.0.0.0

# 캐시 비활성화 (개발 중)
npx serve -s . -l 8080 --no-cache
```

---

### 📋 **기타 실행 방법들:**

#### 방법 2: Python 내장 서버
```bash
npm run serve-python
```

#### 방법 3: PHP 내장 서버  
```bash
npm run serve-php
```

#### 방법 4: VS Code Live Server
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

## 📁 프로젝트 구조 (정적 파일)

```
waitlist/
├── index.html                 # 🏠 메인 waitlist 페이지
├── sitemap.html               # 🗺️ 사이트맵 페이지
├── start.html                 # 🚀 시작 페이지 (런처)
├── assets/                    # 정적 자원
│   ├── css/                  # 스타일시트
│   │   ├── styles.css        # 메인 스타일
│   │   └── sitemap.css       # 사이트맵 스타일
│   ├── js/                   # JavaScript 파일
│   │   ├── script.js         # 메인 로직
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
- **에디터**: GrapesJS v0.21.13 (CDN 로드)
- **서버**: serve v14.2.3 (Node.js 기반)
- **스타일링**: 순수 CSS3 (CSS Grid, Flexbox)  
- **JavaScript**: 최소한의 바닐라 JS
- **반응형**: CSS Media Queries
- **호환성**: 모든 정적 호스팅 서비스

## 📱 **모바일에서 테스트하기**

serve를 사용하면 같은 Wi-Fi 네트워크의 모바일 기기에서도 테스트할 수 있습니다:

```bash
# 모든 네트워크 인터페이스에서 접근 가능하게 실행
npx serve -s . -l 8080 --host 0.0.0.0
```

그 후 모바일에서 **http://[컴퓨터IP]:8080** 으로 접속

컴퓨터 IP 확인: `ifconfig | grep inet` (macOS/Linux)

## 🎨 GrapesJS 웹 에디터 사용법

**중요**: 에디터는 개발 환경에서만 사용하세요. 프로덕션에서는 노출되지 않습니다.

### 에디터 실행
```bash
# 에디터 서버 + 정적 파일 서버 동시 실행
npm run editor-start

# 또는 에디터 서버만 실행 (포트 3001)
npm run editor
```

### 에디터 접속
- **에디터**: http://localhost:3001/editor.html
- **메인 사이트**: http://localhost:8080/index.html

### 페이지 편집
1. 상단에서 편집할 페이지 선택 (`index.html`, `sitemap.html`)
2. '페이지 로드' 버튼으로 기존 페이지 불러오기
3. 드래그 앤 드롭으로 컴포넌트 추가/편집
4. 오른쪽 패널에서 스타일, 속성 수정
5. '저장' 버튼으로 변경사항 저장
6. '미리보기' 버튼으로 결과 확인

### 에디터 기능
- ✅ **비주얼 페이지 편집** - 드래그 앤 드롭 인터페이스
- ✅ **반응형 디자인 미리보기** - 데스크톱/태블릿/모바일
- ✅ **커스텀 Waitlist 컴포넌트** - 대기자 폼, 기능 카드, 히어로 섹션
- ✅ **실시간 미리보기** - 별도 창에서 결과 확인
- ✅ **자동 백업 생성** - 저장 시 자동으로 백업 파일 생성
- ✅ **CSS 스타일 편집** - 시각적 스타일 편집기

### 주의사항
- 에디터는 개발환경에서만 사용 (포트 3001)
- 실제 사이트 서빙은 포트 8080에서
- 저장 시 `backups/` 폴더에 자동 백업
- 프로덕션 배포 시 `editor.html`, `server.js`, `assets/js/editor.js`, `assets/css/editor.css` 파일 제외

## 📄 라이선스

MIT License
