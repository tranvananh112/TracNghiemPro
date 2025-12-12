// ⚡ ACTIVATE SUPABASE FEATURES
// Kích hoạt lại tất cả tính năng Supabase

(async function() {
    console.log('⚡ Activating Supabase Features...\n');
    
    // ===== 1. KIỂM TRA KẾT NỐI =====
    console.log('1️⃣ Checking Supabase Connection...');
    
    if (!window.supabaseQuizManager) {
        console.error('❌ supabaseQuizManager not found!');
        console.log('💡 Make sure supabase-config.js is loaded');
        return;
    }
    
    if (!window.supabaseQuizManager.isAvailable()) {
        console.error('❌ Supabase not available!');
        console.log('💡 Check your configuration in supabase-config.js');
        return;
    }
    
    console.log('✅ Supabase connected!');
    console.log('   URL:', 'https://uprsyadxavxaqrenuxzh.supabase.co');
    
    // ===== 2. TEST KẾT NỐI DATABASE =====
    console.log('\n2️⃣ Testing Database Connection...');
    
    try {
        // Test bảng shared_quizzes
        const { data: sharedQuizzes, error: sharedError } = await window.supabaseQuizManager.supabase
            .from('shared_quizzes')
            .select('count')
            .limit(1);
        
        if (sharedError) {
            console.warn('⚠️ shared_quizzes table:', sharedError.message);
        } else {
            console.log('✅ shared_quizzes table: OK');
        }
        
        // Test bảng exam_rooms
        const { data: examRooms, error: roomsError } = await window.supabaseQuizManager.supabase
            .from('exam_rooms')
            .select('count')
            .limit(1);
        
        if (roomsError) {
            console.warn('⚠️ exam_rooms table:', roomsError.message);
            console.log('💡 Run SQL setup from SUPABASE_SETUP.md');
        } else {
            console.log('✅ exam_rooms table: OK');
        }
        
    } catch (error) {
        console.error('❌ Database test failed:', error);
    }
    
    // ===== 3. KÍCH HOẠT ROOM MANAGER =====
    console.log('\n3️⃣ Activating Room Manager...');
    
    if (window.roomManager) {
        // Force check Supabase status
        await window.roomManager.checkSupabaseStatus();
        
        if (window.roomManager.isSupabaseAvailable) {
            console.log('✅ Room Manager: Supabase ENABLED');
            console.log('   - Can create cloud rooms');
            console.log('   - Can share globally');
            console.log('   - Realtime updates');
        } else {
            console.log('⚠️ Room Manager: Offline mode only');
        }
        
        // Reload rooms
        await window.roomManager.loadRooms();
        console.log('✅ Rooms reloaded');
    } else {
        console.warn('⚠️ RoomManager not found');
    }
    
    // ===== 4. KÍCH HOẠT EXPLORE QUIZ =====
    console.log('\n4️⃣ Activating Explore Quiz...');
    
    if (window.exploreQuizManager) {
        // Check server status
        const isOnline = await window.exploreQuizManager.checkServerStatus();
        
        if (isOnline) {
            console.log('✅ Explore Quiz: ONLINE');
            console.log('   - Can browse shared quizzes');
            console.log('   - Can share your quizzes');
        } else {
            console.log('⚠️ Explore Quiz: Offline mode');
        }
    } else {
        console.warn('⚠️ ExploreQuizManager not found');
    }
    
    // ===== 5. THỐNG KÊ =====
    console.log('\n5️⃣ Statistics...');
    
    try {
        // Count shared quizzes
        const { count: quizCount } = await window.supabaseQuizManager.supabase
            .from('shared_quizzes')
            .select('*', { count: 'exact', head: true });
        
        console.log('📚 Shared Quizzes:', quizCount || 0);
        
        // Count exam rooms
        const { count: roomCount } = await window.supabaseQuizManager.supabase
            .from('exam_rooms')
            .select('*', { count: 'exact', head: true });
        
        console.log('🏠 Exam Rooms:', roomCount || 0);
        
        // Count my rooms
        if (window.roomManager) {
            const myRooms = window.roomManager.myRooms || [];
            console.log('👤 My Rooms:', myRooms.length);
        }
        
    } catch (error) {
        console.warn('⚠️ Could not get statistics:', error.message);
    }
    
    // ===== 6. TÍNH NĂNG KHẢ DỤNG =====
    console.log('\n6️⃣ Available Features:');
    
    const features = {
        '☁️ Cloud Rooms': window.roomManager?.isSupabaseAvailable || false,
        '💾 Offline Rooms': true,
        '🌐 Share Quizzes': window.supabaseQuizManager?.isAvailable() || false,
        '🔍 Explore Quizzes': window.exploreQuizManager?.isServerOnline || false,
        '📊 Leaderboard': window.roomManager?.isSupabaseAvailable || false,
        '🔄 Realtime Updates': window.roomManager?.isSupabaseAvailable || false
    };
    
    Object.entries(features).forEach(([name, enabled]) => {
        console.log(`   ${enabled ? '✅' : '❌'} ${name}`);
    });
    
    // ===== 7. HƯỚNG DẪN SỬ DỤNG =====
    console.log('\n7️⃣ How to Use:');
    
    if (window.roomManager?.isSupabaseAvailable) {
        console.log('✅ CLOUD MODE ACTIVE:');
        console.log('   1. Create room → Saved to Supabase');
        console.log('   2. Share room code → Anyone can join');
        console.log('   3. Results → Auto sync to cloud');
        console.log('   4. Leaderboard → Realtime updates');
    } else {
        console.log('⚠️ OFFLINE MODE:');
        console.log('   1. Create room → Saved locally');
        console.log('   2. Share room code → Same device only');
        console.log('   3. Results → Saved locally');
        console.log('   4. Leaderboard → Click "Refresh"');
        console.log('\n💡 To enable cloud mode:');
        console.log('   - Check supabase-config.js');
        console.log('   - Run SQL setup (SUPABASE_SETUP.md)');
        console.log('   - Reload page');
    }
    
    // ===== 8. TEST FUNCTIONS =====
    console.log('\n8️⃣ Test Functions:');
    console.log('   window.testSupabaseConnection() - Test connection');
    console.log('   window.testCreateRoom() - Test create room');
    console.log('   window.testShareQuiz() - Test share quiz');
    
    // Gắn test functions
    window.testSupabaseConnection = async function() {
        console.log('🧪 Testing Supabase Connection...');
        
        try {
            const { data, error } = await window.supabaseQuizManager.supabase
                .from('exam_rooms')
                .select('count')
                .limit(1);
            
            if (error) {
                console.error('❌ Connection failed:', error.message);
                return false;
            }
            
            console.log('✅ Connection successful!');
            return true;
        } catch (error) {
            console.error('❌ Error:', error);
            return false;
        }
    };
    
    window.testCreateRoom = async function() {
        console.log('🧪 Testing Create Room...');
        
        if (!window.roomManager) {
            console.error('❌ RoomManager not found');
            return;
        }
        
        console.log('Supabase available:', window.roomManager.isSupabaseAvailable);
        console.log('Creator ID:', window.roomManager.creatorId);
        
        console.log('💡 To create a room:');
        console.log('   1. Go to "Tạo Phòng Thi"');
        console.log('   2. Fill in the form');
        console.log('   3. Click "Tạo Phòng Thi"');
    };
    
    window.testShareQuiz = async function() {
        console.log('🧪 Testing Share Quiz...');
        
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        
        if (quizzes.length === 0) {
            console.log('❌ No quizzes to share');
            console.log('💡 Create a quiz first');
            return;
        }
        
        console.log('✅ You have', quizzes.length, 'quizzes');
        console.log('💡 To share:');
        console.log('   1. Go to "Khám Phá Đề Thi"');
        console.log('   2. Click "Chia Sẻ Quiz"');
        console.log('   3. Select a quiz');
        console.log('   4. Click "Chia Sẻ"');
    };
    
    // ===== 9. KẾT LUẬN =====
    console.log('\n🎉 Activation Complete!');
    
    if (window.roomManager?.isSupabaseAvailable) {
        console.log('✅ ALL FEATURES ACTIVE - Cloud mode enabled!');
        console.log('💡 You can now:');
        console.log('   - Create cloud rooms');
        console.log('   - Share globally');
        console.log('   - Use realtime features');
    } else {
        console.log('⚠️ OFFLINE MODE - Limited features');
        console.log('💡 To enable cloud mode:');
        console.log('   1. Check SUPABASE_SETUP.md');
        console.log('   2. Run SQL setup');
        console.log('   3. Reload page');
    }
    
    console.log('\n📝 Documentation:');
    console.log('   - SUPABASE_SETUP.md - Setup guide');
    console.log('   - ROOM_UPGRADE_COMPLETE.md - Room features');
    console.log('   - ROOM_SHARING_SOLUTION.md - Sharing guide');
    
})();

console.log('✅ Supabase activation script loaded!');
