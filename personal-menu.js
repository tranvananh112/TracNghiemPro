// Personal Menu Toggle Handler
document.addEventListener('DOMContentLoaded', function() {
    const personalToggle = document.getElementById('personal-section-toggle');
    const personalMenuItems = document.getElementById('personal-menu-items');
    const personalSection = document.querySelector('.personal-section');
    
    // Lấy trạng thái từ localStorage
    const isCollapsed = localStorage.getItem('personalMenuCollapsed') === 'true';
    
    // Áp dụng trạng thái ban đầu
    if (isCollapsed) {
        personalMenuItems.classList.add('collapsed');
        personalSection.classList.add('collapsed');
    }
    
    // Xử lý click
    if (personalToggle) {
        personalToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle classes
            personalMenuItems.classList.toggle('collapsed');
            personalSection.classList.toggle('collapsed');
            
            // Lưu trạng thái
            const isNowCollapsed = personalMenuItems.classList.contains('collapsed');
            localStorage.setItem('personalMenuCollapsed', isNowCollapsed);
            
            // Animation cho mũi tên
            const arrow = this.querySelector('.toggle-arrow');
            if (arrow) {
                if (isNowCollapsed) {
                    arrow.style.transform = 'rotate(-90deg)';
                } else {
                    arrow.style.transform = 'rotate(0deg)';
                }
            }
        });
    }
});

// Personal Menu Manager
class PersonalMenuManager {
    constructor() {
        this.recentAccess = JSON.parse(localStorage.getItem('recentAccess') || '[]');
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.myResults = JSON.parse(localStorage.getItem('myResults') || '[]');
        this.currentActiveTab = null;
        this.autoRefreshInterval = null;
        
        // Khởi tạo realtime updates
        this.initRealtimeUpdates();
    }

    // Khởi tạo cập nhật theo thời gian thực
    initRealtimeUpdates() {
        // Lắng nghe sự kiện custom từ quizManager
        window.addEventListener('quizStarted', (e) => {
            console.log('📝 Quiz started, updating recent access...');
            this.handleQuizStarted(e.detail);
        });

        window.addEventListener('quizCompleted', (e) => {
            console.log('✅ Quiz completed, updating results...');
            this.handleQuizCompleted(e.detail);
        });

        window.addEventListener('quizFavoriteToggled', (e) => {
            console.log('❤️ Favorite toggled, updating favorites...');
            this.handleFavoriteToggled(e.detail);
        });

        // Auto refresh khi tab đang active
        this.startAutoRefresh();
    }

    // Bắt đầu auto refresh
    startAutoRefresh() {
        // Refresh mỗi 5 giây nếu tab đang active
        this.autoRefreshInterval = setInterval(() => {
            if (this.currentActiveTab) {
                this.refreshCurrentTab();
            }
        }, 5000);
    }

    // Dừng auto refresh
    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    // Refresh tab hiện tại
    refreshCurrentTab() {
        switch(this.currentActiveTab) {
            case 'recent-access':
                this.renderRecentAccess();
                break;
            case 'favorites':
                this.renderFavorites();
                break;
            case 'my-results':
                this.renderMyResults();
                break;
            case 'my-library':
                this.renderMyLibrary();
                break;
        }
    }

    // Xử lý khi bắt đầu làm quiz
    handleQuizStarted(data) {
        if (data && data.quiz) {
            this.addToRecentAccess(data.quiz);
            
            // Hiển thị notification
            if (window.notify) {
                window.notify.info(
                    'Đã lưu vào lịch sử',
                    `"${data.quiz.title}" được thêm vào truy cập gần đây`,
                    3000
                );
            }
        }
    }

    // Xử lý khi hoàn thành quiz
    handleQuizCompleted(data) {
        if (data && data.result) {
            this.saveResult(data.result);
            
            // Hiển thị notification với điểm số
            if (window.notify) {
                const percentage = (data.result.correctAnswers / data.result.totalQuestions * 100).toFixed(1);
                const type = percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'error';
                
                window.notify.show({
                    type: type,
                    title: `Điểm: ${data.result.score.toFixed(1)}/10`,
                    message: `Đúng ${data.result.correctAnswers}/${data.result.totalQuestions} câu (${percentage}%)`,
                    duration: 5000
                });
            }
            
            // Refresh tất cả tabs
            this.refreshAllTabs();
        }
    }

    // Xử lý khi toggle favorite
    handleFavoriteToggled(data) {
        if (data && data.quizId) {
            const isFavorite = this.toggleFavorite(data.quizId);
            
            // Hiển thị notification
            if (window.notify) {
                window.notify.show({
                    type: 'info',
                    title: isFavorite ? 'Đã thêm yêu thích' : 'Đã bỏ yêu thích',
                    message: data.quizTitle || 'Đề thi',
                    duration: 2000
                });
            }
        }
    }

