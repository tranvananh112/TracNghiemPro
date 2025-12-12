# 🏫 HƯỚNG DẪN SỬ DỤNG TÍNH NĂNG PHÒNG THI

## 📋 TỔNG QUAN

Tính năng **Phòng Thi** cho phép bạn:
- ✅ Tạo phòng thi riêng cho lớp học
- ✅ Chia sẻ mã phòng với học sinh
- ✅ Không cần chia sẻ lên cộng đồng
- ✅ Xem bảng xếp hạng của phòng
- ✅ Theo dõi ai đã làm bài

---

## 🎯 DÀNH CHO GIÁO VIÊN / NGƯỜI TẠO PHÒNG

### Bước 1: Tạo Đề Thi Trước
1. Vào tab **"Tạo Bài Quiz"** hoặc **"AI Tạo Quiz"**
2. Tạo đề thi với đầy đủ câu hỏi
3. Lưu đề thi vào **"Quản Lý Quiz"**

### Bước 2: Tạo Phòng Thi
1. Vào tab **"Phòng Thi"**
2. Kéo xuống phần **"Tạo Phòng Thi Mới"**
3. Điền thông tin:
   - **Tên phòng**: Ví dụ "Kiểm tra Toán 10 - Chương 1"
   - **Mã phòng**: 
     - Tự đặt 6 số (ví dụ: 123456)
     - Hoặc click "Tạo mã" để hệ thống random
   - **Chọn đề thi**: Chọn từ dropdown (đề đã tạo trước)
   - **Mô tả**: Mô tả ngắn gọn về bài thi

4. Click **"Tạo Phòng Thi"**

### Bước 3: Chia Sẻ Mã Phòng
1. Sau khi tạo, phòng sẽ hiện trong **"Phòng Thi Của Tôi"**
2. Click vào phòng để xem chi tiết
3. Copy mã phòng (6 số)
4. Chia sẻ mã này cho học sinh qua:
   - Zalo
   - Facebook
   - Email
   - Viết lên bảng

### Bước 4: Theo Dõi Kết Quả
1. Click vào phòng trong **"Phòng Thi Của Tôi"**
2. Xem:
   - **Số người tham gia**
   - **Số lượt làm bài**
   - **Bảng xếp hạng** (ai đạt điểm cao nhất)
   - **Thời gian làm bài** của từng người

---

## 👨‍🎓 DÀNH CHO HỌC SINH / NGƯỜI THAM GIA

### Bước 1: Nhận Mã Phòng
- Nhận mã phòng 6 số từ giáo viên/người tạo phòng

### Bước 2: Vào Phòng Thi
1. Mở ứng dụng
2. Vào tab **"Phòng Thi"**
3. Ở phần **"Tham Gia Phòng Thi"** (màu tím ở trên cùng)
4. Nhập mã phòng 6 số
5. Click **"Vào Phòng"**

### Bước 3: Nhập Tên
- Lần đầu vào phòng, hệ thống yêu cầu nhập tên
- Tên này sẽ hiển thị trong bảng xếp hạng
- **Lưu ý**: Sau khi đặt tên, lần sau vào lại phòng sẽ tự động nhận diện

### Bước 4: Làm Bài
1. Đọc thông tin đề thi
2. Click **"Vào Làm Bài"**
3. Trả lời tất cả câu hỏi
4. Click **"Nộp Bài"**

### Bước 5: Xem Kết Quả
- Xem điểm số của mình
- Xem vị trí trong bảng xếp hạng
- So sánh với bạn bè

---

## 🏆 BẢNG XẾP HẠNG

### Cách Tính Điểm
- **Điểm số**: Số câu đúng / Tổng số câu × 10
- **Thời gian**: Thời gian hoàn thành bài thi

### Xếp Hạng
1. **Ưu tiên 1**: Điểm cao hơn → Xếp trên
2. **Ưu tiên 2**: Nếu điểm bằng nhau → Thời gian nhanh hơn → Xếp trên

