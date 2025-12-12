// ===== DEBUG ROOM CREATE - CHẠY NGAY =====
// Copy toàn bộ và paste vào Console (F12)

(async function() {
    console.log('🔍 ===== DEBUG TẠO PHÒNG =====\n');
    
    // 1. Kiểm tra RoomManager
    console.log('1️⃣ KIỂM TRA ROOM MANAGER:');
    if (!window.roomManager) {
        console.error('❌ RoomManager không tồn tại!');
        console.log('💡 Đang khởi tạo...');
        
        if (typeof RoomManager !== 'undefined') {
            window.roomManager = new RoomManager();
            await window.roomManager.initialize();
            console.log('✅ Đã khởi tạo RoomManager');
        } else {
            console.error('❌ Class RoomManager không load!');
            return;
        }
    } else {
        console.log('✅ RoomManager tồn tại');
        console.log('   - Type:', window.roomManager.constructor.name);
        console.log('   - Supabase:', window.roomManager.isSupabaseAvailable ? '✅' : '❌');
        console.log('   - Creator ID:', window.roomManager.creatorId);
    }
    
    // 2. Kiểm tra Quizzes
    console.log('\n2️⃣ KIỂM TRA ĐỀ THI:');
    let quizzes = [];
    
    if (window.quizManager && window.quizManager.quizzes) {
        quizzes = window.quizManager.quizzes;
        console.log('✅ Từ quizManager:', quizzes.length, 'đề');
    }
    
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    console.log('✅ Từ localStorage:', storedQuizzes.length, 'đề');
    
    if (storedQuizzes.length === 0) {
        console.error('❌ KHÔNG CÓ ĐỀ THI!');
        console.log('💡 Bạn cần tạo đề thi trước:');
        console.log('   1. Vào tab "Tạo Bài Quiz"');
        console.log('   2. Tạo ít nhất 1 đề thi');
        console.log('   3. Quay lại tạo phòng');
        return;
    } else {
        console.log('✅ Có đề thi:');
        storedQuizzes.slice(0, 3).forEach((q, i) => {
            console.log(`   ${i + 1}. ${q.title} (${q.totalQuestions || q.questions?.length || 0} câu)`);
        });
    }
    
    // 3. Kiểm tra Form Elements
    console.log('\n3️⃣ KIỂM TRA FORM:');
    const elements = {
        'room-name-input': document.getElementById('room-name-input'),
        'room-code-input': document.getElementById('room-code-input'),
        'room-description-input': document.getElementById('room-description-input'),
        'room-quiz-selector': document.getElementById('room-quiz-selector'),
        'btn-create-room': document.getElementById('btn-create-room'),
        'btn-generate-room-code': document.getElementById('btn-generate-room-code')
    };
    
    let allElementsOK = true;
    Object.entries(elements).forEach(([id, el]) => {
        if (el) {
            console.log(`✅ ${id}`);
        } else {
            console.error(`❌ ${id} - KHÔNG TÌM THẤY!`);
            allElementsOK = false;
        }
    });
    
    if (!allElementsOK) {
        console.error('❌ Một số element form không tồn tại!');
        console.log('💡 Kiểm tra tab "Phòng Thi" đã mở chưa');
        return;
    }
    
    // 4. Kiểm tra Quiz Selector
    console.log('\n4️⃣ KIỂM TRA QUIZ SELECTOR:');
    const selector = document.getElementById('room-quiz-selector');
    if (selector) {
        const options = Array.from(selector.querySelectorAll('option'));
        console.log('   Tổng options:', options.length);
        
        if (options.length <= 1) {
            console.warn('⚠️ Quiz selector trống!');
            console.log('💡 Đang load quizzes...');
            
            if (window.roomManager && window.roomManager.loadQuizSelector) {
                window.roomManager.loadQuizSelector();
                
                // Đợi 1 giây rồi check lại
                await new Promise(resolve => setTimeout(resolve, 1000));
                const newOptions = Array.from(selector.querySelectorAll('option'));
                console.log('   Sau khi load:', newOptions.length, 'options');
                
                if (newOptions.length > 1) {
                    console.log('✅ Đã load quizzes:');
                    newOptions.slice(1, 4).forEach((opt, i) => {
                        console.log(`      ${i + 1}. ${opt.textContent}`);
                    });
                } else {
                    console.error('❌ Vẫn không load được quizzes!');
                }
            }
        } else {
            console.log('✅ Quiz selector có options:');
            options.slice(1, 4).forEach((opt, i) => {
                console.log(`   ${i + 1}. ${opt.textContent}`);
            });
        }
    }
    
    // 5. Test tạo phòng thử
    console.log('\n5️⃣ TEST TẠO PHÒNG:');
    console.log('💡 Đang tự động điền form...');
    
    const nameInput = document.getElementById('room-name-input');
    const codeInput = document.getElementById('room-code-input');
    const descInput = document.getElementById('room-description-input');
    const quizSelector = document.getElementById('room-quiz-selector');
    
    if (nameInput) nameInput.value = 'Test Room ' + Date.now();
    if (codeInput) codeInput.value = String(Math.floor(100000 + Math.random() * 900000));
    if (descInput) descInput.value = 'Phòng test tự động';
    if (quizSelector && quizSelector.options.length > 1) {
        quizSelector.selectedIndex = 1;
    }
    
    console.log('✅ Đã điền form:');
    console.log('   - Tên:', nameInput?.value);
    console.log('   - Mã:', codeInput?.value);
    console.log('   - Quiz:', quizSelector?.options[quizSelector?.selectedIndex]?.text);
    
    // 6. Kiểm tra nút tạo phòng
    console.log('\n6️⃣ KIỂM TRA NÚT TẠO PHÒNG:');
    const createBtn = document.getElementById('btn-create-room');
    if (createBtn) {
        console.log('✅ Nút tạo phòng tồn tại');
        
        // Kiểm tra event listener
        const listeners = getEventListeners(createBtn);
        if (listeners && listeners.click && listeners.click.length > 0) {
            console.log('✅ Có', listeners.click.length, 'event listener');
        } else {
            console.warn('⚠️ Không có event listener!');
            console.log('💡 Đang gắn event listener...');
            
            const newBtn = createBtn.cloneNode(true);
            createBtn.parentNode.replaceChild(newBtn, createBtn);
            
            newBtn.addEventListener('click', function() {
                console.log('🖱️ Button clicked!');
                if (window.roomManager && typeof window.roomManager.createRoom === 'function') {
                    window.roomManager.createRoom();
                } else {
                    console.error('❌ createRoom() không tồn tại!');
                }
            });
            
            console.log('✅ Đã gắn event listener mới');
        }
    }
    
    // 7. Hướng dẫn
    console.log('\n7️⃣ HƯỚNG DẪN:');
    console.log('📝 Để tạo phòng:');
    console.log('   1. Form đã được tự động điền');
    console.log('   2. Click nút "Tạo Phòng Thi"');
    console.log('   3. Hoặc chạy: window.roomManager.createRoom()');
    
    console.log('\n🎯 TẠO PHÒNG TỰ ĐỘNG:');
    console.log('   Chạy: window.testCreateRoom()');
    
    // Tạo hàm test
    window.testCreateRoom = async function() {
        console.log('🚀 Đang tạo phòng test...');
        
        if (!window.roomManager) {
            console.error('❌ RoomManager không tồn tại!');
            return;
        }
        
        // Điền form
        const nameInput = document.getElementById('room-name-input');
        const codeInput = document.getElementById('room-code-input');
        const descInput = document.getElementById('room-description-input');
        const quizSelector = document.getElementById('room-quiz-selector');
        
        if (nameInput) nameInput.value = 'Test Room ' + Date.now();
        if (codeInput) codeInput.value = String(Math.floor(100000 + Math.random() * 900000));
        if (descInput) descInput.value = 'Phòng test';
        if (quizSelector && quizSelector.options.length > 1) {
            quizSelector.selectedIndex = 1;
        }
        
        // Gọi createRoom
        try {
            await window.roomManager.createRoom();
            console.log('✅ Đã gọi createRoom()');
        } catch (error) {
            console.error('❌ Lỗi:', error);
        }
    };
    
    console.log('\n🏁 DEBUG HOÀN TẤT!');
    
})();
