# ⚡ Cập Nhật Theo Thời Gian Thực - Personal Menu

## Tổng Quan

Hệ thống Personal Menu đã được nâng cấp để cập nhật dữ liệu theo thời gian thực, hiển thị ngay lập tức khi người dùng thực hiện các hành động.

## 🔄 Cơ Chế Hoạt Động

### 1. Event-Driven Architecture

Sử dụng Custom Events để giao tiếp giữa các components:

```javascript
// Khi bắt đầu làm bài
window.dispatchEvent(new CustomEvent('quizStarted', {
    detail: { quiz: quizData }
}));

// Khi hoàn thành bài
window.dispatchEvent(new CustomEvent('quizCompleted', {
    detail: { result: resultData }
}));

// Khi toggle favorite
window.dispatchEvent(new CustomEvent('quizFavoriteToggled', {
    detail: { quizId, quizTitle }
}));
```

### 2. Auto Refresh

- **Interval:** 5 giây
- **Điều kiện:** Chỉ refresh khi tab đang active
- **Tối ưu:** Không refresh khi không cần thiết

### 3. Instant Update

Khi có sự kiện xảy ra:
1. ✅ Lưu vào localStorage ngay lập tức
2. ✅ Render lại UI ngay lập tức
3. ✅ Hiển thị notification
4. ✅ Sync với Supabase (nếu có)

## 📊 Các Chức Năng Realtime

### 1. Thư Viện Của Tôi 📖

**Cập nhật khi:**
- Tạo đề thi mới
- Xóa đề thi
- Chỉnh sửa đề thi
- Hoàn thành bài thi (cập nhật thống kê)

**Hiển thị:**
- Tổng đề thi (realtime)
- Tổng câu hỏi (realtime)
- Đã hoàn thành (realtime)
- Điểm trung bình (realtime)

### 2. Truy Cập Gần Đây 🕐

**Cập nhật khi:**
- Bắt đầu làm bài quiz
- Click vào đề thi để xem

**Hiển thị:**
- Đề thi mới nhất ở trên cùng
- Thời gian truy cập (vừa xong, 5 phút trước...)
- Tự động cập nhật thời gian

**Ví dụ:**
```
Người dùng click "Làm bài" 
→ Event 'quizStarted' được dispatch
→ addToRecentAccess() được gọi
→ Lưu vào localStorage
→ Render lại danh sách
→ Hiển thị notification "Đã lưu vào lịch sử"
→ Đề thi xuất hiện ở đầu danh sách NGAY LẬP TỨC
```

### 3. Đề Thi Yêu Thích ❤️

**Cập nhật khi:**
- Click icon trái tim
- Toggle favorite từ bất kỳ đâu

**Hiển thị:**
- Thêm/Xóa ngay lập tức
- Animation heart beat
- Notification xác nhận

**Ví dụ:**
```
Người dùng click icon ❤️
→ Event 'quizFavoriteToggled' được dispatch
→ toggleFavorite() được gọi
→ Lưu vào localStorage
→ Render lại danh sách
→ Hiển thị notification "Đã thêm yêu thích"
→ Icon đổi màu và animation NGAY LẬP TỨC
```

### 4. Kết Quả Thi Của Tôi 📊

**Cập nhật khi:**
- Hoàn thành bài quiz
- Submit kết quả

**Hiển thị:**
- Kết quả mới nhất ở trên cùng
- Điểm số với màu sắc (Xanh/Vàng/Đỏ)
- Thống kê chi tiết
- Notification với điểm số

**Ví dụ:**
```
Người dùng click "Nộp bài"
→ Event 'quizCompleted' được dispatch
→ saveResult() được gọi
→ Tính toán điểm số
→ Lưu vào localStorage
→ Render lại danh sách
→ Hiển thị notification "Điểm: 8.5/10"
→ Kết quả xuất hiện ở đầu danh sách NGAY LẬP TỨC
→ Thống kê trong "Thư viện" được cập nhật
```

## 🎯 Luồng Dữ Liệu

```
User Action
    ↓
QuizManager Hook
    ↓
Dispatch Custom Event
    ↓
PersonalMenuManager Listen
    ↓
Update localStorage
    ↓
Render UI (Instant)
    ↓
Show Notification
    ↓
Sync to Supabase (Optional)
    ↓
Auto Refresh (Every 5s)
```

