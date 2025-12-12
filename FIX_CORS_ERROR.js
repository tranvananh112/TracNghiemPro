// ===== FIX CORS ERROR - Tạm thời =====
// File này sẽ bỏ qua lỗi CORS khi load community-quizzes.json

(function() {
    console.log('🔧 Applying CORS fix...');
    
    // Tìm và fix explore-quiz.js
    if (window.ExploreQuizManager) {
        const originalLoadCommunityQuizzes = window.ExploreQuizManager.prototype.loadCommunityQuizzes;
        
        window.ExploreQuizManager.prototype.loadCommunityQuizzes = async function() {
            try {
                // Thử load từ file
                await originalLoadCommunityQuizzes.call(this);
            } catch (error) {
                // Nếu lỗi CORS, dùng dữ liệu mẫu
                console.warn('⚠️ CORS error, using sample data');
                
                this.communityQuizzes = [
                    {
                        id: 'sample_1',
                        title: 'Toán 10 - Chương 1',
                        description: 'Đề thi mẫu về hàm số',
                        category: 'Toán học',
                        difficulty: 'Trung bình',
                        totalQuestions: 20,
                        author: 'Admin',
                        downloads: 150,
                        rating: 4.5,
                        questions: []
                    },
                    {
                        id: 'sample_2',
                        title: 'Tiếng Anh 11 - Unit 1',
                        description: 'Đề thi mẫu về từ vựng và ngữ pháp',
                        category: 'Tiếng Anh',
                        difficulty: 'Dễ',
                        totalQuestions: 30,
                        author: 'Admin',
                        downloads: 200,
                        rating: 4.8,
                        questions: []
                    },
                    {
                        id: 'sample_3',
                        title: 'Vật Lý 12 - Dao động cơ',
                        description: 'Đề thi mẫu về dao động điều hòa',
                        category: 'Vật Lý',
                        difficulty: 'Khó',
                        totalQuestions: 25,
                        author: 'Admin',
                        downloads: 100,
                        rating: 4.2,
                        questions: []
                    }
                ];
                
                this.renderCommunityQuizzes();
                
                // Hiển thị thông báo
                if (window.notify) {
                    window.notify.show({
                        type: 'warning',
                        title: 'Chế độ Offline',
                        message: 'Đang hiển thị dữ liệu mẫu. Chạy local server để xem đầy đủ.',
                        duration: 5000
                    });
                }
            }
        };
        
        console.log('✅ CORS fix applied for ExploreQuizManager');
    }
    
    // Thêm thông báo hướng dẫn (chỉ hiển thị banner, không log console)
    setTimeout(() => {
        const isFileProtocol = window.location.protocol === 'file:';
        
        if (isFileProtocol) {
            // Chỉ log 1 dòng ngắn gọn
            console.log('%c💡 Tip: Chạy local server để web hoạt động tốt hơn', 'color: #f59e0b; font-weight: bold;');
            
            // Hiển thị banner trên trang
            const banner = document.createElement('div');
            banner.style.cssText = `
                position: fixed;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;
                font-weight: 600;
                max-width: 90%;
                animation: slideDown 0.5s ease;
            `;
            
            banner.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="font-size: 20px;"></i>
                <div>
                    <div>Đang chạy ở chế độ File (có giới hạn)</div>
                    <div style="font-size: 12px; font-weight: 400; margin-top: 4px;">
                        Chạy local server để sử dụng đầy đủ tính năng
                    </div>
                </div>
                <button onclick="this.parentElement.remove()" 
                        style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-left: auto;">
                    Đóng
                </button>
            `;
            
            // Thêm animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideDown {
                    from {
                        transform: translate(-50%, -100%);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, 0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(banner);
            
            // Tự động ẩn sau 10 giây
            setTimeout(() => {
                banner.style.animation = 'slideDown 0.5s ease reverse';
                setTimeout(() => banner.remove(), 500);
            }, 10000);
        }
    }, 2000);
    
})();

console.log('✅ FIX_CORS_ERROR.js loaded');
