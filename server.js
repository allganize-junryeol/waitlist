// Express 서버 for GrapesJS Editor
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const beautify = require('js-beautify');

const app = express();
const PORT = 3000;

// 포매팅 유틸리티 함수들 - 동기 버전으로 수정
function formatHTML(html) {
    try {
        // js-beautify만 사용 (더 안정적)
        return beautify.html(html, {
            indent_size: 4,
            indent_char: ' ',
            max_preserve_newlines: 2,
            preserve_newlines: true,
            keep_array_indentation: false,
            break_chained_methods: false,
            indent_scripts: 'keep',
            brace_style: 'collapse',
            space_before_conditional: true,
            unescape_strings: false,
            jslint_happy: false,
            end_with_newline: true,
            wrap_line_length: 0,
            indent_inner_html: false,
            comma_first: false,
            e4x: false,
            indent_empty_lines: false
        });
    } catch (error) {
        console.log('HTML 포매팅 실패:', error.message);
        return html; // 포매팅 실패시 원본 반환
    }
}

function formatCSS(css) {
    try {
        // js-beautify만 사용 (더 안정적)
        return beautify.css(css, {
            indent_size: 4,
            indent_char: ' ',
            max_preserve_newlines: 2,
            preserve_newlines: true,
            newline_between_rules: true,
            end_with_newline: true,
            indent_empty_lines: false
        });
    } catch (error) {
        console.log('CSS 포매팅 실패:', error.message);
        return css; // 포매팅 실패시 원본 반환
    }
}

// 파일명에서 확장자를 제거하고 디렉토리 경로를 반환하는 함수
function getFileBaseName(filename) {
    return path.parse(filename).name;
}

function getFileDir(filename) {
    return path.parse(filename).dir || '';
}

