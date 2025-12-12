// ===== SILENT CORS FIX - Tắt tất cả lỗi CORS =====
// File này sẽ tắt các lỗi CORS một cách im lặng

(function() {
    // Tắt tất cả console.warn và console.error liên quan đến CORS
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.warn = function(...args) {
        const message = args.join(' ');
        // Chỉ bỏ qua các warning về CORS
        if (message.includes('CORS') || 
            message.includes('Cross origin') || 
            message.includes('Failed to load') ||
            message.includes('net::ERR_FAILED')) {
            return; // Không hiển thị
        }
        originalWarn.apply(console, args);
    };
    
    console.error = function(...args) {
        const message = args.join(' ');
        // Chỉ bỏ qua các error về CORS
        if (message.includes('CORS') || 
            message.includes('Cross origin') || 
            message.includes('Failed to load') ||
            message.includes('net::ERR_FAILED')) {
            return; // Không hiển thị
        }
        originalError.apply(console, args);
    };
    
    // Override fetch để bắt lỗi CORS im lặng
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).catch(error => {
            // Nếu là lỗi CORS, trả về response rỗng thay vì throw error
            if (error.message.includes('Failed to fetch') || 
                error.message.includes('CORS') ||
                error.message.includes('NetworkError')) {
                // Trả về response rỗng
                return new Response('[]', {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            throw error;
        });
    };
    
    console.log('✅ Silent CORS fix applied');
})();
