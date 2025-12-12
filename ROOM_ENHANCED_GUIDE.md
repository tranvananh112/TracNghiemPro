# 🚀 HƯỚNG DẪN SỬ DỤNG ROOM MANAGER ENHANCED v6.0

## 📋 TỔNG QUAN

File `room-manager-enhanced.js` là phiên bản nâng cấp của `room-manager.js` với các tính năng mới:

### ✨ Tính Năng Mới

1. **🔄 Auto-Sync Offline → Cloud**
   - Tự động đồng bộ phòng offline lên cloud
   - Sync mỗi 5 phút
   - Không mất dữ liệu khi chuyển đổi

2. **📱 QR Code Sharing**
   - Tạo QR code cho mã phòng
   - Quét để join nhanh
   - Giao diện đẹp mắt

3. **📊 Advanced Analytics**
   - Thống kê chi tiết
   - Phân bố điểm
   - Tỷ lệ đạt/không đạt
   - Biểu đồ trực quan

4. **📤 Export Results**
   - Xuất kết quả ra CSV
   - Hỗ trợ tiếng Việt
   - Mở được bằng Excel

5. **🎨 Room Templates**
   - Lưu template phòng
   - Tạo nhanh từ template
   - Quản lý templates

6. **🧹 Auto-Cleanup**
   - Tự động xóa phòng cũ
   - Cấu hình được thời gian
   - Dọn dẹp cả offline và cloud

---

## 🔧 CÀI ĐẶT

### Bước 1: Thêm Thư Viện QR Code

Thêm vào `index.html` trước thẻ `</body>`:

```html
<!-- QR Code Library -->
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>

<!-- Room Manager Enhanced -->
<script src="room-manager-enhanced.js"></script>
```

### Bước 2: Kiểm Tra Load

Mở Console (F12) và kiểm tra:

```javascript
console.log(window.roomManager);
// Nên thấy: RoomManagerEnhanced { ... }
```

---

## 📖 HƯỚNG DẪN SỬ DỤNG

### 1. Auto-Sync Offline → Cloud

**Tự động:**
- Khi có Supabase, auto-sync sẽ tự động bật
- Sync mỗi 5 phút
- Không cần làm gì cả

**Thủ công:**
```javascript
// Sync ngay lập tức
await roomManager.syncOfflineRoomsToCloud();

// Bật/tắt auto-sync
roomManager.autoSyncEnabled = true;  // Bật
roomManager.autoSyncEnabled = false; // Tắt
```

**Kết quả:**
- Phòng offline sẽ được chuyển lên cloud
- Phòng offline gốc sẽ bị xóa
- Hiển thị thông báo số phòng đã sync



### 2. QR Code Sharing

**Cách sử dụng:**

1. Vào chi tiết phòng
2. Click nút **"QR Code"** (màu xanh dương)
3. QR code sẽ hiển thị
4. Người khác quét QR để join

**Hoặc dùng code:**
```javascript
// Hiển thị QR code cho phòng
roomManager.showRoomQRCode('123456');

// Tạo QR canvas
const qrCanvas = await roomManager.generateRoomQRCode('123456');
```

**Lưu ý:**
- Cần thư viện QRCode.js
- QR code chứa link: `yoursite.com?join=123456`
- Click outside modal để đóng

---

### 3. Advanced Analytics

**Cách xem:**

1. Vào chi tiết phòng
2. Click nút **"Thống Kê"** (màu hồng)
3. Xem các chỉ số:
   - Tổng người tham gia
   - Lượt làm bài
   - Điểm trung bình
   - Tỷ lệ đạt
   - Điểm cao/thấp nhất
   - Thời gian trung bình
   - Phân bố điểm

**Hoặc dùng code:**
```javascript
// Lấy analytics data
const analytics = roomManager.getRoomAnalytics('room_id');

console.log(analytics);
// {
//   totalParticipants: 10,
//   totalAttempts: 15,
//   averageScore: 7.5,
//   highestScore: 9.8,
//   lowestScore: 4.2,
//   averageTime: 180,
//   completionRate: 80,
//   passRate: 70,
//   scoreDistribution: [...]
// }

// Hiển thị modal analytics
roomManager.showRoomAnalytics('room_id');
```

---

### 4. Export Results

**Cách xuất:**

1. Vào chi tiết phòng
2. Click nút **"Thống Kê"**
3. Click nút **"Xuất CSV"**
4. File CSV sẽ được tải về

**Hoặc dùng code:**
```javascript
// Xuất CSV
roomManager.exportRoomResults('room_id', 'csv');
```

**File CSV bao gồm:**
- STT
- Họ tên
- Điểm
- Số câu đúng
- Tổng câu
- Thời gian
- Ngày làm

**Mở bằng:**
- Microsoft Excel
- Google Sheets
- LibreOffice Calc

---

### 5. Room Templates

**Lưu template:**

1. Vào chi tiết phòng
2. Click nút **"Lưu Template"** (màu vàng)
3. Template được lưu

