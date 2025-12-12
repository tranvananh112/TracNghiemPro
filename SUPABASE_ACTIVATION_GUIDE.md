# ⚡ KÍCH HOẠT SUPABASE - HƯỚNG DẪN ĐẦY ĐỦ

## ✅ THÔNG TIN SUPABASE

**Project URL:** `https://uprsyadxavxaqrenuxzh.supabase.co`  
**API Key (anon/public):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  
**Status:** ✅ Đã cấu hình trong `supabase-config.js`

## 🎯 CÁC TÍNH NĂNG SẼ ĐƯỢC KÍCH HOẠT

### 1. ☁️ Cloud Rooms (Phòng Thi Cloud)
- Tạo phòng lưu trên Supabase
- Chia sẻ toàn cầu
- Bảng xếp hạng realtime
- Đồng bộ tự động

### 2. 🌐 Share Quizzes (Chia Sẻ Đề Thi)
- Chia sẻ đề thi lên cloud
- Khám phá đề thi từ cộng đồng
- Thống kê views, attempts, likes

### 3. 📊 Leaderboard (Bảng Xếp Hạng)
- Lưu kết quả thi
- Xếp hạng tự động
- Cập nhật realtime

### 4. 🔄 Realtime Updates
- Cập nhật tức thì
- Không cần refresh
- Đồng bộ giữa các thiết bị

## 🔧 BƯỚC KÍCH HOẠT

### Bước 1: Kiểm Tra Cấu Hình

