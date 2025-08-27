# 🎨 GrapesJS 웹 에디터 사용 가이드

## 🚀 에디터 실행 방법

### 1. 서버 실행
```bash
# 에디터 서버 + 정적 파일 서버 동시 실행
npm run editor-start

# 또는 개별 실행
npm run editor    # 에디터 서버 (포트 3001)
npm run serve     # 정적 파일 서버 (포트 8080)
```

### 2. 에디터 접속
- **🎨 에디터**: http://localhost:3001/editor.html
- **🔍 메인 사이트**: http://localhost:8080/index.html

---

## 📖 에디터 사용법

### 기본 편집 워크플로우
1. **페이지 선택** → 상단 드롭다운에서 편집할 페이지 선택
2. **페이지 로드** → "페이지 로드" 버튼으로 기존 페이지 불러오기
3. **요소 편집** → iframe 안의 요소를 클릭하여 선택
4. **스타일 수정** → 우측 패널에서 스타일 속성 변경
5. **저장** → "저장" 버튼으로 변경사항 저장
6. **미리보기** → "미리보기" 버튼으로 새 창에서 결과 확인

### 🎯 편집 가능한 페이지
- **index.html** - 메인 대기자 명단 페이지
- **sitemap.html** - 사이트맵 페이지

---

## 🛠️ 에디터 패널 가이드

### 좌측 블록 패널
- **Waitlist 컴포넌트** 카테고리:
  - 🎯 **대기자 폼** - 이메일/이름 입력 폼
  - 📦 **기능 카드** - 개별 기능 소개 카드
  - 🏠 **히어로 섹션** - 메인 제목 영역
  - ⚡ **기능 그리드** - 3개 기능 카드 그리드

### 우측 스타일 패널
- **General** - 기본 속성 (ID, class, 태그명)
- **Dimension** - 크기, 여백, 패딩
- **Typography** - 폰트, 크기, 색상, 정렬
- **Decorations** - 배경, 테두리, 그림자
- **Extra** - 고급 CSS 속성

### 상단 툴바
- **View components** - 컴포넌트 트리 보기
- **Preview** - 미리보기 모드
- **Fullscreen** - 전체화면 모드  
- **View code** - HTML/CSS 코드 보기

### 디바이스 미리보기
- 🖥️ **Desktop** - 데스크톱 (기본)
- 📱 **Tablet** - 태블릿 (768px)
- 📱 **Mobile landscape** - 모바일 가로 (568px)
- 📱 **Mobile portrait** - 모바일 세로 (320px)

---

## ✨ 고급 편집 기능

### 드래그 앤 드롭 편집
1. 좌측에서 블록을 선택
2. iframe 안의 원하는 위치로 드래그
3. 자동으로 HTML 구조에 추가됨

### 클래스 기반 스타일링
1. 요소 선택 후 우측 "Classes" 영역 확인
2. 기존 CSS 클래스들이 자동으로 인식됨
3. 새 클래스 추가하거나 기존 클래스 수정 가능

### 반응형 편집
1. 상단에서 디바이스 크기 선택
2. 각 디바이스별로 다른 스타일 적용 가능
3. 미디어 쿼리 자동 생성

---

## 🔧 문제 해결

### CSS가 적용되지 않는 경우
✅ **해결됨** - 다음 기능들이 자동으로 적용됩니다:
- Canvas에 CSS 파일 자동 로드
- 인라인 스타일 직접 주입
- 캔버스 재로드 시 CSS 재적용

### 페이지 로드 실패
```bash
# 서버 재시작
pkill -f "node server.js"
npm run editor
```

### 변경사항이 저장되지 않음
- `backups/` 폴더 확인 (자동 백업)
- 브라우저 개발자 도구에서 네트워크 에러 확인

---

## 📁 생성된 파일들

### 🎨 에디터 관련 파일들 (개발환경 전용)
```
editor.html           # GrapesJS 에디터 메인 페이지
server.js             # Express 백엔드 서버
assets/js/editor.js   # 에디터 로직
assets/css/editor.css # 에디터 스타일
backups/              # 자동 백업 폴더
```

### 🚨 중요사항
- **프로덕션 배포 시 위 파일들 제외**
- `.gitignore`에 이미 등록됨
- 실제 서비스는 포트 8080, 에디터는 포트 3001 분리

---

## 🎯 사용 팁

### ⚡ 효율적인 편집
- 요소를 더블클릭하면 텍스트 직접 편집
- Shift + 클릭으로 다중 선택
- Ctrl/Cmd + Z로 실행 취소

### 🎨 스타일링 팁  
- Typography에서 폰트 크기/색상 변경
- Decorations에서 배경/테두리 수정
- Dimension에서 여백/패딩 조절

### 💾 저장 및 백업
- 저장 시 `backups/` 폴더에 타임스탬프 백업 자동 생성
- 원본 파일 안전하게 보존
- 실험적 변경도 안심하고 시도 가능

---

## 🔗 유용한 링크

- **GrapesJS 공식 문서**: https://grapesjs.com/docs/
- **CSS Grid 가이드**: https://css-tricks.com/snippets/css/complete-guide-grid/
- **Flexbox 가이드**: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

---

**즐거운 편집 되세요! 🚀**
