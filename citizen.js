/**
 * AnnaMitra (अन्नमित्र) - Citizen Portal Logic
 * Implements Profile, Grain Quotas, 3 Daytime Slots, Active Token Pass with QR & OTP,
 * Shop Stock Preview, Linked Family Members, Passbook, SOS, and Gov Queries.
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
        this.renderShopStockPreview(shop);
        this.renderActiveToken(citizen, shop);
        this.renderQuotaCard(citizen);
        this.renderSlotSection(citizen, shop);
        this.renderFamilyMembers(citizen);
        this.renderPassbook(citizen);
        this.renderQueries(citizen);
    }

    renderHeaderInfo(citizen, shop) {
        const nameEl = document.getElementById('citizen-head-name');
        const cardNoEl = document.getElementById('citizen-card-no');
        const cardCategoryEl = document.getElementById('citizen-card-category');
        const shopNameEl = document.getElementById('citizen-assigned-shop');
        const districtEl = document.getElementById('citizen-district-tag');
        const switcherEl = document.getElementById('demo-beneficiary-switcher');

        const currentLang = this.i18n ? this.i18n.currentLang : 'mr';
        let displayName = citizen.headOfFamily;
        if (currentLang === 'mr' && citizen.headOfFamilyMarathi) displayName = citizen.headOfFamilyMarathi;

        if (nameEl) nameEl.textContent = displayName;
        if (cardNoEl) cardNoEl.textContent = citizen.cardNumber;
        if (districtEl) districtEl.textContent = citizen.district || 'Pune Rural';
        if (cardCategoryEl) {
            cardCategoryEl.textContent = citizen.categoryName || (citizen.category === 'AAY' ? 'Antyodaya Anna Yojana (पिवळे कार्ड)' : 'Priority Household (केशरी कार्ड)');
            cardCategoryEl.className = `badge badge-${citizen.cardColor || 'orange'}`;
        }
        if (shopNameEl) {
            shopNameEl.textContent = `${shop.name} (${shop.id})`;
        }
        if (switcherEl && switcherEl.value !== citizen.cardNumber) {
            switcherEl.value = citizen.cardNumber;
        }
    }

    renderShopStockPreview(shop) {
        const container = document.getElementById('citizen-shop-stock-preview');
        if (!container) return;

        const availRice = shop.inventory.rice.dispatched - shop.inventory.rice.distributed;
        const availWheat = shop.inventory.wheat.dispatched - shop.inventory.wheat.distributed;
        const availSugar = shop.inventory.sugar.dispatched - shop.inventory.sugar.distributed;

        container.innerHTML = `
            <div class="shop-stock-banner" style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px 20px; box-shadow: var(--shadow-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 8px;">
                <div class="shop-banner-info">
                    <h4 style="margin: 0 0 4px 0; color: var(--primary-navy); font-size: 1.05rem;">📦 ${shop.name} (#${shop.id})</h4>
                    <p style="margin: 0; font-size: 0.875rem; color: #64748b;">Official Warehouse Dispatch Arrived: <strong>${shop.godownDeliveryDate}</strong> | Status: <strong style="color: #10b981;">🟢 In Stock</strong></p>
                </div>
                <div class="shop-stock-pills" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <span class="stock-pill" style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-size: 0.875rem; color: #334155;">🌾 Wheat: <strong>${availWheat.toLocaleString()} kg</strong></span>
                    <span class="stock-pill" style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-size: 0.875rem; color: #334155;">🧂 Sugar: <strong>${availSugar.toLocaleString()} kg</strong></span>
                    <span class="stock-pill" style="background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-size: 0.875rem; color: #334155;">🍚 Rice: <strong>${availRice.toLocaleString()} kg</strong></span>
                </div>
            </div>
        `;
    }

    renderQuotaCard(citizen) {
        const container = document.getElementById('quota-items-grid');
        if (!container) return;

        const quota = citizen.currentQuota;
        const totalAmount = quota.rice.total + quota.wheat.total + quota.sugar.total + (quota.oil ? quota.oil.total : 0);

        const isCollected = quota.status === 'COLLECTED';
        const isBooked = quota.status === 'BOOKED' || citizen.activeToken !== null;

        const statusBadge = document.getElementById('quota-status-badge');
        if (statusBadge) {
            if (isCollected) {
                statusBadge.className = 'status-pill status-success';
                statusBadge.innerHTML = '✅ वितरित (Collected)';
            } else if (isBooked) {
                statusBadge.className = 'status-pill status-booked';
                statusBadge.innerHTML = '🎫 टोकन बुक (Token Booked)';
            } else {
                statusBadge.className = 'status-pill status-available';
                statusBadge.innerHTML = '🟢 उपलब्ध (Available)';
            }
        }

        const items = [
            {
                name: 'तांदूळ (Rice)',
                icon: '🍚',
                qty: `${quota.rice.kg} kg`,
                rate: quota.rice.ratePerKg === 0 ? '₹0 (Free)' : `₹${quota.rice.ratePerKg}/kg`,
                total: `₹${quota.rice.total}`,
                color: 'grain-rice'
            },
            {
                name: 'गहू (Wheat)',
                icon: '🌾',
                qty: `${quota.wheat.kg} kg`,
                rate: quota.wheat.ratePerKg === 0 ? '₹0 (Free)' : `₹${quota.wheat.ratePerKg}/kg`,
                total: `₹${quota.wheat.total}`,
                color: 'grain-wheat'
            },
            {
                name: 'साखर (Sugar)',
                icon: '🧂',
                qty: `${quota.sugar.kg} kg`,
                rate: `₹${quota.sugar.ratePerKg}/kg`,
                total: `₹${quota.sugar.total}`,
                color: 'grain-sugar'
            }
        ];

        if (quota.oil && quota.oil.litres > 0) {
            items.push({
                name: 'खाद्यतेल (Oil)',
                icon: '🛢️',
                qty: `${quota.oil.litres} L`,
                rate: `₹${quota.oil.ratePerLitre}/L`,
                total: `₹${quota.oil.total}`,
                color: 'grain-oil'
            });
        }

        container.innerHTML = items.map(item => `
            <div class="quota-card ${item.color}">
                <div class="grain-icon-wrap">${item.icon}</div>
                <div class="grain-details">
                    <h3 class="grain-title">${item.name}</h3>
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
                        <h4>Morning Slot (10:00 AM – 12:00 PM)</h4>
                        <p class="slot-sub">10:00 AM – 12:00 PM</p>
                    </div>
                </div>
                <div class="slot-availability ${slot1Spots <= 5 ? 'spot-urgent' : 'spot-good'}">
                    <span class="pulse-dot"></span>
                    <strong>${slot1Spots}</strong> spots left
                </div>
                <button class="btn btn-success btn-block btn-slot-book" data-slot-id="slot1" style="background: #059669; border-color: #059669; font-weight: 700;">
                    Book This Token ➔
                </button>
            </div>

            <!-- Slot 2: Mid-Day 12 PM to 2 PM -->
            <div class="slot-card" data-slot="slot2">
                <div class="slot-header">
                    <span class="slot-icon">☀️</span>
                    <div class="slot-time-info">
                        <h4>Mid-Day Slot (12:00 PM – 02:00 PM)</h4>
                        <p class="slot-sub">12:00 PM – 02:00 PM</p>
                    </div>
                </div>
                <div class="slot-availability ${slot2Spots <= 5 ? 'spot-urgent' : 'spot-good'}">
                    <span class="pulse-dot"></span>
                    <strong>${slot2Spots}</strong> spots left
                </div>
                <button class="btn btn-success btn-block btn-slot-book" data-slot-id="slot2" style="background: #059669; border-color: #059669; font-weight: 700;">
                    Book This Token ➔
                </button>
            </div>

            <!-- Slot 3: Evening 4 PM to 8 PM -->
            <div class="slot-card" data-slot="slot3">
                <div class="slot-header">
                    <span class="slot-icon">🌇</span>
                    <div class="slot-time-info">
                        <h4>Evening Slot (04:00 PM – 08:00 PM)</h4>
                        <p class="slot-sub">04:00 PM – 08:00 PM</p>
                    </div>
                </div>
                <div class="slot-availability ${slot3Spots <= 5 ? 'spot-urgent' : 'spot-good'}">
                    <span class="pulse-dot"></span>
                    <strong>${slot3Spots}</strong> spots left
                </div>
                <button class="btn btn-success btn-block btn-slot-book" data-slot-id="slot3" style="background: #059669; border-color: #059669; font-weight: 700;">
                    Book This Token ➔
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
        const tokenNumValue = parseInt(token.tokenNo.replace('TK-', '')) || 29;
        const peopleAhead = Math.max(0, tokenNumValue - currentServing);
        const estimatedWaitMins = peopleAhead * 3;

        const qrSvg = this.generateTokenQRSvg(citizen.cardNumber, token.tokenNo, token.otp);

        tokenSection.innerHTML = `
            <div class="token-pass-card">
                <div class="token-pass-ribbon">
                    <span>🟢 CONFIRMED • शासकीय डिजिटल पास</span>
                </div>
                <div class="token-top-bar">
                    <div>
                        <span class="token-label">TOKEN NUMBER</span>
                        <h2 class="token-display-number">${token.tokenNo}</h2>
                    </div>
                    <div class="token-qr-wrap">
                        ${qrSvg}
                    </div>
                </div>

                <div class="token-details-grid">
                    <div class="token-info-item">
                        <span class="token-sub-label">वेळ / Slot Time</span>
                        <strong>${token.slotLabel}</strong>
                    </div>
                    <div class="token-info-item">
                        <span class="token-sub-label">दिनांक / Date</span>
                        <strong>${token.date}</strong>
                    </div>
                </div>

                <!-- 4-Digit High-Visibility Secure OTP -->
                <div class="secure-otp-container">
                    <span class="otp-heading">🔐 सुरक्षित ४-अंकी OTP (Show to Shopkeeper)</span>
                    <div class="otp-digits-box">
                        ${token.otp.split('').map(d => `<span class="otp-box-digit">${d}</span>`).join('')}
                    </div>
                    <p class="otp-warning-note">⚠️ हा OTP धान्य घेताना दुकानदारास पडताळणीसाठी सांगा.</p>
                </div>

                <!-- Live Queue Radar Tracker -->
                <div class="live-queue-radar">
                    <div class="queue-radar-header">
                        <span class="radar-live-badge">🔴 LIVE QUEUE</span>
                        <span>सध्या दुकान चालू टोकन: <strong>#${currentServing}</strong></span>
                    </div>
                    <div class="queue-wait-estimate">
                        <span>⏳ अंदाजे वेळ: <strong>~${estimatedWaitMins} मिनिटे</strong> (${peopleAhead} कुटुंबे पुढे आहेत)</span>
                    </div>
                </div>

                <div class="token-actions" style="margin-top: 12px; display: flex; justify-content: flex-end;">
                    <button class="btn btn-outline" id="btn-cancel-active-token" style="color: #dc2626; border-color: #fca5a5;">
                        टोकन रद्द करा (Cancel Token) ❌
                    </button>
                </div>
            </div>
        `;
    }

    renderFamilyMembers(citizen) {
        const container = document.getElementById('family-members-grid');
        if (!container) return;

        container.innerHTML = `
            <div class="family-members-cards-wrap" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; width: 100%;">
                ${citizen.familyMembers.map(m => `
                    <div class="family-card" style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px 16px; display: flex; align-items: center; gap: 14px; box-shadow: var(--shadow-subtle);">
                        <div class="family-avatar" style="font-size: 2.2rem; background: #f1f5f9; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">${m.photo || '👤'}</div>
                        <div class="family-details">
                            <h4 style="margin: 0 0 4px 0; font-size: 0.95rem; color: var(--primary-navy);">${m.name}</h4>
                            <p style="margin: 0 0 4px 0; font-size: 0.8rem; color: #64748b;">${m.relation} • ${m.age} yrs</p>
                            <span class="badge" style="background: #dcfce7; color: #166534; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">✅ Aadhaar Verified</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${citizen.activeToken ? `
                <div style="margin-top: 14px; text-align: right; width: 100%;">
                    <button class="btn btn-success" id="btn-scroll-to-token" style="background: #059669; border-color: #059669; font-weight: 700;">
                        🎫 Token Booked: ${citizen.activeToken.tokenNo} ➔
                    </button>
                </div>
            ` : ''}
        `;
    }

    renderPassbook(citizen) {
        const container = document.getElementById('passbook-history-list');
        if (!container) return;

        container.innerHTML = (citizen.passbook || []).map(entry => `
            <div class="passbook-card">
                <div class="passbook-card-header">
                    <div>
                        <span class="passbook-month-tag">📅 ${entry.month}</span>
                        <strong style="margin-left: 8px;">Receipt #${entry.receiptId}</strong>
                    </div>
                    <span class="passbook-date">${entry.date}</span>
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

    async renderQueries(citizen) {
        const container = document.getElementById('citizen-queries-feed');
        if (!container || !citizen) return;

        const res = await this.api.getCitizenQueries(citizen.cardNumber);
        const queries = (res && res.success) ? res.queries : [];

        if (!queries || queries.length === 0) {
            container.innerHTML = `
                <div class="empty-state-box" style="padding: 24px; text-align: center; color: var(--text-muted); background: #f8fafc; border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
                    <div style="font-size: 2rem; margin-bottom: 6px;">💬</div>
                    <p>आपण अद्याप शासनाकडे कोणताही प्रश्न विचारलेला नाही.</p>
                    <small>वरील फॉर्म भरून आपण थेट अन्न व नागरी पुरवठा अधिकाऱ्यांशी संवाद साधू शकता.</small>
                </div>
            `;
            return;
        }

        container.innerHTML = queries.map(q => {
            const isReplied = q.status === 'OFFICER_REPLIED';
            return `
                <div class="query-ticket-card ${isReplied ? 'query-replied' : 'query-pending'}">
                    <div class="query-ticket-header">
                        <div class="query-meta-left">
                            <span class="query-id-tag">#${q.id}</span>
                            <span class="query-category-tag">${q.categoryLabel || q.category}</span>
                        </div>
                        <span class="query-status-badge ${isReplied ? 'badge-replied' : 'badge-pending'}">
                            ${isReplied ? '✅ अधिकृत उत्तर प्राप्त (Officer Replied)' : '⏳ शासकीय तपासणी प्रलंबित (Pending Review)'}
                        </span>
                    </div>

                    <div class="query-question-body">
                        <h5>${q.subject}</h5>
                        <p class="query-text">${q.message}</p>
                        <span class="query-time">📅 विचारले: ${q.submittedAt}</span>
                    </div>

                    ${isReplied ? `
                        <div class="query-officer-response">
                            <div class="officer-response-header">
                                <div class="officer-seal-icon">🏛️</div>
                                <div>
                                    <strong>${q.officerName || 'District Civil Supplies Officer (DSO)'}</strong>
                                    <span class="officer-time">उत्तर दिले: ${q.repliedAt}</span>
                                </div>
                                <span class="gov-verified-stamp">✓ शासकीय अधिकृत उत्तर</span>
                            </div>
                            <div class="officer-response-content">
                                <p>${q.officerReply}</p>
                            </div>
                        </div>
                    ` : `
                        <div class="query-pending-notice">
                            <span>⏳ आपल्या प्रश्नाची दखल घेण्यात आली असून, जिल्हा पुरवठा अधिकारी लवकरच उत्तर देतील.</span>
                        </div>
                    `}
                </div>
            `;
        }).join('');
    }

    bindEvents() {
        // Beneficiary Demo Switcher Dropdown
        document.addEventListener('change', (e) => {
            if (e.target && e.target.id === 'demo-beneficiary-switcher') {
                const targetCard = e.target.value;
                if (this.store) {
                    this.store.state.session.citizenCard = targetCard;
                    this.store.saveState();
                    if (window.annasetuApp) {
                        const newCitizen = this.store.getCurrentCitizen();
                        window.annasetuApp.showToast(`Switched to ${newCitizen ? newCitizen.headOfFamily : targetCard}`, 'info');
                    }
                    this.renderAll();
                }
            }
        });

        // Scroll to Booked Token
        document.addEventListener('click', (e) => {
            if (e.target.closest('#btn-scroll-to-token, #btn-view-booked-token-badge')) {
                const tokenSection = document.getElementById('active-token-section');
                if (tokenSection) {
                    tokenSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

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
                        window.annasetuApp.showToast(`✅ Token Booked: ${result.token.tokenNo} (OTP: ${result.token.otp})`, 'success');
                    }
                    this.renderAll();
                    const tokenSection = document.getElementById('active-token-section');
                    if (tokenSection) tokenSection.scrollIntoView({ behavior: 'smooth' });
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
                            window.annasetuApp.showToast('Token cancelled successfully.', 'info');
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
                        window.annasetuApp.showToast(`🚨 SOS Grievance Dispatched #${result.complaint.id}`, 'error');
                    }
                }
            });
        }

        // Citizen Query Submission Form Submit
        const queryForm = document.getElementById('form-citizen-query');
        if (queryForm) {
            queryForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const category = document.getElementById('query-category')?.value || 'GENERAL';
                const subject = document.getElementById('query-subject')?.value || '';
                const message = document.getElementById('query-message')?.value || '';
                const submitBtn = document.getElementById('btn-submit-citizen-query');

                const citizen = this.store.getCurrentCitizen();
                if (!citizen) return;

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = '⏳ पाठवत आहे... (Submitting)';
                }

                const result = await this.api.submitCitizenQuery({
                    cardNumber: citizen.cardNumber,
                    category: category,
                    subject: subject,
                    message: message
                });

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'शासनाला प्रश्न पाठवा 🚀';
                }

                if (result.success) {
                    queryForm.reset();
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast('✅ आपला प्रश्न शासनाकडे यशस्वीरित्या नोंदवला गेला!', 'success');
                    }
                    this.renderQueries(citizen);
                } else {
                    alert(result.error || 'Failed to submit query. Please try again.');
                }
            });
        }
    }
}

window.annasetuCitizen = new CitizenPortal();
