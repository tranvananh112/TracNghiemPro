// ⚡ FIX QUIZ SELECTOR - Sửa dropdown chọn đề thi
// Chạy script này nếu không thấy danh sách đề thi

(function() {
    console.log('⚡ Fix Quiz Selector Script');
    
    // Hàm load quiz selector
    function loadQuizSelector() {
        console.log('📚 Loading quiz selector...');
        
        const selector = document.getElementById('room-quiz-selector');
        if (!selector) {
            console.error('❌ Quiz selector not found!');
            return;
        }
        
        console.log('✅ Quiz selector found');
        
        // Clear existing options
        selector.innerHTML = '<option value="">-- Chọn đề thi --</option>';
        
        // Get quizzes
        let quizzes = [];
        
        // 1. Try from quizManager
        if (window.quizManager && window.quizManager.quizzes) {
            quizzes = window.quizManager.quizzes;
            console.log('📦 Loaded from quizManager:', quizzes.length);
        }
        
        // 2. Try from localStorage
        if (quizzes.length === 0) {
            try {
                const stored = localStorage.getItem('quizzes');
                if (stored) {
                    quizzes = JSON.parse(stored);
                    console.log('💾 Loaded from localStorage:', quizzes.length);
                }
            } catch (error) {
                console.error('❌ Error loading from localStorage:', error);
            }
        }
        
        // 3. Add options
        if (quizzes && quizzes.length > 0) {
            console.log('✅ Adding', quizzes.length, 'quizzes to selector');
            
            quizzes.forEach((quiz, index) => {
                const option = document.createElement('option');
                option.value = quiz.id;
                option.textContent = `${quiz.title} (${quiz.totalQuestions || quiz.questions?.length || 0} câu)`;
                selector.appendChild(option);
                
                console.log(`   ${index + 1}. ${quiz.title}`);
            });
            
            console.log('✅ Quiz selector loaded successfully!');
        } else {
            console.warn('⚠️ No quizzes found!');
            
            const helpOption = document.createElement('option');
            helpOption.value = '';
            helpOption.textContent = '-- Vui lòng tạo quiz trước --';
            helpOption.disabled = true;
            helpOption.style.color = '#f59e0b';
            selector.appendChild(helpOption);
            
            console.log('💡 Please create a quiz first:');
            console.log('   1. Go to "Tạo Bài Quiz"');
            console.log('   2. Create a quiz');
            console.log('   3. Come back and reload this selector');
        }
    }
    
    // Chạy ngay
    loadQuizSelector();
    
    // Gắn vào window để có thể gọi lại
    window.reloadQuizSelector = loadQuizSelector;
    
    // Gắn vào roomManager nếu có
    if (window.roomManager) {
        window.roomManager.loadQuizSelector = loadQuizSelector;
        console.log('✅ Attached to roomManager');
    }
    
    console.log('💡 To reload: window.reloadQuizSelector()');
    
})();

// ===== AUTO RELOAD ON TAB SWITCH =====
// Tự động reload khi chuyển sang tab "Tạo Phòng Thi"

(function() {
    // Tìm tất cả nav items
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    
    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === 'room') {
            // Gắn event listener
            item.addEventListener('click', function() {
                console.log('🔄 Switched to Room tab - Reloading quiz selector...');
                
                setTimeout(() => {
                    if (window.reloadQuizSelector) {
                        window.reloadQuizSelector();
                    }
                }, 500);
            });
            
            console.log('✅ Auto-reload on tab switch enabled');
        }
    });
})();

console.log('✅ Fix Quiz Selector script loaded!');
