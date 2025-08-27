// Express 서버 for GrapesJS Editor
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Editor API 라우터 import
const editorRouter = require('./api/editor');

function sendIndex(res){
    if (process.env.NODE_ENV === 'production'){
        res.redirect('/assets/home.html');
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
}

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 정적 파일 서빙 - 에디터에서 CSS/JS 접근 가능하도록
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(__dirname)); // 루트 디렉토리의 정적 파일 (JS, CSS 등) 제공

// Editor API 라우터 연결
app.use('/api', editorRouter);

// index.html 직접 라우팅
app.get('/index.html', (req, res) => {
    sendIndex(res);
});

app.get('/index', (req, res) => {
    sendIndex(res);
});

app.get('/', (req, res) => {
    sendIndex(res);
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});

// 예기치 못한 오류 처리
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});