**Sử dụng template:**

```javascript
// Load danh sách templates
const templates = roomManager.loadRoomTemplates();

// Tạo phòng từ template
roomManager.createRoomFromTemplate('template_id');
// → Form sẽ được tự động điền

// Xóa template
roomManager.deleteRoomTemplate('template_id');
```

**Template bao gồm:**
- Tên phòng
- Mô tả
- Đề thi đã chọn

**Không bao gồm:**
- Mã phòng (sẽ tạo mới)

---

### 6. Auto-Cleanup

**Xóa phòng cũ thủ công:**

```javascript
// Xóa phòng cũ hơn 30 ngày
await roomManager.cleanupExpiredRooms(30);

// Xóa phòng cũ hơn 7 ngày
await roomManager.cleanupExpiredRooms(7);
```

**Bật tự động cleanup:**

Mở file `room-manager-enhanced.js`, tìm dòng:

```javascript
// await this.cleanupExpiredRooms(30);
```

Bỏ comment:

```javascript
await this.cleanupExpiredRooms(30);
```

**Kết quả:**
- Phòng cũ hơn X ngày sẽ bị xóa
- Áp dụng cho cả offline và cloud
- Hiển thị số phòng đã xóa

---

## 🎯 DEMO & TEST

### Test Auto-Sync

```javascript
// 1. Tạo phòng offline (tắt Supabase)
// 2. Bật Supabase
// 3. Đợi 5 phút hoặc chạy:
await roomManager.syncOfflineRoomsToCloud();
// 4. Kiểm tra phòng đã lên cloud
```

### Test QR Code

```javascript
// Hiển thị QR code
roomManager.showRoomQRCode('123456');

// Quét bằng điện thoại
// Hoặc click link trong QR
```

### Test Analytics

```javascript
// Tạo phòng và cho người làm bài
// Sau đó xem analytics:
roomManager.showRoomAnalytics('room_id');
```

### Test Export

```javascript
// Xuất kết quả
roomManager.exportRoomResults('room_id', 'csv');

// Mở file CSV bằng Excel
```

### Test Templates

```javascript
// Lưu template
roomManager.saveRoomTemplate('room_id');

// Load templates
const templates = roomManager.loadRoomTemplates();
console.log(templates);

// Sử dụng template
roomManager.createRoomFromTemplate(templates[0].id);
```

---

## ⚙️ CẤU HÌNH

### Tắt Auto-Sync

```javascript
roomManager.autoSyncEnabled = false;
roomManager.stopAutoSync();
```

### Thay đổi thời gian sync

Mở `room-manager-enhanced.js`, tìm:

```javascript
}, 5 * 60 * 1000); // 5 phút
```

Đổi thành:

```javascript
}, 10 * 60 * 1000); // 10 phút
```

### Thay đổi ngày xóa phòng cũ

```javascript
// Xóa phòng cũ hơn 60 ngày
await roomManager.cleanupExpiredRooms(60);
```

---

## 🐛 TROUBLESHOOTING

### QR Code không hiển thị

**Nguyên nhân:** Chưa load thư viện QRCode.js

**Giải pháp:**
```html
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
```

### Auto-Sync không hoạt động

**Kiểm tra:**
```javascript
console.log(roomManager.autoSyncEnabled); // true?
console.log(roomManager.isSupabaseAvailable); // true?
```

**Giải pháp:**
- Đảm bảo Supabase đã cấu hình
- Bật auto-sync: `roomManager.autoSyncEnabled = true`

### Export CSV lỗi font tiếng Việt

**Nguyên nhân:** Excel không nhận diện UTF-8

**Giải pháp:**
- File đã có BOM (✅)
- Mở bằng Google Sheets
- Hoặc import vào Excel với encoding UTF-8

### Analytics không có dữ liệu

**Nguyên nhân:** Chưa có người làm bài

**Giải pháp:**
- Cho ít nhất 1 người làm bài
- Kiểm tra leaderboard có dữ liệu không

---

## 📊 SO SÁNH PHIÊN BẢN

| Tính năng | room-manager.js | room-manager-enhanced.js |
|-----------|-----------------|--------------------------|
| Tạo phòng | ✅ | ✅ |
| Cloud/Offline | ✅ | ✅ |
| Auto-Sync | ❌ | ✅ |
| QR Code | ❌ | ✅ |
| Analytics | ❌ | ✅ |
| Export CSV | ❌ | ✅ |
| Templates | ❌ | ✅ |
| Auto-Cleanup | ❌ | ✅ |

---

## 🎉 KẾT LUẬN

File `room-manager-enhanced.js` cung cấp:

✅ Tất cả tính năng cũ  
✅ 6 tính năng mới mạnh mẽ  
✅ Tương thích ngược 100%  
✅ Tự động thay thế RoomManager cũ  
✅ Không cần sửa code khác  

**Chỉ cần thêm 1 dòng vào HTML là xong!**

---

**Version:** 6.0  
**Date:** 15/11/2025  
**Author:** Trần Văn Anh
