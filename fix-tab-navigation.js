// Fix Tab Navigation - Ensure all tabs work properly
// This file fixes the issue where clicking navigation items doesn't show content

(function() {
    'use strict';
    
    console.log('🔧 Loading tab navigation fix...');
    
    // Wait for DOM to be ready
    function initTabNavigation() {
        console.log('🔄 Initializing tab navigation...');
        
        // Get all navigation items (both sidebar and top navbar)
        const navItems = document.querySelectorAll('.nav-item[data-tab], .top-navbar-item a[data-tab]');
        console.log(`📋 Found ${navItems.length} navigation items`);
        
        navItems.forEach((item, index) => {
            const tabName = item.getAttribute('data-tab');
            console.log(`  ${index + 1}. Nav item: ${tabName}`);
            
            // Remove existing listeners by cloning
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Add new click listener
            newItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetTab = this.getAttribute('data-tab');
                console.log(`🖱️ Clicked: ${targetTab}`);
                
                if (!targetTab) {
                    console.warn('⚠️ No data-tab attribute found');
                    return;
                }
                
                // Switch to the tab
                switchToTab(targetTab);
            });
        });
        
        // Also handle hero buttons
        const heroBtns = document.querySelectorAll('.hero-btn[data-tab]');
        heroBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const targetTab = this.getAttribute('data-tab');
                if (targetTab) {
                    switchToTab(targetTab);
                }
            });
        });
        
        console.log('✅ Tab navigation initialized');
    }
    
    // Switch to a specific tab
    function switchToTab(tabName) {
        console.log(`🔄 Switching to tab: ${tabName}`);
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item, .top-navbar-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        const targetNavItems = document.querySelectorAll(`[data-tab="${tabName}"]`);
        targetNavItems.forEach(item => {
            if (item.classList.contains('nav-item')) {
                item.classList.add('active');
            } else if (item.parentElement.classList.contains('top-navbar-item')) {
                item.parentElement.classList.add('active');
            }
        });
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
            tab.style.display = 'none';
        });
        
        // Show target tab
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
            targetTab.style.display = 'block';
            console.log(`✅ Tab activated: ${tabName}`);
            
            // Trigger content loading based on tab
            loadTabContent(tabName);
        } else {
            console.error(`❌ Tab not found: ${tabName}-tab`);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Load content for specific tabs
    function loadTabContent(tabName) {
        console.log(`📦 Loading content for: ${tabName}`);
        
        // Wait a bit for managers to be initialized
        setTimeout(() => {
            try {
                switch(tabName) {
                    case 'home':
                        if (window.quizManager) {
                            window.quizManager.loadQuizList();
                        }
                        break;
                        
                    case 'manage':
                        if (window.quizManager) {
                            window.quizManager.loadQuizList();
                        }
                        break;
                        
                    case 'quiz':
                        if (window.quizManager) {
                            window.quizManager.updateQuizSelector();
                        }
                        break;
                        
                    case 'explore':
                        if (window.exploreQuizManager) {
                            window.exploreQuizManager.initialize();
                        }
                        break;
                        
                    case 'room':
                        if (window.roomManager) {
                            window.roomManager.loadQuizSelector();
                            window.roomManager.loadMyRooms();
                        }
                        break;
                        
                    case 'my-library':
                        if (window.personalMenuManager) {
                            window.personalMenuManager.renderMyLibrary();
                        }
                        break;
                        
                    case 'recent-access':
                        if (window.personalMenuManager) {
                            window.personalMenuManager.renderRecentAccess();
                        }
                        break;
                        
                    case 'favorites':
                        if (window.personalMenuManager) {
                            window.personalMenuManager.renderFavorites();
                        }
                        break;
                        
                    case 'my-results':
                        if (window.personalMenuManager) {
                            window.personalMenuManager.renderMyResults();
                        }
                        break;
                        
                    case 'analytics':
                        if (window.adminAnalytics) {
                            window.adminAnalytics.loadAnalytics();
                        }
                        break;
                }
                
                console.log(`✅ Content loaded for: ${tabName}`);
            } catch (error) {
                console.error(`❌ Error loading content for ${tabName}:`, error);
            }
        }, 100);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabNavigation);
    } else {
        initTabNavigation();
    }
    
    // Expose function globally for debugging
    window.switchToTab = switchToTab;
    
    console.log('✅ Tab navigation fix loaded');
})();
