# 🐛 DEBUG - Không Tạo Được Phòng

## 🔍 KIỂM TRA NHANH

### Bước 1: Mở Console (F12)

Kiểm tra các lỗi JavaScript:
```javascript
// 1. Kiểm tra RoomManager có tồn tại không
console.log('RoomManager:', window.roomManager);

// 2. Kiểm tra nút tạo phòng
const btn = document.getElementById('btn-create-room');
console.log('Create button:', btn);

// 3. Kiểm tra event listener
console.log('Has click listener:', btn ? 'Yes' : 'No');

// 4. Test tạo phòng thủ công
if (window.roomManager) {
    window.roomManager.createRoom();
}
```

### Bước 2: Kiểm Tra Form

```javascript
// Kiểm tra các input
console.log('Room name:', document.getElementById('room-name-input')?.value);
console.log('Room code:', document.getElementById('room-code-input')?.value);
console.log('Quiz selector:', document.getElementById('room-quiz-selector')?.value);
```

### Bước 3: Kiểm Tra Supabase

```javascript
// Kiểm tra Supabase
console.log('Supabase available:', window.supabaseQuizManager?.isAvailable());
console.log('Room manager Supabase:', window.roomManager?.isSupabaseAvailable);
```

### Bước 4: Kiểm Tra localStorage

```javascript
// Kiểm tra offline rooms
console.log('Offline rooms:', JSON.parse(localStorage.getItem('offlineRooms') || '[]'));
console.log('Creator ID:', localStorage.getItem('creatorId'));
```

## 🔧 CÁC VẤN ĐỀ THƯỜNG GẶP

### Vấn Đề 1: Nút Không Hoạt Động

**Triệu chứng:**
- Click nút "Tạo Phòng Thi" không có gì xảy ra
- Không có thông báo lỗi

**Nguyên nhân:**
- RoomManager chưa được khởi tạo
- Event listener chưa được gắn

**Giải pháp:**
```javascript
// Mở Console và chạy:
if (!window.roomManager) {
    console.error('❌ RoomManager not initialized!');
    // Khởi tạo thủ công
    window.roomManager = new RoomManager();
    await window.roomManager.initialize();
}
```

### Vấn Đề 2: Thiếu Thông Tin

**Triệu chứng:**
- Thông báo "Vui lòng nhập tên phòng"
- Hoặc "Vui lòng chọn đề thi"

**Giải pháp:**
1. Nhập đầy đủ thông tin:
   - Tên phòng: Bắt buộc
   - Mã phòng: 6 chữ số
   - Chọn đề thi: Bắt buộc

2. Kiểm tra có đề thi không:
```javascript
// Kiểm tra danh sách quiz
console.log('Quizzes:', window.quizManager?.quizzes);
```

### Vấn Đề 3: Mã Phòng Trùng

**Triệu chứng:**
- Thông báo "Mã phòng đã tồn tại"

**Giải pháp:**
- Click nút "Tạo Mã Ngẫu Nhiên" (🎲)
- Hoặc nhập mã khác

### Vấn Đề 4: Lỗi JavaScript

**Triệu chứng:**
- Console có lỗi đỏ
- Ví dụ: "Cannot read property 'value' of null"

**Giải pháp:**
1. Reload trang (Ctrl+F5)
2. Clear cache
3. Kiểm tra lại

## 🧪 TEST SCRIPT

Copy và paste vào Console:

```javascript
// ===== TEST ROOM CREATION =====
console.log('🧪 Testing Room Creation...\n');

// 1. Check RoomManager
if (!window.roomManager) {
    console.error('❌ RoomManager not found!');
    console.log('💡 Solution: Reload page (Ctrl+F5)');
} else {
    console.log('✅ RoomManager found');
    console.log('   - Supabase:', window.roomManager.isSupabaseAvailable ? 'Available' : 'Not available');
    console.log('   - Creator ID:', window.roomManager.creatorId);
}

// 2. Check Button
const btn = document.getElementById('btn-create-room');
if (!btn) {
    console.error('❌ Create button not found!');
} else {
    console.log('✅ Create button found');
}

// 3. Check Form Inputs
const roomName = document.getElementById('room-name-input');
const roomCode = document.getElementById('room-code-input');
const quizSelector = document.getElementById('room-quiz-selector');

console.log('\n📝 Form Inputs:');
console.log('   - Room name input:', roomName ? 'Found' : 'NOT FOUND');
console.log('   - Room code input:', roomCode ? 'Found' : 'NOT FOUND');
console.log('   - Quiz selector:', quizSelector ? 'Found' : 'NOT FOUND');

// 4. Check Quizzes
if (window.quizManager) {
    const quizCount = window.quizManager.quizzes?.length || 0;
    console.log('\n📚 Quizzes:');
    console.log('   - Total:', quizCount);
    if (quizCount === 0) {
        console.warn('⚠️ No quizzes found! Create a quiz first.');
    }
} else {
    console.error('❌ QuizManager not found!');
}

// 5. Check localStorage
const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
console.log('\n💾 Offline Rooms:', offlineRooms.length);

// 6. Test Create Room (if everything OK)
if (window.roomManager && btn && roomName && roomCode && quizSelector) {
    console.log('\n✅ All checks passed!');
    console.log('💡 You can now create a room:');
    console.log('   1. Fill in the form');
    console.log('   2. Click "Tạo Phòng Thi"');
    console.log('   OR run: window.roomManager.createRoom()');
} else {
    console.error('\n❌ Some checks failed!');
    console.log('💡 Reload page and try again');
}

console.log('\n🏁 Test complete!');
```

## 🎯 GIẢI PHÁP NHANH

### Nếu Không Tạo Được Phòng

**Cách 1: Reload Trang**
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

**Cách 2: Clear Cache**
```
1. Mở DevTools (F12)
2. Right-click nút Reload
3. Chọn "Empty Cache and Hard Reload"
```

**Cách 3: Tạo Thủ Công**
```javascript
// Mở Console và chạy:
window.roomManager.createRoom();
```

**Cách 4: Test Offline Mode**
```javascript
// Tạo phòng offline trực tiếp
const room = {
    id: 'offline_' + Date.now(),
    name: 'Test Room',
    code: '123456',
    description: 'Test',
    quiz: {
        id: 'test',
        title: 'Test Quiz',
        questions: [],
        totalQuestions: 0
    },
    creatorId: localStorage.getItem('creatorId'),
    creatorName: 'Test User',
    createdAt: new Date().toISOString(),
    participants: 0,
    attempts: 0,
    leaderboard: [],
    mode: 'offline'
};

const rooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
rooms.push(room);
localStorage.setItem('offlineRooms', JSON.stringify(rooms));

console.log('✅ Room created manually!');
window.roomManager.loadRooms();
```

## 📞 HỖ TRỢ

Nếu vẫn không được, gửi thông tin sau:

1. **Console Errors** (F12 → Console tab)
2. **Test Script Results** (chạy script trên)
3. **Browser & Version** (Chrome 120, Firefox 121, etc.)
4. **Steps to Reproduce** (các bước đã làm)

---

**Version:** 5.3  
**Date:** 15/11/2025  
**Status:** Debug Guide
