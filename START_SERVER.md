# 🚀 HƯỚNG DẪN CHẠY LOCAL SERVER

## ❌ Vấn đề: Lỗi CORS

Khi mở file HTML trực tiếp (`file://`), trình duyệt chặn các request vì lý do bảo mật.

**Lỗi:**
```
Access to fetch at 'file://...' has been blocked by CORS policy
```

## ✅ Giải pháp: Chạy Local Server

### Cách 1: Dùng Python (Khuyến nghị) ⭐

**Nếu có Python 3:**
```bash
# Mở Terminal/CMD tại thư mục TracNghiemProMax-main
python -m http.server 8000
```

**Nếu có Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Sau đó mở trình duyệt:**
```
http://localhost:8000
```

---

### Cách 2: Dùng Node.js

**Cài đặt http-server:**
```bash
npm install -g http-server
```

**Chạy server:**
```bash
# Mở Terminal/CMD tại thư mục TracNghiemProMax-main
http-server -p 8000
```

**Mở trình duyệt:**
```
http://localhost:8000
```

---

### Cách 3: Dùng PHP

**Nếu có PHP:**
```bash
php -S localhost:8000
```

**Mở trình duyệt:**
```
http://localhost:8000
```

---

### Cách 4: Dùng VS Code Extension

**Cài đặt extension "Live Server":**
1. Mở VS Code
2. Vào Extensions (Ctrl+Shift+X)
3. Tìm "Live Server"
4. Cài đặt
5. Click chuột phải vào `index.html`
6. Chọn "Open with Live Server"

---

### Cách 5: Dùng Chrome với flag (Không khuyến nghị)

**Windows:**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\temp\chrome_dev"
```

**Mac:**
```bash
open -na "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

⚠️ **Lưu ý:** Cách này không an toàn, chỉ dùng để test!

---

## 🎯 Khuyến nghị

**Dùng Python** vì:
- ✅ Đơn giản nhất
- ✅ Không cần cài thêm gì
- ✅ Python thường có sẵn trên máy

**Hoặc dùng VS Code Live Server** vì:
- ✅ Tự động reload khi sửa code
- ✅ Dễ dùng
- ✅ Phù hợp cho development

---

## 📝 Các bước chi tiết (Python)

### Windows:

1. **Mở Command Prompt (CMD)**
   - Nhấn `Win + R`
   - Gõ `cmd`
   - Enter

2. **Di chuyển đến thư mục project**
   ```bash
   cd F:\Trắc Nghiệm Promax\TracNghiemProMax-main
   ```

3. **Chạy server**
   ```bash
   python -m http.server 8000
   ```

4. **Mở trình duyệt**
   - Vào: `http://localhost:8000`

5. **Dừng server**
   - Nhấn `Ctrl + C` trong CMD

---

### Mac/Linux:

1. **Mở Terminal**

2. **Di chuyển đến thư mục project**
   ```bash
   cd /path/to/TracNghiemProMax-main
   ```

3. **Chạy server**
   ```bash
   python3 -m http.server 8000
   ```

4. **Mở trình duyệt**
   - Vào: `http://localhost:8000`

5. **Dừng server**
   - Nhấn `Ctrl + C` trong Terminal

---

## 🔍 Kiểm tra Python

**Kiểm tra có Python không:**
```bash
python --version
```

**Hoặc:**
```bash
python3 --version
```

**Nếu không có Python:**
- Windows: Tải từ https://www.python.org/downloads/
- Mac: `brew install python3`
- Linux: `sudo apt install python3`

---

## ✅ Sau khi chạy server

1. Mở `http://localhost:8000`
2. Lỗi CORS sẽ biến mất
3. Tất cả chức năng hoạt động bình thường
4. Có thể tạo phòng thi, khám phá đề thi, v.v.

---

## 🎉 Hoàn thành!

Bây giờ web của bạn chạy trên local server và không còn lỗi CORS nữa!
