# Waitlist 웹사이트 + GrapesJS 에디터

대기자 명단 웹사이트와 GrapesJS 비주얼 에디터가 통합된 프로젝트입니다.

## ✨ 주요 기능

### 🎯 대기자 명단 웹사이트
- 이메일/이름 등록 기능
- 반응형 디자인 + 현대적 UI
- 성공/오류 메시지, 애니메이션

### 🎨 GrapesJS 비주얼 에디터
- **HTML/CSS 페어 파일 관리**: `index.html` ↔ `index.css` 자동 연결
- **CSS 완전 분리**: 인라인 스타일 → CSS 파일로 완전 분리
- **예쁜 포매팅**: HTML/CSS 자동 정리 (js-beautify)
- **실시간 미리보기**: 드래그 앤 드롭으로 쉬운 편집

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **에디터**: GrapesJS 0.22.12
- **서버**: Express.js + Node.js
- **포매팅**: js-beautify
- **기타**: CORS, 파일 시스템 관리

## 🚀 빠른 시작

### 1. 의존성 설치 및 서버 실행

```bash
# 저장소 클론
git clone <your-repo-url>
cd waitlist

# 의존성 설치
npm install

# GrapesJS 에디터 서버 시작
npm run editor
# 또는
node server.js
```

### 2. 접속

- **🎨 GrapesJS 에디터**: http://localhost:3000/editor.html
- **🌐 대기자 명단 사이트**: http://localhost:3000/index.html

## 📁 프로젝트 구조

```
waitlist/
├── 📝 에디터
│   ├── index.html          # GrapesJS 에디터 페이지
│   ├── index.js            # GrapesJS 에디터 JS
│   ├── server.js           # Express 서버 (에디터 API)
│   └── package.json        # 의존성 관리
├── 🌐 웹사이트
│   └── assets/
│       ├── 🎨 페어 파일
│       │   ├── home.html    # 메인 페이지
│       │   ├── home.css     # home.html 전용 CSS
│       │   └── sitemap.html # 사이트 맵 페이지
│       │   └── sitemap.css  # sitemap.html 전용 CSS
```

## 🎨 GrapesJS 에디터 사용법

### 1. 파일 편집
1. 왼쪽 사이드바에서 HTML 파일 선택 (index.html, sitemap.html)
2. 드래그 앤 드롭으로 컴포넌트 추가/편집
3. 스타일 매니저에서 CSS 속성 조정
4. **Save** 버튼으로 저장

### 2. HTML/CSS 페어 파일 관리
- 저장시 자동으로 `index.html` → `index.css` 페어 생성
- 인라인 스타일 완전 제거, CSS 파일로 분리
- HTML/CSS 자동 포매팅으로 깔끔한 코드 유지

### 3. 미리보기
- **Preview** 버튼으로 실시간 미리보기
- 반응형 디바이스 테스트 가능

## 🚀 배포

### GitHub Pages 배포 (권장 ⭐)

이 프로젝트는 `waitlist` 폴더를 GitHub Pages로 자동 배포하도록 설정되어 있습니다.

#### 1. GitHub Pages 활성화
1. GitHub 저장소 → **Settings** → **Pages**
2. **Source**: `GitHub Actions` 선택
3. 코드를 `main` 브랜치에 푸시하면 자동 배포됩니다

#### 2. 로컬 미리보기
```bash
# waitlist 폴더만 미리보기 (GitHub Pages와 동일한 환경)
npm run preview-github-pages

# 또는
npm run serve-waitlist
```

#### 3. 배포 상태 확인
- **Actions** 탭에서 배포 진행 상황 확인
- 배포 완료 후 `https://[username].github.io/[repository-name]`에서 확인

### 기타 정적 사이트 배포
1. **Netlify / Vercel**
   - `waitlist/` 폴더를 루트 디렉토리로 설정하여 배포
   - Build command: 없음 (정적 파일)
   - Publish directory: `waitlist`

### 전체 프로젝트 배포 (에디터 포함)
```bash
# PM2로 서버 실행 (프로덕션)
npm install -g pm2
pm2 start server.js --name waitlist-editor

# 또는 Docker 사용
docker build -t waitlist-editor .
docker run -p 3000:3000 waitlist-editor
```

## 🔧 개발 참고사항

- **페어 파일 관리**: HTML 파일당 1개의 CSS 파일 자동 생성
- **코드 포매팅**: js-beautify로 HTML/CSS 자동 정리
- **실시간 편집**: GrapesJS로 즉시 시각적 편집 가능

---

✨ **완벽한 HTML/CSS 페어 파일 관리 시스템으로 깔끔하고 체계적인 코드 유지!** 🎉