/**
 * AnnaMitra (अन्नमित्र) - Master Application Controller
 * Orchestrates views, language, authentication, and toasts.
 */

class AnnasetuApp {
    constructor() {
        this.store = window.annasetuStore;
        this.i18n = window.annasetuI18n;
    }

    init() {
        try { this.initLanguage(); } catch (e) { console.error('Language init error:', e); }
        try { this.initLiveClock(); } catch (e) { console.error('Clock init error:', e); }

        // Initialize Authentication and Navigation FIRST
        if (window.annasetuAuth) {
            try { window.annasetuAuth.init(); } catch (e) { console.error('Auth init error:', e); }
        }

        // Initialize child managers safely
        if (window.annasetuCitizen) {
            try { window.annasetuCitizen.init(); } catch (e) { console.error('Citizen init error:', e); }
        }
        if (window.annasetuShopkeeper) {
            try { window.annasetuShopkeeper.init(); } catch (e) { console.error('Shopkeeper init error:', e); }
        }
        if (window.annasetuAdmin) {
            try { window.annasetuAdmin.init(); } catch (e) { console.error('Admin init error:', e); }
        }
        
        console.log('🌾 AnnaMitra SmartPDS Master App Ready.');
    }

    initLanguage() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (btn) {
                const lang = btn.getAttribute('data-lang');
                if (lang && this.i18n) {
                    this.i18n.setLanguage(lang);
                }
            }
        });
        if (this.i18n) this.i18n.updateDOM();
    }

    initLiveClock() {
        const clockEl = document.getElementById('header-live-clock');
        if (!clockEl) return;

        const updateTime = () => {
            const now = new Date();
            clockEl.textContent = now.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }) + ' • ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    showToast(message, type = 'info') {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type} toast-slide-in`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    window.annasetuApp = new AnnasetuApp();
    window.annasetuApp.init();
});
