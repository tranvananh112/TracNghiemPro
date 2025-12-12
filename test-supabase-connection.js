// Test Supabase Connection
// Kiểm tra kết nối và cấu hình Supabase

async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase Connection...\n');
    
    // 1. Kiểm tra Supabase đã được khởi tạo chưa
    console.log('1️⃣ Checking Supabase Initialization...');
    if (!window.supabaseQuizManager) {
        console.error('❌ supabaseQuizManager not found!');
        console.log('💡 Make sure supabase-config.js is loaded');
        return;
    }
    console.log('✅ supabaseQuizManager found');
    
    // 2. Kiểm tra Supabase có available không
    console.log('\n2️⃣ Checking Supabase Availability...');
    const isAvailable = window.supabaseQuizManager.isAvailable();
    console.log('Available:', isAvailable);
    
    if (!isAvailable) {
        console.error('❌ Supabase is NOT available');
        console.log('💡 Possible reasons:');
        console.log('   - URL or KEY not configured');
        console.log('   - Network error');
        console.log('   - CORS issue');
        return;
    }
    console.log('✅ Supabase is available');
    
    // 3. Test kết nối thực tế
    console.log('\n3️⃣ Testing Real Connection...');
    try {
        const result = await window.supabaseQuizManager.getAllQuizzes(1);
        console.log('✅ Connection successful!');
        console.log('📊 Result:', result);
        
        if (result.success) {
            console.log('✅ Can fetch data from Supabase');
            console.log('📝 Total quizzes:', result.quizzes.length);
        }
    } catch (error) {
        console.error('❌ Connection failed:', error);
        console.log('💡 Error details:', error.message);
    }
    
    // 4. Kiểm tra bảng shared_quizzes
    console.log('\n4️⃣ Checking Table Structure...');
    try {
        const { data, error } = await window.supabaseQuizManager.supabase
            .from('shared_quizzes')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ Table error:', error);
            console.log('💡 Possible issues:');
            console.log('   - Table "shared_quizzes" does not exist');
            console.log('   - RLS policies not configured');
            console.log('   - Permissions issue');
        } else {
            console.log('✅ Table "shared_quizzes" exists and accessible');
            console.log('📊 Sample data:', data);
        }
    } catch (error) {
        console.error('❌ Table check failed:', error);
    }
    
    // 5. Test tạo phòng (Room)
    console.log('\n5️⃣ Testing Room Creation...');
    if (window.roomManager) {
        console.log('✅ roomManager found');
        console.log('Supabase available for rooms:', window.roomManager.isSupabaseAvailable);
        
        if (!window.roomManager.isSupabaseAvailable) {
            console.warn('⚠️ Supabase NOT available for room manager');
            console.log('💡 Room manager needs Supabase to create rooms');
        }
    } else {
        console.warn('⚠️ roomManager not found');
    }
    
    // 6. Tổng kết
    console.log('\n📋 SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Supabase Manager:', window.supabaseQuizManager ? '✅' : '❌');
    console.log('Is Available:', isAvailable ? '✅' : '❌');
    console.log('Room Manager:', window.roomManager ? '✅' : '❌');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (isAvailable) {
        console.log('\n🎉 Supabase is working correctly!');
        console.log('💡 You can now:');
        console.log('   - Create rooms');
        console.log('   - Share quizzes');
        console.log('   - Use cloud features');
    } else {
        console.log('\n⚠️ Supabase is NOT working!');
        console.log('💡 To fix:');
        console.log('   1. Check supabase-config.js');
        console.log('   2. Verify URL and KEY');
        console.log('   3. Create table "shared_quizzes"');
        console.log('   4. Configure RLS policies');
    }
}

// Hướng dẫn tạo bảng
function showTableCreationSQL() {
    console.log('\n📝 SQL to create "shared_quizzes" table:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`
CREATE TABLE shared_quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    total_questions INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    original_id TEXT,
    tags TEXT[],
    difficulty TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE shared_quizzes ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read access" ON shared_quizzes
    FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert access" ON shared_quizzes
    FOR INSERT WITH CHECK (true);

-- Allow public update stats
CREATE POLICY "Allow public update stats" ON shared_quizzes
    FOR UPDATE USING (true) WITH CHECK (true);
    `);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Copy and run this SQL in Supabase SQL Editor');
}

// Export functions
window.testSupabaseConnection = testSupabaseConnection;
window.showTableCreationSQL = showTableCreationSQL;

console.log('✅ Supabase Test Script loaded!');
console.log('💡 Run: testSupabaseConnection()');
console.log('💡 Show SQL: showTableCreationSQL()');
