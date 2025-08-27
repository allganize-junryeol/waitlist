// GrapesJS Editor for Waitlist Website
class WaitlistEditor {
    constructor() {
        this.editor = null;
        this.currentFile = null;
        this.fileTree = [];
        this.currentFileMetadata = null;
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
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 파일 트리 로드
        this.loadFileTree();
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
            
            const response = await fetch('/api/files');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || '파일 목록 로드 실패');
            }
            
            this.fileTree = result.files;
            this.renderFileTree();
        this.showStatus('Files loaded', 'success');
            
        } catch (error) {
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
                if (item.type === 'directory') {
                    // 폴더 아이템 컨테이너 생성
                    const folderWrapper = document.createElement('div');
                    folderWrapper.className = 'folder-wrapper';
                    
                    const itemElement = document.createElement('div');
                    itemElement.className = 'file-item directory-item';
                    itemElement.innerHTML = `
                        <span class="icon">📁</span>
                        <span class="name">${item.name}</span>
                    `;
                    
                    // 하위 항목들 컨테이너 생성
                    let childrenContainer = null;
                    if (item.children && item.children.length > 0) {
                        childrenContainer = document.createElement('div');
                        childrenContainer.className = 'directory-children';
                        childrenContainer.style.display = 'none'; // 기본적으로 숨김
                        renderItems(item.children, childrenContainer);
                    }
                    
                    // 디렉토리 클릭 토글
                    let isExpanded = false; // 기본적으로 닫힌 상태
                    itemElement.addEventListener('click', (e) => {
                        e.stopPropagation(); // 이벤트 전파 방지
                        
                        if (childrenContainer) {
                            isExpanded = !isExpanded;
                            childrenContainer.style.display = isExpanded ? 'block' : 'none';
                            itemElement.querySelector('.icon').textContent = isExpanded ? '📂' : '📁';
                        }
                    });
                    
                    folderWrapper.appendChild(itemElement);
                    if (childrenContainer) {
                        folderWrapper.appendChild(childrenContainer);
                    }
                    
                    container.appendChild(folderWrapper);
                    
                } else if (item.type === 'file') {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'file-item';
                    const sizeText = this.formatFileSize(item.size);
                    itemElement.innerHTML = `
                        <span class="icon">📄</span>
                        <span class="name">${item.name}</span>
                        <span class="size">${sizeText}</span>
                    `;
                    
                    // 파일 클릭 시 로드
                    itemElement.addEventListener('click', (e) => {
                        e.stopPropagation(); // 이벤트 전파 방지
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
        // 파일명만 추출해서 저장 (서버에서 동적으로 경로 찾기)
        this.currentFile = filePath.split('/').pop();
        
        // 현재 파일명 업데이트 (요소가 있는 경우에만)
        const currentFileNameEl = document.getElementById('currentFileName');
        if (currentFileNameEl) {
            currentFileNameEl.textContent = filePath;
        }
        
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
            
            // 파일명만 전달 (서버에서 동적으로 경로 찾기)
            const response = await fetch(`/api/load-page/${this.currentFile}`);
            if (!response.ok) {
                throw new Error('페이지 로드 실패');
            }
            
            const data = await response.json();
            
            // 메타데이터 저장
            this.currentFileMetadata = data.metadata || null;
            
            // 페어 CSS 로드 확인
            if (data.cssFiles && data.cssFiles.length > 0) {
                console.log(`✅ 페어 CSS 로드: ${data.cssFiles.join(', ')}`);
            }
            
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
            
            this.showStatus(`${this.currentFile} loaded`, 'success');
            
        } catch (error) {
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
            }
        } catch (error) {
            // CSS injection 실패시 무시
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
            
            // 파일명만 전달 (서버에서 동적으로 경로 찾기)
            const response = await fetch(`/api/save-page/${this.currentFile}`, {
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
            
            const result = await response.json();
            
            // 저장 완료 메시지 표시
            this.showStatus(result.message || `${this.currentFile} saved successfully`, 'success');
        } catch (error) {
            this.showStatus('Save failed: ' + error.message, 'error');
        }
    }

    generateFullHTML() {
        // 원본 파일의 메타데이터 사용 (일반화)
        const metadata = this.currentFileMetadata || {
            title: 'Untitled',
            charset: 'UTF-8',
            viewport: 'width=device-width, initial-scale=1.0',
            lang: 'ko'
        };
        
        // 서버에서 CSS 완전 분리를 처리하므로 단순한 HTML만 생성
        return `<!DOCTYPE html>
<html lang="${metadata.lang}">
<head>
    <meta charset="${metadata.charset}">
    <meta name="viewport" content="${metadata.viewport}">
    <title>${metadata.title}</title>
</head>
${this.editor.getHtml()}
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