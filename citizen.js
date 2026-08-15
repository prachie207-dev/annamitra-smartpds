/**
 * Annasetu (अन्नसेतू) - Citizen Portal Logic
 * Renders data exclusively for the authenticated citizen cardholder.
 */

class CitizenPortal {
    constructor() {
        this.store = window.annasetuStore;
        this.i18n = window.annasetuI18n;
        this.api = window.annasetuApi;
    }

    init() {
        this.renderAll();
        this.bindEvents();
    }

    renderAll() {
        const citizen = this.store.getCurrentCitizen();
        if (!citizen) return;

        const shop = this.store.getShop(citizen.assignedFPS);

        this.renderHeaderInfo(citizen, shop);
        this.renderQuotaCard(citizen);
        this.renderSlotSection(citizen, shop);
        this.renderActiveToken(citizen, shop);
        this.renderShopStockPreview(shop);
        this.renderFamilyMembers(citizen);
        this.renderPassbook(citizen);
    }

    renderHeaderInfo(citizen, shop) {
        const nameEl = document.getElementById('citizen-head-name');
        const cardNoEl = document.getElementById('citizen-card-no');
        const cardCategoryEl = document.getElementById('citizen-card-category');
        const shopNameEl = document.getElementById('citizen-assigned-shop');
        const districtEl = document.getElementById('citizen-district-tag');

        const currentLang = this.i18n.currentLang;
        let displayName = citizen.headOfFamily;
        if (currentLang === 'mr') displayName = citizen.headOfFamilyMarathi;
        if (currentLang === 'hi') displayName = citizen.headOfFamilyHindi;

        if (nameEl) nameEl.textContent = displayName;
        if (cardNoEl) cardNoEl.textContent = citizen.cardNumber;
        if (districtEl) districtEl.textContent = citizen.district || 'Maharashtra';
        if (cardCategoryEl) {
            cardCategoryEl.textContent = citizen.categoryName;
            cardCategoryEl.className = `badge badge-${citizen.cardColor}`;
        }
        if (shopNameEl) {
            shopNameEl.textContent = `${shop.name} (${shop.id})`;
        }
    }

    renderQuotaCard(citizen) {
        const container = document.getElementById('quota-items-grid');
        if (!container) return;

        const quota = citizen.currentQuota;
        const totalAmount = quota.rice.total + quota.wheat.total + quota.sugar.total + (quota.oil ? quota.oil.total : 0);

        const isCollected = quota.status === 'COLLECTED';
        const isBooked = quota.status === 'BOOKED';

        const statusBadge = document.getElementById('quota-status-badge');
        if (statusBadge) {
            if (isCollected) {
                statusBadge.className = 'status-pill status-success';
                statusBadge.innerHTML = '✅ ' + this.i18n.t('collected');
            } else if (isBooked) {
                statusBadge.className = 'status-pill status-booked';
                statusBadge.innerHTML = '🎫 ' + this.i18n.t('booked');
            } else {
                statusBadge.className = 'status-pill status-available';
                statusBadge.innerHTML = '🟢 ' + this.i18n.t('available');
            }
        }

        const items = [
            {
                nameKey: 'rice',
                icon: '🍚',
                qty: `${quota.rice.kg} ${this.i18n.t('kg')}`,
                rate: quota.rice.ratePerKg === 0 ? this.i18n.t('free') : `₹${quota.rice.ratePerKg}/${this.i18n.t('kg')}`,
                total: `₹${quota.rice.total}`,
                color: 'grain-rice'
            },
            {
                nameKey: 'wheat',
                icon: '🌾',
                qty: `${quota.wheat.kg} ${this.i18n.t('kg')}`,
                rate: quota.wheat.ratePerKg === 0 ? this.i18n.t('free') : `₹${quota.wheat.ratePerKg}/${this.i18n.t('kg')}`,
                total: `₹${quota.wheat.total}`,
                color: 'grain-wheat'
            },
            {
                nameKey: 'sugar',
                icon: '🧂',
                qty: `${quota.sugar.kg} ${this.i18n.t('kg')}`,
                rate: `₹${quota.sugar.ratePerKg}/${this.i18n.t('kg')}`,
                total: `₹${quota.sugar.total}`,
                color: 'grain-sugar'
            }
        ];

        if (quota.oil && quota.oil.litres > 0) {
            items.push({
                nameKey: 'oil',
                icon: '🛢️',
                qty: `${quota.oil.litres} ${this.i18n.t('litre')}`,
                rate: `₹${quota.oil.ratePerLitre}/${this.i18n.t('litre')}`,
                total: `₹${quota.oil.total}`,
                color: 'grain-oil'
            });
        }

        container.innerHTML = items.map(item => `
            <div class="quota-card ${item.color}">
                <div class="grain-icon-wrap">${item.icon}</div>
                <div class="grain-details">
                    <h3 class="grain-title">${this.i18n.t(item.nameKey)}</h3>
                    <div class="grain-quantity">${item.qty}</div>
                    <div class="grain-price-tag">
                        <span>${item.rate}</span>
                        <strong class="grain-subtotal">${item.total}</strong>
                    </div>
                </div>
            </div>
        `).join('');

        const totalPayableEl = document.getElementById('quota-total-amount');
        if (totalPayableEl) {
            totalPayableEl.textContent = `₹${totalAmount}`;
        }
    }

