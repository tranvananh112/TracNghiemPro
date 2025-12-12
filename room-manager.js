// ============================================================================
// ROOM MANAGER - BẢO MẬT HOÀN TOÀN
// ============================================================================
// CHỈ hiển thị phòng của CHÍNH MÌNH - Người khác CHỈ truy cập qua MÃ
// ============================================================================

class RoomManager {
    constructor() {
        this.rooms = [];
        this.myRooms = [];
        this.currentRoom = null;
        this.currentUserName = localStorage.getItem('roomUserName') || '';
        this.userRoomHistory = JSON.parse(localStorage.getItem('userRoomHistory') || '{}');
        this.isSupabaseAvailable = false;
        this.creatorId = this.getCreatorId();
        
        console.log('🔐 Room Manager - SECURE MODE ACTIVATED');
        console.log('🆔 Your Creator ID:', this.creatorId);
    }

    getCreatorId() {
        let creatorId = localStorage.getItem('creatorId');
        if (!creatorId) {
            creatorId = 'creator_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('creatorId', creatorId);
            console.log('🆕 Created new Creator ID:', creatorId);
        }
        return creatorId;
    }

    async initialize() {
        console.log('🏠 Initializing Room Manager (SECURE)...');
        await this.checkSupabaseStatus();
        await this.loadRooms();
        this.setupEventListeners();
        this.loadQuizSelector();
        console.log('✅ Room Manager initialized (SECURE)');
    }

    async checkSupabaseStatus() {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (window.supabaseQuizManager && window.supabaseQuizManager.isAvailable()) {
                this.isSupabaseAvailable = true;
                console.log('✅ Supabase available for rooms');
                return true;
            }
        } catch (error) {
            console.warn('Supabase not available for rooms:', error);
        }
        
