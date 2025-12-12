# 🔔 Hướng Dẫn Sử Dụng Hệ Thống Thông Báo Mới

## Tổng Quan

Hệ thống thông báo mới được thiết kế hiện đại, đẹp mắt và nhỏ gọn hơn. Thông báo sẽ xuất hiện ở góc trên bên phải màn hình với animation mượt mà.

## Các Loại Thông Báo

### 1. Success (Thành công) ✅
```javascript
showSuccess('Thành công!', 'Quiz đã được lưu thành công.');
```

### 2. Error (Lỗi) ❌
```javascript
showError('Lỗi!', 'Không thể kết nối đến server.');
```

### 3. Warning (Cảnh báo) ⚠️
```javascript
showWarning('Cảnh báo!', 'Bạn chưa nhập đủ thông tin.');
```

### 4. Info (Thông tin) ℹ️
```javascript
showInfo('Thông tin', 'Hệ thống đang chạy ở chế độ offline.');
```

## Cách Sử Dụng Chi Tiết

### Cú pháp cơ bản:
```javascript
showNotification(title, message, type, duration);
```

**Tham số:**
- `title`: Tiêu đề thông báo (bắt buộc)
- `message`: Nội dung chi tiết (tùy chọn)
- `type`: Loại thông báo - 'success', 'error', 'warning', 'info' (mặc định: 'info')
- `duration`: Thời gian hiển thị tính bằng milliseconds (mặc định: 4000ms)

### Ví dụ nâng cao:
```javascript
// Thông báo tự động đóng sau 3 giây
showSuccess('Đã lưu!', 'Dữ liệu đã được lưu thành công.', 3000);

// Thông báo lỗi hiển thị lâu hơn (5 giây)
showError('Lỗi nghiêm trọng!', 'Vui lòng liên hệ admin.', 5000);

// Thông báo không tự động đóng (duration = 0)
window.notify.show({
    type: 'warning',
    title: 'Cảnh báo quan trọng',
    message: 'Vui lòng đọc kỹ trước khi tiếp tục.',
    duration: 0,
    closable: true
});
```

## Tính Năng

✨ **Animation mượt mà**: Slide in/out từ bên phải
🎨 **Màu sắc phân biệt**: Mỗi loại có màu riêng
📱 **Responsive**: Tự động điều chỉnh trên mobile
🌙 **Dark mode**: Hỗ trợ chế độ tối
⏱️ **Progress bar**: Hiển thị thời gian còn lại
👆 **Click để đóng**: Click vào thông báo hoặc nút X để đóng
🔄 **Multiple notifications**: Hiển thị nhiều thông báo cùng lúc

## Test Thông Báo

Mở file `test-notifications.html` trong trình duyệt để xem demo và test các loại thông báo.

## Thay Thế Alert Cũ

### Trước đây:
```javascript
alert('Quiz đã được lưu!');
```

### Bây giờ:
```javascript
showSuccess('Thành công!', 'Quiz đã được lưu!');
```

## Lưu Ý

- Thông báo sẽ tự động xếp chồng lên nhau nếu có nhiều thông báo cùng lúc
- Thông báo cũ sẽ tự động đóng khi hết thời gian
- Có thể click vào thông báo để đóng ngay lập tức
- Trên mobile, thông báo sẽ chiếm toàn bộ chiều rộng màn hình

## API Reference

### window.notify.show(options)
```javascript
window.notify.show({
    type: 'success',      // 'success', 'error', 'warning', 'info'
    title: 'Tiêu đề',     // String
    message: 'Nội dung',  // String
    duration: 4000,       // Number (ms), 0 = không tự đóng
    closable: true        // Boolean
});
```

### Shortcut Functions
- `showSuccess(title, message, duration)`
- `showError(title, message, duration)`
- `showWarning(title, message, duration)`
- `showInfo(title, message, duration)`
- `showNotification(title, message, type, duration)`

---

**Tác giả:** Trần Văn Anh  
**Ngày tạo:** 2025  
**Version:** 1.0
