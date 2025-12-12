# 🔧 Hướng Dẫn Cấu Hình Supabase

## 🎯 Tổng Quan

Supabase được sử dụng cho:
- ✅ Tạo phòng thi (Room)
- ✅ Chia sẻ quiz lên cloud
- ✅ Khám phá đề thi từ cộng đồng
- ✅ Lưu trữ dữ liệu online

## ✅ Kiểm Tra Nhanh

### Trong Console (F12):
```javascript
// Test kết nối
testSupabaseConnection()

// Xem SQL tạo bảng
showTableCreationSQL()
```

---

## 📋 Bước 1: Tạo Project Supabase

### 1.1. Truy cập Supabase
```
https://supabase.com/
```

### 1.2. Đăng ký/Đăng nhập
- Click "Start your project"
- Đăng nhập bằng GitHub hoặc Email

### 1.3. Tạo Project Mới
- Click "New Project"
- Nhập thông tin:
  - **Name**: QuizTva Studio
  - **Database Password**: (tạo password mạnh)
  - **Region**: Southeast Asia (Singapore)
- Click "Create new project"
- Đợi 2-3 phút để project được tạo

---

## 📋 Bước 2: Lấy API Credentials

### 2.1. Vào Settings
- Click vào project vừa tạo
- Sidebar → Settings → API

### 2.2. Copy Thông Tin
Bạn sẽ thấy:
```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3. Cập Nhật File
Mở `supabase-config.js` và thay đổi:

```javascript
// Trước
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Sau
const SUPABASE_URL = 'https://xxxxx.supabase.co'; // URL của bạn
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Key của bạn
```

---

## 📋 Bước 3: Tạo Bảng Database

### 3.1. Vào SQL Editor
- Sidebar → SQL Editor
- Click "New query"

### 3.2. Copy và Run SQL
```sql
-- Tạo bảng shared_quizzes
CREATE TABLE shared_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    total_questions INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    original_id TEXT,
    tags TEXT[],
    difficulty TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo indexes
CREATE INDEX idx_shared_quizzes_shared_at ON shared_quizzes(shared_at DESC);
CREATE INDEX idx_shared_quizzes_views ON shared_quizzes(views DESC);
CREATE INDEX idx_shared_quizzes_category ON shared_quizzes(category);
CREATE INDEX idx_shared_quizzes_difficulty ON shared_quizzes(difficulty);

-- Enable Row Level Security
ALTER TABLE shared_quizzes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
CREATE POLICY "Allow public read access" ON shared_quizzes
    FOR SELECT USING (true);

-- Policy: Allow public insert
CREATE POLICY "Allow public insert access" ON shared_quizzes
    FOR INSERT WITH CHECK (true);

-- Policy: Allow public update stats
CREATE POLICY "Allow public update stats" ON shared_quizzes
    FOR UPDATE USING (true) WITH CHECK (true);
```

### 3.3. Run Query
- Click "Run" (hoặc Ctrl+Enter)
- Kiểm tra kết quả: "Success. No rows returned"

---

## 📋 Bước 4: Kiểm Tra Kết Nối

### 4.1. Reload Trang
```
Ctrl + Shift + R
```

### 4.2. Mở Console (F12)
```javascript
testSupabaseConnection()
```

### 4.3. Kết Quả Mong Đợi
```
🔍 Testing Supabase Connection...

1️⃣ Checking Supabase Initialization...
✅ supabaseQuizManager found

2️⃣ Checking Supabase Availability...
✅ Supabase is available

3️⃣ Testing Real Connection...
✅ Connection successful!

4️⃣ Checking Table Structure...
✅ Table "shared_quizzes" exists and accessible

5️⃣ Testing Room Creation...
✅ roomManager found
✅ Supabase available for rooms

📋 SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Supabase Manager: ✅
Is Available: ✅
Room Manager: ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Supabase is working correctly!
```

---

## ❌ Troubleshooting

### Lỗi 1: "Supabase chưa được cấu hình"
**Nguyên nhân:** URL hoặc KEY chưa được cập nhật

**Giải pháp:**
1. Kiểm tra `supabase-config.js`
2. Đảm bảo URL và KEY đã được thay đổi
3. Reload trang

### Lỗi 2: "Table does not exist"
**Nguyên nhân:** Chưa tạo bảng `shared_quizzes`

**Giải pháp:**
1. Vào Supabase SQL Editor
2. Run SQL ở Bước 3
3. Kiểm tra lại

### Lỗi 3: "Permission denied"
**Nguyên nhân:** RLS policies chưa được cấu hình

**Giải pháp:**
1. Vào Supabase → Authentication → Policies
2. Kiểm tra table `shared_quizzes`
3. Đảm bảo có 3 policies: SELECT, INSERT, UPDATE
4. Nếu không có, run lại SQL ở Bước 3

### Lỗi 4: "CORS error"
**Nguyên nhân:** Supabase chặn domain

**Giải pháp:**
1. Vào Supabase → Settings → API
2. Scroll xuống "API Settings"
3. Thêm domain của bạn vào "Allowed origins"
4. Hoặc thêm `*` để cho phép tất cả (development only)

### Lỗi 5: "Network error"
**Nguyên nhân:** Không có internet hoặc firewall

**Giải pháp:**
1. Kiểm tra kết nối internet
2. Tắt VPN/ProxyInvoke-Item "TracNghiemProMax-main\index.html”
3. Kiểm tra firewall

---

## 🧪 Test Các Chức Năng

### Test 1: Tạo Phòng Thi
```
1. Click "Tạo Phòng Thi"
2. Nhập thông tin phòng
3. Click "Tạo Phòng"
4. → Phòng được tạo thành công
```

### Test 2: Chia Sẻ Quiz
```
1. Vào "Quản Lý Quiz"
2. Click "Chia sẻ" trên một quiz
3. Nhập tên và mô tả
4. Click "Chia Sẻ Ngay"
5. → Quiz được chia sẻ lên Supabase
```

### Test 3: Khám Phá Đề Thi
```
1. Click "Khám Phá Đề Thi"
2. → Thấy danh sách quiz từ Supabase
3. Click "Làm bài" trên một quiz
4. → Có thể làm bài
```

---

## 📊 Monitoring

### Xem Dữ Liệu
1. Vào Supabase → Table Editor
2. Chọn table `shared_quizzes`
3. Xem tất cả quiz đã chia sẻ

### Xem Logs
1. Vào Supabase → Logs
2. Chọn "API Logs"
3. Xem các request đến Supabase

### Xem Usage
1. Vào Supabase → Settings → Usage
2. Xem số lượng requests
3. Kiểm tra storage used

---

## 💡 Tips

### 1. Free Tier Limits
- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **API Requests**: Unlimited

### 2. Backup
- Supabase tự động backup mỗi ngày
- Có thể export data bất cứ lúc nào

### 3. Security
- Không share ANON_KEY công khai
- Sử dụng RLS policies
- Enable 2FA cho account

### 4. Performance
- Sử dụng indexes
- Limit số lượng records fetch
- Cache data khi có thể

---

## 📞 Support

### Nếu Vẫn Gặp Vấn Đề:
1. Chạy `testSupabaseConnection()` trong Console
2. Chụp screenshot kết quả
3. Kiểm tra Console có lỗi không
4. Xem Supabase Logs

### Tài Liệu:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Tác giả:** Trần Văn Anh  
**Ngày:** 15/11/2025  
**Version:** 3.2 - Supabase Setup Guide  
**Status:** ✅ Complete
