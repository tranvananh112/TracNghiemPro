// Test Personal Menu Functions
// Chạy script này trong Console để test các chức năng

console.log('🧪 Testing Personal Menu Functions...');

// 1. Test Recent Access
function testRecentAccess() {
    console.log('\n📝 Test 1: Recent Access');
    
    const sampleQuiz = {
        id: 'test-quiz-1',
        title: 'Đề thi Toán 10 - Chương 1',
        description: 'Ôn tập chương 1 - Hàm số',
        totalQuestions: 20
    };
    
    if (window.personalMenuManager) {
        window.personalMenuManager.addToRecentAccess(sampleQuiz);
        console.log('✅ Added to recent access:', sampleQuiz.title);
        
        // Kiểm tra localStorage
        const recentAccess = JSON.parse(localStorage.getItem('recentAccess') || '[]');
        console.log('📊 Recent Access Count:', recentAccess.length);
        console.log('📋 Recent Access Data:', recentAccess);
    } else {
        console.error('❌ personalMenuManager not found!');
    }
}

// 2. Test Favorites
function testFavorites() {
    console.log('\n❤️ Test 2: Favorites');
    
    const quizId = 'test-quiz-1';
    
    if (window.personalMenuManager) {
        const isFavorite = window.personalMenuManager.toggleFavorite(quizId);
        console.log('✅ Toggle favorite:', isFavorite ? 'Added' : 'Removed');
        
        // Kiểm tra localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        console.log('📊 Favorites Count:', favorites.length);
        console.log('📋 Favorites Data:', favorites);
    } else {
        console.error('❌ personalMenuManager not found!');
    }
}

// 3. Test Results
function testResults() {
    console.log('\n📊 Test 3: My Results');
    
    const sampleResult = {
        quizId: 'test-quiz-1',
        quizTitle: 'Đề thi Toán 10 - Chương 1',
        score: 8.5,
        correctAnswers: 17,
        totalQuestions: 20,
        timeSpent: 600 // 10 phút
    };
    
    if (window.personalMenuManager) {
        window.personalMenuManager.saveResult(sampleResult);
        console.log('✅ Saved result:', sampleResult.quizTitle);
        
        // Kiểm tra localStorage
        const myResults = JSON.parse(localStorage.getItem('myResults') || '[]');
        console.log('📊 Results Count:', myResults.length);
        console.log('📋 Results Data:', myResults);
    } else {
        console.error('❌ personalMenuManager not found!');
    }
}

// 4. Test Library
function testLibrary() {
    console.log('\n📖 Test 4: My Library');
    
    if (window.personalMenuManager) {
        window.personalMenuManager.renderMyLibrary();
        console.log('✅ Rendered My Library');
    } else {
        console.error('❌ personalMenuManager not found!');
    }
}

// 5. Test Events
function testEvents() {
    console.log('\n⚡ Test 5: Events');
    
    // Test quizStarted event
    const quizData = {
        id: 'event-test-1',
        title: 'Event Test Quiz',
        description: 'Testing events',
        totalQuestions: 10
    };
    
    window.dispatchEvent(new CustomEvent('quizStarted', {
        detail: { quiz: quizData }
    }));
    console.log('✅ Dispatched quizStarted event');
    
    // Test quizCompleted event
    setTimeout(() => {
        const resultData = {
            quizId: 'event-test-1',
            quizTitle: 'Event Test Quiz',
            score: 9.0,
            correctAnswers: 9,
            totalQuestions: 10,
            timeSpent: 300
        };
        
        window.dispatchEvent(new CustomEvent('quizCompleted', {
            detail: { result: resultData }
        }));
        console.log('✅ Dispatched quizCompleted event');
    }, 1000);
}

// 6. Run All Tests
function runAllTests() {
    console.log('🚀 Running All Tests...\n');
    
    testRecentAccess();
    setTimeout(() => testFavorites(), 500);
    setTimeout(() => testResults(), 1000);
    setTimeout(() => testLibrary(), 1500);
    setTimeout(() => testEvents(), 2000);
    
    setTimeout(() => {
        console.log('\n✅ All tests completed!');
        console.log('\n📋 Summary:');
        console.log('- Recent Access:', JSON.parse(localStorage.getItem('recentAccess') || '[]').length, 'items');
        console.log('- Favorites:', JSON.parse(localStorage.getItem('favorites') || '[]').length, 'items');
        console.log('- Results:', JSON.parse(localStorage.getItem('myResults') || '[]').length, 'items');
        console.log('\n💡 Tip: Chuyển sang các tab Cá Nhân để xem kết quả!');
    }, 3000);
}

// 7. Clear All Data
function clearAllData() {
    console.log('🗑️ Clearing all personal data...');
    localStorage.removeItem('recentAccess');
    localStorage.removeItem('favorites');
    localStorage.removeItem('myResults');
    console.log('✅ All data cleared!');
}

// Export functions
window.testPersonalMenu = {
    runAll: runAllTests,
    recentAccess: testRecentAccess,
    favorites: testFavorites,
    results: testResults,
    library: testLibrary,
    events: testEvents,
    clear: clearAllData
};

console.log('\n📚 Available Commands:');
console.log('- testPersonalMenu.runAll()      // Chạy tất cả tests');
console.log('- testPersonalMenu.recentAccess() // Test truy cập gần đây');
console.log('- testPersonalMenu.favorites()    // Test yêu thích');
console.log('- testPersonalMenu.results()      // Test kết quả');
console.log('- testPersonalMenu.library()      // Test thư viện');
console.log('- testPersonalMenu.events()       // Test events');
console.log('- testPersonalMenu.clear()        // Xóa tất cả dữ liệu');
console.log('\n💡 Chạy: testPersonalMenu.runAll() để bắt đầu!');
