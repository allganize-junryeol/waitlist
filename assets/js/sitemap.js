// Sitemap functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // 페이지 통계 업데이트
    updatePageStats();
    
    // 저장된 페이지 목록 로드
    loadSavedPages();
    
    // 파일 트리 애니메이션
    animateFileTree();
    
    // 페이지 통계 업데이트
    function updatePageStats() {
        const totalPages = document.querySelectorAll('.page-card').length;
        
        // 통계 정보를 동적으로 추가할 수 있음
        console.log('Total pages:', totalPages);
    }
    
    // 저장된 페이지 목록 로드 (LocalStorage에서)
    function loadSavedPages() {
        const savedPages = [];
        
        // LocalStorage에서 저장된 페이지 검색
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('grapesjs-')) {
                const pageName = key.replace('grapesjs-', '');
                try {
                    const pageData = JSON.parse(localStorage.getItem(key));
                    savedPages.push({
                        name: pageName,
                        data: pageData
                    });
                } catch (error) {
                    console.warn('Error parsing saved page:', pageName, error);
                }
            }
        }
        
        // 저장된 커스텀 페이지가 있으면 표시
        if (savedPages.length > 0) {
            displaySavedPages(savedPages);
        }
    }
    
    // 저장된 페이지들을 화면에 표시
    function displaySavedPages(savedPages) {
        const pagesGrid = document.querySelector('.pages-grid');
        
        savedPages.forEach(page => {
            if (page.name !== 'index') { // 기본 index 페이지 제외
                const pageCard = createPageCard(page);
                pagesGrid.appendChild(pageCard);
            }
        });
    }
    
    // 페이지 카드 생성
    function createPageCard(page) {
        const card = document.createElement('div');
        card.className = 'page-card';
        card.innerHTML = `
            <div class="page-header">
                <span class="page-icon">📄</span>
                <h3 class="page-name">${page.name}</h3>
            </div>
        `;
        return card;
    }
    
    // 파일 트리 애니메이션
    function animateFileTree() {
        const treeItems = document.querySelectorAll('.tree-item');
        
        treeItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }
    
    // 날짜 포맷팅
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
        });
    }
});

// 저장된 페이지 미리보기
function previewSavedPage(pageName) {
    const savedData = localStorage.getItem(`grapesjs-${pageName}`);
    if (!savedData) {
        alert('저장된 페이지를 찾을 수 없습니다.');
        return;
    }
    
    try {
        const data = JSON.parse(savedData);
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${pageName} - 미리보기</title>
                <style>${data.css}</style>
            </head>
            <body>
                ${data.html}
            </body>
            </html>
        `);
        previewWindow.document.close();
    } catch (error) {
        console.error('Error previewing page:', error);
        alert('페이지 미리보기 중 오류가 발생했습니다.');
    }
}

// 페이지 삭제
function deletePage(pageName) {
    if (confirm(`"${pageName}" 페이지를 삭제하시겠습니까?`)) {
        localStorage.removeItem(`grapesjs-${pageName}`);
        
        // 페이지 새로고침으로 목록 업데이트
        location.reload();
    }
}

// 추가 스타일 동적 생성
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .delete-action {
            background: #ef4444 !important;
            color: white !important;
        }
        
        .delete-action:hover {
            background: #dc2626 !important;
        }
        
        .page-card {
            position: relative;
            overflow: hidden;
        }
        
        .page-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .page-card:hover::before {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
