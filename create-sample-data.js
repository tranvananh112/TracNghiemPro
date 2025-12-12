// Tạo dữ liệu mẫu cho Personal Menu
// Chạy trong Console: createSampleData()

function createSampleData() {
    console.log('🎨 Creating sample data...');
    
    // 1. Tạo quiz mẫu
    const sampleQuizzes = [
        {
            id: 'sample-quiz-1',
            title: 'Toán 10 - Hàm số',
            description: 'Ôn tập chương 1 về hàm số',
            totalQuestions: 20,
            questions: Array(20).fill(null).map((_, i) => ({
                question: `Câu ${i + 1}: Câu hỏi mẫu về hàm số`,
                options: ['A. Đáp án A', 'B. Đáp án B', 'C. Đáp án C', 'D. Đáp án D'],
                correctAnswer: 'A'
            })),
            createdAt: new Date().toISOString()
        },
        {
            id: 'sample-quiz-2',
            title: 'Lý 11 - Điện học',
            description: 'Kiểm tra kiến thức điện học',
            totalQuestions: 15,
            questions: Array(15).fill(null).map((_, i) => ({
                question: `Câu ${i + 1}: Câu hỏi mẫu về điện học`,
                options: ['A. Đáp án A', 'B. Đáp án B', 'C. Đáp án C', 'D. Đáp án D'],
                correctAnswer: 'B'
            })),
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 ngày trước
        },
        {
            id: 'sample-quiz-3',
            title: 'Hóa 12 - Hữu cơ',
            description: 'Ôn tập hóa hữu cơ',
            totalQuestions: 25,
            questions: Array(25).fill(null).map((_, i) => ({
                question: `Câu ${i + 1}: Câu hỏi mẫu về hóa hữu cơ`,
                options: ['A. Đáp án A', 'B. Đáp án B', 'C. Đáp án C', 'D. Đáp án D'],
                correctAnswer: 'C'
            })),
            createdAt: new Date(Date.now() - 172800000).toISOString() // 2 ngày trước
        }
    ];
    
    // Lưu vào localStorage
    localStorage.setItem('quizzes', JSON.stringify(sampleQuizzes));
    console.log('✅ Created', sampleQuizzes.length, 'sample quizzes');
    
    // 2. Tạo recent access
    const recentAccess = [
        {
            id: 'sample-quiz-1',
            title: 'Toán 10 - Hàm số',
            description: 'Ôn tập chương 1 về hàm số',
            totalQuestions: 20,
            accessedAt: new Date().toISOString(),
            type: 'quiz'
        },
        {
            id: 'sample-quiz-2',
            title: 'Lý 11 - Điện học',
            description: 'Kiểm tra kiến thức điện học',
            totalQuestions: 15,
            accessedAt: new Date(Date.now() - 3600000).toISOString(), // 1 giờ trước
            type: 'quiz'
        }
    ];
    
    localStorage.setItem('recentAccess', JSON.stringify(recentAccess));
    console.log('✅ Created', recentAccess.length, 'recent access items');
    
    // 3. Tạo favorites
    const favorites = ['sample-quiz-1', 'sample-quiz-3'];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('✅ Created', favorites.length, 'favorites');
    
    // 4. Tạo results
    const myResults = [
        {
            id: Date.now().toString(),
            quizId: 'sample-quiz-1',
            quizTitle: 'Toán 10 - Hàm số',
            score: 8.5,
            correctAnswers: 17,
            totalQuestions: 20,
            timeSpent: 600,
            completedAt: new Date().toISOString()
        },
        {
            id: (Date.now() - 1000).toString(),
            quizId: 'sample-quiz-2',
            quizTitle: 'Lý 11 - Điện học',
            score: 7.0,
            correctAnswers: 10,
            totalQuestions: 15,
            timeSpent: 450,
            completedAt: new Date(Date.now() - 7200000).toISOString() // 2 giờ trước
        },
        {
            id: (Date.now() - 2000).toString(),
            quizId: 'sample-quiz-3',
            quizTitle: 'Hóa 12 - Hữu cơ',
            score: 9.2,
            correctAnswers: 23,
            totalQuestions: 25,
            timeSpent: 900,
            completedAt: new Date(Date.now() - 86400000).toISOString() // 1 ngày trước
        }
    ];
    
    localStorage.setItem('myResults', JSON.stringify(myResults));
    console.log('✅ Created', myResults.length, 'results');
    
    // 5. Cập nhật quizManager nếu có
    if (window.quizManager) {
        window.quizManager.quizzes = sampleQuizzes;
        window.quizManager.saveQuizzes();
        console.log('✅ Updated quizManager');
    }
    
    // 6. Cập nhật personalMenuManager nếu có
    if (window.personalMenuManager) {
        window.personalMenuManager.recentAccess = recentAccess;
        window.personalMenuManager.favorites = favorites;
        window.personalMenuManager.myResults = myResults;
        console.log('✅ Updated personalMenuManager');
    }
    
    console.log('\n🎉 Sample data created successfully!');
    console.log('\n📊 Summary:');
    console.log('- Quizzes:', sampleQuizzes.length);
    console.log('- Recent Access:', recentAccess.length);
    console.log('- Favorites:', favorites.length);
    console.log('- Results:', myResults.length);
    console.log('\n💡 Reload trang hoặc chuyển sang các tab Cá Nhân để xem!');
    
    return {
        quizzes: sampleQuizzes,
        recentAccess,
        favorites,
        myResults
    };
}

// Xóa dữ liệu mẫu
function clearSampleData() {
    console.log('🗑️ Clearing sample data...');
    
    localStorage.removeItem('quizzes');
    localStorage.removeItem('recentAccess');
    localStorage.removeItem('favorites');
    localStorage.removeItem('myResults');
    
    if (window.quizManager) {
        window.quizManager.quizzes = [];
        window.quizManager.saveQuizzes();
    }
    
    if (window.personalMenuManager) {
        window.personalMenuManager.recentAccess = [];
        window.personalMenuManager.favorites = [];
        window.personalMenuManager.myResults = [];
    }
    
    console.log('✅ Sample data cleared!');
    console.log('💡 Reload trang để thấy thay đổi');
}

// Export
window.createSampleData = createSampleData;
window.clearSampleData = clearSampleData;

console.log('📚 Sample Data Creator loaded!');
console.log('💡 Chạy: createSampleData() để tạo dữ liệu mẫu');
console.log('💡 Chạy: clearSampleData() để xóa dữ liệu mẫu');
