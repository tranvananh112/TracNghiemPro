# 🏫 HƯỚNG DẪN HỆ THỐNG PHÒNG THI HOÀN CHỈNH

**Phiên bản:** 6.0 - Complete System  
**Ngày cập nhật:** 15/11/2025  
**Tác giả:** Trần Văn Anh

---

## 📋 TỔNG QUAN HỆ THỐNG

Hệ thống phòng thi hiện tại hỗ trợ **2 chế độ hoạt động**:

### 1. ☁️ Cloud Mode (Supabase)
- Lưu trữ trên cloud
- Chia sẻ toàn cầu
- Đồng bộ realtime
- Bảo mật cao với RLS
- Cần cấu hình Supabase

### 2. 💾 Offline Mode (localStorage)
- Lưu trữ trên máy
- Không cần internet
- Chia sẻ cục bộ
- Hoạt động ngay lập tức
- Không cần cấu hình

---

## 🎯 CÁC TÍNH NĂNG CHÍNH

### ✅ Đã Hoàn Thành

1. **Tạo Phòng Thi**
   - Tạo phòng cloud (nếu có Supabase)
   - Tạo phòng offline (fallback tự động)
   - Validate đầy đủ quiz data
   - Kiểm tra mã phòng trùng
   - Tạo mã ngẫu nhiên 6 số

2. **Quản Lý Phòng**
   - Hiển thị phòng của tôi (filter theo creator_id)
   - Badge mode (Cloud/Offline)
   - Xem chi tiết phòng
   - Xóa phòng (chỉ người tạo)
   - Chia sẻ mã phòng

3. **Tham Gia Phòng**
   - Join bằng mã 6 số
   - Tìm kiếm thông minh (offline → cloud)
   - Nhập tên người dùng
   - Lưu lịch sử tham gia

4. **Bảng Xếp Hạng**
   - Tự động sắp xếp theo điểm
   - Hiển thị thời gian làm bài
   - Cập nhật realtime (cloud mode)
   - Nút làm mới (offline mode)
   - Top 3 với huy chương

5. **Bảo Mật**
   - Creator ID duy nhất
   - Chỉ thấy phòng của mình
   - RLS policies trên Supabase
   - Validate dữ liệu đầy đủ


---

## 🚀 NÂNG CẤP MỚI ĐỀ XUẤT

### 1. 🔄 Auto-Sync Offline → Cloud
**Mục đích:** Tự động đồng bộ phòng offline lên cloud khi có internet

**Cách thực hiện:**
```javascript
// Thêm vào room-manager.js
async syncOfflineRoomsToCloud() {
    if (!this.isSupabaseAvailable) return;
    
    const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
    const myOfflineRooms = offlineRooms.filter(r => r.creatorId === this.creatorId);
    
    for (const room of myOfflineRooms) {
        try {
            // Kiểm tra mã phòng đã tồn tại trên cloud chưa
            const exists = await this.checkRoomCodeExists(room.code);
            if (exists) continue;
            
            // Upload lên cloud
            const result = await this.saveRoomToSupabase(room);
            if (result.success) {
                console.log('✅ Synced room:', room.name);
                // Xóa khỏi offline
                const updated = offlineRooms.filter(r => r.id !== room.id);
                localStorage.setItem('offlineRooms', JSON.stringify(updated));
            }
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }
}
```

### 2. 📱 QR Code Sharing
**Mục đích:** Chia sẻ phòng bằng QR code

**Cách thực hiện:**
```javascript
// Thêm thư viện QR Code
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>

// Thêm vào room-manager.js
async generateRoomQRCode(roomCode) {
    const url = `${window.location.origin}?join=${roomCode}`;
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
}
```


### 3. ⏰ Room Expiry & Auto-Delete
**Mục đích:** Tự động xóa phòng cũ sau thời gian nhất định

**Cách thực hiện:**
```javascript
// Thêm vào room-manager.js
async cleanupExpiredRooms() {
    const EXPIRY_DAYS = 30; // Xóa phòng sau 30 ngày
    const now = new Date();
    
    // Cleanup offline rooms
    const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
    const validRooms = offlineRooms.filter(room => {
        const createdDate = new Date(room.createdAt);
        const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
        return daysDiff < EXPIRY_DAYS;
    });
    localStorage.setItem('offlineRooms', JSON.stringify(validRooms));
    
    // Cleanup cloud rooms (nếu có Supabase)
    if (this.isSupabaseAvailable) {
        const expiryDate = new Date(now.getTime() - EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        await window.supabaseQuizManager.supabase
            .from('exam_rooms')
            .delete()
            .eq('creator_id', this.creatorId)
            .lt('created_at', expiryDate.toISOString());
    }
}
```

