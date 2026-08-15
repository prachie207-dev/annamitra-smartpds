/**
 * AnnaMitra (अन्नमित्र) - Authentication & Route Manager
 * Supports Password, Biometric WebAuthn, Mobile SMS OTP,
 * Session Home Navigation without Logout, and Direct Government Command Center.
 */

class AuthManager {
    constructor() {
        this.store = window.annasetuStore;
        this.i18n = window.annasetuI18n;
        this.api = window.annasetuApi;
        this.lastOtpTarget = '';
    }

    init() {
        this.bindAuthEvents();
        this.restoreSession();
    }

    restoreSession() {
        if (!this.store || !this.store.state) {
            this.showView('view-homepage');
            return;
        }
        const session = this.store.state.session;
        if (session && session.isLoggedIn && session.role) {
            this.showPortal(session.role);
        } else {
            this.showView('view-homepage');
        }
    }

    showView(viewId) {
        document.querySelectorAll('.app-view-container').forEach(view => {
            if (view.id === viewId) {
                view.classList.add('view-active');
            } else {
                view.classList.remove('view-active');
            }
        });

        const loggedInBar = document.getElementById('logged-in-user-bar');
        if (loggedInBar) {
            const session = this.store && this.store.state ? this.store.state.session : null;
            if (viewId.startsWith('portal-')) {
                loggedInBar.style.display = 'flex';
            } else if (session && session.isLoggedIn && session.role !== 'admin') {
                loggedInBar.style.display = 'flex';
            } else {
                loggedInBar.style.display = 'none';
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showPortal(role) {
        this.showView(`portal-${role}`);

        const userBarName = document.getElementById('logged-in-user-name');
        const userBarRole = document.getElementById('logged-in-user-role');
        const logoutBtn = document.getElementById('btn-global-logout');

        if (role === 'citizen') {
            const citizen = this.store ? this.store.getCurrentCitizen() : null;
            if (citizen) {
                if (userBarName) userBarName.textContent = citizen.headOfFamily;
                if (userBarRole) userBarRole.textContent = `Ration Card: ${citizen.cardNumber}`;
            }
            if (logoutBtn) logoutBtn.style.display = 'inline-flex';
            if (window.annasetuCitizen && typeof window.annasetuCitizen.renderAll === 'function') {
                window.annasetuCitizen.renderAll();
            }
        } else if (role === 'shopkeeper') {
            const shop = this.store ? this.store.getCurrentShop() : null;
            if (shop) {
                if (userBarName) userBarName.textContent = `${shop.dealerName} (${shop.name})`;
                if (userBarRole) userBarRole.textContent = `FPS ID: #${shop.id}`;
            }
            if (logoutBtn) logoutBtn.style.display = 'inline-flex';
            if (window.annasetuShopkeeper && typeof window.annasetuShopkeeper.renderAll === 'function') {
                window.annasetuShopkeeper.renderAll();
            }
        } else if (role === 'admin') {
            if (userBarName) userBarName.textContent = 'District Civil Supplies Officer (DSO)';
            if (userBarRole) userBarRole.textContent = 'Government of Maharashtra Command Desk';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (window.annasetuAdmin && typeof window.annasetuAdmin.renderAll === 'function') {
                window.annasetuAdmin.renderAll();
            }
        }

        if (this.i18n && typeof this.i18n.updateDOM === 'function') {
            this.i18n.updateDOM();
        }
    }

    bindAuthEvents() {
        // Universal Document-Level Click Delegation for 100% Mobile & Desktop Reliability
        document.addEventListener('click', (e) => {
            // 1. Homepage Role Selector Cards
            const roleCard = e.target.closest('.home-role-card');
            if (roleCard) {
                const targetRole = roleCard.getAttribute('data-target-role');
                if (targetRole === 'admin') {
                    // Direct 1-Click Access to Government Command Desk (No login wall)
                    if (this.store) {
                        this.store.state.session = {
                            isLoggedIn: true,
                            role: 'admin',
                            adminId: 'DSO-MAHARASHTRA'
                        };
                        this.store.saveState();
                    }
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast('🏛️ Government Command Center Active.', 'info');
                    }
                    this.showPortal('admin');
                } else if (targetRole) {
                    const session = this.store && this.store.state ? this.store.state.session : null;
                    if (session && session.isLoggedIn && session.role === targetRole) {
                        this.showPortal(targetRole);
                    } else {
                        this.showView(`view-login-${targetRole}`);
                    }
                }
                return;
            }

            // 2. Back to Homepage Buttons (Without Logging Out)
            const backBtn = e.target.closest('.btn-back-home, .btn-portal-back-home, #btn-session-home');
            if (backBtn) {
                this.showView('view-homepage');
                return;
            }

            // 3. Global Logout Button (Only for Citizen and Shopkeeper)
            const logoutBtn = e.target.closest('#btn-global-logout');
            if (logoutBtn) {
                if (this.store) this.store.logout();
                this.showView('view-homepage');
                if (window.annasetuApp) {
                    window.annasetuApp.showToast('Logged out successfully.', 'info');
                }
                return;
            }

            // 4. Password Show/Hide Toggle Eyes
            const eye = e.target.closest('.password-toggle-eye');
            if (eye) {
                const inputId = eye.getAttribute('data-for');
                const input = document.getElementById(inputId);
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        eye.textContent = '🙈';
                    } else {
                        input.type = 'password';
                        eye.textContent = '👁️';
                    }
                }
                return;
            }

            // 5. Citizen Login Method Switcher Tabs
            const tabPin = e.target.closest('#tab-auth-pin');
            const tabFingerprint = e.target.closest('#tab-auth-fingerprint');
            const tabSmsOtp = e.target.closest('#tab-auth-sms');
            const linkForgotPass = e.target.closest('#link-forgot-password');

            if (tabPin || tabFingerprint || tabSmsOtp || linkForgotPass) {
                const pinTab = document.getElementById('tab-auth-pin');
                const fingerTab = document.getElementById('tab-auth-fingerprint');
                const smsTab = document.getElementById('tab-auth-sms');

                const methodPinWrap = document.getElementById('auth-method-pin-wrap');
                const methodFingerprintWrap = document.getElementById('auth-method-fingerprint-wrap');
                const methodSmsWrap = document.getElementById('auth-method-sms-wrap');

                const setTab = (activeTab, activeWrap) => {
                    [pinTab, fingerTab, smsTab].forEach(t => t && t.classList.remove('active'));
                    [methodPinWrap, methodFingerprintWrap, methodSmsWrap].forEach(w => w && (w.style.display = 'none'));
                    if (activeTab) activeTab.classList.add('active');
                    if (activeWrap) activeWrap.style.display = 'block';
                };

                if (tabPin) setTab(pinTab, methodPinWrap);
                if (tabFingerprint) setTab(fingerTab, methodFingerprintWrap);
                if (tabSmsOtp || linkForgotPass) setTab(smsTab, methodSmsWrap);
                return;
            }

            // 6. Biometric Sensor Touch Scanner
            const bioTrigger = e.target.closest('#btn-biometric-scan-sensor, #biometric-scanner-pad');
            if (bioTrigger) {
                this.handleBiometricAuth();
                return;
            }

            // 7. Send SMS OTP Button
            const btnSendSmsOtp = e.target.closest('#btn-send-sms-otp');
            if (btnSendSmsOtp) {
                this.handleSendSmsOtp(btnSendSmsOtp);
                return;
            }
        });

        // Form Submit Handlers
        const formSmsVerify = document.getElementById('form-citizen-sms-login');
        if (formSmsVerify) {
            formSmsVerify.addEventListener('submit', (e) => this.handleSmsLogin(e));
        }

        const citizenForm = document.getElementById('form-citizen-login');
        if (citizenForm) {
            citizenForm.addEventListener('submit', (e) => this.handleCitizenPasswordLogin(e));
        }

        const shopForm = document.getElementById('form-shopkeeper-login');
        if (shopForm) {
            shopForm.addEventListener('submit', (e) => this.handleShopkeeperLogin(e));
        }
    }

