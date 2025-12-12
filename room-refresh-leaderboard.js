// ⭐ REFRESH LEADERBOARD FOR OFFLINE ROOMS
// Thêm vào room-manager.js

// Thêm hàm này vào class RoomManager:

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

// CÁCH SỬ DỤNG:
// 1. Người dùng làm bài xong
// 2. Kết quả được lưu vào localStorage (offline room)
// 3. Người tạo phòng click nút "Làm mới" trong modal
// 4. Bảng xếp hạng được cập nhật ngay lập tức
