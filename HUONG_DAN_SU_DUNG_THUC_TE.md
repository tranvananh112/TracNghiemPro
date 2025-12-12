# 📖 Hướng Dẫn Sử Dụng Thực Tế - Personal Menu

## 🎯 Cách Hoạt Động

4 chức năng cá nhân sẽ **TỰ ĐỘNG** lưu và hiển thị dữ liệu dựa trên hành động THỰC của bạn:

## 1. 📖 Thư Viện Của Tôi

### Cách Có Dữ Liệu:
**Tạo đề thi mới:**

1. Click **"Tạo Bài Quiz"** trong menu
2. Nhập thông tin:
   - Tên bài quiz: `Toán 10 - Chương 1`
   - Mô tả: `Ôn tập hàm số`
   - Câu hỏi và đáp án
3. Click **"Xử lý & Tạo quiz"**
4. ✅ Quiz xuất hiện trong **"Thư viện của tôi"** NGAY LẬP TỨC

### Thống Kê Tự Động:
- **Tổng đề thi**: Số quiz bạn đã tạo
- **Tổng câu hỏi**: Tổng số câu trong tất cả quiz
- **Đã hoàn thành**: Số quiz bạn đã làm xong
- **Điểm TB**: Điểm trung bình của tất cả kết quả

---

## 2. 🕐 Truy Cập Gần Đây

### Cách Có Dữ Liệu:
**Làm bài quiz:**

1. Click **"Làm Bài"** trong menu
2. Chọn quiz từ dropdown
3. Click **"Bắt đầu"**
4. ✅ Quiz xuất hiện trong **"Truy cập gần đây"** NGAY LẬP TỨC

### Thông Tin Hiển Thị:
- Tên quiz
- Số câu hỏi
- Thời gian truy cập (vừa xong, 5 phút trước, 1 giờ trước...)

### Giới Hạn:
- Lưu **20 quiz gần nhất**
- Quiz mới nhất ở trên cùng
- Tự động xóa quiz cũ khi vượt quá 20

---

## 3. ❤️ Đề Thi Yêu Thích

### Cách Có Dữ Liệu:
**Thêm yêu thích:**

1. Vào **"Thư viện của tôi"**
2. Click icon **❤️** ở góc trên phải của quiz
3. ✅ Quiz xuất hiện trong **"Đề thi yêu thích"** NGAY LẬP TỨC

### Bỏ Yêu Thích:
1. Click lại icon **❤️** (đã đổi màu)
2. ✅ Quiz biến mất khỏi danh sách yêu thích

### Giới Hạn:
- **Không giới hạn** số lượng
- Có thể thêm/bỏ bất cứ lúc nào

---

## 4. 📊 Kết Quả Thi Của Tôi

### Cách Có Dữ Liệu:
**Hoàn thành bài quiz:**

1. Làm bài quiz (chọn đáp án cho tất cả câu)
2. Click **"Nộp bài"**
3. Xem kết quả
4. ✅ Kết quả xuất hiện trong **"Kết quả thi của tôi"** NGAY LẬP TỨC

### Thông Tin Hiển Thị:
- Tên quiz
- Điểm số (0-10)
- Số câu đúng/Tổng số câu
- Tỷ lệ đúng (%)
- Thời gian làm bài
- Ngày giờ hoàn thành

### Màu Sắc:
- **Xanh lá**: Điểm ≥ 80% (Giỏi)
- **Vàng**: Điểm 50-79% (Khá)
- **Đỏ**: Điểm < 50% (Cần cố gắng)

### Giới Hạn:
- Lưu **50 kết quả gần nhất**
- Kết quả mới nhất ở trên cùng

---

## 🔄 Luồng Sử Dụng Hoàn Chỉnh

### Scenario 1: Người Dùng Mới

