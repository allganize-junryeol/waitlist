// GrapesJS Editor Implementation
document.addEventListener('DOMContentLoaded', function() {
    let editor;
    
    // 기본 waitlist 페이지 템플릿
    const defaultTemplate = `
    <div class="container">
        <header class="hero">
            <h1 class="hero-title">곧 찾아뵙겠습니다!</h1>
            <p class="hero-subtitle">혁신적인 서비스가 곧 출시됩니다. 얼리 액세스를 원하시면 이메일을 남겨주세요.</p>
        </header>

        <main class="main-content">
            <div class="waitlist-form-container">
                <form id="waitlistForm" class="waitlist-form">
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

                <div id="successMessage" class="success-message hidden">
                    <h3>감사합니다! 🎉</h3>
                    <p>대기 명단에 등록되었습니다. 곧 연락드리겠습니다.</p>
                </div>

                <div id="errorMessage" class="error-message hidden">
                    <p>문제가 발생했습니다. 다시 시도해주세요.</p>
                </div>
            </div>

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
        </main>

        <footer class="footer">
            <p>&copy; 2024. 모든 권리 보유.</p>
        </footer>
    </div>`;

    // CSS 스타일 읽기 (기존 스타일 로드)
    async function loadExistingCSS() {
        try {
            const response = await fetch('../assets/css/styles.css');
            return await response.text();
        } catch (error) {
            console.warn('Could not load existing CSS:', error);
            return '';
        }
    }

    // GrapesJS 에디터 초기화
    async function initializeEditor() {
        const existingCSS = await loadExistingCSS();
        
        editor = grapesjs.init({
            container: '#gjs',
            height: '100%',
            width: '100%',
            
            // 기본 설정
            fromElement: false,
            showOffsets: true,
            noticeOnUnload: false,
            
            // 저장 관리자 설정
            storageManager: {
                id: 'gjs-',
                type: 'local',
                autosave: true,
                autoload: true,
                stepsBeforeSave: 1,
            },
            
            // 디바이스 관리자 설정 (반응형)
            deviceManager: {
                devices: [
                    {
                        name: 'Desktop',
                        width: '',
                    },
                    {
                        name: 'Tablet',
                        width: '768px',
                        widthMedia: '992px',
                    },
                    {
                        name: 'Mobile Portrait',
                        width: '320px',
                        widthMedia: '575px',
                    }
                ]
            },

            // 플러그인 설정
            plugins: ['gjs-preset-webpage'],
            pluginsOpts: {
                'gjs-preset-webpage': {
                    modalImportTitle: 'HTML 가져오기',
                    modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">HTML 코드를 붙여넣어주세요</div>',
                    modalImportContent: function(editor) {
                        return editor.getHtml();
                    },
                    filestackOpts: false,
                    blocksBasicOpts: {
                        blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video'],
                        flexGrid: 1,
                    },
                    customStyleManager: [{
                        name: 'General',
                        buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
                        properties: [{
                            type: 'integer',
                            name: 'The width',
                            property: 'width',
                            units: ['px', '%'],
                            defaults: 'auto',
                            min: 0,
                        }]
                    }]
                }
            },

            // CSS 설정
            cssComposer: {
                cssComposer: existingCSS
            },

            // 패널 설정
            panels: {
                defaults: [
                    {
                        id: 'layers',
                        el: '.panel__right',
                        resizable: {
                            maxDim: 350,
                            minDim: 200,
                            tc: 0,
                            cl: 1,
                            cr: 0,
                            bc: 0,
                            keyWidth: 'flex-basis',
                        },
                    },
                    {
                        id: 'panel-switcher',
                        el: '.panel__switcher',
                        buttons: [
                            {
                                id: 'show-layers',
                                active: true,
                                label: 'Layers',
                                command: 'show-layers',
                                togglable: false,
                            },
                            {
                                id: 'show-style',
                                active: true,
                                label: 'Styles',
                                command: 'show-styles',
                                togglable: false,
                            }
                        ],
                    }
                ]
            },
        });

        // 기본 콘텐츠 로드
        editor.setComponents(defaultTemplate);
        editor.setStyle(existingCSS);

        // 에디터 이벤트 리스너
        setupEditorEvents();
    }

    // 에디터 이벤트 설정
    function setupEditorEvents() {
        // 저장 버튼
        document.getElementById('saveBtn').addEventListener('click', function() {
            showSaveModal();
        });

        // 미리보기 버튼
        document.getElementById('previewBtn').addEventListener('click', function() {
            const html = editor.getHtml();
            const css = editor.getCss();
            
            const previewWindow = window.open('', '_blank');
            previewWindow.document.write(`
                <!DOCTYPE html>
                <html lang="ko">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>미리보기</title>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                </body>
                </html>
            `);
            previewWindow.document.close();
        });

        // 모달 관련 이벤트
        setupModalEvents();
    }

    // 모달 이벤트 설정
    function setupModalEvents() {
        const modal = document.getElementById('saveModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelSave');
        const confirmBtn = document.getElementById('confirmSave');
        const pageSelect = document.getElementById('pageSelect');
        const customPageName = document.getElementById('customPageName');

        closeBtn.addEventListener('click', hideSaveModal);
        cancelBtn.addEventListener('click', hideSaveModal);
        
        pageSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customPageName.classList.remove('hidden');
            } else {
                customPageName.classList.add('hidden');
            }
        });

        confirmBtn.addEventListener('click', function() {
            saveCurrentPage();
        });

        // 모달 배경 클릭 시 닫기
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideSaveModal();
            }
        });
    }

    // 저장 모달 표시
    function showSaveModal() {
        document.getElementById('saveModal').classList.remove('hidden');
    }

    // 저장 모달 숨기기
    function hideSaveModal() {
        document.getElementById('saveModal').classList.add('hidden');
        document.getElementById('customPageName').classList.add('hidden');
        document.getElementById('pageSelect').value = 'index';
        document.getElementById('newPageName').value = '';
    }

    // 현재 페이지 저장
    function saveCurrentPage() {
        const pageSelect = document.getElementById('pageSelect').value;
        const customName = document.getElementById('newPageName').value;
        
        const html = editor.getHtml();
        const css = editor.getCss();
        
        // 저장할 페이지 이름 결정
        let pageName = pageSelect === 'custom' ? customName : pageSelect;
        if (!pageName || pageName.trim() === '') {
            alert('페이지 이름을 입력해주세요.');
            return;
        }
        
        // Local Storage에 저장 (실제 구현에서는 서버로 전송)
        const saveData = {
            html: html,
            css: css,
            timestamp: new Date().toISOString(),
            pageName: pageName
        };
        
        localStorage.setItem(`grapesjs-${pageName}`, JSON.stringify(saveData));
        
        // 성공 메시지
        alert(`"${pageName}" 페이지가 성공적으로 저장되었습니다!`);
        
        hideSaveModal();
        
        console.log('Saved page data:', saveData);
    }

    // 저장된 페이지 로드
    function loadSavedPage(pageName = 'index') {
        const savedData = localStorage.getItem(`grapesjs-${pageName}`);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                editor.setComponents(data.html);
                editor.setStyle(data.css);
                console.log('Loaded page:', pageName, data);
            } catch (error) {
                console.error('Error loading saved page:', error);
            }
        }
    }

    // 키보드 단축키
    document.addEventListener('keydown', function(e) {
        // Ctrl+S 또는 Cmd+S로 저장
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            showSaveModal();
        }
        
        // Ctrl+P 또는 Cmd+P로 미리보기
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            document.getElementById('previewBtn').click();
        }
    });

    // 에디터 초기화
    initializeEditor().then(() => {
        console.log('GrapesJS Editor initialized successfully!');
        
        // URL 파라미터로 특정 페이지 로드
        const urlParams = new URLSearchParams(window.location.search);
        const pageToLoad = urlParams.get('page') || 'index';
        loadSavedPage(pageToLoad);
    }).catch(error => {
        console.error('Error initializing editor:', error);
    });
});
