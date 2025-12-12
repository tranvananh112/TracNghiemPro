# 🧪 TEST QUIZ SELECTOR

## 🔍 KIỂM TRA NHANH

Mở Console (F12) và chạy từng bước:

### Bước 1: Kiểm Tra Đề Thi

```javascript
// Kiểm tra có đề thi không
const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
console.log('📚 Số đề thi:', quizzes.length);

if (quizzes.length > 0) {
    console.log('✅ Có đề thi:');
    quizzes.forEach((q, i) => {
        console.log(`   ${i + 1}. ${q.title} (${q.totalQuestions} câu)`);
    });
} else {
    console.log('❌ KHÔNG CÓ ĐỀ THI!');
    console.log('💡 Tạo đề thi trước:');
    console.log('   1. Vào "Tạo Bài Quiz"');
    console.log('   2. Nhập câu hỏi');
    console.log('   3. Click "Xử lý & Tạo quiz"');
}
```

### Bước 2: Kiểm Tra Selector

```javascript
// Kiểm tra dropdown có tồn tại không
const selector = document.getElementById('room-quiz-selector');
console.log('Selector:', selector ? '✅ Found' : '❌ Not found');

if (selector) {
    const options = selector.querySelectorAll('option');
    console.log('Options:', options.length);
    
    Array.from(options).forEach((opt, i) => {
        console.log(`   ${i}. ${opt.textContent} (value: ${opt.value})`);
    });
}
```

### Bước 3: Reload Selector

```javascript
// Reload danh sách đề thi
if (window.roomManager && window.roomManager.loadQuizSelector) {
    window.roomManager.loadQuizSelector();
    console.log('✅ Reloaded!');
} else {
    console.log('❌ loadQuizSelector not found!');
}
```

### Bước 4: Test Hoàn Chỉnh

```javascript
// ===== COMPLETE TEST =====
console.log('🧪 Complete Quiz Selector Test\n');

// 1. Check quizzes
const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
console.log('1️⃣ Quizzes in localStorage:', quizzes.length);

// 2. Check quizManager
console.log('2️⃣ QuizManager:', window.quizManager ? '✅' : '❌');
if (window.quizManager) {
    console.log('   - Quizzes:', window.quizManager.quizzes?.length || 0);
}

// 3. Check selector
const selector = document.getElementById('room-quiz-selector');
console.log('3️⃣ Selector:', selector ? '✅' : '❌');
if (selector) {
    const options = selector.querySelectorAll('option');
    console.log('   - Options:', options.length);
}

// 4. Check roomManager
console.log('4️⃣ RoomManager:', window.roomManager ? '✅' : '❌');
if (window.roomManager) {
    console.log('   - loadQuizSelector:', typeof window.roomManager.loadQuizSelector);
}

// 5. Final verdict
console.log('\n🏁 Result:');
if (quizzes.length === 0) {
    console.log('❌ NO QUIZZES - Create a quiz first!');
} else if (!selector) {
    console.log('❌ SELECTOR NOT FOUND - Check HTML');
} else if (selector.querySelectorAll('option').length <= 1) {
    console.log('⚠️ SELECTOR EMPTY - Run: window.roomManager.loadQuizSelector()');
} else {
    console.log('✅ ALL GOOD - Selector is working!');
}
```

## 🔧 GIẢI PHÁP

### Vấn Đề 1: Không Có Đề Thi

**Triệu chứng:**
```
Số đề thi: 0
```

**Giải pháp:**
1. Vào tab "Tạo Bài Quiz"
2. Tạo ít nhất 1 đề thi
3. Quay lại tab "Tạo Phòng Thi"

### Vấn Đề 2: Selector Rỗng

**Triệu chứng:**
```
Options: 1 (chỉ có placeholder)
```

**Giải pháp:**
```javascript
// Reload selector
window.roomManager.loadQuizSelector();
```

### Vấn Đề 3: RoomManager Chưa Load

**Triệu chứng:**
```
RoomManager: ❌
```

**Giải pháp:**
```javascript
// Khởi tạo RoomManager
if (typeof RoomManager !== 'undefined') {
    window.roomManager = new RoomManager();
    await window.roomManager.initialize();
}
```

### Vấn Đề 4: Selector Không Tồn Tại

**Triệu chứng:**
```
Selector: ❌ Not found
```

**Giải pháp:**
- Kiểm tra đang ở đúng tab "Tạo Phòng Thi"
- Reload trang (Ctrl+F5)

## 🎯 QUICK FIX

### Cách 1: Tự Động

Load script `fix-quiz-selector.js`:

```html
<!-- Thêm vào index.html trước </body> -->
<script src="fix-quiz-selector.js"></script>
```

### Cách 2: Thủ Công

Copy và paste vào Console:

```javascript
// Quick fix
(function() {
    const selector = document.getElementById('room-quiz-selector');
    if (!selector) return;
    
    selector.innerHTML = '<option value="">-- Chọn đề thi --</option>';
    
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    
    if (quizzes.length > 0) {
        quizzes.forEach(quiz => {
            const option = document.createElement('option');
            option.value = quiz.id;
            option.textContent = `${quiz.title} (${quiz.totalQuestions} câu)`;
            selector.appendChild(option);
        });
        console.log('✅ Loaded', quizzes.length, 'quizzes');
    } else {
        console.log('❌ No quizzes found!');
    }
})();
```

### Cách 3: Tạo Quiz Mẫu

Nếu không có đề thi, tạo nhanh:

```javascript
// Tạo quiz mẫu
const sampleQuiz = {
    id: 'quiz_' + Date.now(),
    title: 'Quiz Mẫu',
    description: 'Đề thi mẫu để test',
    questions: [
        {
            question: 'Câu hỏi 1?',
            options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
            correctAnswer: 'A'
        },
        {
            question: 'Câu hỏi 2?',
            options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
            correctAnswer: 'B'
        }
    ],
    totalQuestions: 2,
    createdAt: new Date().toISOString()
};

const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
quizzes.push(sampleQuiz);
localStorage.setItem('quizzes', JSON.stringify(quizzes));

console.log('✅ Sample quiz created!');

// Reload selector
if (window.roomManager) {
    window.roomManager.loadQuizSelector();
}
```

## 📊 EXPECTED RESULTS

### Khi Thành Công

```
Console output:
✅ Quiz selector found
💾 Loaded from localStorage: 3
✅ Adding 3 quizzes to selector
   1. Toán 10
   2. Văn 11
   3. Anh 12
✅ Quiz selector loaded successfully!
```

Dropdown hiển thị:
```
-- Chọn đề thi --
Toán 10 (20 câu)
Văn 11 (15 câu)
Anh 12 (30 câu)
```

### Khi Thất Bại

```
Console output:
⚠️ No quizzes found!
💡 Please create a quiz first:
   1. Go to "Tạo Bài Quiz"
   2. Create a quiz
   3. Come back and reload this selector
```

Dropdown hiển thị:
```
-- Chọn đề thi --
-- Vui lòng tạo quiz trước --
```

## ✅ CHECKLIST

- [ ] Đã tạo ít nhất 1 đề thi
- [ ] Đề thi có trong localStorage
- [ ] Selector tồn tại trong HTML
- [ ] RoomManager đã được khởi tạo
- [ ] loadQuizSelector() đã được gọi
- [ ] Dropdown hiển thị danh sách đề thi

---

**Version:** 5.6  
**Date:** 15/11/2025  
**Status:** Test & Debug Guide