```
Bước 1: Tạo Quiz
→ Trang Chủ → Tạo Bài Quiz → Nhập dữ liệu → Xử lý & Tạo quiz
→ ✅ Xuất hiện trong "Thư viện của tôi"

Bước 2: Làm Bài
→ Làm Bài → Chọn quiz → Bắt đầu
→ ✅ Xuất hiện trong "Truy cập gần đây"

Bước 3: Hoàn Thành
→ Chọn đáp án → Nộp bài
→ ✅ Xuất hiện trong "Kết quả thi của tôi"
→ ✅ Thống kê trong "Thư viện" cập nhật

Bước 4: Yêu Thích
→ Thư viện → Click ❤️
→ ✅ Xuất hiện trong "Đề thi yêu thích"
```

### Scenario 2: Người Dùng Quay Lại

```
Vào "Truy cập gần đây"
→ Thấy các quiz đã làm gần đây
→ Click vào quiz → Làm lại

Vào "Kết quả thi của tôi"
→ Xem lại điểm số các lần làm
→ So sánh tiến bộ

Vào "Đề thi yêu thích"
→ Làm lại các quiz quan trọng
→ Ôn tập hiệu quả
```

---

## ⚡ Cập Nhật Theo Thời Gian Thực

### Tự Động:
- ✅ Khi tạo quiz → Cập nhật "Thư viện"
- ✅ Khi làm bài → Cập nhật "Truy cập gần đây"
- ✅ Khi hoàn thành → Cập nhật "Kết quả"
- ✅ Khi toggle ❤️ → Cập nhật "Yêu thích"

### Notification:
- Hiển thị thông báo khi có hành động
- Tự động đóng sau vài giây
- Màu sắc theo loại hành động

### Auto Refresh:
- Refresh mỗi 5 giây nếu tab đang active
- Không refresh khi tab không active (tiết kiệm tài nguyên)

---

## 💾 Lưu Trữ Dữ Liệu

### localStorage:
- Tất cả dữ liệu lưu trên máy bạn
- Không mất khi reload trang
- Không mất khi tắt browser
- Chỉ mất khi clear cache

### Không Cần Server:
- Hoạt động hoàn toàn offline
- Không cần internet
- Không cần đăng nhập
- Dữ liệu riêng tư, an toàn

---

## ❓ FAQ

**Q: Tại sao không thấy dữ liệu?**
A: Vì bạn chưa tạo quiz hoặc làm bài nào. Hãy tạo quiz đầu tiên!

**Q: Dữ liệu có bị mất không?**
A: Không, trừ khi bạn clear cache browser.

**Q: Có thể xóa dữ liệu không?**
A: Có, vào Settings browser → Clear browsing data → Cached images and files.

**Q: Dữ liệu có đồng bộ giữa các thiết bị không?**
A: Không, dữ liệu chỉ lưu trên thiết bị hiện tại.

**Q: Có giới hạn dung lượng không?**
A: Có, tùy browser (thường 5-10MB). Đủ cho hàng nghìn quiz.

---

## 🎯 Tips & Tricks

### 1. Quản Lý Hiệu Quả
- Đánh dấu ❤️ các quiz quan trọng
- Xem "Truy cập gần đây" để tiếp tục học
- Kiểm tra "Kết quả" để biết điểm yếu

### 2. Theo Dõi Tiến Độ
- Xem thống kê trong "Thư viện"
- So sánh điểm qua các lần làm
- Đặt mục tiêu cải thiện

### 3. Ôn Tập Thông Minh
- Làm lại quiz có điểm thấp
- Tập trung vào quiz yêu thích
- Xem lại kết quả để học từ sai lầm

---

## ✅ Checklist Bắt Đầu

- [ ] Tạo quiz đầu tiên
- [ ] Làm bài quiz đó
- [ ] Hoàn thành và xem kết quả
- [ ] Thêm vào yêu thích
- [ ] Kiểm tra 4 tab cá nhân
- [ ] Tạo thêm quiz khác
- [ ] Làm lại và so sánh điểm

---

**Lưu ý:** Tất cả dữ liệu đều THỰC TẾ từ hành động của bạn. Không có dữ liệu mẫu hay giả lập!

**Tác giả:** Trần Văn Anh  
**Ngày:** 15/11/2025  
**Version:** 2.3 - Real Data Only