// HTML에서 메타데이터 추출하는 함수
function extractHtmlMetadata(html) {
    const metadata = {
        title: 'Untitled',
        charset: 'UTF-8',
        viewport: 'width=device-width, initial-scale=1.0',
        lang: 'ko',
        metaTags: []
    };

    try {
        // title 추출
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        if (titleMatch) {
            metadata.title = titleMatch[1].trim();
        }

        // charset 추출
        const charsetMatch = html.match(/<meta[^>]*charset=["']([^"']+)["'][^>]*>/i);
        if (charsetMatch) {
            metadata.charset = charsetMatch[1];
        }

        // viewport 추출
        const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["'][^>]*>/i);
        if (viewportMatch) {
            metadata.viewport = viewportMatch[1];
        }

        // lang 속성 추출
        const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["'][^>]*>/i);
        if (langMatch) {
            metadata.lang = langMatch[1];
        }

        // 기타 meta 태그들 추출
        const metaMatches = html.match(/<meta[^>]*>/gi);
        if (metaMatches) {
            metadata.metaTags = metaMatches.map(tag => tag.trim());
        }

    } catch (error) {
        console.log('메타데이터 추출 실패:', error.message);
    }

    return metadata;
}

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 정적 파일 서빙 - 에디터에서 CSS/JS 접근 가능하도록
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(__dirname)); // 루트 디렉토리의 정적 파일 (JS, CSS 등) 제공

// index.html 직접 라우팅
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// API 라우트

// 파일 탐색기 - assets 폴더 스캔
app.get('/api/files', async (req, res) => {
    try {
        const assetsDir = path.join(__dirname, 'assets');
        
        // 재귀적으로 디렉토리 스캔하는 함수
        async function scanDirectory(dirPath, relativePath = '') {
            const items = [];
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                const relPath = path.join(relativePath, entry.name).replace(/\\/g, '/');
                
                if (entry.isDirectory()) {
                    // 디렉토리인 경우 재귀적으로 스캔
                    const children = await scanDirectory(fullPath, relPath);
                    items.push({
                        name: entry.name,
                        type: 'directory',
                        path: relPath,
                        children: children
                    });
                } else if (entry.isFile()) {
                    // HTML 파일만 포함 (실제로 로드 가능한 파일들)
                    const ext = path.extname(entry.name).toLowerCase();
                    
                    if (ext === '.html') {
                        const stats = await fs.stat(fullPath);
                        items.push({
                            name: entry.name,
                            type: 'file',
                            path: relPath,
                            size: stats.size,
                            modified: stats.mtime.toISOString()
                        });
                    }
                }
            }
            
            return items.sort((a, b) => {
                // 디렉토리 먼저, 그 다음 파일명 순서
                if (a.type !== b.type) {
                    return a.type === 'directory' ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
        }
        
        const fileTree = await scanDirectory(assetsDir);
        res.json({ success: true, files: fileTree });
        
    } catch (error) {
        console.error('파일 스캔 오류:', error);
        res.status(500).json({ 
            success: false, 
            error: '파일 목록을 불러올 수 없습니다.',
            details: error.message 
        });
    }
});

// 페이지 로드 - 임시로 원래 방식으로 되돌림 (서브디렉터리 지원 포함)
app.get('/api/load-page/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        
        // HTML 파일인지 검증
        if (!filename.endsWith('.html')) {
            return res.status(400).json({ 
                error: 'Only HTML files are supported',
                filename: filename
            });
        }
        
        console.log(`📖 ${filename} 로드 시작`);
        
        const fileBaseName = getFileBaseName(filename);
        const assetsDir = path.join(__dirname, 'assets');
        
        // 서브디렉터리 파일 재귀적 검색
        async function findFileRecursively(dirPath, targetFilename) {
            try {
                const entries = await fs.readdir(dirPath, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullEntryPath = path.join(dirPath, entry.name);
                    
                    if (entry.isFile() && entry.name === targetFilename) {
                        return fullEntryPath;
                    } else if (entry.isDirectory()) {
                        const found = await findFileRecursively(fullEntryPath, targetFilename);
                        if (found) return found;
                    }
                }
            } catch (err) {
                // 디렉토리 접근 불가, 무시
            }
            return null;
        }
        
        const fullPath = await findFileRecursively(assetsDir, filename);
        
        if (!fullPath) {
            return res.status(404).json({ 
                error: 'File not found',
                filename: filename
            });
        }
        
        // HTML 파일 읽기
        const html = await fs.readFile(fullPath, 'utf8');
        
        // HTML에서 메타데이터 추출
        const htmlMetadata = extractHtmlMetadata(html);
        
        // 페어 CSS 파일 우선 로드 (교체 방식)
        let css = '';
        const cssFiles = [];
        let hasPairCss = false;
        
        try {
            // 1. 페어 CSS 파일 (HTML과 같은 이름, 같은 디렉터리) 먼저 확인 - 우선순위 최고
            const htmlDir = path.dirname(fullPath);
            const pairCssPath = path.join(htmlDir, `${fileBaseName}.css`);
            try {
                const pairCss = await fs.readFile(pairCssPath, 'utf8');
                css = pairCss; // 페어 CSS로 완전 교체
                
                // 상대 경로 계산
                const relativeCssPath = path.relative(assetsDir, pairCssPath).replace(/\\/g, '/');
                cssFiles.push(relativeCssPath);
                hasPairCss = true;
                console.log(`🔄 페어 CSS로 교체 로드됨: ${relativeCssPath}`);
            } catch (pairError) {
                // 페어 CSS 파일 없음
            }
            
            // 2. 페어 CSS가 없을 때만 기존 CSS 파일들 로드
            if (!hasPairCss) {
                console.log('📂 기존 CSS 파일들 로드');
                
                try {
                    const stylesCssPath = path.join(assetsDir, 'css/styles.css');
                    const stylesCss = await fs.readFile(stylesCssPath, 'utf8');
                    css += stylesCss;
                    cssFiles.push('css/styles.css');
                } catch (stylesError) {
                    // 기본 styles.css 파일 없음
                }
                
                // 특정 파일명에 대한 전용 CSS 로드 (예: sitemap.html -> sitemap.css)
                if (fileBaseName === 'sitemap') {
                    try {
                        const sitemapCssPath = path.join(assetsDir, 'css/sitemap.css');
                        const sitemapCss = await fs.readFile(sitemapCssPath, 'utf8');
                        css += css ? '\n\n/* sitemap.css */\n' + sitemapCss : sitemapCss;
                        cssFiles.push('css/sitemap.css');
                    } catch (sitemapError) {
                        // sitemap.css 파일 없음
                    }
                }
            } else {
                console.log('✨ 페어 CSS 우선 사용됨');
            }
            
        } catch (cssError) {
            // CSS 파일 로드 오류 - 무시
        }
        
        const result = {
            html: html,
            css: css,
            filename: filename,
            cssFiles: cssFiles,
            htmlSize: html.length,
            cssSize: css.length,
            timestamp: new Date().toISOString(),
            metadata: htmlMetadata
        };
        
        console.log(`✅ ${filename} 로드 완료 (CSS 파일: ${cssFiles.length}개)`);
        res.json(result);
        
    } catch (error) {
        console.error('페이지 로드 오류:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to load page',
            details: error.message,
            filename: req.params.filename
        });
    }
});