## 💡 Tối Ưu Hóa

### 1. Debounce & Throttle
- Không render quá nhiều lần trong thời gian ngắn
- Chỉ render khi cần thiết

### 2. Conditional Rendering
- Chỉ render tab đang active
- Không render tab ẩn

### 3. Lazy Loading
- Load dữ liệu khi cần
- Không load tất cả cùng lúc

### 4. Memory Management
- Clear interval khi không dùng
- Remove event listeners khi destroy

## 🔧 API Reference

### Events

#### quizStarted
```javascript
window.dispatchEvent(new CustomEvent('quizStarted', {
    detail: {
        quiz: {
            id: string,
            title: string,
            description: string,
            totalQuestions: number
        }
    }
}));
```

#### quizCompleted
```javascript
window.dispatchEvent(new CustomEvent('quizCompleted', {
    detail: {
        result: {
            quizId: string,
            quizTitle: string,
            score: number,
            correctAnswers: number,
            totalQuestions: number,
            timeSpent: number
        }
    }
}));
```

#### quizFavoriteToggled
```javascript
window.dispatchEvent(new CustomEvent('quizFavoriteToggled', {
    detail: {
        quizId: string,
        quizTitle: string
    }
}));
```

### Methods

#### setActiveTab(tabName)
Set tab đang active để auto refresh

#### refreshCurrentTab()
Refresh tab hiện tại

#### refreshAllTabs()
Refresh tất cả tabs

#### startAutoRefresh()
Bắt đầu auto refresh (5s interval)

#### stopAutoRefresh()
Dừng auto refresh

## 📱 Demo Scenarios

### Scenario 1: Làm Bài Mới
1. User click "Làm bài" trên đề thi "Toán 10"
2. **NGAY LẬP TỨC:**
   - "Toán 10" xuất hiện trong "Truy cập gần đây"
   - Notification: "Đã lưu vào lịch sử"
   - Thời gian: "Vừa xong"

### Scenario 2: Hoàn Thành Bài
1. User làm xong và click "Nộp bài"
2. Điểm: 8.5/10 (17/20 câu đúng)
3. **NGAY LẬP TỨC:**
   - Kết quả xuất hiện trong "Kết quả thi của tôi"
   - Notification: "Điểm: 8.5/10 - Đúng 17/20 câu (85%)"
   - Màu xanh (≥80%)
   - Thống kê "Điểm TB" trong "Thư viện" được cập nhật

### Scenario 3: Thêm Yêu Thích
1. User click icon ❤️ trên đề thi "Lý 11"
2. **NGAY LẬP TỨC:**
   - Icon đổi màu và animation heart beat
   - "Lý 11" xuất hiện trong "Đề thi yêu thích"
   - Notification: "Đã thêm yêu thích"

### Scenario 4: Auto Refresh
1. User đang xem tab "Kết quả thi của tôi"
2. Mỗi 5 giây, danh sách tự động refresh
3. Nếu có kết quả mới (từ tab khác), sẽ hiển thị ngay

## 🎨 Visual Feedback

### Notifications
- **Success (Xanh):** Điểm ≥80%
- **Warning (Vàng):** Điểm 50-79%
- **Error (Đỏ):** Điểm <50%
- **Info (Xanh dương):** Thông tin chung

### Animations
- Slide in/out cho notifications
- Heart beat cho favorite
- Fade in cho items mới
- Smooth transitions

## 🔒 Data Persistence

### localStorage
- Lưu trữ local, không mất khi reload
- Sync giữa các tabs (same origin)
- Không giới hạn (tùy browser)

### Supabase (Optional)
- Sync lên cloud nếu có
- Backup dữ liệu
- Đồng bộ giữa devices (future)

## ✅ Testing Checklist

- [ ] Làm bài mới → Xuất hiện trong "Truy cập gần đây"
- [ ] Hoàn thành bài → Xuất hiện trong "Kết quả"
- [ ] Toggle favorite → Cập nhật danh sách yêu thích
- [ ] Notification hiển thị đúng
- [ ] Thống kê cập nhật realtime
- [ ] Auto refresh hoạt động
- [ ] Không lag/freeze UI
- [ ] Mobile responsive

---

**Tác giả:** Trần Văn Anh  
**Ngày:** 15/11/2025  
**Version:** 2.1 - Realtime Update