    async handleBiometricAuth() {
        const statusLabel = document.getElementById('biometric-status-label');
        const bioSensorPad = document.getElementById('biometric-scanner-pad');
        const cardInput = document.getElementById('login-citizen-card-bio');
        const targetCard = cardInput && cardInput.value.trim() ? cardInput.value.trim().toUpperCase() : 'MH-PDS-2026-0001';

        if (bioSensorPad) bioSensorPad.classList.add('scanning');
        if (statusLabel) statusLabel.innerHTML = '🔄 <span style="color:#0284c7;">Aadhaar Biometric e-KYC Scanning...</span>';

        if (window.PublicKeyCredential) {
            try {
                const challenge = new Uint8Array(32);
                window.crypto.getRandomValues(challenge);
                await navigator.credentials.create({
                    publicKey: {
                        challenge: challenge,
                        rp: { name: "AnnaMitra SmartPDS", id: window.location.hostname || "localhost" },
                        user: { id: Uint8Array.from(targetCard, c => c.charCodeAt(0)), name: targetCard, displayName: targetCard },
                        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                        authenticatorSelection: { authenticatorAttachment: "platform" },
                        timeout: 20000
                    }
                }).catch(e => console.log('Hardware prompt note:', e.name));
            } catch (e) {
                console.log('Biometric note:', e);
            }
        }

        setTimeout(async () => {
            const result = await this.api.loginCitizenBiometric(targetCard);
            if (bioSensorPad) bioSensorPad.classList.remove('scanning');

            if (result.success) {
                if (statusLabel) statusLabel.innerHTML = '✅ <span style="color:#059669;">Aadhaar Biometric Verified! Logging in...</span>';
                if (this.store) {
                    this.store.state.session = {
                        isLoggedIn: true,
                        role: 'citizen',
                        citizenCard: result.user.cardNumber
                    };
                    this.store.saveState();
                }

                if (window.annasetuApp) {
                    window.annasetuApp.showToast(`👆 Biometric Verified: Welcome ${result.user.headOfFamily}!`, 'success');
                }

                setTimeout(() => {
                    this.showPortal('citizen');
                }, 400);
            } else {
                if (statusLabel) statusLabel.innerHTML = '❌ <span style="color:#dc2626;">Biometric Mismatch. Try again.</span>';
                alert(result.error || 'Biometric verification failed.');
            }
        }, 600);
    }

