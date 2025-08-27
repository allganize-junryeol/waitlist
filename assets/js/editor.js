// GrapesJS Editor for Waitlist Website
class WaitlistEditor {
    constructor() {
        this.editor = null;
        this.currentFile = null;
        this.fileTree = [];
        this.init();
    }

    init() {
        // GrapesJS 초기화 - 단순하고 확실하게
        this.editor = grapesjs.init({
            container: '#gjs',
            height: '100%',
            width: 'auto',
            storageManager: false,
            fromElement: false,
            showOffsets: true,
            noticeOnUnload: false,
            
            // 캔버스 설정 - CSS 파일들을 직접 로드
            canvas: {
                styles: [
                    'http://localhost:3001/assets/css/styles.css',
                    'http://localhost:3001/assets/css/sitemap.css'
                ]
            },
            
            // 에셋 매니저 설정
            assetManager: {
                upload: false,
                uploadFile: false
            },
            
            // 반응형 디바이스 설정
            deviceManager: {
                devices: [{
                    name: 'Desktop',
                    width: '',
                }, {
                    name: 'Tablet',
                    width: '768px',
                    widthMedia: '992px',
                }, {
                    name: 'Mobile landscape',
                    width: '568px',
                    widthMedia: '768px',
                }, {
                    name: 'Mobile portrait',
                    width: '320px',
                    widthMedia: '480px',
                }]
            }
        });

        // 커스텀 블록 추가
        this.addCustomBlocks();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 파일 트리 로드
        this.loadFileTree();
    }

    addCustomBlocks() {
        const bm = this.editor.BlockManager;
        
        // 커스텀 블록들 추가
        bm.add('waitlist-form', {
            label: '대기자 폼',
            content: `
                <div class="waitlist-form-container">
                    <form class="waitlist-form" id="waitlistForm">
                        <div class="form-group">
                            <label for="email" class="form-label">이메일 주소</label>
                            <input type="email" id="email" name="email" class="form-input" placeholder="your@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="name" class="form-label">이름 (선택사항)</label>
                            <input type="text" id="name" name="name" class="form-input" placeholder="이름을 입력해주세요">
                        </div>
                        <button type="submit" class="submit-btn">
                            <span class="btn-text">대기 명단 참여하기</span>
                            <span class="btn-loading hidden">제출 중...</span>
                        </button>
                    </form>
                </div>
            `,
            category: 'Waitlist 컴포넌트',
        });

        bm.add('feature-card', {
            label: '기능 카드',
            content: `
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>제목</h3>
                    <p>설명을 입력하세요</p>
                </div>
            `,
            category: 'Waitlist 컴포넌트',
        });

        bm.add('hero-section', {
            label: '히어로 섹션',
            content: `
                <header class="hero">
                    <h1 class="hero-title">타이틀</h1>
                    <p class="hero-subtitle">부제목을 입력하세요</p>
                </header>
            `,
            category: 'Waitlist 컴포넌트',
        });

        bm.add('features-grid', {
            label: '기능 그리드',
            content: `
                <div class="features">
                    <h2 class="features-title">무엇을 기대할 수 있나요?</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🚀</div>
                            <h3>얼리 액세스</h3>
                            <p>정식 출시 전 특별한 미리보기 기능을 체험하세요</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">💎</div>
                            <h3>독점 혜택</h3>
                            <p>대기자 명단 참여자만을 위한 특별 할인과 혜택</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">🔔</div>
                            <h3>우선 알림</h3>
                            <p>출시 소식을 가장 먼저 받아보세요</p>
                        </div>
                    </div>
                </div>
            `,
            category: 'Waitlist 컴포넌트',
        });
    }