    renderSlotSection(citizen, shop) {
        const slotSection = document.getElementById('slot-booking-section');
        if (!slotSection) return;

        if (citizen.activeToken || citizen.currentQuota.status === 'COLLECTED') {
            slotSection.style.display = 'none';
            return;
        }

        slotSection.style.display = 'block';

        const slot1Spots = Math.max(0, shop.slots.slot1.max - shop.slots.slot1.booked);
        const slot2Spots = Math.max(0, shop.slots.slot2.max - shop.slots.slot2.booked);
        const slot3Spots = Math.max(0, shop.slots.slot3.max - shop.slots.slot3.booked);

        const slotGrid = document.getElementById('slots-grid');
        if (!slotGrid) return;

        slotGrid.innerHTML = `
            <!-- Slot 1: Morning 10 AM to 12 PM -->
            <div class="slot-card" data-slot="slot1">
                <div class="slot-header">
                    <span class="slot-icon">🌅</span>
                    <div class="slot-time-info">
                        <h4>${this.i18n.t('slot1Title')}</h4>
                        <p class="slot-sub">10:00 AM – 12:00 PM</p>
                    </div>
                </div>
                <div class="slot-availability ${slot1Spots <= 5 ? 'spot-urgent' : 'spot-good'}">
                    <span class="pulse-dot"></span>
                    <strong>${slot1Spots}</strong> ${this.i18n.t('spotsRemaining')}
                </div>
                <button class="btn btn-primary btn-block btn-slot-book" data-slot-id="slot1">
                    ${this.i18n.t('bookNowBtn')}
                </button>
            </div>

            <!-- Slot 2: Mid-Day 12 PM to 2 PM -->
            <div class="slot-card" data-slot="slot2">
                <div class="slot-header">
                    <span class="slot-icon">☀️</span>
                    <div class="slot-time-info">
                        <h4>${this.i18n.t('slot2Title')}</h4>
                        <p class="slot-sub">12:00 PM – 02:00 PM</p>
                    </div>
                </div>
                <div class="slot-availability ${slot2Spots <= 5 ? 'spot-urgent' : 'spot-good'}">
                    <span class="pulse-dot"></span>
                    <strong>${slot2Spots}</strong> ${this.i18n.t('spotsRemaining')}
                </div>
                <button class="btn btn-primary btn-block btn-slot-book" data-slot-id="slot2">
                    ${this.i18n.t('bookNowBtn')}
                </button>
            </div>

            <!-- Slot 3: Evening 4 PM to 8 PM -->
            <div class="slot-card" data-slot="slot3">
                <div class="slot-header">
                    <span class="slot-icon">🌇</span>
                    <div class="slot-time-info">
                        <h4>${this.i18n.t('slot3Title')}</h4>
                        <p class="slot-sub">04:00 PM – 08:00 PM</p>
                    </div>
                </div>
                <div class="slot-availability ${slot3Spots <= 5 ? 'spot-urgent' : 'spot-good'}">
                    <span class="pulse-dot"></span>
                    <strong>${slot3Spots}</strong> ${this.i18n.t('spotsRemaining')}
                </div>
                <button class="btn btn-primary btn-block btn-slot-book" data-slot-id="slot3">
                    ${this.i18n.t('bookNowBtn')}
                </button>
            </div>
        `;
    }

