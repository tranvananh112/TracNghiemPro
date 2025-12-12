// ============================================================================
// ROOM MANAGER - ENHANCED VERSION v6.0
// ============================================================================
// Nâng cấp với: Auto-sync, QR Code, Analytics, Export, Templates
// ============================================================================

class RoomManagerEnhanced extends RoomManager {
    constructor() {
        super();
        
        // Enhanced features
        this.autoSyncEnabled = true;
        this.autoSyncInterval = null;
        this.roomTemplates = JSON.parse(localStorage.getItem('roomTemplates') || '[]');
        this.analytics = {};
        
        console.log('🚀 Room Manager Enhanced v6.0 loaded');
    }

    // ============================================================================
    // 1. AUTO-SYNC OFFLINE → CLOUD
    // ============================================================================
    
    async startAutoSync() {
        if (!this.autoSyncEnabled || !this.isSupabaseAvailable) return;
        
        console.log('🔄 Starting auto-sync...');
        
        // Sync ngay lập tức
        await this.syncOfflineRoomsToCloud();
        
        // Sync mỗi 5 phút
        this.autoSyncInterval = setInterval(async () => {
            await this.syncOfflineRoomsToCloud();
        }, 5 * 60 * 1000);
    }

    stopAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
            console.log('⏹️ Auto-sync stopped');
        }
    }

    async syncOfflineRoomsToCloud() {
        if (!this.isSupabaseAvailable) return;
        
        try {
            const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
            const myOfflineRooms = offlineRooms.filter(r => r.creatorId === this.creatorId);
            
            if (myOfflineRooms.length === 0) return;
            
            console.log(`🔄 Syncing ${myOfflineRooms.length} offline rooms to cloud...`);
            
            let syncedCount = 0;
            
            for (const room of myOfflineRooms) {
                try {
                    // Kiểm tra mã phòng đã tồn tại trên cloud chưa
                    const exists = await this.checkRoomCodeExists(room.code);
                    if (exists) {
                        console.log(`⏭️ Room ${room.code} already exists on cloud, skipping...`);
                        continue;
                    }
                    
                    // Upload lên cloud
                    const result = await this.saveRoomToSupabase(room);
                    if (result.success) {
                        console.log(`✅ Synced room: ${room.name} (${room.code})`);
                        syncedCount++;
                        
                        // Xóa khỏi offline
                        const updated = offlineRooms.filter(r => r.id !== room.id);
                        localStorage.setItem('offlineRooms', JSON.stringify(updated));
                    }
                } catch (error) {
                    console.error(`❌ Failed to sync room ${room.code}:`, error);
                }
            }
            
            if (syncedCount > 0) {
                this.showToast(`✅ Đã đồng bộ ${syncedCount} phòng lên cloud!`, 'success');
                await this.loadRooms();
            }
            
        } catch (error) {
            console.error('Auto-sync error:', error);
        }
    }

    // ============================================================================
    // 2. QR CODE SHARING
    // ============================================================================
    
    async generateRoomQRCode(roomCode) {
        try {
            // Kiểm tra thư viện QRCode
            if (typeof QRCode === 'undefined') {
                console.warn('QRCode library not loaded');
                this.showToast('⚠️ Chức năng QR Code chưa được cài đặt', 'warning');
                return null;
            }
            
            const url = `${window.location.origin}${window.location.pathname}?join=${roomCode}`;
            const qrCanvas = document.createElement('canvas');
            
            await QRCode.toCanvas(qrCanvas, url, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#667eea',
                    light: '#ffffff'
                }
            });
            
            return qrCanvas;
        } catch (error) {
            console.error('QR Code generation error:', error);
            return null;
        }
    }

    async showRoomQRCode(roomCode) {
        const qrCanvas = await this.generateRoomQRCode(roomCode);
        
        if (!qrCanvas) {
            this.showToast('❌ Không thể tạo QR Code', 'error');
            return;
        }
        
        // Tạo modal hiển thị QR Code
        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 20px; text-align: center; max-width: 400px;">
                <h2 style="margin-bottom: 20px; color: #667eea;">
                    <i class="fas fa-qrcode"></i> QR Code Phòng Thi
                </h2>
                <div id="qr-container" style="margin: 20px 0;"></div>
                <p style="font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">
                    Mã: ${roomCode}
                </p>
                <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                    Quét mã QR hoặc nhập mã để tham gia
                </p>
                <button onclick="this.closest('.qr-modal').remove()" 
                        style="background: #667eea; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-size: 16px;">
                    Đóng
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('qr-container').appendChild(qrCanvas);
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }


    // ============================================================================
    // 3. ADVANCED ANALYTICS
    // ============================================================================
    
    getRoomAnalytics(roomId) {
        const room = this.myRooms.find(r => r.id === roomId);
        if (!room) return null;
        
        const leaderboard = room.leaderboard || [];
        
        if (leaderboard.length === 0) {
            return {
                totalParticipants: 0,
                totalAttempts: 0,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 0,
                averageTime: 0,
                completionRate: 0,
                passRate: 0
            };
        }
        
        const scores = leaderboard.map(e => e.score);
        const times = leaderboard.map(e => e.time);
        const passThreshold = 5.0; // Điểm đạt: >= 5.0
        
        return {
            totalParticipants: room.participants || 0,
            totalAttempts: room.attempts || 0,
            averageScore: (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(2),
            highestScore: Math.max(...scores).toFixed(2),
            lowestScore: Math.min(...scores).toFixed(2),
            averageTime: Math.round(times.reduce((sum, t) => sum + t, 0) / times.length),
            completionRate: room.participants > 0 
                ? ((leaderboard.length / room.participants) * 100).toFixed(1) 
                : 0,
            passRate: ((scores.filter(s => s >= passThreshold).length / scores.length) * 100).toFixed(1),
            scoreDistribution: this.getScoreDistribution(scores)
        };
    }

    getScoreDistribution(scores) {
        const ranges = [
            { label: '0-2', min: 0, max: 2, count: 0 },
            { label: '2-4', min: 2, max: 4, count: 0 },
            { label: '4-6', min: 4, max: 6, count: 0 },
            { label: '6-8', min: 6, max: 8, count: 0 },
            { label: '8-10', min: 8, max: 10, count: 0 }
        ];
        
        scores.forEach(score => {
            for (const range of ranges) {
                if (score >= range.min && score < range.max) {
                    range.count++;
                    break;
                }
                if (score === 10 && range.max === 10) {
                    range.count++;
                    break;
                }
            }
        });
        
        return ranges;
    }

    showRoomAnalytics(roomId) {
        const analytics = this.getRoomAnalytics(roomId);
        if (!analytics) {
            this.showToast('Không tìm thấy phòng!', 'error');
            return;
        }
        
        const room = this.myRooms.find(r => r.id === roomId);
        
        // Tạo modal hiển thị analytics
        const modal = document.createElement('div');
        modal.className = 'analytics-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            overflow-y: auto;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 20px; max-width: 800px; width: 90%; margin: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #667eea; margin: 0;">
                        <i class="fas fa-chart-bar"></i> Thống Kê Phòng Thi
                    </h2>
                    <button onclick="this.closest('.analytics-modal').remove()" 
                            style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <h3 style="color: #333; margin-bottom: 15px;">${this.escapeHtml(room.name)}</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px;">
                        <div style="font-size: 32px; font-weight: bold;">${analytics.totalParticipants}</div>
                        <div style="font-size: 14px; opacity: 0.9;">Người tham gia</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 12px;">
                        <div style="font-size: 32px; font-weight: bold;">${analytics.totalAttempts}</div>
                        <div style="font-size: 14px; opacity: 0.9;">Lượt làm bài</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 12px;">
                        <div style="font-size: 32px; font-weight: bold;">${analytics.averageScore}</div>
                        <div style="font-size: 14px; opacity: 0.9;">Điểm trung bình</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 20px; border-radius: 12px;">
                        <div style="font-size: 32px; font-weight: bold;">${analytics.passRate}%</div>
                        <div style="font-size: 14px; opacity: 0.9;">Tỷ lệ đạt</div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="margin-top: 0; color: #333;">Chi tiết</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <div style="color: #666; font-size: 14px;">Điểm cao nhất</div>
                            <div style="font-size: 20px; font-weight: bold; color: #10b981;">${analytics.highestScore}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 14px;">Điểm thấp nhất</div>
                            <div style="font-size: 20px; font-weight: bold; color: #ef4444;">${analytics.lowestScore}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 14px;">Thời gian TB</div>
                            <div style="font-size: 20px; font-weight: bold; color: #667eea;">${this.formatTime(analytics.averageTime)}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 14px;">Tỷ lệ hoàn thành</div>
                            <div style="font-size: 20px; font-weight: bold; color: #f59e0b;">${analytics.completionRate}%</div>
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
                    <h4 style="margin-top: 0; color: #333;">Phân bố điểm</h4>
                    ${analytics.scoreDistribution.map(range => `
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span style="font-size: 14px; color: #666;">${range.label} điểm</span>
                                <span style="font-size: 14px; font-weight: bold; color: #333;">${range.count} người</span>
                            </div>
                            <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${analytics.totalAttempts > 0 ? (range.count / analytics.totalAttempts * 100) : 0}%; transition: width 0.3s;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                    <button onclick="roomManager.exportRoomResults('${roomId}', 'csv')" 
                            style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; margin-right: 10px;">
                        <i class="fas fa-download"></i> Xuất CSV
                    </button>
                    <button onclick="this.closest('.analytics-modal').remove()" 
                            style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                        Đóng
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }


    // ============================================================================
    // 4. EXPORT RESULTS
    // ============================================================================
    
    exportRoomResults(roomId, format = 'csv') {
        const room = this.myRooms.find(r => r.id === roomId);
        if (!room) {
            this.showToast('Không tìm thấy phòng!', 'error');
            return;
        }
        
        const leaderboard = (room.leaderboard || []).sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.time - b.time;
        });
        
        if (leaderboard.length === 0) {
            this.showToast('Chưa có dữ liệu để xuất!', 'warning');
            return;
        }
        
        if (format === 'csv') {
            // Tạo CSV với BOM để hỗ trợ tiếng Việt
            const BOM = '\uFEFF';
            let csv = BOM + 'STT,Họ tên,Điểm,Số câu đúng,Tổng câu,Thời gian,Ngày làm\n';
            
            leaderboard.forEach((entry, index) => {
                const date = new Date(entry.completedAt).toLocaleString('vi-VN');
                csv += `${index + 1},"${entry.userName}",${entry.score},${entry.correctCount},${entry.totalQuestions},${this.formatTime(entry.time)},"${date}"\n`;
            });
            
            // Download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${room.name}_${room.code}_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            
            this.showToast('✅ Đã xuất file CSV!', 'success');
        }
    }

    // ============================================================================
    // 5. ROOM TEMPLATES
    // ============================================================================
    
    saveRoomTemplate(roomId) {
        const room = this.myRooms.find(r => r.id === roomId);
        if (!room) {
            this.showToast('Không tìm thấy phòng!', 'error');
            return;
        }
        
        const template = {
            id: 'template_' + Date.now(),
            name: room.name + ' (Template)',
            description: room.description,
            quizId: room.quiz.id,
            quizTitle: room.quiz.title,
            createdAt: new Date().toISOString()
        };
        
        this.roomTemplates.push(template);
        localStorage.setItem('roomTemplates', JSON.stringify(this.roomTemplates));
        
        this.showToast('✅ Đã lưu template!', 'success');
    }

    loadRoomTemplates() {
        this.roomTemplates = JSON.parse(localStorage.getItem('roomTemplates') || '[]');
        return this.roomTemplates;
    }

    createRoomFromTemplate(templateId) {
        const template = this.roomTemplates.find(t => t.id === templateId);
        if (!template) {
            this.showToast('Không tìm thấy template!', 'error');
            return;
        }
        
        // Auto-fill form
        const nameInput = document.getElementById('room-name-input');
        const descInput = document.getElementById('room-description-input');
        const quizSelector = document.getElementById('room-quiz-selector');
        
        if (nameInput) nameInput.value = template.name.replace(' (Template)', '');
        if (descInput) descInput.value = template.description;
        if (quizSelector) quizSelector.value = template.quizId;
        
        // Generate new code
        this.generateRoomCode();
        
        this.showToast('✅ Đã áp dụng template!', 'success');
    }

    deleteRoomTemplate(templateId) {
        this.roomTemplates = this.roomTemplates.filter(t => t.id !== templateId);
        localStorage.setItem('roomTemplates', JSON.stringify(this.roomTemplates));
        this.showToast('🗑️ Đã xóa template!', 'success');
    }

    // ============================================================================
    // 6. ROOM EXPIRY & AUTO-CLEANUP
    // ============================================================================
    
    async cleanupExpiredRooms(expiryDays = 30) {
        const now = new Date();
        const expiryDate = new Date(now.getTime() - expiryDays * 24 * 60 * 60 * 1000);
        
        let cleanedCount = 0;
        
        // Cleanup offline rooms
        const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
        const validOfflineRooms = offlineRooms.filter(room => {
            const createdDate = new Date(room.createdAt);
            return createdDate > expiryDate;
        });
        
        const offlineCleanedCount = offlineRooms.length - validOfflineRooms.length;
        if (offlineCleanedCount > 0) {
            localStorage.setItem('offlineRooms', JSON.stringify(validOfflineRooms));
            cleanedCount += offlineCleanedCount;
        }
        
        // Cleanup cloud rooms (nếu có Supabase)
        if (this.isSupabaseAvailable) {
            try {
                const { data, error } = await window.supabaseQuizManager.supabase
                    .from('exam_rooms')
                    .delete()
                    .eq('creator_id', this.creatorId)
                    .lt('created_at', expiryDate.toISOString())
                    .select();
                
                if (!error && data) {
                    cleanedCount += data.length;
                }
            } catch (error) {
                console.error('Cloud cleanup error:', error);
            }
        }
        
        if (cleanedCount > 0) {
            this.showToast(`🧹 Đã xóa ${cleanedCount} phòng cũ (>${expiryDays} ngày)`, 'success');
            await this.loadRooms();
        } else {
            this.showToast('✅ Không có phòng cũ cần xóa', 'info');
        }
    }

    // ============================================================================
    // 7. ENHANCED ROOM DETAILS WITH ACTIONS
    // ============================================================================
    
    // Override showRoomDetailsModal để thêm các nút mới
    showRoomDetailsModalEnhanced(room) {
        // Gọi hàm gốc
        this.showRoomDetailsModal(room);
        
        // Thêm các nút mới vào room-actions
        const actionsDiv = document.querySelector('.room-actions');
        if (actionsDiv && room.creatorId === this.creatorId) {
            // Thêm nút Analytics
            const analyticsBtn = document.createElement('button');
            analyticsBtn.className = 'btn-analytics';
            analyticsBtn.style.cssText = 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600;';
            analyticsBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Thống Kê';
            analyticsBtn.onclick = () => this.showRoomAnalytics(room.id);
            
            // Thêm nút QR Code
            const qrBtn = document.createElement('button');
            qrBtn.className = 'btn-qr';
            qrBtn.style.cssText = 'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600;';
            qrBtn.innerHTML = '<i class="fas fa-qrcode"></i> QR Code';
            qrBtn.onclick = () => this.showRoomQRCode(room.code);
            
            // Thêm nút Save Template
            const templateBtn = document.createElement('button');
            templateBtn.className = 'btn-template';
            templateBtn.style.cssText = 'background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600;';
            templateBtn.innerHTML = '<i class="fas fa-save"></i> Lưu Template';
            templateBtn.onclick = () => this.saveRoomTemplate(room.id);
            
            actionsDiv.appendChild(analyticsBtn);
            actionsDiv.appendChild(qrBtn);
            actionsDiv.appendChild(templateBtn);
        }
    }

    // ============================================================================
    // 8. HELPER FUNCTIONS
    // ============================================================================
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(show) {
        const loader = document.getElementById('rooms-loader');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }

    clearRoomForm() {
        const nameInput = document.getElementById('room-name-input');
        const codeInput = document.getElementById('room-code-input');
        const descInput = document.getElementById('room-description-input');
        const quizSelector = document.getElementById('room-quiz-selector');
        
        if (nameInput) nameInput.value = '';
        if (codeInput) codeInput.value = '';
        if (descInput) descInput.value = '';
        if (quizSelector) quizSelector.selectedIndex = 0;
    }

    // ============================================================================
    // 9. INITIALIZE ENHANCED FEATURES
    // ============================================================================
    
    async initializeEnhanced() {
        await this.initialize();
        
        // Start auto-sync
        if (this.autoSyncEnabled && this.isSupabaseAvailable) {
            await this.startAutoSync();
        }
        
        // Load templates
        this.loadRoomTemplates();
        
        // Auto cleanup old rooms (30 days)
        // Uncomment để bật tự động dọn dẹp
        // await this.cleanupExpiredRooms(30);
        
        console.log('✅ Enhanced features initialized');
    }
}

// ============================================================================
// AUTO-REPLACE OLD ROOM MANAGER
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Đợi RoomManager cũ load xong
    setTimeout(() => {
        if (window.roomManager && window.roomManager.constructor.name === 'RoomManager') {
            console.log('🔄 Upgrading to RoomManagerEnhanced...');
            
            // Backup data cũ
            const oldRooms = window.roomManager.rooms;
            const oldMyRooms = window.roomManager.myRooms;
            const oldCreatorId = window.roomManager.creatorId;
            
            // Tạo instance mới
            window.roomManager = new RoomManagerEnhanced();
            
            // Restore data
            window.roomManager.rooms = oldRooms;
            window.roomManager.myRooms = oldMyRooms;
            window.roomManager.creatorId = oldCreatorId;
            
            // Initialize enhanced features
            window.roomManager.initializeEnhanced();
            
            console.log('✅ RoomManagerEnhanced activated!');
        }
    }, 3000);
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoomManagerEnhanced;
}

console.log('✅ room-manager-enhanced.js loaded');
