// Express 서버 for GrapesJS Editor
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 명령행 인수 처리
const args = process.argv.slice(2);
const projectType = args[0]

// 프로젝트 타입에 따른 기준 폴더 설정
const basePath = path.join(__dirname, '..', projectType);

console.log(`Starting editor for project: ${projectType}`);
console.log(`Base path: ${basePath}`);

// 프로젝트 타입을 전역 변수로 설정 (API에서 사용할 수 있도록)
global.projectType = projectType;
global.basePath = basePath;

// Editor API 라우터 import
const editorRouter = require('./api/editor');
// Waitlist API 라우터 import
const waitlistRouter = require('./api/waitlist');

function sendIndex(res){
    res.sendFile(path.join(__dirname, 'index.html'));
}

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true })); // HTML form 데이터 처리

// 정적 파일 서빙 - 에디터 파일들 (waitlist 폴더)
app.use('/waitlist', express.static(__dirname));

// 정적 파일 서빙 - 루트 경로에서 waitlist 폴더 파일들에 직접 접근
app.use(express.static(__dirname));

// 정적 파일 서빙 - 프로젝트 타입에 따라 다른 기준 폴더 사용
app.use(`/waitlist/${projectType}`, express.static(basePath));

// Editor API 라우터 연결
app.use('/api', editorRouter);
// Waitlist API 라우터 연결
app.use('/api', waitlistRouter);

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