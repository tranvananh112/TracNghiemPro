// ⚡ FORCE CREATE ROOM - Tạo phòng bắt buộc
// Chạy script này trong Console nếu nút "Tạo Phòng" không hoạt động

(function() {
    console.log('⚡ Force Create Room Script');
    
    // Kiểm tra RoomManager
    if (!window.roomManager) {
        console.error('❌ RoomManager not found!');
        console.log('💡 Initializing RoomManager...');
        
        // Khởi tạo RoomManager
        if (typeof RoomManager !== 'undefined') {
            window.roomManager = new RoomManager();
            window.roomManager.initialize().then(() => {
                console.log('✅ RoomManager initialized!');
                attachCreateRoomHandler();
            });
        } else {
            console.error('❌ RoomManager class not loaded!');
            console.log('💡 Make sure room-manager.js is loaded');
            return;
        }
    } else {
        console.log('✅ RoomManager found');
        attachCreateRoomHandler();
    }
    
    function attachCreateRoomHandler() {
        const btn = document.getElementById('btn-create-room');
        
        if (!btn) {
            console.error('❌ Create button not found!');
            return;
        }
        
        console.log('✅ Create button found');
        
        // Xóa event listeners cũ
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Gắn event listener mới
        newBtn.addEventListener('click', function() {
            console.log('🖱️ Button clicked!');
            
            if (window.roomManager && typeof window.roomManager.createRoom === 'function') {
                console.log('📞 Calling createRoom()...');
                window.roomManager.createRoom();
            } else {
                console.error('❌ createRoom() not found!');
            }
        });
        
        console.log('✅ Event listener attached!');
        console.log('💡 Try clicking "Tạo Phòng Thi" now');
    }
    
})();

// ===== MANUAL CREATE FUNCTION =====
// Gọi hàm này để tạo phòng thủ công
window.manualCreateRoom = function() {
    console.log('🔧 Manual Room Creation');
    
    // Lấy thông tin từ form
    const roomName = document.getElementById('room-name-input')?.value?.trim();
    const roomCode = document.getElementById('room-code-input')?.value?.trim();
    const quizId = document.getElementById('room-quiz-selector')?.value;
    
    console.log('📝 Form data:');
    console.log('   - Name:', roomName || '(empty)');
    console.log('   - Code:', roomCode || '(empty)');
    console.log('   - Quiz ID:', quizId || '(empty)');
    
    // Validate
    if (!roomName) {
        alert('❌ Vui lòng nhập tên phòng!');
        return;
    }
    
    if (!roomCode || roomCode.length !== 6 || !/^\d{6}$/.test(roomCode)) {
        alert('❌ Mã phòng phải là 6 chữ số!');
        return;
    }
    
    if (!quizId) {
        alert('❌ Vui lòng chọn đề thi!');
        return;
    }
    
    // Lấy quiz
    let quiz = null;
    if (window.quizManager && window.quizManager.quizzes) {
        quiz = window.quizManager.quizzes.find(q => q.id === quizId);
    }
    
    if (!quiz) {
        try {
            const storedQuizzes = localStorage.getItem('quizzes');
            if (storedQuizzes) {
                const quizzes = JSON.parse(storedQuizzes);
                quiz = quizzes.find(q => q.id === quizId);
            }
        } catch (e) {
            console.error('Error loading quiz:', e);
        }
    }
    
    if (!quiz) {
        alert('❌ Không tìm thấy đề thi!');
        return;
    }
    
    // Tạo room object
    const creatorId = localStorage.getItem('creatorId') || 
                     'creator_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('creatorId', creatorId);
    
    const room = {
        id: 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: roomName,
        code: roomCode,
        description: document.getElementById('room-description-input')?.value?.trim() || 'Không có mô tả',
        quiz: {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions,
            totalQuestions: quiz.totalQuestions || quiz.questions.length
        },
        creatorId: creatorId,
        creatorName: localStorage.getItem('roomUserName') || 'Người dùng',
        createdAt: new Date().toISOString(),
        participants: 0,
        attempts: 0,
        leaderboard: [],
        mode: 'offline'
    };
    
    // Kiểm tra mã trùng
    const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
    if (offlineRooms.some(r => r.code === roomCode)) {
        alert('❌ Mã phòng đã tồn tại! Vui lòng chọn mã khác.');
        return;
    }
    
    // Lưu phòng
    offlineRooms.push(room);
    localStorage.setItem('offlineRooms', JSON.stringify(offlineRooms));
    
    console.log('✅ Room created:', room);
    alert('✅ Tạo phòng thành công!\n\nMã phòng: ' + roomCode);
    
    // Reload danh sách
    if (window.roomManager && typeof window.roomManager.loadRooms === 'function') {
        window.roomManager.loadRooms();
    }
    
    // Clear form
    document.getElementById('room-name-input').value = '';
    document.getElementById('room-code-input').value = '';
    document.getElementById('room-description-input').value = '';
};

console.log('✅ Force create room script loaded!');
console.log('💡 Run: window.manualCreateRoom() to create room manually');
