
## ⚠️ Vấn đề hiện tại:
Bạn chưa cài Python hoặc Node.js nên không thể chạy local server.

## ✅ GIẢI PHÁP NHANH NHẤT:

### Cách 1: Cài Python (Khuyến nghị) ⭐

**Bước 1: Tải Python**
1. Vào: https://www.python.org/downloads/
2. Click nút **"Download Python 3.x.x"** (màu vàng)
3. Chạy file cài đặt

**Bước 2: Cài đặt**
1. ✅ **QUAN TRỌNG:** Tick vào ô **"Add Python to PATH"** (ở dưới cùng)
2. Click **"Install Now"**
3. Đợi cài đặt xong
4. Click **"Close"**

**Bước 3: Chạy server**
1. Double-click file `start-server.bat`
2. Mở trình duyệt: http://localhost:8000
3. ✅ Xong!

---

### Cách 2: Dùng VS Code Live Server (Dễ nhất)

**Bước 1: Cài extension**
1. Mở VS Code
2. Nhấn `Ctrl+Shift+X` (mở Extensions)
3. Tìm: **"Live Server"**
4. Click **"Install"**

**Bước 2: Chạy server**
1. Mở file `index.html` trong VS Code
2. Click chuột phải vào file
3. Chọn **"Open with Live Server"**
4. Trình duyệt sẽ tự động mở
5. ✅ Xong!

---

### Cách 3: Dùng Chrome Extension

**Bước 1: Cài extension**
1. Mở Chrome
2. Vào: https://chrome.google.com/webstore
3. Tìm: **"Web Server for Chrome"**
4. Click **"Add to Chrome"**

**Bước 2: Chạy server**
1. Mở extension "Web Server for Chrome"
2. Click **"Choose Folder"**
3. Chọn thư mục `TracNghiemProMax-main`
4. Click **"Start"**
5. Mở link hiển thị (ví dụ: http://127.0.0.1:8887)
6. ✅ Xong!

---

## 🎯 SO SÁNH CÁC CÁCH:

| Cách | Độ khó | Tốc độ | Khuyến nghị |
|------|--------|--------|-------------|
| Python | Dễ | Nhanh | ⭐⭐⭐⭐⭐ |
| VS Code Live Server | Rất dễ | Rất nhanh | ⭐⭐⭐⭐⭐ |
| Chrome Extension | Trung bình | Nhanh | ⭐⭐⭐⭐ |

---

## 📝 CHI TIẾT CÁCH 1: CÀI PYTHON

### Windows:

**1. Tải Python:**
```
https://www.python.org/downloads/
```

**2. Cài đặt:**
- ✅ Tick: "Add Python to PATH"
- Click: "Install Now"

**3. Kiểm tra:**
- Mở CMD (Win+R → cmd)
- Gõ: `python --version`
- Nếu thấy số phiên bản → Thành công!

**4. Chạy server:**
```bash
# Cách 1: Double-click start-server.bat

# Cách 2: Mở CMD
cd "F:\Trắc Nghiệm Promax\TracNghiemProMax-main"
python -m http.server 8000
```

**5. Mở trình duyệt:**
```
http://localhost:8000
```

---

## 📝 CHI TIẾT CÁCH 2: VS CODE LIVE SERVER

### Cài đặt:

**1. Mở VS Code**

**2. Cài extension:**
- Nhấn `Ctrl+Shift+X`
- Tìm: "Live Server"
- Tác giả: Ritwick Dey
- Click "Install"

**3. Sử dụng:**
- Mở file `index.html`
- Click chuột phải
- Chọn "Open with Live Server"
- Hoặc click nút "Go Live" ở góc dưới phải

**4. Tự động:**
- Trình duyệt tự mở
- Tự động reload khi sửa code
- Rất tiện cho development!

---

## ✅ SAU KHI CHẠY SERVER:

### Kiểm tra web hoạt động:

1. **Trang chủ hiển thị đẹp** ✅
2. **Top navbar hoạt động** ✅
3. **Hero section với chữ chạy** ✅
4. **Tạo đề thi** ✅
5. **Tạo phòng thi** ✅
6. **Khám phá đề thi** ✅
7. **Không còn lỗi CORS** ✅

---

## 🐛 TROUBLESHOOTING:

### Lỗi: "Python not found"
**Giải pháp:**
- Cài lại Python
- Nhớ tick "Add Python to PATH"
- Khởi động lại máy

### Lỗi: "Port 8000 already in use"
**Giải pháp:**
- Đổi port khác: `python -m http.server 8001`
- Hoặc tắt chương trình đang dùng port 8000

### Lỗi: "Live Server not working"
**Giải pháp:**
- Cài lại extension
- Khởi động lại VS Code
- Kiểm tra firewall

---

## 🎉 KẾT QUẢ:

Sau khi chạy server, bạn sẽ có:

✅ Web chạy mượt mà  
✅ Tất cả chức năng hoạt động  
✅ Không còn lỗi CORS  
✅ Có thể tạo phòng thi  
✅ Có thể khám phá đề thi  
✅ Có thể chia sẻ với người khác  

---

## 💡 KHUYẾN NGHỊ:

**Dùng VS Code Live Server** vì:
- ✅ Dễ nhất
- ✅ Nhanh nhất
- ✅ Tự động reload
- ✅ Không cần cài Python

**Hoặc cài Python** vì:
- ✅ Có sẵn trên hầu hết máy
- ✅ Dùng được cho nhiều project khác
- ✅ Chạy ổn định

---

## 📞 CẦN HỖ TRỢ?

Nếu vẫn gặp vấn đề:
1. Chụp màn hình lỗi
2. Cho biết bạn đã làm bước nào
3. Hệ điều hành: Windows/Mac/Linux
4. Đã cài Python/Node.js chưa

---

**Chúc bạn thành công!** 🚀
