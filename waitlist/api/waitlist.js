const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// 대기자 명단 데이터를 저장할 파일 경로
const WAITLIST_FILE = path.join(__dirname, '..', 'waitlist-data.json');

// 대기자 명단 데이터 파일 초기화
async function initWaitlistFile() {
    try {
        await fs.access(WAITLIST_FILE);
    } catch {
        // 파일이 없으면 빈 배열로 초기화
        await fs.writeFile(WAITLIST_FILE, JSON.stringify([], null, 2));
    }
}

// 대기자 명단 데이터 읽기
async function readWaitlistData() {
    try {
        const data = await fs.readFile(WAITLIST_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('대기자 명단 데이터 읽기 실패:', error);
        return [];
    }
}

// 대기자 명단 데이터 저장
async function saveWaitlistData(data) {
    try {
        await fs.writeFile(WAITLIST_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('대기자 명단 데이터 저장 실패:', error);
        return false;
    }
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// POST /waitlist - 대기자 명단에 추가
router.post('/waitlist', async (req, res) => {
    try {
        const { email, name } = req.body;
        
        // Referer 헤더에서 원래 페이지 URL 가져오기
        const refererUrl = req.get('Referer');
        const baseUrl = refererUrl.split('?')[0]; // 기존 파라미터 제거

        // 필수 필드 검증
        if (!email) {
            return res.redirect(baseUrl + '?error=' + encodeURIComponent('이메일 주소는 필수입니다.'));
        }

        // 이메일 형식 검증
        if (!isValidEmail(email)) {
            return res.redirect(baseUrl + '?error=' + encodeURIComponent('유효한 이메일 주소를 입력해주세요.'));
        }

        // 기존 데이터 읽기
        const waitlistData = await readWaitlistData();

        // 중복 이메일 확인
        const existingEntry = waitlistData.find(entry => entry.email.toLowerCase() === email.toLowerCase());
        if (existingEntry) {
            return res.redirect(baseUrl + '?error=' + encodeURIComponent('이미 등록된 이메일 주소입니다.'));
        }

        // 새 항목 생성
        const newEntry = {
            id: Date.now().toString(),
            email: email.toLowerCase(),
            name: name || '',
            registeredAt: new Date().toISOString(),
            ipAddress: req.ip || req.connection.remoteAddress
        };

        // 대기자 명단에 추가
        waitlistData.push(newEntry);

        // 파일에 저장
        const saved = await saveWaitlistData(waitlistData);
        if (!saved) {
            return res.redirect(baseUrl + '?error=' + encodeURIComponent('서버 오류가 발생했습니다. 다시 시도해주세요.'));
        }

        // 성공 시 리다이렉트
        const successParams = new URLSearchParams({
            success: 'true',
            position: waitlistData.length.toString(),
            name: name || ''
        });
        res.redirect(baseUrl + '?' + successParams.toString());

        console.log(`새 대기자 등록: ${email} (총 ${waitlistData.length}명)`);

    } catch (error) {
        console.error('대기자 명단 등록 중 오류:', error);
        const refererUrl = req.get('Referer');
        const baseUrl = refererUrl.split('?')[0];
        res.redirect(baseUrl + '?error=' + encodeURIComponent('서버 오류가 발생했습니다. 다시 시도해주세요.'));
    }
});

// GET /waitlist - 대기자 명단 조회 (관리용)
router.get('/waitlist', async (req, res) => {
    try {
        const waitlistData = await readWaitlistData();
        
        // 개인정보 보호를 위해 이메일 일부 마스킹
        const maskedData = waitlistData.map((entry, index) => ({
            id: entry.id,
            email: entry.email.replace(/(.{2}).*(@.*)/, '$1***$2'),
            name: entry.name || '미제공',
            registeredAt: entry.registeredAt,
            position: index + 1
        }));

        res.json({
            success: true,
            data: {
                total: waitlistData.length,
                entries: maskedData
            }
        });
    } catch (error) {
        console.error('대기자 명단 조회 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});

// GET /waitlist/stats - 대기자 명단 통계
router.get('/waitlist/stats', async (req, res) => {
    try {
        const waitlistData = await readWaitlistData();
        
        res.json({
            success: true,
            data: {
                total: waitlistData.length,
                todayCount: waitlistData.filter(entry => {
                    const entryDate = new Date(entry.registeredAt);
                    const today = new Date();
                    return entryDate.toDateString() === today.toDateString();
                }).length,
                weekCount: waitlistData.filter(entry => {
                    const entryDate = new Date(entry.registeredAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return entryDate >= weekAgo;
                }).length
            }
        });
    } catch (error) {
        console.error('대기자 명단 통계 조회 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
});

// 서버 시작시 데이터 파일 초기화
initWaitlistFile();

module.exports = router;