    // Refresh tất cả tabs
    refreshAllTabs() {
        this.renderRecentAccess();
        this.renderFavorites();
        this.renderMyResults();
        this.renderMyLibrary();
    }

    // Set tab đang active
    setActiveTab(tabName) {
        this.currentActiveTab = tabName;
        this.refreshCurrentTab();
    }

    // Thêm vào lịch sử truy cập
    addToRecentAccess(quiz) {
        const accessItem = {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            totalQuestions: quiz.totalQuestions,
            accessedAt: new Date().toISOString(),
            type: 'quiz'
        };

        // Xóa item cũ nếu đã tồn tại
        this.recentAccess = this.recentAccess.filter(item => item.id !== quiz.id);
        
        // Thêm vào đầu
        this.recentAccess.unshift(accessItem);
        
        // Giới hạn 20 items
        if (this.recentAccess.length > 20) {
            this.recentAccess = this.recentAccess.slice(0, 20);
        }
        
        localStorage.setItem('recentAccess', JSON.stringify(this.recentAccess));
        
        // Render ngay lập tức
        this.renderRecentAccess();
        
        console.log('✅ Added to recent access:', quiz.title);
    }

    // Render danh sách truy cập gần đây
    renderRecentAccess() {
        const container = document.getElementById('recent-access-list');
        if (!container) {
            console.warn('⚠️ recent-access-list container not found');
            return;
        }

        console.log('📋 Rendering recent access...', this.recentAccess.length, 'items');

        if (this.recentAccess.length === 0) {
            container.innerHTML = `
                <div class="personal-empty-state">
                    <i class="fas fa-history"></i>
                    <h3>Chưa có lịch sử truy cập</h3>
                    <p>Làm bài quiz để xem lịch sử ở đây</p>
                    <button class="btn-primary" data-tab="quiz" onclick="document.querySelector('[data-tab=quiz]').click()">
                        <i class="fas fa-play"></i> Làm bài ngay
                    </button>
                </div>
            `;
            return;
        }

        const html = this.recentAccess.map(item => {
            const timeAgo = this.getTimeAgo(item.accessedAt);
            return `
                <div class="recent-access-card" onclick="personalMenuManager.openQuiz('${item.id}')">
                    <div class="recent-access-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="recent-access-info">
                        <div class="recent-access-title">${this.escapeHtml(item.title)}</div>
                        <div class="recent-access-meta">
                            <span><i class="fas fa-question-circle"></i> ${item.totalQuestions} câu</span>
                            <span><i class="fas fa-clock"></i> ${timeAgo}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    // Toggle yêu thích
    toggleFavorite(quizId) {
        const index = this.favorites.indexOf(quizId);
        
        if (index > -1) {
            // Đã yêu thích -> Bỏ yêu thích
            this.favorites.splice(index, 1);
        } else {
            // Chưa yêu thích -> Thêm vào
            this.favorites.push(quizId);
        }
        
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.renderFavorites();
        
        return index === -1; // Return true nếu vừa thêm vào
    }

    // Kiểm tra quiz có được yêu thích không
    isFavorite(quizId) {
        return this.favorites.includes(quizId);
    }

    // Render danh sách yêu thích
    renderFavorites() {
        const container = document.getElementById('favorites-list');
        if (!container) {
            console.warn('⚠️ favorites-list container not found');
            return;
        }

        console.log('📋 Rendering favorites...', this.favorites);

        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="personal-empty-state">
                    <i class="fas fa-heart"></i>
                    <h3>Chưa có đề thi yêu thích</h3>
                    <p>Nhấn vào icon trái tim trên đề thi để thêm vào yêu thích</p>
                    <button class="btn-primary" data-tab="my-library" onclick="document.querySelector('[data-tab=my-library]').click()">
                        <i class="fas fa-book"></i> Xem Thư Viện
                    </button>
                </div>
            `;
            return;
        }

        // Lấy thông tin quiz từ quizManager hoặc localStorage
        let allQuizzes = [];
        
        if (window.quizManager && window.quizManager.quizzes) {
            allQuizzes = window.quizManager.quizzes;
        } else {
            // Fallback: Lấy từ localStorage
            try {
                const storedQuizzes = localStorage.getItem('quizzes');
                if (storedQuizzes) {
                    allQuizzes = JSON.parse(storedQuizzes);
                }
            } catch (e) {
                console.error('Error loading quizzes from localStorage:', e);
            }
        }

        console.log('📚 All quizzes:', allQuizzes.length);

        const favoriteQuizzes = this.favorites
            .map(id => allQuizzes.find(q => q.id === id))
            .filter(q => q !== undefined);

        console.log('❤️ Favorite quizzes found:', favoriteQuizzes.length);

        if (favoriteQuizzes.length === 0) {
            container.innerHTML = `
                <div class="personal-empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <h3>Các đề thi yêu thích đã bị xóa</h3>
                    <p>Hãy thêm đề thi mới vào yêu thích</p>
                    <button class="btn-secondary" onclick="personalMenuManager.favorites = []; localStorage.setItem('favorites', '[]'); personalMenuManager.renderFavorites();">
                        <i class="fas fa-trash"></i> Xóa danh sách
                    </button>
                </div>
            `;
            return;
        }

        const html = favoriteQuizzes.map(quiz => `
            <div class="quiz-card" data-quiz-id="${quiz.id}" style="position: relative;">
                <div class="favorite-badge active" onclick="event.stopPropagation(); personalMenuManager.toggleFavorite('${quiz.id}'); personalMenuManager.renderFavorites();">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="quiz-card-header">
                    <h3>${this.escapeHtml(quiz.title)}</h3>
                    <p>${this.escapeHtml(quiz.description || 'Không có mô tả')}</p>
                </div>
                <div class="quiz-card-meta">
                    <span><i class="fas fa-question-circle"></i> ${quiz.totalQuestions || quiz.questions?.length || 0} câu</span>
                    <span><i class="fas fa-calendar"></i> ${quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </div>
                <div class="quiz-card-actions">
                    <button class="btn-primary" onclick="personalMenuManager.startQuiz('${quiz.id}')">
                        <i class="fas fa-play"></i> Làm bài
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
        console.log('✅ Favorites rendered');
    }

    // Lưu kết quả làm bài
    saveResult(result) {
        const resultItem = {
            id: Date.now().toString(),
            quizId: result.quizId,
            quizTitle: result.quizTitle,
            score: result.score,
            correctAnswers: result.correctAnswers,
            totalQuestions: result.totalQuestions,
            timeSpent: result.timeSpent,
            completedAt: new Date().toISOString()
        };

        this.myResults.unshift(resultItem);
        
        // Giới hạn 50 kết quả
        if (this.myResults.length > 50) {
            this.myResults = this.myResults.slice(0, 50);
        }
        
        localStorage.setItem('myResults', JSON.stringify(this.myResults));
        
        // Sync với Supabase nếu có
        this.syncResultToSupabase(resultItem);
        
        // Render ngay lập tức
        this.renderMyResults();
        
        // Cập nhật thư viện
        this.renderMyLibrary();
    }

    // Sync kết quả lên Supabase
    async syncResultToSupabase(result) {
        if (!window.supabaseQuizManager || !window.supabaseQuizManager.isAvailable()) {
            return; // Không có Supabase, skip
        }

        try {
            // Có thể thêm API để lưu kết quả cá nhân lên Supabase
            console.log('📤 Syncing result to Supabase...', result);
            // TODO: Implement Supabase sync
        } catch (error) {
            console.error('Error syncing result to Supabase:', error);
        }
    }

    // Render kết quả của tôi
    renderMyResults() {
        const container = document.getElementById('my-results-list');
        if (!container) {
            console.warn('⚠️ my-results-list container not found');
            return;
        }

        console.log('📊 Rendering my results...', this.myResults.length, 'items');

        if (this.myResults.length === 0) {
            container.innerHTML = `
                <div class="personal-empty-state">
                    <i class="fas fa-clipboard-check"></i>
                    <h3>Chưa có kết quả nào</h3>
                    <p>Hoàn thành một bài quiz để xem kết quả</p>
                    <button class="btn-primary" data-tab="quiz" onclick="document.querySelector('[data-tab=quiz]').click()">
                        <i class="fas fa-play"></i> Làm bài ngay
                    </button>
                </div>
            `;
            return;
        }

        const html = this.myResults.map(result => {
            const percentage = (result.correctAnswers / result.totalQuestions * 100).toFixed(1);
            const scoreColor = percentage >= 80 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';
            
            return `
                <div class="result-card">
                    <div class="result-card-header">
                        <div class="result-quiz-title">${this.escapeHtml(result.quizTitle)}</div>
                        <div class="result-score" style="color: ${scoreColor};">${result.score.toFixed(1)}</div>
                    </div>
                    <div class="result-card-body">
                        <div class="result-stat">
                            <div class="result-stat-value">${result.correctAnswers}/${result.totalQuestions}</div>
                            <div class="result-stat-label">Đúng/Tổng</div>
                        </div>
                        <div class="result-stat">
                            <div class="result-stat-value">${percentage}%</div>
                            <div class="result-stat-label">Tỷ lệ đúng</div>
                        </div>
                        <div class="result-stat">
                            <div class="result-stat-value">${this.formatTime(result.timeSpent)}</div>
                            <div class="result-stat-label">Thời gian</div>
                        </div>
                    </div>
                    <div class="result-card-footer">
                        <span><i class="fas fa-calendar"></i> ${new Date(result.completedAt).toLocaleDateString('vi-VN')}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(result.completedAt).toLocaleTimeString('vi-VN')}</span>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    // Render thư viện của tôi
    renderMyLibrary() {
        const container = document.getElementById('my-library-content');
        if (!container) {
            console.warn('⚠️ my-library-content container not found');
            return;
        }

        console.log('📖 Rendering my library...');

        // Lấy quizzes từ quizManager hoặc localStorage
        let allQuizzes = [];
        
        if (window.quizManager && window.quizManager.quizzes) {
            allQuizzes = window.quizManager.quizzes;
        } else {
            // Fallback: Lấy từ localStorage
            try {
                const storedQuizzes = localStorage.getItem('quizzes');
                if (storedQuizzes) {
                    allQuizzes = JSON.parse(storedQuizzes);
                }
            } catch (e) {
                console.error('Error loading quizzes from localStorage:', e);
            }
        }

        console.log('📚 Total quizzes:', allQuizzes.length);

        if (allQuizzes.length === 0) {
            container.innerHTML = `
                <div class="personal-empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>Thư viện trống</h3>
                    <p>Hãy tạo đề thi đầu tiên của bạn!</p>
                    <button class="btn-primary" data-tab="input" onclick="document.querySelector('[data-tab=input]').click()">
                        <i class="fas fa-plus"></i> Tạo đề thi mới
                    </button>
                </div>
            `;
            return;
        }

        // Tính toán thống kê
        const totalQuizzes = allQuizzes.length;
        const totalQuestions = allQuizzes.reduce((sum, q) => sum + (q.totalQuestions || q.questions?.length || 0), 0);
        const completedQuizzes = this.myResults.filter(r => 
            allQuizzes.some(q => q.id === r.quizId)
        ).length;
        const avgScore = this.myResults.length > 0 
            ? (this.myResults.reduce((sum, r) => sum + r.score, 0) / this.myResults.length).toFixed(1)
            : 0;

        console.log('📊 Stats:', { totalQuizzes, totalQuestions, completedQuizzes, avgScore });

        const html = `
            <!-- Stats Summary -->
            <div class="personal-stats-summary">
                <div class="personal-stat-card">
                    <div class="personal-stat-value">${totalQuizzes}</div>
                    <div class="personal-stat-label">Tổng đề thi</div>
                </div>
                <div class="personal-stat-card">
                    <div class="personal-stat-value">${totalQuestions}</div>
                    <div class="personal-stat-label">Tổng câu hỏi</div>
                </div>
                <div class="personal-stat-card">
                    <div class="personal-stat-value">${completedQuizzes}</div>
                    <div class="personal-stat-label">Đã hoàn thành</div>
                </div>
                <div class="personal-stat-card">
                    <div class="personal-stat-value">${avgScore}</div>
                    <div class="personal-stat-label">Điểm TB</div>
                </div>
            </div>

            <!-- Quiz Grid -->
            <div class="quiz-grid">
                ${allQuizzes.map(quiz => {
                    const isFav = this.isFavorite(quiz.id);
                    const questionCount = quiz.totalQuestions || quiz.questions?.length || 0;
                    const createdDate = quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString('vi-VN') : 'N/A';
                    
                    return `
                        <div class="quiz-card" data-quiz-id="${quiz.id}" style="position: relative;">
                            <div class="favorite-badge ${isFav ? 'active' : ''}" 
                                 onclick="event.stopPropagation(); personalMenuManager.toggleFavorite('${quiz.id}'); personalMenuManager.renderMyLibrary();"
                                 title="${isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="quiz-card-header">
                                <h3>${this.escapeHtml(quiz.title)}</h3>
                                <p>${this.escapeHtml(quiz.description || 'Không có mô tả')}</p>
                            </div>
                            <div class="quiz-card-meta">
                                <span><i class="fas fa-question-circle"></i> ${questionCount} câu</span>
                                <span><i class="fas fa-calendar"></i> ${createdDate}</span>
                            </div>
                            <div class="quiz-card-actions">
                                <button class="btn-primary" onclick="personalMenuManager.startQuiz('${quiz.id}')">
                                    <i class="fas fa-play"></i> Làm bài
                                </button>
                                <button class="btn-secondary" onclick="personalMenuManager.editQuiz('${quiz.id}')">
                                    <i class="fas fa-edit"></i> Sửa
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = html;
        console.log('✅ My library rendered');
    }

    // Helper functions
    getTimeAgo(dateString) {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return new Date(dateString).toLocaleDateString('vi-VN');
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    openQuiz(quizId) {
        // Chuyển sang tab làm bài và chọn quiz
        const quizSelector = document.getElementById('quiz-selector');
        if (quizSelector) {
            quizSelector.value = quizId;
            document.getElementById('start-quiz').disabled = false;
        }
        
        // Chuyển tab
        document.querySelector('[data-tab="quiz"]').click();
    }

    startQuiz(quizId) {
        this.openQuiz(quizId);
        setTimeout(() => {
            document.getElementById('start-quiz').click();
        }, 100);
    }

    editQuiz(quizId) {
        if (window.quizManager && window.quizManager.editQuiz) {
            window.quizManager.editQuiz(quizId);
        }
    }
}

// Khởi tạo
const personalMenuManager = new PersonalMenuManager();
window.personalMenuManager = personalMenuManager;

// Load dữ liệu khi chuyển tab
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Set active tab cho auto refresh
            if (['recent-access', 'favorites', 'my-results', 'my-library'].includes(tabName)) {
                personalMenuManager.setActiveTab(tabName);
            } else {
                personalMenuManager.setActiveTab(null);
            }
            
            setTimeout(() => {
                if (tabName === 'recent-access') {
                    personalMenuManager.renderRecentAccess();
                } else if (tabName === 'favorites') {
                    personalMenuManager.renderFavorites();
                } else if (tabName === 'my-results') {
                    personalMenuManager.renderMyResults();
                } else if (tabName === 'my-library') {
                    personalMenuManager.renderMyLibrary();
                }
            }, 100);
        });
    });
    
    // Tích hợp với quizManager để tự động track
    setTimeout(() => {
        if (window.quizManager) {
            // Hook vào hàm startQuiz để track recent access
            const originalStartQuiz = window.quizManager.startQuiz;
            if (originalStartQuiz) {
                window.quizManager.startQuiz = function() {
                    const result = originalStartQuiz.apply(this, arguments);
                    
                    // Track quiz vào recent access
                    if (this.currentQuiz) {
                        const quizData = {
                            id: this.currentQuiz.id,
                            title: this.currentQuiz.title,
                            description: this.currentQuiz.description || '',
                            totalQuestions: this.currentQuiz.totalQuestions
                        };
                        
                        // Dispatch event
                        window.dispatchEvent(new CustomEvent('quizStarted', {
                            detail: { quiz: quizData }
                        }));
                    }
                    
                    return result;
                };
            }
            
            // Hook vào hàm submitQuiz để lưu kết quả
            const originalSubmitQuiz = window.quizManager.submitQuiz;
            if (originalSubmitQuiz) {
                window.quizManager.submitQuiz = function() {
                    const result = originalSubmitQuiz.apply(this, arguments);
                    
                    // Lưu kết quả
                    if (this.currentQuiz && this.userAnswers) {
                        const correctCount = this.currentQuiz.questions.filter((q, i) => 
                            this.userAnswers[i] === q.correctAnswer
                        ).length;
                        
                        const score = (correctCount / this.currentQuiz.totalQuestions) * 10;
                        const timeSpent = this.timeSpent || 0;
                        
                        const resultData = {
                            quizId: this.currentQuiz.id,
                            quizTitle: this.currentQuiz.title,
                            score: score,
                            correctAnswers: correctCount,
                            totalQuestions: this.currentQuiz.totalQuestions,
                            timeSpent: timeSpent
                        };
                        
                        // Dispatch event
                        window.dispatchEvent(new CustomEvent('quizCompleted', {
                            detail: { result: resultData }
                        }));
                    }
                    
                    return result;
                };
            }
            
            console.log('✅ Personal Menu integrated with QuizManager');
        }
    }, 1000);
});

console.log('✅ Personal Menu Manager loaded with auto-tracking');


// Initialize PersonalMenuManager instance
let personalMenuManager;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersonalMenuManager);
} else {
    initPersonalMenuManager();
}

function initPersonalMenuManager() {
    personalMenuManager = new PersonalMenuManager();
    window.personalMenuManager = personalMenuManager;
    console.log('✅ PersonalMenuManager initialized');
}
