// Auto Initialize Personal Data
// Tự động tạo dữ liệu mẫu nếu chưa có

(function() {
    console.log('🔍 Checking personal data...');
    
    // Kiểm tra xem đã có dữ liệu chưa
    const hasQuizzes = localStorage.getItem('quizzes');
    const hasRecentAccess = localStorage.getItem('recentAccess');
    const hasResults = localStorage.getItem('myResults');
    
    const hasAnyData = hasQuizzes || hasRecentAccess || hasResults;
    
    if (!hasAnyData) {
        console.log('📝 No data found. Creating sample data...');
        
        // Đợi 2 giây để đảm bảo tất cả scripts đã load
        setTimeout(() => {
            if (typeof createSampleData === 'function') {
                createSampleData();
                console.log('✅ Sample data created automatically!');
                
                // Hiển thị notification
                if (window.notify) {
                    window.notify.info(
                        'Dữ liệu mẫu đã được tạo',
                        'Chuyển sang các tab Cá Nhân để xem!',
                        5000
                    );
                }
                
                // Refresh personal menu nếu có
                if (window.personalMenuManager) {
                    setTimeout(() => {
                        window.personalMenuManager.refreshAllTabs();
                    }, 500);
                }
            } else {
                console.warn('⚠️ createSampleData function not found');
            }
        }, 2000);
    } else {
        console.log('✅ Personal data already exists');
        
        // Load dữ liệu vào personalMenuManager
        if (window.personalMenuManager) {
            setTimeout(() => {
                window.personalMenuManager.recentAccess = JSON.parse(localStorage.getItem('recentAccess') || '[]');
                window.personalMenuManager.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                window.personalMenuManager.myResults = JSON.parse(localStorage.getItem('myResults') || '[]');
                
                console.log('📊 Loaded data:', {
                    recentAccess: window.personalMenuManager.recentAccess.length,
                    favorites: window.personalMenuManager.favorites.length,
                    results: window.personalMenuManager.myResults.length
                });
            }, 1000);
        }
    }
})();

console.log('✅ Auto Init Personal Data loaded');
