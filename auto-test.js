// Auto Test Script - Kiểm tra tự động tất cả chức năng
// Chạy script này trong Console (F12) để test

(function() {
    'use strict';
    
    console.log('🧪 BẮT ĐẦU AUTO TEST...\n');
    
    const results = {
        passed: 0,
        failed: 0,
        warnings: 0,
        tests: []
    };
    
    function test(name, condition, message = '') {
        const result = {
            name: name,
            passed: condition,
            message: message
        };
        
        results.tests.push(result);
        
        if (condition) {
            results.passed++;
            console.log(`✅ PASS: ${name}`);
        } else {
            results.failed++;
            console.error(`❌ FAIL: ${name}${message ? ' - ' + message : ''}`);
        }
    }
    
    function warn(name, message) {
        results.warnings++;
        console.warn(`⚠️ WARNING: ${name} - ${message}`);
    }
    
    // TEST 1: Kiểm tra Managers
    console.log('\n📦 TEST 1: MANAGERS INITIALIZATION');
    test('QuizManager exists', typeof window.quizManager !== 'undefined', 'window.quizManager not found');
    test('PersonalMenuManager exists', typeof window.personalMenuManager !== 'undefined', 'window.personalMenuManager not found');
    test('ExploreQuizManager exists', typeof window.exploreQuizManager !== 'undefined', 'window.exploreQuizManager not found');
    test('RoomManager exists', typeof window.roomManager !== 'undefined', 'window.roomManager not found');
    
    // TEST 2: Kiểm tra Tab Sections
    console.log('\n📑 TEST 2: TAB SECTIONS');
    const tabs = [
        'home', 'my-library', 'recent-access', 'favorites', 'my-results',
        'input', 'ai-quiz', 'explore', 'room', 'manage', 'quiz', 'results', 'analytics'
    ];
    
    tabs.forEach(tab => {
        const element = document.getElementById(`${tab}-tab`);
        test(`Tab ${tab} exists`, element !== null, `#${tab}-tab not found in DOM`);
    });
    
    // TEST 3: Kiểm tra Navigation Items
    console.log('\n🧭 TEST 3: NAVIGATION ITEMS');
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    test('Navigation items exist', navItems.length > 0, `Found ${navItems.length} nav items`);
    test('Navigation items count', navItems.length >= 13, `Expected >= 13, got ${navItems.length}`);
    
    // TEST 4: Kiểm tra CSS Files
    console.log('\n🎨 TEST 4: CSS FILES');
    const cssFiles = [
        'style.css',
        'style-tab-fix.css',
        'style-modern-quiz.css',
        'style-personal.css'
    ];
    
    const stylesheets = Array.from(document.styleSheets);
    cssFiles.forEach(file => {
        const found = stylesheets.some(sheet => sheet.href && sheet.href.includes(file));
        test(`CSS ${file} loaded`, found, `${file} not found in stylesheets`);
    });
    
    // TEST 5: Kiểm tra Disabled Elements
    console.log('\n🚫 TEST 5: DISABLED ELEMENTS (Should NOT exist)');
    const topNavbar = document.querySelector('.top-navbar');
    const heroSection = document.querySelector('.hero-section');
    
    if (topNavbar && topNavbar.offsetParent !== null) {
        warn('Top Navbar', 'Top navbar is visible (should be hidden)');
    } else {
        test('Top Navbar hidden', true, 'Top navbar correctly hidden');
    }
    
    if (heroSection && heroSection.offsetParent !== null) {
        warn('Hero Section', 'Hero section is visible (should be hidden)');
    } else {
        test('Hero Section hidden', true, 'Hero section correctly hidden');
    }
    
    // TEST 6: Kiểm tra Sidebar
    console.log('\n📱 TEST 6: SIDEBAR');
    const sidebar = document.querySelector('.sidebar');
    test('Sidebar exists', sidebar !== null, 'Sidebar not found');
    test('Sidebar visible', sidebar && sidebar.offsetParent !== null, 'Sidebar not visible');
    
    // TEST 7: Kiểm tra LocalStorage
    console.log('\n💾 TEST 7: LOCALSTORAGE');
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        test('LocalStorage available', true);
    } catch (e) {
        test('LocalStorage available', false, e.message);
    }
    
    // TEST 8: Kiểm tra Functions
    console.log('\n⚙️ TEST 8: FUNCTIONS');
    test('switchToTab function exists', typeof window.switchToTab === 'function', 'switchToTab not found');
    
    if (window.quizManager) {
        test('quizManager.switchTab exists', typeof window.quizManager.switchTab === 'function');
        test('quizManager.processQuiz exists', typeof window.quizManager.processQuiz === 'function');
        test('quizManager.startQuiz exists', typeof window.quizManager.startQuiz === 'function');
    }
    
    // TEST 9: Test Tab Switching
    console.log('\n🔄 TEST 9: TAB SWITCHING');
    if (typeof window.switchToTab === 'function') {
        try {
            // Test switch to input tab
            window.switchToTab('input');
            const inputTab = document.getElementById('input-tab');
            test('Switch to input tab', inputTab && inputTab.classList.contains('active'), 'input-tab not active after switch');
            
            // Switch back to home
            window.switchToTab('home');
            const homeTab = document.getElementById('home-tab');
            test('Switch to home tab', homeTab && homeTab.classList.contains('active'), 'home-tab not active after switch');
        } catch (e) {
            test('Tab switching', false, e.message);
        }
    }
    
    // TEST 10: Kiểm tra Console Errors
    console.log('\n🐛 TEST 10: CONSOLE ERRORS');
    // Note: This test can't catch errors that happened before this script runs
    const originalError = console.error;
    let errorCount = 0;
    console.error = function(...args) {
        errorCount++;
        originalError.apply(console, args);
    };
    
    setTimeout(() => {
        console.error = originalError;
        test('No console errors', errorCount === 0, `${errorCount} errors detected`);
    }, 1000);
    
    // SUMMARY
    setTimeout(() => {
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${results.passed}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`⚠️ Warnings: ${results.warnings}`);
        console.log(`📝 Total Tests: ${results.tests.length}`);
        
        const percentage = ((results.passed / results.tests.length) * 100).toFixed(1);
        console.log(`\n📈 Success Rate: ${percentage}%`);
        
        if (results.failed === 0 && results.warnings === 0) {
            console.log('\n🎉 ALL TESTS PASSED! System is ready!');
        } else if (results.failed === 0) {
            console.log('\n✅ All tests passed with some warnings.');
        } else {
            console.log('\n⚠️ Some tests failed. Please check the errors above.');
        }
        
        console.log('\n📋 Detailed Results:');
        console.table(results.tests);
        
        // Return results for programmatic access
        window.testResults = results;
        
    }, 1500);
    
})();

console.log('\n💡 TIP: Kết quả chi tiết được lưu trong window.testResults');
console.log('💡 TIP: Chạy lại test bằng cách reload script này\n');
