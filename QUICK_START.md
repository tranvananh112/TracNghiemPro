# 🚀 Quick Start - Personal Menu

## Vấn Đề: Không Thấy Dữ Liệu

Nếu bạn thấy "Chưa có lịch sử truy cập" hoặc "Chưa có kết quả nào", đây là cách khắc phục:

## ✅ Giải Pháp 1: Tự Động (Khuyến Nghị)

### Bước 1: Reload Trang
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Bước 2: Đợi 2 Giây
- Hệ thống sẽ tự động kiểm tra
- Nếu chưa có dữ liệu, sẽ tự động tạo
- Notification sẽ xuất hiện: "Dữ liệu mẫu đã được tạo"

### Bước 3: Chuyển Sang Các Tab
1. Click "Thư viện của tôi" → Thấy 3 quiz
2. Click "Truy cập gần đây" → Thấy 2 quiz
3. Click "Đề thi yêu thích" → Thấy 2 quiz
4. Click "Kết quả thi của tôi" → Thấy 3 kết quả

## ✅ Giải Pháp 2: Thủ Công

### Cách 1: Click Nút
1. Vào tab "Truy cập gần đây" hoặc "Kết quả thi"
2. Click nút "Tạo dữ liệu mẫu"
3. Trang sẽ tự động reload
4. Dữ liệu sẽ xuất hiện

### Cách 2: Console
1. Mở Console (F12)
2. Chạy lệnh:
```javascript
createSampleData()
```
3. Reload trang:
```javascript
location.reload()
```

## 📊 Dữ Liệu Mẫu Bao Gồm:

### 3 Quiz:
1. **Toán 10 - Hàm số** (20 câu)
2. **Lý 11 - Điện học** (15 câu)
3. **Hóa 12 - Hữu cơ** (25 câu)

### 2 Recent Access:
- Toán 10 (vừa xong)
- Lý 11 (1 giờ trước)

### 2 Favorites:
- Toán 10
- Hóa 12

### 3 Results:
- Toán 10: 8.5/10 (85%)
- Lý 11: 7.0/10 (70%)
- Hóa 12: 9.2/10 (92%)

## 🔍 Kiểm Tra Dữ Liệu

### Trong Console:
```javascript
// Kiểm tra quizzes
console.log(JSON.parse(localStorage.getItem('quizzes')));

// Kiểm tra recent access
console.log(JSON.parse(localStorage.getItem('recentAccess')));

// Kiểm tra favorites
console.log(JSON.parse(localStorage.getItem('favorites')));

// Kiểm tra results
console.log(JSON.parse(localStorage.getItem('myResults')));
```

## 🗑️ Xóa Dữ Liệu Mẫu

### Trong Console:
```javascript
clearSampleData()
location.reload()
```

### Hoặc thủ công:
```javascript
localStorage.removeItem('quizzes');
localStorage.removeItem('recentAccess');
localStorage.removeItem('favorites');
localStorage.removeItem('myResults');
location.reload();
```

## ❓ Troubleshooting

### Vấn đề: Vẫn không thấy dữ liệu
**Giải pháp:**
1. Clear cache: Ctrl + Shift + Delete
2. Reload: Ctrl + Shift + R
3. Chạy lại: `createSampleData()`

### Vấn đề: Console báo lỗi
**Giải pháp:**
1. Kiểm tra file `create-sample-data.js` đã load chưa
2. Kiểm tra file `auto-init-personal-data.js` đã load chưa
3. Xem Console có lỗi JavaScript không

### Vấn đề: Dữ liệu bị mất sau reload
**Nguyên nhân:** Browser đang ở chế độ Incognito
**Giải pháp:** Mở ở chế độ bình thường

## 🎯 Test Realtime

Sau khi có dữ liệu mẫu:

### Test 1: Làm Bài Mới
1. Click "Làm Bài"
2. Chọn quiz "Toán 10"
3. Click "Bắt đầu"
4. → Kiểm tra "Truy cập gần đây" (phải có Toán 10 ở đầu)

### Test 2: Toggle Favorite
1. Vào "Thư viện của tôi"
2. Click icon ❤️ trên quiz "Lý 11"
3. → Kiểm tra "Đề thi yêu thích" (phải có Lý 11)

### Test 3: Hoàn Thành Bài
1. Làm bài quiz
2. Click "Nộp bài"
3. → Kiểm tra "Kết quả thi" (phải có kết quả mới)

## 📝 Lưu Ý

- Dữ liệu lưu trong localStorage
- Không mất khi reload trang
- Chỉ mất khi clear cache
- Không đồng bộ giữa các thiết bị

---

**Cập nhật:** 15/11/2025  
**Version:** 2.2