    renderActiveToken(citizen, shop) {
        const tokenSection = document.getElementById('active-token-section');
        if (!tokenSection) return;

        if (!citizen.activeToken) {
            tokenSection.style.display = 'none';
            return;
        }

        tokenSection.style.display = 'block';
        const token = citizen.activeToken;

        const currentServing = shop.currentServingToken || 14;
        const tokenNumValue = parseInt(token.tokenNo.replace('TK-', '')) || 25;
        const peopleAhead = Math.max(0, tokenNumValue - currentServing);
        const estimatedWaitMins = peopleAhead * 3;

        const qrSvg = this.generateTokenQRSvg(citizen.cardNumber, token.tokenNo, token.otp);

        tokenSection.innerHTML = `
            <div class="token-pass-card">
                <div class="token-pass-ribbon">
                    <span>🟢 ${this.i18n.t('confirmed')}</span>
                </div>
                <div class="token-top-bar">
                    <div>
                        <span class="token-label">${this.i18n.t('tokenNo')}</span>
                        <h2 class="token-display-number">${token.tokenNo}</h2>
                    </div>
                    <div class="token-qr-wrap">
                        ${qrSvg}
                    </div>
                </div>

                <div class="token-details-grid">
                    <div class="token-info-item">
                        <span class="token-sub-label">${this.i18n.t('assignedTime')}</span>
                        <strong>${token.slotLabel}</strong>
                    </div>
                    <div class="token-info-item">
                        <span class="token-sub-label">${this.i18n.t('validDate')}</span>
                        <strong>${token.date}</strong>
                    </div>
                </div>

                <!-- 4-Digit High-Visibility Secure OTP -->
                <div class="secure-otp-container">
                    <span class="otp-heading">🔐 ${this.i18n.t('secureOtp')}</span>
                    <div class="otp-digits-box">
                        ${token.otp.split('').map(d => `<span class="otp-box-digit">${d}</span>`).join('')}
                    </div>
                    <p class="otp-warning-note">⚠️ ${this.i18n.t('otpInstruction')}</p>
                </div>

                <!-- Live Queue Radar Tracker -->
                <div class="live-queue-radar">
                    <div class="queue-radar-header">
                        <span class="radar-live-badge">🔴 LIVE QUEUE</span>
                        <span>${this.i18n.t('currentServing')} <strong>#${currentServing}</strong></span>
                    </div>
                    <div class="queue-wait-estimate">
                        <span>⏳ ${this.i18n.t('yourTurnIn')} <strong>~${estimatedWaitMins} mins</strong> (${peopleAhead} families ahead)</span>
                    </div>
                </div>

                <div class="token-actions">
                    <button class="btn btn-danger-outline" id="btn-cancel-active-token">
                        ${this.i18n.t('cancelTokenBtn')}
                    </button>
                </div>
            </div>
        `;
    }

