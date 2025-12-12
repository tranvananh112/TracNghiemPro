# 🔄 Hướng Dẫn Force Reload - Cập Nhật Supabase

## ❗ Vấn Đề

Bạn đã cập nhật `supabase-config.js` nhưng trang web vẫn dùng code cũ do **browser cache**.

## ✅ Giải Pháp

### Cách 1: Hard Reload (Khuyến Nghị)

#### Windows/Linux:
```
Ctrl + Shift + R
```
hoặc
```
Ctrl + F5
```

#### Mac:
```
Cmd + Shift + R
```
hoặc
```
Cmd + Option + R
```

---

### Cách 2: Clear Cache Hoàn Toàn

#### Chrome/Edge:
1. Nhấn `F12` để mở DevTools
2. Click chuột phải vào nút Reload (⟳)
3. Chọn **"Empty Cache and Hard Reload"**

#### Firefox:
1. Nhấn `Ctrl + Shift + Delete`
2. Chọn "Cached Web Content"
3. Click "Clear Now"
4. Reload trang

---

### Cách 3: Disable Cache (Development)

#### Trong DevTools:
1. Mở DevTools (`F12`)
2. Vào tab **Network**
3. Tick vào **"Disable cache"**
4. Giữ DevTools mở
5. Reload trang

---

### Cách 4: Incognito/Private Mode

#### Chrome/Edge:
```
Ctrl + Shift + N
```

#### Firefox:
```
Ctrl + Shift + P
```

Mở trang trong chế độ ẩn danh → Không có cache

---

## 🧪 Kiểm Tra Sau Khi Reload

### Bước 1: Mở Console (F12)

### Bước 2: Chạy Test
```javascript
testSupabaseConnection()
```

### Bước 3: Xem Kết Quả

#### ✅ Nếu Thành Công:
```
✅ Supabase initialized successfully
✅ supabaseQuizManager found
✅ Supabase is available
✅ Connection successful!
✅ Table "shared_quizzes" exists and accessible

🎉 Supabase is working correctly!
```

#### ❌ Nếu Vẫn Lỗi:
```
❌ Supabase is NOT available
```

→ Xem phần Troubleshooting bên dưới

---

## 🔍 Troubleshooting

### Lỗi 1: "Supabase chưa được cấu hình"

**Kiểm tra:**
```javascript
// Trong Console
console.log(window.supabaseQuizManager);
console.log(window.supabaseQuizManager.isAvailable());
```

**Nếu `undefined`:**
- File `supabase-config.js` chưa load
- Kiểm tra Console có lỗi JavaScript không
- Hard reload lại

**Nếu `false`:**
- URL hoặc KEY sai
- Kiểm tra lại trong Supabase Dashboard

---

### Lỗi 2: "Table does not exist"

**Nguyên nhân:** Chưa tạo bảng `shared_quizzes`

**Giải pháp:**
1. Vào Supabase → SQL Editor
2. Chạy lệnh:
```javascript
showTableCreationSQL()
```
3. Copy SQL và run trong Supabase

---

### Lỗi 3: "Permission denied"

**Nguyên nhân:** RLS policies chưa được cấu hình

**Giải pháp:**
1. Vào Supabase → Authentication → Policies
2. Kiểm tra table `shared_quizzes`
3. Phải có 3 policies:
   - ✅ Allow public read access
   - ✅ Allow public insert access
   - ✅ Allow public update stats

---

### Lỗi 4: Module Script Error

**Lỗi trong Console:**
```
Failed to load module script: Expected a JavaScript module script
```

**Nguyên nhân:** File `supabase-config.js` là ES6 module

**Giải pháp:** Đã được fix, file được load với `type="module"`

---

## 📝 Checklist

Làm theo thứ tự:

- [ ] 1. Cập nhật URL và KEY trong `supabase-config.js`
- [ ] 2. Save file
- [ ] 3. Hard Reload: `Ctrl + Shift + R`
- [ ] 4. Mở Console: `F12`
- [ ] 5. Chạy test: `testSupabaseConnection()`
- [ ] 6. Kiểm tra kết quả

Nếu vẫn lỗi:

- [ ] 7. Clear cache hoàn toàn
- [ ] 8. Thử Incognito mode
- [ ] 9. Kiểm tra Console có lỗi không
- [ ] 10. Kiểm tra Network tab (F12 → Network)

---

## 🎯 Xác Nhận Supabase Đã Hoạt Động

### Test 1: Tạo Phòng
```
1. Click "Tạo Phòng Thi"
2. Nhập thông tin
3. Click "Tạo Phòng"
4. → Không có lỗi "Supabase chưa được cấu hình"
```

### Test 2: Chia Sẻ Quiz
```
1. Vào "Quản Lý Quiz"
2. Click "Chia sẻ"
3. → Modal mở ra, không có lỗi
```

### Test 3: Khám Phá
```
1. Click "Khám Phá Đề Thi"
2. → Không có thông báo lỗi
3. → Có thể thấy danh sách (hoặc empty nếu chưa có data)
```

---

## 💡 Tips

### 1. Development Mode
Khi đang phát triển, luôn:
- Mở DevTools
- Enable "Disable cache" trong Network tab
- Giữ DevTools mở

### 2. Verify Changes
Sau mỗi lần sửa code:
```javascript
// Check version
console.log('Supabase URL:', window.supabaseQuizManager?.supabase?.supabaseUrl);
```

### 3. Monitor Network
- Mở Network tab (F12)
- Filter: `supabase`
- Xem các request đến Supabase
- Kiểm tra status code (200 = OK)

---

## 📞 Vẫn Không Hoạt Động?

### Gửi Thông Tin:
1. Screenshot Console (F12)
2. Screenshot Network tab
3. Kết quả của `testSupabaseConnection()`
4. URL Supabase của bạn (không gửi KEY!)

### Kiểm Tra:
```javascript
// Trong Console
console.log('URL:', 'https://uprsyadxavxaqrenuxzh.supabase.co');
console.log('Manager:', window.supabaseQuizManager);
console.log('Available:', window.supabaseQuizManager?.isAvailable());
console.log('Supabase:', window.supabaseQuizManager?.supabase);
```

---

**Lưu ý:** Sau khi cập nhật `supabase-config.js`, PHẢI hard reload (`Ctrl + Shift + R`) để browser load code mới!

**Tác giả:** Trần Văn Anh  
**Ngày:** 15/11/2025  
**Version:** 3.3 - Force Reload Guide