    setupEventListeners() {
        // 새로고침 버튼
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadFileTree();
        });

        // 저장 버튼
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.savePage();
        });

        // 미리보기 버튼
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.previewPage();
        });
    }

    async loadFileTree() {
        try {
            this.showStatus('Loading files...', 'loading');
            
            const response = await fetch('http://localhost:3001/api/files');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || '파일 목록 로드 실패');
            }
            
            this.fileTree = result.files;
            this.renderFileTree();
        this.showStatus('Files loaded', 'success');
            
        } catch (error) {
            console.error('파일 트리 로드 오류:', error);
            this.showStatus('Failed to load files: ' + error.message, 'error');
            
            // 오류 시 기본 트리 표시
            document.getElementById('fileTree').innerHTML = `
                <div class="loading">Could not load files<br>
                <small style="color: #d9534f;">${error.message}</small></div>
            `;
        }
    }

    renderFileTree() {
        const treeContainer = document.getElementById('fileTree');
        treeContainer.innerHTML = '';
        
        if (this.fileTree.length === 0) {
            treeContainer.innerHTML = '<div class="loading">No HTML files found</div>';
            return;
        }
        
        const renderItems = (items, container) => {
            items.forEach(item => {
                const itemElement = document.createElement('div');
                
                if (item.type === 'directory') {
                    itemElement.className = 'file-item directory-item';
                    itemElement.innerHTML = `
                        <span class="icon">📁</span>
                        <span class="name">${item.name}</span>
                    `;
                    
                    // 디렉토리 클릭 토글
                    let isExpanded = true; // 기본적으로 확장
                    itemElement.addEventListener('click', () => {
                        isExpanded = !isExpanded;
                        const childrenContainer = itemElement.nextElementSibling;
                        if (childrenContainer) {
                            childrenContainer.style.display = isExpanded ? 'block' : 'none';
                            itemElement.querySelector('.icon').textContent = isExpanded ? '📂' : '📁';
                        }
                    });
                    
                    container.appendChild(itemElement);
                    
                    // 하위 항목들
                    if (item.children && item.children.length > 0) {
                        const childrenContainer = document.createElement('div');
                        childrenContainer.className = 'directory-children';
                        renderItems(item.children, childrenContainer);
                        container.appendChild(childrenContainer);
                        
                        // 초기 상태는 확장
                        itemElement.querySelector('.icon').textContent = '📂';
                    }
                    
                } else if (item.type === 'file') {
                    itemElement.className = 'file-item';
                    const sizeText = this.formatFileSize(item.size);
                    itemElement.innerHTML = `
                        <span class="icon">📄</span>
                        <span class="name">${item.name}</span>
                        <span class="size">${sizeText}</span>
                    `;
                    
                    // 파일 클릭 시 로드
                    itemElement.addEventListener('click', () => {
                        this.selectFile(item.path, itemElement);
                    });
                    
                    container.appendChild(itemElement);
                }
            });
        };
        
        renderItems(this.fileTree, treeContainer);
    }

    selectFile(filePath, element) {
        // 이전 선택 해제
        document.querySelectorAll('.file-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // 새 파일 선택
        element.classList.add('active');
        this.currentFile = filePath;
        
        // 현재 파일명 업데이트
        document.getElementById('currentFileName').textContent = filePath;
        
        // 파일 로드
        this.loadPage();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    async loadPage() {
        if (!this.currentFile) {
            this.showStatus('Please select a file', 'error');
            return;
        }

        try {
            this.showStatus('Loading page...', 'loading');
            
            // 파일명에서 확장자 제거
            const fileName = this.currentFile.split('/').pop();
            
            const response = await fetch(`http://localhost:3001/api/load-page/${fileName}`);
            if (!response.ok) {
                throw new Error('페이지 로드 실패');
            }
            
            const data = await response.json();
            
            // HTML을 파싱하여 body 내용만 추출
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.html, 'text/html');
            const bodyContent = doc.body.innerHTML;
            
            // HTML 컨텐츠 설정
            this.editor.setComponents(bodyContent);
            
            // CSS를 인라인으로 설정
            if (data.css) {
                this.editor.setStyle(data.css);
            }
            
            // 캔버스에 CSS 직접 주입
            setTimeout(() => {
                this.injectCssToCanvas(data.css);
            }, 1000);
            
            // 저장/미리보기 버튼 활성화
            document.getElementById('saveBtn').disabled = false;
            document.getElementById('previewBtn').disabled = false;
            
            this.showStatus(`${fileName} loaded`, 'success');
            
        } catch (error) {
            console.error('페이지 로드 오류:', error);
            this.showStatus('Failed to load: ' + error.message, 'error');
        }
    }

    injectCssToCanvas(cssContent) {
        try {
            const canvasDoc = this.editor.Canvas.getDocument();
            if (canvasDoc) {
                // 기존 인젝션된 스타일 제거
                const existingStyle = canvasDoc.getElementById('injected-css');
                if (existingStyle) {
                    existingStyle.remove();
                }
                
                // CSS를 style 태그로 직접 주입
                const style = canvasDoc.createElement('style');
                style.id = 'injected-css';
                style.textContent = cssContent;
                canvasDoc.head.appendChild(style);
                
                console.log('CSS injected to canvas');
            }
        } catch (error) {
            console.error('CSS injection error:', error);
        }
    }

    async savePage() {
        if (!this.currentFile) {
            this.showStatus('Please select a file to save', 'error');
            return;
        }

        try {
            this.showStatus('Saving...', 'loading');
            
            const html = this.generateFullHTML();
            const css = this.editor.getCss();
            const fileName = this.currentFile.split('/').pop();
            
            const response = await fetch(`http://localhost:3001/api/save-page/${fileName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: html,
                    css: css
                })
            });
            
            if (!response.ok) {
                throw new Error('저장 실패');
            }
            
            this.showStatus(`${fileName} saved`, 'success');
        } catch (error) {
            console.error('저장 오류:', error);
            this.showStatus('Save failed: ' + error.message, 'error');
        }
    }

    generateFullHTML() {
        const components = this.editor.getHtml();
        const css = this.editor.getCss();
        
        // 기존 HTML 구조를 유지하면서 body 내용만 교체
        const fileName = this.currentFile ? this.currentFile.split('/').pop() : 'index.html';
        const isIndex = fileName === 'index.html';
        const isSitemap = fileName === 'sitemap.html';
        
        return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isIndex ? 'Waitlist - 출시 전 알림 받기' : isSitemap ? '사이트맵 - Waitlist' : fileName}</title>
    <link rel="stylesheet" href="./css/styles.css">
    ${isSitemap ? '<link rel="stylesheet" href="./css/sitemap.css">' : ''}
    <style>
        ${css}
    </style>
</head>
<body>
    ${components}
    <script src="./js/${isSitemap ? 'sitemap.js' : 'script.js'}"></script>
</body>
</html>`;
    }

    previewPage() {
        const html = this.generateFullHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    showStatus(message, type) {
        const statusEl = document.getElementById('statusMessage');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type} show`;
        
        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 3000);
    }
}

// 에디터 초기화
document.addEventListener('DOMContentLoaded', () => {
    const editor = new WaitlistEditor();
    
    // 전역 에디터 접근용
    window.waitlistEditor = editor;
});