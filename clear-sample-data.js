// Clear Sample Data - Xóa dữ liệu mẫu
// Chạy script này để xóa tất cả dữ liệu mẫu

(function() {
    console.log('🗑️ Clearing all sample data...');
    
    // Xóa dữ liệu mẫu nếu có
    const recentAccess = JSON.parse(localStorage.getItem('recentAccess') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const myResults = JSON.parse(localStorage.getItem('myResults') || '[]');
    const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    
    // Lọc bỏ dữ liệu mẫu (có id bắt đầu bằng 'sample-' hoặc 'test-' hoặc 'event-')
    const cleanRecentAccess = recentAccess.filter(item => 
        !item.id.startsWith('sample-') && 
        !item.id.startsWith('test-') && 
        !item.id.startsWith('event-')
    );
    
    const cleanFavorites = favorites.filter(id => 
        !id.startsWith('sample-') && 
        !id.startsWith('test-') && 
        !id.startsWith('event-')
    );
    
    const cleanResults = myResults.filter(result => 
        !result.quizId.startsWith('sample-') && 
        !result.quizId.startsWith('test-') && 
        !result.quizId.startsWith('event-')
    );
    
    const cleanQuizzes = quizzes.filter(quiz => 
        !quiz.id.startsWith('sample-') && 
        !quiz.id.startsWith('test-') && 
        !quiz.id.startsWith('event-')
    );
    
    // Lưu lại dữ liệu đã lọc
    localStorage.setItem('recentAccess', JSON.stringify(cleanRecentAccess));
    localStorage.setItem('favorites', JSON.stringify(cleanFavorites));
    localStorage.setItem('myResults', JSON.stringify(cleanResults));
    localStorage.setItem('quizzes', JSON.stringify(cleanQuizzes));
    
    console.log('✅ Sample data cleared!');
    console.log('📊 Remaining data:');
    console.log('- Quizzes:', cleanQuizzes.length);
    console.log('- Recent Access:', cleanRecentAccess.length);
    console.log('- Favorites:', cleanFavorites.length);
    console.log('- Results:', cleanResults.length);
    
    // Cập nhật quizManager nếu có
    if (window.quizManager) {
        window.quizManager.quizzes = cleanQuizzes;
        window.quizManager.saveQuizzes();
    }
    
    // Cập nhật personalMenuManager nếu có
    if (window.personalMenuManager) {
        window.personalMenuManager.recentAccess = cleanRecentAccess;
        window.personalMenuManager.favorites = cleanFavorites;
        window.personalMenuManager.myResults = cleanResults;
        window.personalMenuManager.refreshAllTabs();
    }
    
    console.log('💡 Reload trang để thấy thay đổi!');
})();

console.log('✅ Clear Sample Data script loaded');
