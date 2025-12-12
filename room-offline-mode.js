// Room Offline Mode - DEPRECATED
// ⚠️ File này không còn cần thiết vì room-manager.js đã tích hợp offline mode
// ⚠️ Giữ lại để tương thích, nhưng không làm gì cả

(function() {
    console.log('🏠 Room Offline Mode (DEPRECATED) - Offline mode is now built-in to room-manager.js');
    return; // Exit immediately
    
    // Code cũ bên dưới không chạy nữa
    console.log('🏠 Room Offline Mode initializing...');
    
    // ⭐ Hàm đợi RoomManager được khởi tạo
    function waitForRoomManager(callback, maxAttempts = 20) {
        let attempts = 0;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (window.roomManager) {
                clearInterval(checkInterval);
                console.log('✅ RoomManager found after', attempts, 'attempts');
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('⚠️ RoomManager not found after', maxAttempts, 'attempts');
                console.log('💡 Room offline mode disabled');
            }
        }, 500); // Check every 500ms
    }
    
    // Đợi RoomManager load
    waitForRoomManager(() => {
        // Kiểm tra Supabase
        if (window.roomManager.isSupabaseAvailable) {
            console.log('✅ Supabase available - Using online mode');
            return;
        }
        
        console.log('📴 Supabase not available - Enabling offline mode');
        
        // Override createRoom để hoạt động offline
        const originalCreateRoom = window.roomManager.createRoom;
        
        window.roomManager.createRoom = async function() {
            console.log('🏠 Creating room in OFFLINE mode...');
            
            // Lấy thông tin từ form
            const roomName = document.getElementById('room-name-input')?.value?.trim();
            const roomCode = document.getElementById('room-code-input')?.value?.trim();
            const selectedQuizId = document.getElementById('room-quiz-selector')?.value;
            const timeLimit = parseInt(document.getElementById('room-time-limit')?.value) || 0;
            const allowReview = document.getElementById('room-allow-review')?.checked || false;
            const showResults = document.getElementById('room-show-results')?.checked || true;
            
            // Validate
            if (!roomName) {
                if (window.notify) {
                    window.notify.warning('Thiếu thông tin', 'Vui lòng nhập tên phòng!');
                }
                return;
            }
            
            if (!roomCode || roomCode.length !== 6 || !/^\d{6}$/.test(roomCode)) {
                if (window.notify) {
                    window.notify.warning('Mã phòng không hợp lệ', 'Mã phòng phải là 6 chữ số!');
                }
                return;
            }
            
            if (!selectedQuizId) {
                if (window.notify) {
                    window.notify.warning('Thiếu đề thi', 'Vui lòng chọn đề thi!');
                }
                return;
            }
            
            // Lấy quiz
            let quiz = null;
            if (window.quizManager && window.quizManager.quizzes) {
                quiz = window.quizManager.quizzes.find(q => q.id === selectedQuizId);
            }
            
            if (!quiz) {
                try {
                    const storedQuizzes = localStorage.getItem('quizzes');
                    if (storedQuizzes) {
                        const quizzes = JSON.parse(storedQuizzes);
                        quiz = quizzes.find(q => q.id === selectedQuizId);
                    }
                } catch (e) {
                    console.error('Error loading quiz:', e);
                }
            }
            
            if (!quiz) {
                if (window.notify) {
                    window.notify.error('Lỗi', 'Không tìm thấy đề thi!');
                }
                return;
            }
            
            // Tạo room object
            const room = {
                id: 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                code: roomCode,
                name: roomName,
                quizId: selectedQuizId,
                quizTitle: quiz.title,
                totalQuestions: quiz.totalQuestions || quiz.questions?.length || 0,
                timeLimit: timeLimit,
                allowReview: allowReview,
                showResults: showResults,
                creatorId: this.creatorId,
                createdAt: new Date().toISOString(),
                participants: [],
                status: 'active',
                mode: 'offline' // Đánh dấu là offline
            };
            
            // Lưu vào localStorage
            const rooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
            
            // Kiểm tra mã phòng trùng
            if (rooms.some(r => r.code === roomCode)) {
                if (window.notify) {
                    window.notify.warning('Mã phòng đã tồn tại', 'Vui lòng chọn mã khác!');
                }
                return;
            }
            
            rooms.push(room);
            localStorage.setItem('offlineRooms', JSON.stringify(rooms));
            
            // Thêm vào myRooms
            this.myRooms.push(room);
            
            // Hiển thị thông báo
            if (window.notify) {
                window.notify.success(
                    'Tạo phòng thành công!',
                    `Mã phòng: ${roomCode}`,
                    5000
                );
            }
            
            // Clear form
            document.getElementById('room-name-input').value = '';
            document.getElementById('room-code-input').value = '';
            document.getElementById('room-quiz-selector').value = '';
            
            // Render lại danh sách
            this.renderMyRooms();
            
            // Hiển thị chi tiết phòng
            this.showRoomDetails(room);
            
            console.log('✅ Room created in offline mode:', room);
        };
        
        // Override loadRooms để load từ localStorage
        const originalLoadRooms = window.roomManager.loadRooms;
        
        window.roomManager.loadRooms = async function() {
            if (this.isSupabaseAvailable) {
                return originalLoadRooms.call(this);
            }
            
            console.log('📂 Loading rooms from localStorage...');
            
            try {
                const rooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
                this.myRooms = rooms.filter(r => r.creatorId === this.creatorId);
                
                console.log('✅ Loaded', this.myRooms.length, 'offline rooms');
                
                this.renderMyRooms();
            } catch (error) {
                console.error('Error loading offline rooms:', error);
                this.myRooms = [];
            }
        };
        
        // Override joinRoom để join offline room
        const originalJoinRoom = window.roomManager.joinRoom;
        
        window.roomManager.joinRoom = async function(roomCode) {
            console.log('🚪 Joining room:', roomCode);
            
            // Tìm trong offline rooms trước
            const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
            const offlineRoom = offlineRooms.find(r => r.code === roomCode);
            
            if (offlineRoom) {
                console.log('✅ Found offline room');
                
                // Lấy quiz
                let quiz = null;
                if (window.quizManager && window.quizManager.quizzes) {
                    quiz = window.quizManager.quizzes.find(q => q.id === offlineRoom.quizId);
                }
                
                if (!quiz) {
                    try {
                        const storedQuizzes = localStorage.getItem('quizzes');
                        if (storedQuizzes) {
                            const quizzes = JSON.parse(storedQuizzes);
                            quiz = quizzes.find(q => q.id === offlineRoom.quizId);
                        }
                    } catch (e) {
                        console.error('Error loading quiz:', e);
                    }
                }
                
                if (!quiz) {
                    if (window.notify) {
                        window.notify.error('Lỗi', 'Không tìm thấy đề thi của phòng này!');
                    }
                    return;
                }
                
                // Bắt đầu làm bài
                if (window.quizManager) {
                    window.quizManager.currentQuiz = quiz;
                    window.quizManager.currentQuizId = quiz.id;
                    
                    // Chuyển sang tab quiz
                    document.querySelector('[data-tab="quiz"]')?.click();
                    
                    // Render quiz
                    setTimeout(() => {
                        if (window.quizManager.renderQuiz) {
                            window.quizManager.renderQuiz();
                        }
                    }, 100);
                    
                    if (window.notify) {
                        window.notify.success(
                            'Vào phòng thành công!',
                            `Phòng: ${offlineRoom.name}`,
                            3000
                        );
                    }
                }
                
                return;
            }
            
            // Nếu không tìm thấy offline, thử online
            if (this.isSupabaseAvailable && originalJoinRoom) {
                return originalJoinRoom.call(this, roomCode);
            }
            
            // Không tìm thấy
            if (window.notify) {
                window.notify.error('Không tìm thấy phòng', `Mã phòng ${roomCode} không tồn tại!`);
            }
        };
        
        console.log('✅ Room Offline Mode enabled');
        
        // Hiển thị thông báo
        if (window.notify) {
            window.notify.info(
                'Chế độ Offline',
                'Phòng thi sẽ lưu trên máy bạn',
                4000
            );
        }
    });
})();

console.log('✅ Room Offline Mode script loaded');