    renderShopStockPreview(shop) {
        const container = document.getElementById('citizen-shop-stock-preview');
        if (!container) return;

        const availRice = shop.inventory.rice.dispatched - shop.inventory.rice.distributed;
        const availWheat = shop.inventory.wheat.dispatched - shop.inventory.wheat.distributed;
        const availSugar = shop.inventory.sugar.dispatched - shop.inventory.sugar.distributed;

        container.innerHTML = `
            <div class="shop-stock-banner">
                <div class="shop-banner-info">
                    <h4>🏪 ${shop.name} (#${shop.id})</h4>
                    <p>📦 Official Warehouse Dispatch Arrived: <strong>${shop.godownDeliveryDate}</strong> | Status: <strong class="text-success">🟢 In Stock</strong></p>
                </div>
                <div class="shop-stock-pills">
                    <span class="stock-pill">🍚 Rice: <strong>${availRice.toLocaleString()} kg</strong></span>
                    <span class="stock-pill">🌾 Wheat: <strong>${availWheat.toLocaleString()} kg</strong></span>
                    <span class="stock-pill">🧂 Sugar: <strong>${availSugar.toLocaleString()} kg</strong></span>
                </div>
            </div>
        `;
    }

    renderFamilyMembers(citizen) {
        const container = document.getElementById('family-members-grid');
        if (!container) return;

        container.innerHTML = citizen.familyMembers.map(m => `
            <div class="family-card">
                <div class="family-avatar">${m.photo}</div>
                <div class="family-details">
                    <h4>${m.name}</h4>
                    <p>${m.relation} • ${m.age} yrs</p>
                    <span class="aadhaar-badge ${m.aadhaarLinked ? 'aadhaar-verified' : 'aadhaar-pending'}">
                        ${m.aadhaarLinked ? this.i18n.t('aadhaarLinked') : this.i18n.t('aadhaarPending')}
                    </span>
                </div>
            </div>
        `).join('');
    }

    renderPassbook(citizen) {
        const container = document.getElementById('passbook-history-list');
        if (!container) return;

        if (!citizen.passbook || citizen.passbook.length === 0) {
            container.innerHTML = `<div class="empty-state-card"><p>No previous passbook receipts found.</p></div>`;
            return;
        }

        container.innerHTML = citizen.passbook.map(entry => `
            <div class="passbook-item-card">
                <div class="passbook-card-header">
                    <div>
                        <span class="passbook-month">📅 ${entry.month}</span>
                        <div class="passbook-datetime">${entry.date}</div>
                    </div>
                    <div class="passbook-receipt-badge">
                        ${entry.receiptId}
                    </div>
                </div>
                <div class="passbook-items-summary">
                    ${entry.items.map(item => `
                        <div class="passbook-grain-row">
                            <span>${item.name}</span>
                            <strong>${item.qty} (${item.price})</strong>
                        </div>
                    `).join('')}
                </div>
                <div class="passbook-card-footer">
                    <span class="passbook-verified-method">🛡️ ${entry.verificationMethod}</span>
                    <span class="passbook-total-paid">Total: <strong>₹${entry.totalAmount}</strong></span>
                </div>
            </div>
        `).join('');
    }