### Hiển Thị
- 🥇 **Top 1**: Huy chương vàng
- 🥈 **Top 2**: Huy chương bạc
- 🥉 **Top 3**: Huy chương đồng
- 📊 **Còn lại**: Số thứ tự

---

## 🔒 BẢO MẬT

### Người Tạo Phòng
- ✅ Chỉ thấy phòng của CHÍNH MÌNH
- ✅ Không thấy phòng của người khác
- ✅ Có thể xóa phòng của mình

### Người Tham Gia
- ✅ Chỉ vào được phòng khi có mã
- ✅ Không thấy danh sách tất cả phòng
- ✅ Tên được lưu riêng cho từng phòng

### Dữ Liệu
- ✅ Lưu trên Supabase (cloud)
- ✅ Đồng bộ giữa các thiết bị
- ✅ Không mất dữ liệu

---

## ❓ CÂU HỎI THƯỜNG GẶP

### 1. Tôi quên mã phòng của mình?
**Trả lời**: Vào tab "Phòng Thi" → "Phòng Thi Của Tôi" → Click vào phòng → Xem mã

### 2. Học sinh có thể làm bài nhiều lần không?
**Trả lời**: Có, mỗi lần làm sẽ cập nhật điểm mới vào bảng xếp hạng

### 3. Tôi có thể sửa đề thi sau khi tạo phòng không?
**Trả lời**: Không, đề thi đã được lưu cố định trong phòng. Nếu muốn sửa, hãy tạo phòng mới

### 4. Mã phòng có hết hạn không?
**Trả lời**: Không, mã phòng vĩnh viễn cho đến khi bạn xóa phòng

### 5. Tôi có thể xóa phòng không?
**Trả lời**: Có, vào "Phòng Thi Của Tôi" → Click nút "Xóa" trên phòng

### 6. Bảng xếp hạng có cập nhật realtime không?
**Trả lời**: Có, khi có người làm bài xong, bảng xếp hạng tự động cập nhật

### 7. Tôi có thể tạo bao nhiêu phòng?
**Trả lời**: Không giới hạn

### 8. Phòng thi có giới hạn số người tham gia không?
**Trả lời**: Không giới hạn

---

## 💡 MẸO HAY

### Cho Giáo Viên
1. **Đặt mã dễ nhớ**: Ví dụ 123456, 111111
2. **Đặt tên rõ ràng**: "Toán 10 - Chương 1 - Ngày 15/1"
3. **Tạo nhiều phòng**: Mỗi bài kiểm tra một phòng riêng
4. **Theo dõi thường xuyên**: Xem ai chưa làm bài

### Cho Học Sinh
1. **Lưu mã phòng**: Chụp màn hình hoặc ghi lại
2. **Đặt tên đúng**: Để giáo viên nhận diện
3. **Làm bài cẩn thận**: Điểm sẽ hiển thị công khai
4. **Kiểm tra kết nối**: Đảm bảo có internet khi làm bài

---

## 🚀 TÍNH NĂNG NỔI BẬT

### 1. Không Cần Chia Sẻ Lên Cộng Đồng
- Phòng thi hoàn toàn riêng tư
- Chỉ người có mã mới vào được

### 2. Bảng Xếp Hạng Tự Động
- Tự động sắp xếp theo điểm và thời gian
- Hiển thị đẹp mắt với huy chương

### 3. Lưu Tên Người Dùng
- Lần đầu nhập tên
- Lần sau tự động nhận diện

### 4. Đồng Bộ Đa Thiết Bị
- Làm bài trên điện thoại
- Xem kết quả trên máy tính
- Dữ liệu luôn đồng bộ

### 5. Theo Dõi Chi Tiết
- Số người tham gia
- Số lượt làm bài
- Thời gian làm bài
- Điểm số từng người

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra kết nối internet
2. Reload trang (F5)
3. Xóa cache trình duyệt
4. Thử lại

---

## 🎉 CHÚC BẠN SỬ DỤNG VUI VẺ!

**Version**: 1.0  
**Last Updated**: 2025  
**Author**: Trần Văn Anh