File `supabase-config.js` đã có:
```javascript
const SUPABASE_URL = 'https://uprsyadxavxaqrenuxzh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

✅ **Đã OK!** Không cần sửa gì.

### Bước 2: Chạy SQL Setup

**Quan trọng:** Phải tạo bảng trong Supabase!

1. Truy cập: https://supabase.com/dashboard
2. Chọn project: `uprsyadxavxaqrenuxzh`
3. Vào **SQL Editor**
4. Chạy các SQL sau:

#### SQL 1: Tạo Bảng `shared_quizzes`

```sql
-- Bảng chia sẻ đề thi
CREATE TABLE IF NOT EXISTS shared_quizzes (
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

-- Index
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_shared_at ON shared_quizzes(shared_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_quizzes_views ON shared_quizzes(views DESC);

-- RLS
ALTER TABLE shared_quizzes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read" ON shared_quizzes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON shared_quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update stats" ON shared_quizzes FOR UPDATE USING (true);
```

#### SQL 2: Tạo Bảng `exam_rooms`

```sql
-- Bảng phòng thi
CREATE TABLE IF NOT EXISTS exam_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    quiz_data JSONB NOT NULL,
    creator_name TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    leaderboard JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_exam_rooms_code ON exam_rooms(code);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_creator_id ON exam_rooms(creator_id);
CREATE INDEX IF NOT EXISTS idx_exam_rooms_created_at ON exam_rooms(created_at DESC);

-- RLS
ALTER TABLE exam_rooms ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow read all rooms" ON exam_rooms FOR SELECT USING (true);
CREATE POLICY "Allow insert new room" ON exam_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update stats" ON exam_rooms FOR UPDATE USING (true);
CREATE POLICY "Allow delete own room" ON exam_rooms FOR DELETE USING (true);
```

### Bước 3: Test Kết Nối

Mở Console (F12) và chạy:

```javascript
// Test connection
const { data, error } = await window.supabaseQuizManager.supabase
    .from('exam_rooms')
    .select('count')
    .limit(1);

if (error) {
    console.error('❌ Error:', error);
} else {
    console.log('✅ Connected!');
}
```

### Bước 4: Kích Hoạt Tính Năng

Load script kích hoạt:

```html
<!-- Thêm vào index.html trước </body> -->
<script src="activate-supabase-features.js"></script>
```

Hoặc chạy trong Console:

```javascript
// Copy toàn bộ nội dung activate-supabase-features.js
// Paste vào Console và Enter
```

### Bước 5: Reload Trang

```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

## 🧪 KIỂM TRA

### Test 1: Kiểm Tra Supabase

```javascript
console.log('Supabase:', window.supabaseQuizManager?.isAvailable());
// Expected: true
```

### Test 2: Kiểm Tra Room Manager

```javascript
console.log('Room Manager Supabase:', window.roomManager?.isSupabaseAvailable);
// Expected: true
```

### Test 3: Tạo Phòng Cloud

```
1. Vào "Tạo Phòng Thi"
2. Nhập thông tin
3. Click "Tạo Phòng Thi"
4. Kiểm tra badge: ☁️ Cloud (màu xanh)
```

### Test 4: Chia Sẻ Đề Thi

```
1. Vào "Khám Phá Đề Thi"
2. Click "Chia Sẻ Quiz"
3. Chọn đề thi
4. Click "Chia Sẻ"
5. Kiểm tra thông báo thành công
```

## 📊 TÍNH NĂNG TRƯỚC/SAU

### Trước Khi Kích Hoạt

| Tính năng | Trạng thái |
|-----------|------------|
| Tạo phòng | ❌ Chỉ offline |
| Chia sẻ phòng | ❌ Cùng máy |
| Bảng xếp hạng | ⚠️ Cần refresh |
| Chia sẻ đề thi | ❌ Không có |
| Khám phá đề thi | ❌ Không có |

### Sau Khi Kích Hoạt

| Tính năng | Trạng thái |
|-----------|------------|
| Tạo phòng | ✅ Cloud + Offline |
| Chia sẻ phòng | ✅ Toàn cầu |
| Bảng xếp hạng | ✅ Realtime |
| Chia sẻ đề thi | ✅ Lên cloud |
| Khám phá đề thi | ✅ Từ cộng đồng |

## 🐛 TROUBLESHOOTING

### Lỗi: "Table does not exist"

**Nguyên nhân:** Chưa chạy SQL setup

**Giải pháp:**
1. Vào Supabase SQL Editor
2. Chạy SQL tạo bảng (Bước 2)
3. Reload trang

### Lỗi: "Permission denied"

**Nguyên nhân:** RLS policies chưa đúng

**Giải pháp:**
```sql
-- Xóa policies cũ
DROP POLICY IF EXISTS "Allow public read" ON exam_rooms;
DROP POLICY IF EXISTS "Allow insert new room" ON exam_rooms;

-- Tạo lại
CREATE POLICY "Allow public read" ON exam_rooms FOR SELECT USING (true);
CREATE POLICY "Allow insert new room" ON exam_rooms FOR INSERT WITH CHECK (true);
```

### Lỗi: "Connection refused"

**Nguyên nhân:** URL hoặc API key sai

**Giải pháp:**
1. Kiểm tra `supabase-config.js`
2. Đảm bảo URL và key đúng
3. Reload trang

### Lỗi: "isAvailable is not a function"

**Nguyên nhân:** supabase-config.js chưa load

**Giải pháp:**
1. Kiểm tra `index.html` có load script
2. Đảm bảo thứ tự load đúng
3. Reload trang

## ✅ CHECKLIST

### Setup
- [x] Supabase URL đã cấu hình
- [x] API key đã cấu hình
- [ ] SQL bảng `shared_quizzes` đã chạy
- [ ] SQL bảng `exam_rooms` đã chạy
- [ ] RLS policies đã tạo
- [ ] Test connection thành công

### Features
- [ ] Tạo phòng cloud thành công
- [ ] Chia sẻ mã phòng hoạt động
- [ ] Bảng xếp hạng realtime
- [ ] Chia sẻ đề thi thành công
- [ ] Khám phá đề thi hoạt động

### Testing
- [ ] Test tạo phòng
- [ ] Test join phòng
- [ ] Test làm bài
- [ ] Test bảng xếp hạng
- [ ] Test chia sẻ đề thi

## 🎉 KẾT QUẢ

Sau khi hoàn thành, bạn sẽ có:

✅ **Phòng thi cloud** - Chia sẻ toàn cầu  
✅ **Bảng xếp hạng realtime** - Cập nhật tức thì  
✅ **Chia sẻ đề thi** - Lên cộng đồng  
✅ **Khám phá đề thi** - Từ người khác  
✅ **Đồng bộ tự động** - Giữa các thiết bị  

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Chạy script test: `activate-supabase-features.js`
2. Kiểm tra Console có lỗi
3. Xem log chi tiết
4. Tham khảo `SUPABASE_SETUP.md`

---

**Version:** 6.0 FINAL  
**Date:** 15/11/2025  
**Status:** ✅ Ready to Activate