    generateTokenQRSvg(cardNo, tokenNo, otp) {
        return `
            <svg viewBox="0 0 100 100" width="84" height="84" class="qr-svg">
                <rect width="100" height="100" fill="#ffffff" rx="6"/>
                <rect x="8" y="8" width="26" height="26" fill="#0B2545" rx="3"/>
                <rect x="13" y="13" width="16" height="16" fill="#ffffff" rx="2"/>
                <rect x="17" y="17" width="8" height="8" fill="#0B2545"/>
                
                <rect x="66" y="8" width="26" height="26" fill="#0B2545" rx="3"/>
                <rect x="71" y="13" width="16" height="16" fill="#ffffff" rx="2"/>
                <rect x="75" y="17" width="8" height="8" fill="#0B2545"/>

                <rect x="8" y="66" width="26" height="26" fill="#0B2545" rx="3"/>
                <rect x="13" y="71" width="16" height="16" fill="#ffffff" rx="2"/>
                <rect x="17" y="75" width="8" height="8" fill="#0B2545"/>

                <circle cx="42" cy="18" r="3" fill="#0B2545"/>
                <circle cx="52" cy="18" r="3" fill="#059669"/>
                <circle cx="42" cy="28" r="3" fill="#0B2545"/>
                <circle cx="52" cy="28" r="3" fill="#0B2545"/>
                <circle cx="20" cy="45" r="3" fill="#0B2545"/>
                <circle cx="30" cy="45" r="3" fill="#059669"/>
                <circle cx="45" cy="45" r="4" fill="#0B2545"/>
                <circle cx="60" cy="45" r="3" fill="#0B2545"/>
                <circle cx="75" cy="45" r="3" fill="#059669"/>
                <circle cx="85" cy="45" r="3" fill="#0B2545"/>
                <circle cx="45" cy="60" r="3" fill="#0B2545"/>
                <circle cx="60" cy="60" r="4" fill="#059669"/>
                <circle cx="75" cy="60" r="3" fill="#0B2545"/>
                <circle cx="45" cy="75" r="3" fill="#059669"/>
                <circle cx="60" cy="75" r="3" fill="#0B2545"/>
                <circle cx="75" cy="75" r="3" fill="#0B2545"/>
                <circle cx="85" cy="75" r="3" fill="#0B2545"/>
                <circle cx="85" cy="85" r="3" fill="#059669"/>
            </svg>
        `;
    }

    bindEvents() {
        // Slot Booking Buttons
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-slot-book');
            if (btn) {
                const slotId = btn.getAttribute('data-slot-id');
                const citizen = this.store.getCurrentCitizen();
                const result = await this.api.bookSlot(citizen.cardNumber, slotId);
                if (result.success) {
                    citizen.currentQuota.status = 'BOOKED';
                    citizen.activeToken = result.token;
                    this.store.saveState();
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`✅ ${this.i18n.t('booked')}: ${result.token.tokenNo}`, 'success');
                    }
                    this.renderAll();
                } else {
                    alert(result.error || 'Failed to book slot.');
                }
            }
        });

        // Cancel Token Button
        document.addEventListener('click', async (e) => {
            if (e.target.closest('#btn-cancel-active-token')) {
                if (confirm('Are you sure you want to cancel your booked slot?')) {
                    const citizen = this.store.getCurrentCitizen();
                    const result = await this.api.cancelSlot(citizen.cardNumber);
                    if (result.success) {
                        citizen.currentQuota.status = 'AVAILABLE';
                        citizen.activeToken = null;
                        this.store.saveState();
                        if (window.annasetuApp) {
                            window.annasetuApp.showToast('Token cancelled.', 'info');
                        }
                        this.renderAll();
                    }
                }
            }
        });

        // SOS Button Click (Open Modal)
        const sosBtn = document.getElementById('btn-trigger-sos');
        if (sosBtn) {
            sosBtn.addEventListener('click', () => {
                const modal = document.getElementById('sos-complaint-modal');
                if (modal) modal.classList.add('modal-active');
            });
        }

        // SOS Form Submit
        const sosForm = document.getElementById('sos-form');
        if (sosForm) {
            sosForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const reason = document.querySelector('input[name="sos-reason"]:checked')?.value || 'DENIED_RATION';
                const notes = document.getElementById('sos-notes')?.value || '';
                const citizen = this.store.getCurrentCitizen();

                const result = await this.api.fileSOS(citizen.cardNumber, reason, notes);
                if (result.success) {
                    const modal = document.getElementById('sos-complaint-modal');
                    if (modal) modal.classList.remove('modal-active');
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`🚨 ${this.i18n.t('sosModalTitle')} #${result.complaint.id}`, 'error');
                    }
                }
            });
        }
    }
}

window.annasetuCitizen = new CitizenPortal();