        this.isSupabaseAvailable = false;
        return false;
    }

    setupEventListeners() {
        const createBtn = document.getElementById('btn-create-room');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.createRoom());
        }

        const generateBtn = document.getElementById('btn-generate-room-code');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateRoomCode());
        }

        const joinBtn = document.getElementById('btn-join-room');
        if (joinBtn) {
            joinBtn.addEventListener('click', () => this.joinRoom());
        }

        const roomCodeInput = document.getElementById('join-room-code-input');
        if (roomCodeInput) {
            roomCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.joinRoom();
                }
            });
        }

        const refreshBtn = document.getElementById('refresh-my-rooms');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadRooms());
        }
    }

    generateRoomCode() {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const input = document.getElementById('room-code-input');
        if (input) {
            input.value = code;
        }
        this.showToast('🎲 Đã tạo mã phòng ngẫu nhiên', 'success');
    }

    showToast(message, type = 'success') {
        // Sử dụng notification system mới nếu có
        if (window.notify) {
            window.notify.show({
                type: type,
                title: message,
                message: '',
                duration: 4000
            });
            return;
        }
        
        // Fallback: Sử dụng quizManager.showToast nếu có
        if (window.quizManager && window.quizManager.showToast) {
            window.quizManager.showToast(message, type);
            return;
        }

        // Không làm gì cả nếu không có notification system
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    async createRoom() {
        try {
            const roomName = document.getElementById('room-name-input').value.trim();
            const roomCode = document.getElementById('room-code-input').value.trim();
            const roomDescription = document.getElementById('room-description-input').value.trim();
            const selectedQuizId = document.getElementById('room-quiz-selector').value;

            if (!roomName) {
                this.showToast('Vui lòng nhập tên phòng!', 'warning');
                document.getElementById('room-name-input').focus();
                return;
            }

            if (!roomCode || roomCode.length !== 6 || !/^\d{6}$/.test(roomCode)) {
                this.showToast('Mã phòng phải là 6 chữ số!', 'warning');
                document.getElementById('room-code-input').focus();
                return;
            }

            if (!selectedQuizId) {
                this.showToast('Vui lòng chọn đề thi!', 'warning');
                document.getElementById('room-quiz-selector').focus();
                return;
            }

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
                } catch (error) {
                    console.error('Error loading quiz from localStorage:', error);
                }
            }
            
            if (!quiz) {
                this.showToast('Không tìm thấy đề thi!', 'error');
                return;
            }

            const existingRoom = await this.checkRoomCodeExists(roomCode);
            if (existingRoom) {
                this.showToast('Mã phòng đã tồn tại! Vui lòng chọn mã khác.', 'error');
                return;
            }

            const room = {
                id: Date.now().toString(),
                name: roomName,
                code: roomCode,
                description: roomDescription || 'Không có mô tả',
                quiz: {
                    id: quiz.id,
                    title: quiz.title,
                    description: quiz.description,
                    questions: quiz.questions,
                    totalQuestions: quiz.totalQuestions
                },
                creatorName: this.currentUserName || 'Người dùng',
                creatorId: this.creatorId, // ⭐ QUAN TRỌNG
                createdAt: new Date().toISOString(),
                participants: 0,
                attempts: 0,
                leaderboard: []
            };

            this.showToast('🔄 Đang tạo phòng...', 'info');

            // ⭐ NÂNG CẤP: Cho phép tạo phòng OFFLINE nếu không có Supabase
            if (this.isSupabaseAvailable) {
                // Có Supabase: Lưu lên cloud
                try {
                    const result = await this.saveRoomToSupabase(room);
                    if (result.success) {
                        room.id = result.id;
                        this.showToast('✨ Tạo phòng thành công! (Cloud)', 'success');
                        
                        this.clearRoomForm();
                        await this.loadRooms();
                        this.viewRoomDetails(room.id);
                        return;
                    }
                } catch (error) {
                    console.error('Supabase save failed:', error);
                    this.showToast('⚠️ Lỗi cloud, chuyển sang offline...', 'warning');
                    // Fallback to offline mode
                }
            }

            // ⭐ OFFLINE MODE: Lưu vào localStorage
            console.log('💾 Saving room in OFFLINE mode...');
            
            // Kiểm tra mã phòng trùng trong offline
            const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
            if (offlineRooms.some(r => r.code === roomCode)) {
                this.showToast('❌ Mã phòng đã tồn tại! Vui lòng chọn mã khác.', 'error');
                return;
            }
            
            // Lưu phòng offline
            room.mode = 'offline';
            room.id = 'offline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            offlineRooms.push(room);
            localStorage.setItem('offlineRooms', JSON.stringify(offlineRooms));
            
            this.myRooms.push(room);
            this.rooms = this.myRooms;
            
            this.showToast('✨ Tạo phòng thành công! (Offline)', 'success');
            this.clearRoomForm();
            this.renderMyRooms();
            this.viewRoomDetails(room.id);
            return;

        } catch (error) {
            console.error('Error creating room:', error);
            this.showToast('❌ Lỗi khi tạo phòng: ' + error.message, 'error');
        }
    }

    async checkRoomCodeExists(code) {
        if (!this.isSupabaseAvailable) {
            return false;
        }

        try {
            const { data, error } = await window.supabaseQuizManager.supabase
                .from('exam_rooms')
                .select('id')
                .eq('code', code)
                .single();

            if (data) {
                return true;
            }
        } catch (error) {
            // Không tìm thấy là OK
        }

        return false;
    }

    async saveRoomToSupabase(room) {
        try {
            if (!room.quiz || !room.quiz.questions || room.quiz.questions.length === 0) {
                throw new Error('Quiz data không hợp lệ!');
            }

            for (let i = 0; i < room.quiz.questions.length; i++) {
                const q = room.quiz.questions[i];
                if (!q.question || !q.options || q.options.length < 2 || !q.correctAnswer) {
                    throw new Error(`Câu hỏi ${i + 1} không đầy đủ!`);
                }
            }

            if (!room.creatorId) {
                throw new Error('Creator ID không hợp lệ!');
            }

            console.log('🔐 Saving with creator_id:', room.creatorId);

            const { data, error } = await window.supabaseQuizManager.supabase
                .from('exam_rooms')
                .insert([{
                    name: room.name,
                    code: room.code,
                    description: room.description,
                    quiz_data: room.quiz,
                    creator_name: room.creatorName,
                    creator_id: room.creatorId, // ⭐ BẮT BUỘC
                    participants: 0,
                    attempts: 0,
                    leaderboard: []
                }])
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.log('✅ Room saved securely');

            return {
                success: true,
                id: data.id
            };
        } catch (error) {
            console.error('Error saving room:', error);
            throw error;
        }
    }

    // ⭐⭐⭐ NÂNG CẤP: LOAD PHÒNG TỪ CLOUD + OFFLINE ⭐⭐⭐
    async loadRooms() {
        try {
            this.showLoading(true);
            let cloudRooms = [];
            let offlineRooms = [];

            // 1. Load từ Supabase (nếu có)
            if (this.isSupabaseAvailable) {
                try {
                    console.log('☁️ Loading rooms from Supabase...');
                    
                    const { data, error } = await window.supabaseQuizManager.supabase
                        .from('exam_rooms')
                        .select('*')
                        .eq('creator_id', this.creatorId)
                        .order('created_at', { ascending: false });

                    if (!error && data) {
                        cloudRooms = data
                            .filter(room => room.creator_id === this.creatorId)
                            .map(room => ({
                                id: room.id,
                                name: room.name,
                                code: room.code,
                                description: room.description,
                                quiz: room.quiz_data,
                                creatorName: room.creator_name,
                                creatorId: room.creator_id,
                                createdAt: room.created_at,
                                participants: room.participants || 0,
                                attempts: room.attempts || 0,
                                leaderboard: room.leaderboard || [],
                                mode: 'cloud'
                            }));
                        
                        console.log(`✅ Loaded ${cloudRooms.length} cloud rooms`);
                    }
                } catch (error) {
                    console.warn('⚠️ Supabase load failed:', error);
                }
            }

            // 2. Load từ localStorage (offline rooms)
            try {
                console.log('💾 Loading offline rooms...');
                const stored = localStorage.getItem('offlineRooms');
                if (stored) {
                    const allOfflineRooms = JSON.parse(stored);
                    offlineRooms = allOfflineRooms.filter(r => r.creatorId === this.creatorId);
                    console.log(`✅ Loaded ${offlineRooms.length} offline rooms`);
                }
            } catch (error) {
                console.warn('⚠️ Offline rooms load failed:', error);
            }

            // 3. Gộp cả 2 loại phòng
            this.myRooms = [...cloudRooms, ...offlineRooms];
            this.rooms = this.myRooms;

            console.log(`📊 Total rooms: ${this.rooms.length} (${cloudRooms.length} cloud + ${offlineRooms.length} offline)`);

            this.renderMyRooms();

        } catch (error) {
            console.error('Error loading rooms:', error);
            this.showToast('❌ Lỗi khi tải danh sách phòng', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    renderMyRooms() {
        const container = document.getElementById('my-rooms-grid');
        if (!container) return;

        if (this.rooms.length === 0) {
            container.innerHTML = `
                <div class="rooms-empty-state">
                    <i class="fas fa-door-open"></i>
                    <h3>Chưa có phòng thi nào</h3>
                    <p>Hãy tạo phòng thi đầu tiên của bạn!</p>
                    <p style="color: #10b981; margin-top: 10px; font-size: 14px;">
                        <i class="fas fa-check-circle"></i> Bạn có thể tạo phòng ${this.isSupabaseAvailable ? 'online hoặc offline' : 'offline'}
                    </p>
                    <p style="color: #6b7280; margin-top: 10px; font-size: 14px;">
                        <i class="fas fa-lock"></i> Chỉ bạn mới thấy phòng của mình
                    </p>
                </div>
            `;
            return;
        }

        const roomsHTML = this.rooms.map(room => {
            const modeIcon = room.mode === 'cloud' ? '☁️' : '💾';
            const modeText = room.mode === 'cloud' ? 'Cloud' : 'Offline';
            const modeColor = room.mode === 'cloud' ? '#10b981' : '#f59e0b';
            
            return `
            <div class="room-card" data-room-id="${room.id}">
                <div class="room-card-header">
                    <div>
                        <h4 class="room-card-title">${this.escapeHtml(room.name)}</h4>
                        <div style="display: flex; gap: 8px; align-items: center; margin-top: 5px;">
                            <span class="room-code-badge">
                                <i class="fas fa-key"></i> ${room.code}
                            </span>
                            <span style="background: ${modeColor}; color: white; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 600;">
                                ${modeIcon} ${modeText}
                            </span>
                        </div>
                    </div>
                </div>
                
                <p class="room-card-description">${this.escapeHtml(room.description)}</p>
                
                <div class="room-card-meta">
                    <div class="room-meta-item">
                        <i class="fas fa-book"></i>
                        <span>${this.escapeHtml(room.quiz.title)}</span>
                    </div>
                    <div class="room-meta-item">
                        <i class="fas fa-question-circle"></i>
                        <span>${room.quiz.totalQuestions} câu hỏi</span>
                    </div>
                    <div class="room-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(room.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
                
                <div class="room-card-stats">
                    <div class="room-stat-item">
                        <span class="room-stat-value">${room.participants || 0}</span>
                        <span class="room-stat-label">Người tham gia</span>
                    </div>
                    <div class="room-stat-item">
                        <span class="room-stat-value">${room.attempts || 0}</span>
                        <span class="room-stat-label">Lượt làm</span>
                    </div>
                    <div class="room-stat-item">
                        <span class="room-stat-value">${(room.leaderboard || []).length}</span>
                        <span class="room-stat-label">Bảng xếp hạng</span>
                    </div>
                </div>
                
                <div class="room-card-actions">
                    <button class="btn-view-room" onclick="roomManager.viewRoomDetails('${room.id}')">
                        <i class="fas fa-eye"></i>
                        Xem chi tiết
                    </button>
                    <button class="btn-share-room" onclick="roomManager.shareRoomCode('${room.code}')">
                        <i class="fas fa-share-alt"></i>
                        Chia sẻ
                    </button>
                    <button class="btn-delete-room" onclick="roomManager.deleteRoom('${room.id}')">
                        <i class="fas fa-trash"></i>
                        Xóa
                    </button>
                </div>
            </div>
        `}).join('');

        container.innerHTML = roomsHTML;
    }

    async viewRoomDetails(roomId) {
        try {
            let room = this.myRooms.find(r => r.id === roomId);

            // Nếu không tìm thấy trong myRooms, tìm trong offline rooms
            if (!room) {
                try {
                    const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
                    room = offlineRooms.find(r => r.id === roomId);
                    if (room) {
                        room.mode = 'offline';
                    }
                } catch (error) {
                    console.warn('Error loading offline room:', error);
                }
            }

            // Nếu vẫn không tìm thấy, tìm trên cloud
            if (!room && this.isSupabaseAvailable) {
                const { data, error } = await window.supabaseQuizManager.supabase
                    .from('exam_rooms')
                    .select('*')
                    .eq('id', roomId)
                    .single();

                if (!error && data) {
                    room = {
                        id: data.id,
                        name: data.name,
                        code: data.code,
                        description: data.description,
                        quiz: data.quiz_data,
                        creatorName: data.creator_name,
                        creatorId: data.creator_id,
                        createdAt: data.created_at,
                        participants: data.participants || 0,
                        attempts: data.attempts || 0,
                        leaderboard: data.leaderboard || [],
                        mode: 'cloud'
                    };
                }
            }

            if (!room) {
                this.showToast('Không tìm thấy phòng!', 'error');
                return;
            }

            this.showRoomDetailsModal(room);

        } catch (error) {
            console.error('Error viewing room details:', error);
            this.showToast('❌ Lỗi khi xem chi tiết phòng', 'error');
        }
    }

    showRoomDetailsModal(room) {
        const modal = document.getElementById('room-details-modal');
        if (!modal) return;

        const modalContent = modal.querySelector('.room-details-modal-content');
        
        const sortedLeaderboard = (room.leaderboard || []).sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.time - b.time;
        });

        const isMyRoom = room.creatorId === this.creatorId;
        const ownerBadge = isMyRoom ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin-left: 10px;"><i class="fas fa-crown"></i> Phòng của bạn</span>' : '';

        modalContent.innerHTML = `
            <div class="room-details-header">
                <div class="room-details-title-section">
                    <h2>${this.escapeHtml(room.name)} ${ownerBadge}</h2>
                    <div class="room-details-code">
                        <i class="fas fa-key"></i> Mã phòng: ${room.code}
                    </div>
                    <p class="room-details-description">${this.escapeHtml(room.description)}</p>
                </div>
                <button class="btn-close-room-modal" onclick="roomManager.closeRoomDetailsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="room-details-body">
                <div class="room-info-grid">
                    <div class="room-info-item">
                        <div class="room-info-label">
                            <i class="fas fa-book"></i>
                            Đề thi
                        </div>
                        <div class="room-info-value">${this.escapeHtml(room.quiz.title)}</div>
                    </div>
                    <div class="room-info-item">
                        <div class="room-info-label">
                            <i class="fas fa-question-circle"></i>
                            Số câu hỏi
                        </div>
                        <div class="room-info-value">${room.quiz.totalQuestions} câu</div>
                    </div>
                    <div class="room-info-item">
                        <div class="room-info-label">
                            <i class="fas fa-user"></i>
                            Người tạo
                        </div>
                        <div class="room-info-value">${this.escapeHtml(room.creatorName)}</div>
                    </div>
                    <div class="room-info-item">
                        <div class="room-info-label">
                            <i class="fas fa-calendar"></i>
                            Ngày tạo
                        </div>
                        <div class="room-info-value">${new Date(room.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div class="room-info-item">
                        <div class="room-info-label">
                            <i class="fas fa-users"></i>
                            Người tham gia
                        </div>
                        <div class="room-info-value">${room.participants || 0}</div>
                    </div>
                    <div class="room-info-item">
                        <div class="room-info-label">
                            <i class="fas fa-pen"></i>
                            Lượt làm bài
                        </div>
                        <div class="room-info-value">${room.attempts || 0}</div>
                    </div>
                </div>

                <div class="room-leaderboard-section">
                    <div class="leaderboard-header">
                        <i class="fas fa-trophy"></i>
                        <h3>Bảng Xếp Hạng</h3>
                        ${room.mode === 'offline' ? `
                            <button class="btn-refresh-leaderboard" onclick="roomManager.refreshRoomLeaderboard('${room.id}')" style="margin-left: auto; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px;">
                                <i class="fas fa-sync-alt"></i> Làm mới
                            </button>
                        ` : ''}
                    </div>
                    
                    ${sortedLeaderboard.length > 0 ? `
                        <table class="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Hạng</th>
                                    <th>Người chơi</th>
                                    <th>Điểm</th>
                                    <th>Thời gian</th>
                                    <th>Ngày làm</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedLeaderboard.map((entry, index) => `
                                    <tr>
                                        <td class="leaderboard-rank rank-${index + 1}">
                                            ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                        </td>
                                        <td>
                                            <div class="leaderboard-player">
                                                <div class="leaderboard-avatar">
                                                    ${entry.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <span class="leaderboard-name">${this.escapeHtml(entry.userName)}</span>
                                            </div>
                                        </td>
                                        <td class="leaderboard-score">${entry.score.toFixed(1)}/10</td>
                                        <td class="leaderboard-time">${this.formatTime(entry.time)}</td>
                                        <td class="leaderboard-time">${new Date(entry.completedAt).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="leaderboard-empty">
                            <i class="fas fa-trophy"></i>
                            <p>Chưa có ai hoàn thành bài thi</p>
                            <p>Hãy là người đầu tiên!</p>
                        </div>
                    `}
                </div>

                <div class="room-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                    <button class="btn-create-room" onclick="roomManager.startRoomQuiz('${room.id}')">
                        <i class="fas fa-play"></i>
                        Vào Làm Bài
                    </button>
                    <button class="btn-share-room" onclick="roomManager.shareRoomCode('${room.code}')">
                        <i class="fas fa-share-alt"></i>
                        Chia Sẻ Mã Phòng
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeRoomDetailsModal() {
        const modal = document.getElementById('room-details-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    shareRoomCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showToast(`📋 Đã copy mã phòng: ${code}`, 'success');
        }).catch(() => {
            alert(`Mã phòng: ${code}\n\nHãy chia sẻ mã này cho người khác!`);
        });
    }

    async deleteRoom(roomId) {
        if (!confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
            return;
        }

        try {
            const room = this.myRooms.find(r => r.id === roomId);
            if (!room) {
                this.showToast('❌ Không tìm thấy phòng!', 'error');
                return;
            }

            if (room.creatorId !== this.creatorId) {
                this.showToast('❌ Không có quyền xóa!', 'error');
                console.error('🔒 SECURITY: Attempted to delete other user room!');
                return;
            }

            // Xóa phòng cloud
            if (room.mode === 'cloud' && this.isSupabaseAvailable) {
                try {
                    const { error } = await window.supabaseQuizManager.supabase
                        .from('exam_rooms')
                        .delete()
                        .eq('id', roomId)
                        .eq('creator_id', this.creatorId);

                    if (!error) {
                        this.showToast('🗑️ Đã xóa phòng cloud!', 'success');
                        await this.loadRooms();
                        return;
                    } else {
                        throw error;
                    }
                } catch (error) {
                    console.error('Delete cloud room failed:', error);
                    this.showToast('❌ Lỗi: ' + error.message, 'error');
                    return;
                }
            }

            // Xóa phòng offline
            if (room.mode === 'offline' || !room.mode) {
                try {
                    const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
                    const updatedRooms = offlineRooms.filter(r => r.id !== roomId);
                    localStorage.setItem('offlineRooms', JSON.stringify(updatedRooms));
                    
                    this.showToast('🗑️ Đã xóa phòng offline!', 'success');
                    await this.loadRooms();
                    return;
                } catch (error) {
                    console.error('Delete offline room failed:', error);
                    this.showToast('❌ Lỗi khi xóa phòng offline', 'error');
                }
            }

        } catch (error) {
            console.error('Error deleting room:', error);
            this.showToast('❌ Lỗi khi xóa phòng', 'error');
        }
    }

    async joinRoom() {
        try {
            const code = document.getElementById('join-room-code-input').value.trim();

            if (!code) {
                this.showToast('Vui lòng nhập mã phòng!', 'warning');
                return;
            }

            if (code.length !== 6 || !/^\d{6}$/.test(code)) {
                this.showToast('Mã phòng phải là 6 chữ số!', 'warning');
                return;
            }

            this.showToast('🔍 Đang tìm phòng...', 'info');

            let room = null;

            // 1. Tìm trong offline rooms trước
            try {
                const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
                const offlineRoom = offlineRooms.find(r => r.code === code);
                
                if (offlineRoom) {
                    room = offlineRoom;
                    room.mode = 'offline';
                    console.log('✅ Found offline room:', code);
                }
            } catch (error) {
                console.warn('Error searching offline rooms:', error);
            }

            // 2. Nếu không tìm thấy offline, tìm trên cloud
            if (!room && this.isSupabaseAvailable) {
                try {
                    const { data, error } = await window.supabaseQuizManager.supabase
                        .from('exam_rooms')
                        .select('*')
                        .eq('code', code)
                        .single();

                    if (!error && data) {
                        room = {
                            id: data.id,
                            name: data.name,
                            code: data.code,
                            description: data.description,
                            quiz: data.quiz_data,
                            creatorName: data.creator_name,
                            creatorId: data.creator_id,
                            createdAt: data.created_at,
                            participants: data.participants || 0,
                            attempts: data.attempts || 0,
                            leaderboard: data.leaderboard || [],
                            mode: 'cloud'
                        };
                        console.log('✅ Found cloud room:', code);
                    }
                } catch (error) {
                    console.warn('Error searching cloud rooms:', error);
                }
            }

            // 3. Hiển thị kết quả
            if (room) {
                this.showRoomDetailsModal(room);
                document.getElementById('join-room-code-input').value = '';
            } else {
                this.showToast('❌ Không tìm thấy phòng với mã: ' + code, 'error');
            }

        } catch (error) {
            console.error('Error joining room:', error);
            this.showToast('❌ Lỗi khi tìm phòng', 'error');
        }
    }

    // Các hàm hỗ trợ khác (giữ nguyên từ code cũ)
    async ensureQuizManagerReady() {
        if (window.quizManager) {
            return true;
        }

        if (typeof QuizManager === 'undefined') {
            console.error('❌ QuizManager class not loaded');
            return false;
        }

        try {
            window.quizManager = new QuizManager();
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize QuizManager:', error);
            return false;
        }
    }

    async startRoomQuiz(roomId) {
        try {
            this.showToast('⏳ Đang chuẩn bị...', 'info');
            
            const isReady = await this.ensureQuizManagerReady();
            
            if (!isReady) {
                this.showToast('❌ Vui lòng tải lại trang!', 'error');
                setTimeout(() => {
                    if (confirm('Tải lại trang?')) {
                        window.location.reload();
                    }
                }, 1000);
                return;
            }

            let room = this.myRooms.find(r => r.id === roomId);

            if (!room && this.isSupabaseAvailable) {
                const { data, error } = await window.supabaseQuizManager.supabase
                    .from('exam_rooms')
                    .select('*')
                    .eq('id', roomId)
                    .single();

                if (!error && data) {
                    room = {
                        id: data.id,
                        name: data.name,
                        code: data.code,
                        description: data.description,
                        quiz: data.quiz_data,
                        creatorName: data.creator_name,
                        creatorId: data.creator_id,
                        createdAt: data.created_at,
                        participants: data.participants || 0,
                        attempts: data.attempts || 0,
                        leaderboard: data.leaderboard || []
                    };
                }
            }

            if (!room) {
                this.showToast('Không tìm thấy phòng!', 'error');
                return;
            }

            const userName = this.getUserNameForRoom(room.code);
            
            if (!userName) {
                this.showUserNameModal(room);
                return;
            }

            this.startQuizWithUserName(room, userName);

        } catch (error) {
            console.error('Error starting quiz:', error);
            this.showToast('❌ Lỗi khi b��t đầu', 'error');
        }
    }

    getUserNameForRoom(roomCode) {
        return this.userRoomHistory[roomCode] || null;
    }

    saveUserNameForRoom(roomCode, userName) {
        this.userRoomHistory[roomCode] = userName;
        localStorage.setItem('userRoomHistory', JSON.stringify(this.userRoomHistory));
    }

    showUserNameModal(room) {
        const modal = document.getElementById('user-name-modal');
        if (!modal) return;

        const modalContent = modal.querySelector('.user-name-modal-content');
        
        modalContent.innerHTML = `
            <h3>Nhập Tên Của Bạn</h3>
            <p>Để tham gia phòng thi và xuất hiện trên bảng xếp hạng</p>
            <input type="text" 
                   id="user-name-input-modal" 
                   class="user-name-input" 
                   placeholder="Nhập tên của bạn..."
                   maxlength="50">
            <button class="btn-submit-name" onclick="roomManager.submitUserName('${room.id}', '${room.code}')">
                <i class="fas fa-check"></i>
                Xác Nhận
            </button>
        `;

        modal.classList.add('active');

        setTimeout(() => {
            const input = document.getElementById('user-name-input-modal');
            if (input) {
                input.focus();
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.submitUserName(room.id, room.code);
                    }
                });
            }
        }, 100);
    }

    closeUserNameModal() {
        const modal = document.getElementById('user-name-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async submitUserName(roomId, roomCode) {
        const input = document.getElementById('user-name-input-modal');
        if (!input) return;

        const userName = input.value.trim();

        if (!userName) {
            this.showToast('Vui lòng nhập tên!', 'warning');
            input.focus();
            return;
        }

        this.saveUserNameForRoom(roomCode, userName);
        this.currentUserName = userName;
        localStorage.setItem('roomUserName', userName);

        this.closeUserNameModal();

        let room = this.myRooms.find(r => r.id === roomId);

        if (!room && this.isSupabaseAvailable) {
            const { data } = await window.supabaseQuizManager.supabase
                .from('exam_rooms')
                .select('*')
                .eq('id', roomId)
                .single();

            if (data) {
                room = {
                    id: data.id,
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    quiz: data.quiz_data,
                    creatorName: data.creator_name,
                    creatorId: data.creator_id,
                    createdAt: data.created_at,
                    participants: data.participants || 0,
                    attempts: data.attempts || 0,
                    leaderboard: data.leaderboard || []
                };
            }
        }

        if (!room) {
            this.showToast('Không tìm thấy phòng!', 'error');
            return;
        }

        this.startQuizWithUserName(room, userName);
    }

    // ⭐⭐⭐ FIXED VERSION - Khắc phục lỗi currentQuiz bị null ⭐⭐⭐
    startQuizWithUserName(room, userName) {
        if (!window.quizManager) {
            this.showToast('❌ Hệ thống chưa sẵn sàng!', 'error');
            return;
        }

        // ⭐ VALIDATE QUIZ DATA
        if (!room || !room.quiz || !room.quiz.questions || room.quiz.questions.length === 0) {
            this.showToast('❌ Dữ liệu không hợp lệ!', 'error');
            console.error('Invalid room or quiz data:', room);
            return;
        }

        console.log('🚀 Starting quiz with validated data:', {
            roomId: room.id,
            quizTitle: room.quiz.title,
            questionCount: room.quiz.questions.length,
            userName: userName
        });

        this.closeRoomDetailsModal();

        // ⭐ LƯU ROOM HIỆN TẠI
        this.currentRoom = {
            ...room,
            userName: userName
        };

        // ⭐ TẠO DEEP COPY ĐỂ BẢO VỆ DỮ LIỆU
        const quizData = {
            id: room.quiz.id,
            title: room.quiz.title,
            description: room.quiz.description || '',
            questions: JSON.parse(JSON.stringify(room.quiz.questions)), // Deep copy
            totalQuestions: room.quiz.totalQuestions || room.quiz.questions.length,
            isRoomQuiz: true,
            roomId: room.id,
            roomCode: room.code,
            roomName: room.name,
            userName: userName
        };

        // ⭐ LƯU VÀO LOCALSTORAGE ĐỂ PHỤC HỒI NẾU MẤT
        try {
            localStorage.setItem('currentRoomQuiz', JSON.stringify(quizData));
            localStorage.setItem('currentRoomData', JSON.stringify(this.currentRoom));
            console.log('✅ Quiz data backed up to localStorage');
        } catch (error) {
            console.warn('Failed to backup quiz data:', error);
        }

        // ⭐ CẬP NHẬT ATTEMPTS
        this.incrementRoomAttempts(room.id);

        // ⭐ SET QUIZ DATA VÀO QUIZMANAGER
        window.quizManager.currentQuiz = JSON.parse(JSON.stringify(quizData)); // Deep copy
        window.quizManager.currentAnswers = {};
        window.quizManager.currentQuestionIndex = 0;
        window.quizManager._quizBackup = JSON.parse(JSON.stringify(quizData)); // Backup

        console.log('✅ Quiz data set to quizManager:', window.quizManager.currentQuiz);

        // ⭐ CHUYỂN TAB
        try {
            if (typeof window.quizManager.switchTab === 'function') {
                window.quizManager.switchTab('quiz');
            }
        } catch (error) {
            console.error('Error switching tab:', error);
        }

        // ⭐ RENDER QUIZ VỚI NHIỀU LẦN THỬ
        let renderAttempts = 0;
        const maxAttempts = 3;

        const attemptRender = () => {
            renderAttempts++;
            console.log(`🎨 Render attempt ${renderAttempts}/${maxAttempts}`);

            // Kiểm tra và khôi phục nếu mất
            if (!window.quizManager.currentQuiz || !window.quizManager.currentQuiz.questions) {
                console.warn('⚠️ currentQuiz lost, restoring from backup...');
                window.quizManager.currentQuiz = JSON.parse(JSON.stringify(quizData));
                window.quizManager._quizBackup = JSON.parse(JSON.stringify(quizData));
            }

            try {
                // Thử render với modern layout trước
                if (typeof window.quizManager.renderQuizModern === 'function') {
                    window.quizManager.renderQuizModern();
                    console.log('✅ Rendered with modern layout');
                } else if (typeof window.quizManager.renderQuiz === 'function') {
                    window.quizManager.renderQuiz();
                    console.log('✅ Rendered with standard layout');
                } else {
                    throw new Error('No render function available');
                }

                // Verify render thành công
                setTimeout(() => {
                    if (!window.quizManager.currentQuiz) {
                        console.error('❌ Quiz lost after render');
                        if (renderAttempts < maxAttempts) {
                            attemptRender();
                        } else {
                            this.showToast('❌ Không thể tải bài thi. Vui lòng thử lại!', 'error');
                        }
                    } else {
                        this.showToast(`🚀 Chào ${userName}! Bắt đầu làm bài!`, 'success');
                        console.log('✅ Quiz loaded successfully');
                    }
                }, 200);

            } catch (error) {
                console.error('Error rendering quiz:', error);
                if (renderAttempts < maxAttempts) {
                    setTimeout(attemptRender, 300);
                } else {
                    this.showToast('❌ Lỗi hiển thị bài thi', 'error');
                }
            }
        };

        // Bắt đầu render sau 300ms
        setTimeout(attemptRender, 300);
    }

    async incrementRoomAttempts(roomId) {
        try {
            if (this.isSupabaseAvailable) {
                const { data } = await window.supabaseQuizManager.supabase
                    .from('exam_rooms')
                    .select('attempts')
                    .eq('id', roomId)
                    .single();

                if (data) {
                    await window.supabaseQuizManager.supabase
                        .from('exam_rooms')
                        .update({ attempts: (data.attempts || 0) + 1 })
                        .eq('id', roomId);
                }
            }
        } catch (error) {
            console.error('Error incrementing attempts:', error);
        }
    }

    async saveResultToLeaderboard(roomId, result) {
        try {
            const entry = {
                userName: result.userName,
                score: result.score,
                correctCount: result.correctCount,
                totalQuestions: result.totalQuestions,
                time: result.totalTime,
                completedAt: new Date().toISOString()
            };

            if (this.isSupabaseAvailable) {
                const { data } = await window.supabaseQuizManager.supabase
                    .from('exam_rooms')
                    .select('leaderboard')
                    .eq('id', roomId)
                    .single();

                if (data) {
                    const leaderboard = data.leaderboard || [];
                    
                    const existingIndex = leaderboard.findIndex(e => e.userName === entry.userName);
                    
                    if (existingIndex >= 0) {
                        if (entry.score > leaderboard[existingIndex].score) {
                            leaderboard[existingIndex] = entry;
                        }
                    } else {
                        leaderboard.push(entry);
                    }

                    await window.supabaseQuizManager.supabase
                        .from('exam_rooms')
                        .update({ leaderboard: leaderboard })
                        .eq('id', roomId);
                }
            }

            this.showToast('📊 Đã lưu kết quả!', 'success');

        } catch (error) {
            console.error('Error saving to leaderboard:', error);
        }
    }

    clearRoomForm() {
        document.getElementById('room-name-input').value = '';
        document.getElementById('room-code-input').value = '';
        document.getElementById('room-description-input').value = '';
        document.getElementById('room-quiz-selector').value = '';
    }

    showLoading(show) {
        const loader = document.getElementById('rooms-loading');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadQuizSelector() {
        const selector = document.getElementById('room-quiz-selector');
        if (!selector) return;

        selector.innerHTML = '<option value="">-- Chọn đề thi --</option>';

        let quizzes = [];
        
        if (window.quizManager && window.quizManager.quizzes) {
            quizzes = window.quizManager.quizzes;
        }
        
        if (quizzes.length === 0) {
            try {
                const storedQuizzes = localStorage.getItem('quizzes');
                if (storedQuizzes) {
                    quizzes = JSON.parse(storedQuizzes);
                }
            } catch (error) {
                console.error('Error loading quizzes:', error);
            }
        }

        if (quizzes && quizzes.length > 0) {
            quizzes.forEach(quiz => {
                const option = document.createElement('option');
                option.value = quiz.id;
                option.textContent = `${quiz.title} (${quiz.totalQuestions} câu)`;
                selector.appendChild(option);
            });
        } else {
            const helpOption = document.createElement('option');
            helpOption.value = '';
            helpOption.textContent = '-- Vui lòng tạo quiz trước --';
            helpOption.disabled = true;
            selector.appendChild(helpOption);
        }
    }
}

// Initialize
let roomManager;
document.addEventListener('DOMContentLoaded', () => {
    roomManager = new RoomManager();
    
    setTimeout(() => {
        roomManager.initialize();
    }, 2000);
    
    document.querySelectorAll('[data-tab="room"]').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                if (roomManager) {
                    roomManager.loadQuizSelector();
                }
            }, 100);
        });
    });
    
    setTimeout(() => {
        if (window.QuizManager && window.QuizManager.prototype) {
            const originalSaveQuizzes = window.QuizManager.prototype.saveQuizzes;
            window.QuizManager.prototype.saveQuizzes = function() {
                originalSaveQuizzes.call(this);
                if (window.roomManager) {
                    setTimeout(() => {
                        window.roomManager.loadQuizSelector();
                    }, 100);
                }
            };
        }
    }, 1000);
    
    window.addEventListener('storage', (e) => {
        if (e.key === 'quizzes' && window.roomManager) {
            window.roomManager.loadQuizSelector();
        }
    });
});

window.roomManager = roomManager;


    // ⭐ REFRESH LEADERBOARD FOR OFFLINE ROOMS
    refreshRoomLeaderboard(roomId) {
        try {
            console.log('🔄 Refreshing leaderboard for room:', roomId);
            
            // Load lại phòng từ localStorage
            const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
            const room = offlineRooms.find(r => r.id === roomId);
            
            if (!room) {
                this.showToast('❌ Không tìm thấy phòng!', 'error');
                return;
            }
            
            // Cập nhật room trong myRooms
            const roomIndex = this.myRooms.findIndex(r => r.id === roomId);
            if (roomIndex >= 0) {
                this.myRooms[roomIndex] = room;
            }
            
            // Hiển thị lại modal với dữ liệu mới
            this.showRoomDetailsModal(room);
            
            this.showToast('✅ Đã làm mới bảng xếp hạng!', 'success');
            
            console.log('✅ Leaderboard refreshed:', room.leaderboard);
            
        } catch (error) {
            console.error('Error refreshing leaderboard:', error);
            this.showToast('❌ Lỗi khi làm mới!', 'error');
        }
    }
