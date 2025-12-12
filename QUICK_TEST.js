// ⚡ QUICK TEST - Paste vào Console
// Copy toàn bộ và paste vào Console (F12)

console.clear();
console.log('⚡ QUICK ROOM TEST\n');

// 1. Supabase
console.log('1. Supabase:', window.supabaseQuizManager?.isAvailable() ? '✅ OK' : '❌ NOT AVAILABLE');

// 2. RoomManager
console.log('2. RoomManager:', window.roomManager ? '✅ OK' : '❌ NOT FOUND');
if (window.roomManager) {
    console.log('   - Supabase:', window.roomManager.isSupabaseAvailable ? '✅' : '❌');
}

// 3. Quizzes
const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
console.log('3. Quizzes:', quizzes.length, quizzes.length > 0 ? '✅' : '❌ NONE');

// 4. Form
const selector = document.getElementById('room-quiz-selector');
const btn = document.getElementById('btn-create-room');
console.log('4. Form:');
console.log('   - Selector:', selector ? '✅' : '❌');
console.log('   - Button:', btn ? '✅' : '❌');
if (selector) {
    console.log('   - Options:', selector.options.length);
}

// 5. Test
console.log('\n🎯 RESULT:');
if (!window.roomManager) {
    console.log('❌ RoomManager not found - Reload page!');
} else if (quizzes.length === 0) {
    console.log('❌ No quizzes - Create a quiz first!');
} else if (!selector || selector.options.length <= 1) {
    console.log('⚠️ Quiz selector empty - Running fix...');
    window.roomManager.loadQuizSelector();
    console.log('✅ Fixed! Check selector now.');
} else {
    console.log('✅ ALL OK - Try creating a room!');
    console.log('\n💡 To auto-create test room, run:');
    console.log('   window.testCreateRoom()');
}

// Helper function
window.testCreateRoom = async function() {
    console.log('\n🧪 Creating test room...');
    
    const nameInput = document.getElementById('room-name-input');
    const codeInput = document.getElementById('room-code-input');
    const selector = document.getElementById('room-quiz-selector');
    
    if (!nameInput || !codeInput || !selector) {
        console.log('❌ Form elements not found!');
        return;
    }
    
    // Fill form
    nameInput.value = 'Test Room ' + Date.now();
    codeInput.value = String(Math.floor(100000 + Math.random() * 900000));
    
    if (selector.options.length > 1) {
        selector.selectedIndex = 1;
    } else {
        console.log('❌ No quiz options!');
        return;
    }
    
    console.log('✅ Form filled:');
    console.log('   Name:', nameInput.value);
    console.log('   Code:', codeInput.value);
    console.log('   Quiz:', selector.options[selector.selectedIndex].text);
    
    console.log('\n📞 Calling createRoom()...');
    
    try {
        await window.roomManager.createRoom();
        console.log('✅ createRoom() called!');
        console.log('💡 Check for success message or errors above');
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

console.log('\n✅ Test complete!');