### 4. 📊 Advanced Analytics
**Mục đích:** Thống kê chi tiết về phòng thi

**Cách thực hiện:**
```javascript
// Thêm vào room-manager.js
getRoomAnalytics(roomId) {
    const room = this.myRooms.find(r => r.id === roomId);
    if (!room) return null;
    
    const leaderboard = room.leaderboard || [];
    
    return {
        totalParticipants: room.participants || 0,
        totalAttempts: room.attempts || 0,
        averageScore: leaderboard.length > 0 
            ? leaderboard.reduce((sum, e) => sum + e.score, 0) / leaderboard.length 
            : 0,
        highestScore: leaderboard.length > 0 
            ? Math.max(...leaderboard.map(e => e.score)) 
            : 0,
        lowestScore: leaderboard.length > 0 
            ? Math.min(...leaderboard.map(e => e.score)) 
            : 0,
        averageTime: leaderboard.length > 0 
            ? leaderboard.reduce((sum, e) => sum + e.time, 0) / leaderboard.length 
            : 0,
        completionRate: room.participants > 0 
            ? (leaderboard.length / room.participants * 100).toFixed(1) 
            : 0
    };
}
```


### 5. 🎨 Room Templates
**Mục đích:** Lưu template phòng để tạo nhanh

**Cách thực hiện:**
```javascript
// Thêm vào room-manager.js
saveRoomTemplate(room) {
    const template = {
        name: room.name,
        description: room.description,
        quizId: room.quiz.id,
        settings: {
            timeLimit: room.timeLimit,
            allowReview: room.allowReview,
            showResults: room.showResults
        }
    };
    
    const templates = JSON.parse(localStorage.getItem('roomTemplates') || '[]');
    templates.push(template);
    localStorage.setItem('roomTemplates', JSON.stringify(templates));
}

createRoomFromTemplate(templateId) {
    const templates = JSON.parse(localStorage.getItem('roomTemplates') || '[]');
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
        // Auto-fill form
        document.getElementById('room-name-input').value = template.name;
        document.getElementById('room-description-input').value = template.description;
        document.getElementById('room-quiz-selector').value = template.quizId;
        // ... fill other settings
    }
}
```

### 6. 🔔 Real-time Notifications
**Mục đích:** Thông báo khi có người join hoặc hoàn thành bài

**Cách thực hiện:**
```javascript
// Sử dụng Supabase Realtime
async subscribeToRoomUpdates(roomId) {
    if (!this.isSupabaseAvailable) return;
    
    const subscription = window.supabaseQuizManager.supabase
        .channel(`room:${roomId}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'exam_rooms',
            filter: `id=eq.${roomId}`
        }, (payload) => {
            console.log('Room updated:', payload);
            
            // Hiển thị notification
            if (window.notify) {
                window.notify.info(
                    'Cập nhật phòng thi',
                    'Có thay đổi mới trong phòng!',
                    3000
                );
            }
            
            // Reload room details
            this.viewRoomDetails(roomId);
        })
        .subscribe();
    
    return subscription;
}
```


### 7. 🔐 Room Password Protection
**Mục đích:** Bảo vệ phòng bằng mật khẩu

**Cách thực hiện:**
```javascript
// Thêm vào room object
const room = {
    // ... existing fields
    password: hashedPassword, // SHA-256 hash
    isPasswordProtected: true
};

// Khi join phòng
async joinProtectedRoom(roomCode, password) {
    const room = await this.findRoomByCode(roomCode);
    
    if (room.isPasswordProtected) {
        const hashedInput = await this.hashPassword(password);
        if (hashedInput !== room.password) {
            throw new Error('Mật khẩu không đúng!');
        }
    }
    
    // Continue join...
}

async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
```

### 8. 📤 Export Results
**Mục đích:** Xuất kết quả ra Excel/CSV

**Cách thực hiện:**
```javascript
// Thêm vào room-manager.js
exportRoomResults(roomId, format = 'csv') {
    const room = this.myRooms.find(r => r.id === roomId);
    if (!room) return;
    
    const leaderboard = room.leaderboard || [];
    
    if (format === 'csv') {
        let csv = 'STT,Họ tên,Điểm,Thời gian,Ngày làm\n';
        leaderboard.forEach((entry, index) => {
            csv += `${index + 1},${entry.userName},${entry.score},${this.formatTime(entry.time)},${new Date(entry.completedAt).toLocaleString('vi-VN')}\n`;
        });
        
        // Download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${room.name}_${room.code}.csv`;
        link.click();
    }
}
```