    async handleSendSmsOtp(btn) {
        const input = document.getElementById('login-citizen-mobile-card');
        const val = input ? input.value.trim() : 'MH-PDS-2026-0001';
        if (!val) {
            alert('Please enter your Ration Card Number or Registered 10-Digit Mobile Number.');
            return;
        }

        btn.disabled = true;
        btn.textContent = '⏳ Sending SMS...';

        const res = await this.api.sendCitizenOtp(val);
        btn.disabled = false;
        btn.textContent = '📲 Resend OTP';

        if (res.success) {
            this.lastOtpTarget = res.cardNumber;
            const wrap = document.getElementById('sms-otp-input-box-wrap');
            if (wrap) wrap.style.display = 'block';

            this.showSimulatedSmsAlert(res.mobile || 'Registered Phone', res.otp);

            const otpInputField = document.getElementById('login-citizen-sms-otp');
            if (otpInputField) {
                otpInputField.value = res.otp;
            }

            if (window.annasetuApp) {
                window.annasetuApp.showToast(`📩 OTP sent to ${res.maskedMobile}`, 'info');
            }
        } else {
            alert(res.error || 'Failed to send OTP. Please check Ration Card / Mobile number.');
        }
    }

    async handleSmsLogin(e) {
        e.preventDefault();
        const inputCard = document.getElementById('login-citizen-mobile-card');
        const inputOtp = document.getElementById('login-citizen-sms-otp');

        const identifier = (inputCard && inputCard.value.trim()) || this.lastOtpTarget;
        const otp = inputOtp ? inputOtp.value.trim() : '';

        if (!otp || otp.length !== 6) {
            alert('Please enter the 6-digit OTP received via SMS.');
            return;
        }

        const res = await this.api.verifyCitizenOtp(identifier, otp);
        if (res.success) {
            if (this.store) {
                this.store.state.session = {
                    isLoggedIn: true,
                    role: 'citizen',
                    citizenCard: res.user.cardNumber
                };
                this.store.saveState();
            }

            if (window.annasetuApp) {
                window.annasetuApp.showToast(`✅ Phone Verified: Welcome ${res.user.headOfFamily}!`, 'success');
            }
            this.showPortal('citizen');
        } else {
            alert(res.error || 'Invalid OTP. Please try again.');
        }
    }

