// Modern Notification System - Hệ thống thông báo đẹp và nhỏ gọn
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Tạo container cho notifications
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
        
        // Thêm CSS
        this.injectStyles();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 380px;
                pointer-events: none;
            }
            
            .notification {
                background: white;
                border-radius: 12px;
                padding: 14px 18px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                pointer-events: auto;
                cursor: pointer;
                transition: all 0.3s;
                border-left: 4px solid;
                position: relative;
                overflow: hidden;
            }
            
            .notification:hover {
                transform: translateX(-5px);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
            }
            
            .notification.removing {
                animation: slideOutRight 0.3s ease-in forwards;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(120%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                to {
                    transform: translateX(120%);
                    opacity: 0;
                }
            }
            
            .notification.success {
                border-left-color: #10b981;
            }
            
            .notification.error {
                border-left-color: #ef4444;
            }
            
            .notification.warning {
                border-left-color: #f59e0b;
            }
            
            .notification.info {
                border-left-color: #3b82f6;
            }
            
            .notification-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
            }
            
            .notification.success .notification-icon {
                background: #d1fae5;
                color: #10b981;
            }
            
            .notification.error .notification-icon {
                background: #fee2e2;
                color: #ef4444;
            }
            
            .notification.warning .notification-icon {
                background: #fef3c7;
                color: #f59e0b;
            }
            
            .notification.info .notification-icon {
                background: #dbeafe;
                color: #3b82f6;
            }
            
            .notification-content {
                flex: 1;
                min-width: 0;
            }
            
            .notification-title {
                font-weight: 600;
                font-size: 14px;
                color: #1f2937;
                margin: 0 0 2px 0;
                line-height: 1.3;
            }
            
            .notification-message {
                font-size: 13px;
                color: #6b7280;
                margin: 0;
                line-height: 1.4;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: all 0.2s;
                flex-shrink: 0;
                width: 24px;
                height: 24px;
            }
            
            .notification-close:hover {
                background: #f3f4f6;
                color: #4b5563;
            }
            
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                opacity: 0.3;
                animation: progressBar linear;
            }
            
            @keyframes progressBar {
                from {
                    width: 100%;
                }
                to {
                    width: 0%;
                }
            }
            
            /* Dark mode support */
            [data-theme="dark"] .notification {
                background: #1f2937;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            }
            
            [data-theme="dark"] .notification-title {
                color: #f9fafb;
            }
            
            [data-theme="dark"] .notification-message {
                color: #d1d5db;
            }
            
            [data-theme="dark"] .notification-close:hover {
                background: #374151;
                color: #e5e7eb;
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .notification-container {
                    top: 70px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
                
                .notification {
                    padding: 12px 14px;
                }
                
                .notification-icon {
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                }
                
                .notification-title {
                    font-size: 13px;
                }
                
                .notification-message {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    show(options) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 4000,
            closable = true
        } = options;

        // Tạo notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Icon theo type
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="notification-content">
                ${title ? `<div class="notification-title">${title}</div>` : ''}
                ${message ? `<div class="notification-message">${message}</div>` : ''}
            </div>
            ${closable ? '<button class="notification-close"><i class="fas fa-times"></i></button>' : ''}
            ${duration > 0 ? `<div class="notification-progress" style="animation-duration: ${duration}ms;"></div>` : ''}
        `;

        
        // Thêm vào container
        this.container.appendChild(notification);
        
        // Xử lý đóng notification
        const closeNotification = () => {
            notification.classList.add('removing');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        // Click để đóng
        if (closable) {
            const closeBtn = notification.querySelector('.notification-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeNotification();
                });
            }
        }
        
        // Click vào notification để đóng
        notification.addEventListener('click', closeNotification);
        
        // Tự động đóng sau duration
        if (duration > 0) {
            setTimeout(closeNotification, duration);
        }
        
        return notification;
    }

    success(title, message, duration) {
        return this.show({ type: 'success', title, message, duration });
    }

    error(title, message, duration) {
        return this.show({ type: 'error', title, message, duration });
    }

    warning(title, message, duration) {
        return this.show({ type: 'warning', title, message, duration });
    }

    info(title, message, duration) {
        return this.show({ type: 'info', title, message, duration });
    }
}

// Khởi tạo hệ thống thông báo global
window.notify = new NotificationSystem();

// Tạo các hàm shortcut global
window.showNotification = (title, message, type = 'info', duration = 4000) => {
    return window.notify.show({ type, title, message, duration });
};

window.showSuccess = (title, message, duration = 3000) => {
    return window.notify.success(title, message, duration);
};

window.showError = (title, message, duration = 5000) => {
    return window.notify.error(title, message, duration);
};

window.showWarning = (title, message, duration = 4000) => {
    return window.notify.warning(title, message, duration);
};

window.showInfo = (title, message, duration = 4000) => {
    return window.notify.info(title, message, duration);
};

console.log('✅ Notification System loaded');
