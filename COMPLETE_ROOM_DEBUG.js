// ===== COMPLETE ROOM DEBUG SCRIPT =====
// Copy toàn bộ và paste vào Console (F12)

(async function() {
    console.log('🔍 ===== COMPLETE ROOM DEBUG =====\n');
    
    // ===== 1. KIỂM TRA SUPABASE =====
    console.log('1️⃣ SUPABASE CHECK:');
    console.log('   supabaseQuizManager:', window.supabaseQuizManager ? '✅' : '❌');
    
    if (window.supabaseQuizManager) {
        const isAvailable = window.supabaseQuizManager.isAvailable();
        console.log('   isAvailable():', isAvailable ? '✅' : '❌');
        
        if (isAvailable) {
            // Test connection
            try {
                const { data, error } = await window.supabaseQuizManager.supabase
                    .from('exam_rooms')
                    .select('count')
                    .limit(1);
                
                if (error) {
                    console.log('   ❌ Connection error:', error.message);
                    console.log('   💡 Run SQL setup from SUPABASE_ACTIVATION_GUIDE.md');
                } else {
                    console.log('   ✅ Database connected!');
                }
            } catch (e) {
                console.log('   ❌ Test failed:', e.message);
            }
        }
    }
    
    // ===== 2. KIỂM TRA ROOM MANAGER =====
    console.log('\n2️⃣ ROOM MANAGER CHECK:');
    console.log('   roomManager:', window.roomManager ? '✅' : '❌');
    
    if (window.roomManager) {
        console.log('   isSupabaseAvailable:', window.roomManager.isSupabaseAvailable ? '✅' : '❌');
        console.log('   creatorId:', window.roomManager.creatorId);
        console.log('   myRooms:', window.roomManager.myRooms?.length || 0);
        
        // Force check Supabase
        await window.roomManager.checkSupabaseStatus();
        console.log('   After recheck:', window.roomManager.isSupabaseAvailable ? '✅' : '❌');
    } else {
        console.log('   ❌ RoomManager not initialized!');
        console.log('   💡 Reload page (Ctrl+F5)');
    }
    
    // ===== 3. KIỂM TRA QUIZZES =====
    console.log('\n3️⃣ QUIZZES CHECK:');
    
    let quizzes = [];
    if (window.quizManager && window.quizManager.quizzes) {
        quizzes = window.quizManager.quizzes;
        console.log('   From quizManager:', quizzes.length);
    }
    
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
    console.log('   From localStorage:', storedQuizzes.length);
    
    if (storedQuizzes.length === 0) {
        console.log('   ❌ NO QUIZZES FOUND!');
        console.log('   💡 Create a quiz first:');
        console.log('      1. Go to "Tạo Bài Quiz"');
        console.log('      2. Create a quiz');
        console.log('      3. Come back');
    } else {
        console.log('   ✅ Quizzes available:');
        storedQuizzes.slice(0, 3).forEach((q, i) => {
            console.log(`      ${i + 1}. ${q.title} (${q.totalQuestions} câu)`);
        });
    }
    
    // ===== 4. KIỂM TRA FORM ELEMENTS =====
    console.log('\n4️⃣ FORM ELEMENTS CHECK:');
    
    const elements = {
        'room-name-input': document.getElementById('room-name-input'),
        'room-code-input': document.getElementById('room-code-input'),
        'room-quiz-selector': document.getElementById('room-quiz-selector'),
        'btn-create-room': document.getElementById('btn-create-room'),
        'btn-generate-room-code': document.getElementById('btn-generate-room-code')
    };
    
    Object.entries(elements).forEach(([id, el]) => {
        console.log(`   ${id}:`, el ? '✅' : '❌');
    });
    
    // ===== 5. KIỂM TRA QUIZ SELECTOR =====
    console.log('\n5️⃣ QUIZ SELECTOR CHECK:');
    
    const selector = document.getElementById('room-quiz-selector');
    if (selector) {
        const options = Array.from(selector.querySelectorAll('option'));
        console.log('   Total options:', options.length);
        
        if (options.length <= 1) {
            console.log('   ⚠️ Selector is empty!');
            console.log('   💡 Loading quizzes...');
            
            // Try to load
            if (window.roomManager && window.roomManager.loadQuizSelector) {
                window.roomManager.loadQuizSelector();
                
                // Check again
                const newOptions = Array.from(selector.querySelectorAll('option'));
                console.log('   After reload:', newOptions.length, 'options');
                
                if (newOptions.length > 1) {
                    console.log('   ✅ Quizzes loaded:');
                    newOptions.slice(1, 4).forEach((opt, i) => {
                        console.log(`      ${i + 1}. ${opt.textContent}`);
                    });
                }
            }
        } else {
            console.log('   ✅ Options available:');
            options.slice(1, 4).forEach((opt, i) => {
                console.log(`      ${i + 1}. ${opt.textContent}`);
            });
        }
    }
    
    // ===== 6. KIỂM TRA EVENT LISTENERS =====
    console.log('\n6️⃣ EVENT LISTENERS CHECK:');
    
    const createBtn = document.getElementById('btn-create-room');
    if (createBtn) {
        console.log('   Create button: ✅');
        
        // Test click
        console.log('   Testing click handler...');
        const testClick = () => {
            console.log('   ✅ Click handler works!');
        };
        
        // Gắn test handler
        const oldBtn = createBtn.cloneNode(true);
        createBtn.parentNode.replaceChild(oldBtn, createBtn);
        
        oldBtn.addEventListener('click', function() {
            console.log('   🖱️ Button clicked!');
            
            if (window.roomManager && typeof window.roomManager.createRoom === 'function') {
                console.log('   📞 Calling createRoom()...');
                window.roomManager.createRoom();
            } else {
                console.log('   ❌ createRoom() not found!');
            }
        });
        
        console.log('   ✅ Event listener attached');
    }
    
    // ===== 7. TEST TẠO PHÒNG =====
    console.log('\n7️⃣ TEST CREATE ROOM:');
    
    if (!window.roomManager) {
        console.log('   ❌ Cannot test - RoomManager not found');
    } else if (storedQuizzes.length === 0) {
        console.log('   ❌ Cannot test - No quizzes');
    } else {
        console.log('   ✅ Ready to create room!');
        console.log('   💡 Fill the form:');
        console.log('      - Room name: "Test Room"');
        console.log('      - Room code: 123456');
        console.log('      - Select a quiz');
        console.log('      - Click "Tạo Phòng Thi"');
        
        // Auto-fill for testing
        const nameInput = document.getElementById('room-name-input');
        const codeInput = document.getElementById('room-code-input');
        
        if (nameInput && codeInput && selector) {
            nameInput.value = 'Test Room ' + Date.now();
            codeInput.value = String(Math.floor(100000 + Math.random() * 900000));
            
            // Select first quiz
            if (selector.options.length > 1) {
                selector.selectedIndex = 1;
            }
            
            console.log('   ✅ Form auto-filled!');
            console.log('   💡 Now click "Tạo Phòng Thi" button');
        }
    }
    
    // ===== 8. KIỂM TRA EXISTING ROOMS =====
    console.log('\n8️⃣ EXISTING ROOMS:');
    
    // Offline rooms
    const offlineRooms = JSON.parse(localStorage.getItem('offlineRooms') || '[]');
    console.log('   Offline rooms:', offlineRooms.length);
    
    if (offlineRooms.length > 0) {
        offlineRooms.slice(0, 3).forEach((r, i) => {
            console.log(`      ${i + 1}. ${r.name} (${r.code}) - ${r.mode || 'offline'}`);
        });
    }
    
    // Cloud rooms (if Supabase available)
    if (window.roomManager?.isSupabaseAvailable) {
        try {
            const { data: cloudRooms, error } = await window.supabaseQuizManager.supabase
                .from('exam_rooms')
                .select('name, code')
                .eq('creator_id', window.roomManager.creatorId)
                .limit(3);
            
            if (!error && cloudRooms) {
                console.log('   Cloud rooms:', cloudRooms.length);
                cloudRooms.forEach((r, i) => {
                    console.log(`      ${i + 1}. ${r.name} (${r.code}) - cloud`);
                });
            }
        } catch (e) {
            console.log('   ⚠️ Could not fetch cloud rooms');
        }
    }
    
    // ===== 9. FINAL VERDICT =====
    console.log('\n9️⃣ FINAL VERDICT:');
    
    const issues = [];
    
    if (!window.supabaseQuizManager?.isAvailable()) {
        issues.push('Supabase not configured');
    }
    
    if (!window.roomManager) {
        issues.push('RoomManager not initialized');
    }
    
    if (storedQuizzes.length === 0) {
        issues.push('No quizzes available');
    }
    
    if (selector && selector.options.length <= 1) {
        issues.push('Quiz selector empty');
    }
    
    if (!createBtn) {
        issues.push('Create button not found');
    }
    
    if (issues.length === 0) {
        console.log('   ✅ ALL CHECKS PASSED!');
        console.log('   💡 You should be able to create rooms now');
        console.log('   💡 If still not working, check Console for errors');
    } else {
        console.log('   ❌ ISSUES FOUND:');
        issues.forEach((issue, i) => {
            console.log(`      ${i + 1}. ${issue}`);
        });
        
        console.log('\n   💡 SOLUTIONS:');
        if (issues.includes('Supabase not configured')) {
            console.log('      - Check supabase-config.js');
            console.log('      - Run SQL setup');
        }
        if (issues.includes('RoomManager not initialized')) {
            console.log('      - Reload page (Ctrl+F5)');
        }
        if (issues.includes('No quizzes available')) {
            console.log('      - Create a quiz first');
        }
        if (issues.includes('Quiz selector empty')) {
            console.log('      - Run: window.roomManager.loadQuizSelector()');
        }
    }
    
    // ===== 10. HELPER FUNCTIONS =====
    console.log('\n🔧 HELPER FUNCTIONS:');
    console.log('   window.forceCreateRoom() - Force create a test room');
    console.log('   window.reloadQuizSelector() - Reload quiz selector');
    console.log('   window.testSupabaseConnection() - Test Supabase');
    
    // Force create room function
    window.forceCreateRoom = async function() {
        console.log('⚡ Force Creating Room...');
        
        if (!window.roomManager) {
            console.error('❌ RoomManager not found!');
            return;
        }
        
        const quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        if (quizzes.length === 0) {
            console.error('❌ No quizzes! Create one first.');
            return;
        }
        
        // Auto-fill form
        const nameInput = document.getElementById('room-name-input');
        const codeInput = document.getElementById('room-code-input');
        const selector = document.getElementById('room-quiz-selector');
        
        if (nameInput) nameInput.value = 'Test Room ' + Date.now();
        if (codeInput) codeInput.value = String(Math.floor(100000 + Math.random() * 900000));
        if (selector && selector.options.length > 1) selector.selectedIndex = 1;
        
        console.log('✅ Form filled');
        console.log('📞 Calling createRoom()...');
        
        // Call createRoom
        await window.roomManager.createRoom();
    };
    
    console.log('\n🏁 DEBUG COMPLETE!');
    console.log('💡 If you see issues, follow the solutions above');
    console.log('💡 If all checks passed, try creating a room now');
    
})();