    async handleCitizenPasswordLogin(e) {
        e.preventDefault();
        const cardInput = document.getElementById('login-citizen-card');
        const pinInput = document.getElementById('login-citizen-pin');

        const cardNo = cardInput ? cardInput.value.trim().toUpperCase() : '';
        const pin = pinInput ? pinInput.value.trim() : '';

        if (!cardNo) {
            alert('Please enter your Ration Card Number or Registered Mobile Number.');
            return;
        }

        const result = await this.api.loginCitizen(cardNo, pin);
        if (result.success) {
            if (result.role === 'shopkeeper') {
                if (this.store) {
                    this.store.state.session = {
                        isLoggedIn: true,
                        role: 'shopkeeper',
                        shopId: result.shop.id
                    };
                    this.store.saveState();
                }
                if (window.annasetuApp) {
                    window.annasetuApp.showToast(`🏪 Shopkeeper Login: Welcome ${result.shop.dealerName}!`, 'success');
                }
                this.showPortal('shopkeeper');
            } else {
                if (this.store) {
                    this.store.state.session = {
                        isLoggedIn: true,
                        role: 'citizen',
                        citizenCard: result.user.cardNumber
                    };
                    this.store.saveState();
                }

                if (window.annasetuApp) {
                    window.annasetuApp.showToast(`Welcome ${result.user.headOfFamily}!`, 'success');
                }
                this.showPortal('citizen');
            }
        } else {
            alert(result.error || 'Invalid Ration Card Number or Password. (Default PIN: 1234)');
        }
    }

    async handleShopkeeperLogin(e) {
        e.preventDefault();
        const fpsIdInput = document.getElementById('login-fps-id');
        const passInput = document.getElementById('login-fps-password');

        const fpsId = fpsIdInput ? fpsIdInput.value.trim().toUpperCase() : '';
        const pass = passInput ? passInput.value.trim() : '';

        const result = await this.api.loginShopkeeper(fpsId, pass);
        if (result.success) {
            if (this.store) {
                this.store.state.session = {
                    isLoggedIn: true,
                    role: 'shopkeeper',
                    shopId: result.shop.id
                };
                this.store.saveState();
            }

            if (window.annasetuApp) {
                window.annasetuApp.showToast(`Welcome ${result.shop.dealerName}!`, 'success');
            }
            this.showPortal('shopkeeper');
        } else {
            alert(result.error || 'Invalid Fair Price Shop ID or Password. (Default: 1234 / admin)');
        }
    }

    showSimulatedSmsAlert(phone, otp) {
        let smsBanner = document.getElementById('live-sms-gateway-banner');
        if (!smsBanner) {
            smsBanner = document.createElement('div');
            smsBanner.id = 'live-sms-gateway-banner';
            smsBanner.className = 'live-sms-gateway-banner';
            document.body.appendChild(smsBanner);
        }

        smsBanner.innerHTML = `
            <div class="sms-push-card">
                <div class="sms-push-header">
                    <span>💬 MESSAGES • <strong>VM-MHPDS</strong></span>
                    <span class="sms-time-tag">Now</span>
                </div>
                <div class="sms-push-body">
                    <p>Your AnnaMitra (अन्नमित्र) security OTP is: <strong class="sms-otp-highlight">${otp}</strong>. Valid for 10 mins. Use this OTP to login to your SmartPDS account. - Govt of Maharashtra</p>
                </div>
            </div>
        `;

        smsBanner.style.display = 'block';
        smsBanner.classList.add('sms-slide-down');

        setTimeout(() => {
            smsBanner.classList.remove('sms-slide-down');
        }, 8000);
    }
}

window.annasetuAuth = new AuthManager();