// 페이지 저장 - 임시로 원래 방식으로 되돌림 (서브디렉터리 지원 포함)
app.post('/api/save-page/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const { html, css } = req.body;
        
        // HTML 파일인지 검증
        if (!filename.endsWith('.html')) {
            return res.status(400).json({ 
                error: 'Only HTML files are supported',
                filename: filename
            });
        }
        
        console.log(`💾 ${filename} 저장 시작`);
        
        const fileBaseName = getFileBaseName(filename);
        const assetsDir = path.join(__dirname, 'assets');
        
        // 서브디렉터리 파일 재귀적 검색 (로드와 동일한 로직)
        async function findFileRecursively(dirPath, targetFilename) {
            try {
                const entries = await fs.readdir(dirPath, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullEntryPath = path.join(dirPath, entry.name);
                    
                    if (entry.isFile() && entry.name === targetFilename) {
                        return fullEntryPath;
                    } else if (entry.isDirectory()) {
                        const found = await findFileRecursively(fullEntryPath, targetFilename);
                        if (found) return found;
                    }
                }
            } catch (err) {
                // 디렉토리 접근 불가, 무시
            }
            return null;
        }
        
        let fullPath = await findFileRecursively(assetsDir, filename);
        
        // 파일이 없으면 기본 위치에 생성
        if (!fullPath) {
            fullPath = path.join(assetsDir, filename);
        }
        
        // HTML 포매팅 및 저장
        let formattedHtml = html;
        if (html && html.trim()) {
            try {
                formattedHtml = formatHTML(html);
                console.log('📝 HTML 포매팅 완료');
            } catch (formatError) {
                formattedHtml = html; // 포매팅 실패시 원본 사용
            }
        }
        
        // CSS 완전 분리 저장 - HTML에서 인라인 스타일 제거
        let cssPath = null;
        let cleanedHtml = formattedHtml;
        
        if (css && css.trim()) {
            try {
                // CSS 파일을 HTML 파일과 같은 위치에 생성
                const htmlDir = path.dirname(fullPath);
                cssPath = path.join(htmlDir, `${fileBaseName}.css`);
                
                const formattedCss = formatCSS(css);
                
                const finalCss = formattedCss;
                await fs.writeFile(cssPath, finalCss, 'utf8');
                
                // 상대 경로 계산
                const relativeCssPath = path.relative(assetsDir, cssPath).replace(/\\/g, '/');
                console.log(`✨ CSS 페어 파일 저장 완료: ${relativeCssPath}`);
                
                // HTML에서 인라인 스타일 제거 (완전 분리)
                cleanedHtml = removeInlineStylesFromHtml(formattedHtml, `${fileBaseName}.css`);
                
            } catch (cssError) {
                cssPath = null;
            }
        }
        
        // HTML 파일 재저장 (인라인 스타일 제거된 버전)
        await fs.writeFile(fullPath, cleanedHtml, 'utf8');
        console.log(`🎉 ${filename} 저장 완료 - HTML/CSS 페어 생성됨`);
        
        res.json({
            success: true,
            message: `${filename}이(가) 성공적으로 저장되었습니다`,
            timestamp: new Date().toISOString(),
            files: { html: fullPath, css: cssPath }
        });
        
    } catch (error) {
        console.error('페이지 저장 오류:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to save page',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// HTML에서 인라인 스타일을 완전히 제거하고 CSS 파일 링크로 교체하는 함수
function removeInlineStylesFromHtml(html, cssFileName) {
    try {
        let cleanedHtml = html;
        
        // 1. <style> 태그 완전 제거
        cleanedHtml = cleanedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        
        // 2. 인라인 style 속성 제거
        cleanedHtml = cleanedHtml.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');
        
        // 3. CSS 파일 링크가 없다면 추가
        const cssLinkRegex = new RegExp(`<link[^>]*href=["\']([^"']*${cssFileName})["\'][^>]*>`, 'i');
        
        if (!cssLinkRegex.test(cleanedHtml)) {
            // head 태그 내에 CSS 링크 추가
            const headEndRegex = /<\/head>/i;
            if (headEndRegex.test(cleanedHtml)) {
                const cssLink = `    <link rel="stylesheet" href="./assets/${cssFileName}">`;
                cleanedHtml = cleanedHtml.replace(headEndRegex, `${cssLink}\n</head>`);
            }
        }
        
        // 4. 빈 줄 정리 (연속된 빈 줄을 하나로)
        cleanedHtml = cleanedHtml.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // 5. 최종 포매팅
        return formatHTML(cleanedHtml);
        
    } catch (error) {
        return html; // 실패시 원본 반환
    }
}

// 레거시 호환용 - 기존 함수명 유지
async function updateHtmlCssLink(htmlPath, cssFileName) {
    try {
        let html = await fs.readFile(htmlPath, 'utf8');
        const cleanedHtml = removeInlineStylesFromHtml(html, cssFileName);
        await fs.writeFile(htmlPath, cleanedHtml, 'utf8');
    } catch (error) {
        // CSS 링크 업데이트 실패 - 무시
    }
}

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 GrapesJS 에디터 서버 실행중 (포트 ${PORT})`);
    console.log(`📝 에디터: http://localhost:${PORT}`);
    console.log(`✨ HTML/CSS 페어 파일 자동 관리 + 예쁜 포매팅`);
});

// 예기치 못한 오류 처리
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
