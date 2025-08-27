// 최소한의 JavaScript - 폼 제출 처리만 구현
document.addEventListener('DOMContentLoaded', function() {
    // API 엔드포인트 설정 (실제 API URL로 변경 필요)
    const API_ENDPOINT = 'https://your-api-endpoint.com/waitlist';
    
    // DOM 요소들
    const form = document.getElementById('waitlistForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // 폼 제출 처리
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 버튼 로딩 상태로 변경
        setLoadingState(true);
        hideMessages();
        
        // 폼 데이터 수집
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            name: formData.get('name') || ''
        };
        
        try {
            // API 호출
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // 성공 처리
                showSuccess();
                form.reset();
            } else {
                // 에러 처리
                throw new Error('서버 응답 오류');
            }
        } catch (error) {
            // 네트워크 에러 또는 기타 에러
            console.error('Error:', error);
            showError();
        } finally {
            // 로딩 상태 해제
            setLoadingState(false);
        }
    });
    
    // 로딩 상태 설정
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    }
    
    // 메시지 숨기기
    function hideMessages() {
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }
    
    // 성공 메시지 표시
    function showSuccess() {
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // 3초 후 폼 다시 보이기
        setTimeout(() => {
            form.classList.remove('hidden');
            successMessage.classList.add('hidden');
        }, 3000);
    }
    
    // 에러 메시지 표시
    function showError() {
        errorMessage.classList.remove('hidden');
        
        // 3초 후 에러 메시지 숨기기
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 3000);
    }
    
    // 이메일 유효성 검사 (선택사항)
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value;
        if (email && !isValidEmail(email)) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#e5e7eb';
        }
    });
    
    // 간단한 이메일 유효성 검사
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
