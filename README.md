# 🎯 Quiz Management System - Hệ Thống Trắc Nghiệm Thông Minh

Một hệ thống trắc nghiệm hiện đại, thân thiện với sinh viên, hỗ trợ tự động nhận diện câu hỏi và đáp án, chấm điểm thông minh.

## ✨ Tính năng chính

### 🔧 Tạo Quiz
- **Nhập linh hoạt**: Hỗ trợ nhiều định dạng nhập câu hỏi và đáp án
- **Tự động nhận diện**: Hệ thống tự động phân tích và ghép nối câu hỏi với đáp án
- **Xác thực dữ liệu**: Kiểm tra tính hợp lệ và đồng bộ giữa câu hỏi và đáp án

### 📚 Quản lý Quiz
- **Lưu trữ bền vững**: Tất cả dữ liệu được lưu trong LocalStorage
- **Chỉnh sửa trực tiếp**: Sửa đổi câu hỏi, đáp án ngay trong giao diện
- **Sao chép & Xóa**: Dễ dàng tái sử dụng và quản lý các bài quiz
- **Thông tin chi tiết**: Hiển thị số câu, ngày tạo, mô tả

### 🎮 Làm bài trắc nghiệm
- **Xáo trộn câu hỏi**: Tùy chọn thay đổi thứ tự câu hỏi
- **Giao diện thân thiện**: Thiết kế hiện đại, dễ sử dung
- **Đồng hồ đếm thời gian**: Theo dõi thời gian làm bài
- **Lưu tiến độ**: Tự động lưu các câu trả lời đã chọn

### 📊 Chấm điểm & Kết quả
- **Thang điểm 10**: Chấm điểm theo hệ thống giáo dục Việt Nam
- **Phân tích chi tiết**: Hiển thị từng câu đúng/sai với giải thích
- **Thống kê tổng quan**: Số câu đúng, tỷ lệ, thời gian hoàn thành
- **Xuất kết quả**: Lưu kết quả dưới định dạng JSON

## 🛠 Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)
- **Storage**: LocalStorage API
- **Server**: http-server (development)

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js (phiên bản 14+ khuyến nghị)
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd quiz-management-system

# Cài đặt dependencies
npm install

# Chạy server development
npm run dev
```

### Truy cập ứng dụng
- **Development**: http://localhost:3000
- **Production**: http://localhost:8080 (khi chạy `npm start`)

## 📖 Hướng dẫn sử dụng

### 1. Tạo Quiz mới
1. Chuyển đến tab **"Tạo Bài Quiz"**
2. Nhập tên và mô tả cho quiz
3. Nhập câu hỏi theo định dạng:
   ```
   Câu 1: Thủ đô của Việt Nam là gì?
   A. Hồ Chí Minh
   B. Hà Nội  
   C. Đà Nẵng
   D. Huế
   ```
4. Nhập đáp án theo thứ tự:
   ```
   1. B
   2. A
   ```
5. Nhấn **"Xử Lý & Tạo Quiz"**

### 2. Quản lý Quiz
- **Chỉnh sửa**: Nhấn nút "Sửa" để thay đổi nội dung quiz
- **Sao chép**: Tạo bản sao để tái sử dụng
- **Xóa**: Xóa vĩnh viễn quiz không cần thiết

### 3. Làm bài trắc nghiệm
1. Chọn quiz từ dropdown
2. Tùy chọn xáo trộn câu hỏi
3. Nhấn **"Bắt Đầu"**
4. Chọn đáp án cho từng câu hỏi
5. Nhấn **"Nộp Bài"** khi hoàn thành

### 4. Xem kết quả
- Điểm số thang 10
- Phân tích chi tiết từng câu
- Thống kê tổng quan
- Xuất kết quả để lưu trữ

## 🎨 Giao diện

### Thiết kế hiện đại
- **Màu sắc**: Gradient xanh dương chuyên nghiệp
- **Typography**: Font Inter cho độ rõ nét cao
- **Animation**: Hiệu ứng mượt mà, responsive
- **Layout**: Card-based design, mobile-friendly

### Tối ưu cho sinh viên
- Giao diện trực quan, dễ hiểu
- Phản hồi trực quan cho mọi thao tác
- Thiết kế responsive trên mọi thiết bị
- Màu sắc và biểu tượng rõ ràng

## 📁 Cấu trúc dự án

```
quiz-management-system/
├── index.html          # Giao diện chính
├── style.css           # Styles và responsive design
├── script.js           # Logic chính của ứng dụng
├── package.json        # Cấu hình project và dependencies
└── README.md          # Tài liệu hướng dẫn
```

## 🔧 Cấu hình

### LocalStorage Structure
```javascript
// Cấu trúc lưu trữ quiz
{
  "quizzes": [
    {
      "id": "timestamp",
      "title": "Tên quiz",
      "description": "Mô tả",
      "questions": [...],
      "createdAt": "ISO date",
      "totalQuestions": "number"
    }
  ],
  "quizResults": [
    {
      "quizTitle": "string",
      "score": "number",
      "completedAt": "ISO date",
      "results": [...]
    }
  ]
}
```

## 🚀 Deployment

### GitHub Pages
1. Push code lên GitHub repository
2. Vào Settings > Pages
3. Chọn source branch (main/master)
4. Truy cập: `https://username.github.io/repository-name`

### Netlify
1. Connect GitHub repository
2. Build command: `npm install`
3. Publish directory: `./`
4. Deploy tự động khi push code

### Vercel
1. Import repository
2. Framework: Other
3. Build Command: `npm install`  
4. Deploy tự động

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/TenTinhNang`
3. Commit changes: `git commit -m 'Thêm tính năng mới'`
4. Push branch: `git push origin feature/TenTinhNang`
5. Tạo Pull Request

## 📋 TODO

- [ ] Thêm timer cho mỗi câu hỏi
- [ ] Hỗ trợ câu hỏi có hình ảnh
- [ ] Export quiz sang PDF
- [ ] Chế độ thi online với multiple users
- [ ] Phân tích thống kê chi tiết
- [ ] Dark mode
- [ ] PWA support

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Tác giả

Được phát triển với ❤️ cho cộng đồng sinh viên Việt Nam.

---

**🌟 Nếu project hữu ích, hãy cho một Star để ủng hộ nhé!**