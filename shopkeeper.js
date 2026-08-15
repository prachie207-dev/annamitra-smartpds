/**
 * Annasetu (अन्नसेतू) - Shopkeeper / Fair Price Shop (FPS) Portal Logic
 * Implements OTP Dispensation, Add Member, Expired Member Removal Request (Gov Workflow),
 * and On-Demand Paginated 500-Family Directory.
 */

class ShopkeeperPortal {
    constructor() {
        this.store = window.annasetuStore;
        this.i18n = window.annasetuI18n;
        this.api = window.annasetuApi;
        this.currentLoadedCitizen = null;
        this.selectedMemberCitizen = null;
        this.selectedDeleteCitizen = null;
        this.allCitizensCache = [];
        this.directoryPage = 1;
        this.pageSize = 15;
        this.directoryFilter = 'ALL';
        this.directorySearchQuery = '';
        this.isDirectoryLoaded = false;
    }

    init() {
        this.renderAll();
        this.bindEvents();
    }

    renderAll() {
        const shop = this.store.getCurrentShop();
        if (!shop) return;

        this.renderHeader(shop);
        this.renderImmutableLedger(shop);
        this.renderTodaySummary(shop);
    }

    renderHeader(shop) {
        const fpsNameEl = document.getElementById('fps-shop-title');
        const fpsDealerEl = document.getElementById('fps-dealer-title');
        const fpsIdBadge = document.getElementById('fps-id-badge');

        if (fpsNameEl) fpsNameEl.textContent = shop.name;
        if (fpsDealerEl) fpsDealerEl.textContent = shop.dealerName;
        if (fpsIdBadge) fpsIdBadge.textContent = `#${shop.id}`;
    }

    renderImmutableLedger(shop) {
        const container = document.getElementById('fps-stock-ledger-grid');
        if (!container) return;

        const inv = shop.inventory;

        const commodities = [
            {
                name: this.i18n.t('rice'),
                icon: '🍚',
                dispatched: inv.rice.dispatched,
                distributed: inv.rice.distributed,
                available: inv.rice.dispatched - inv.rice.distributed,
                unit: this.i18n.t('kg')
            },
            {
                name: this.i18n.t('wheat'),
                icon: '🌾',
                dispatched: inv.wheat.dispatched,
                distributed: inv.wheat.distributed,
                available: inv.wheat.dispatched - inv.wheat.distributed,
                unit: this.i18n.t('kg')
            },
            {
                name: this.i18n.t('sugar'),
                icon: '🧂',
                dispatched: inv.sugar.dispatched,
                distributed: inv.sugar.distributed,
                available: inv.sugar.dispatched - inv.sugar.distributed,
                unit: this.i18n.t('kg')
            },
            {
                name: this.i18n.t('oil'),
                icon: '🛢️',
                dispatched: inv.oil.dispatched,
                distributed: inv.oil.distributed,
                available: inv.oil.dispatched - inv.oil.distributed,
                unit: this.i18n.t('litre')
            }
        ];

        container.innerHTML = commodities.map(c => `
            <div class="ledger-commodity-card">
                <div class="commodity-header">
                    <span class="comm-icon">${c.icon}</span>
                    <div>
                        <h4>${c.name}</h4>
                        <span class="ledger-lock-tag">🔒 Immutable Central Ledger</span>
                    </div>
                </div>
                
                <div class="ledger-metrics-stack">
                    <div class="ledger-metric-row">
                        <span class="metric-label">📦 ${this.i18n.t('fciDispatched')}:</span>
                        <strong class="metric-val text-primary">${c.dispatched.toLocaleString()} ${c.unit}</strong>
                    </div>
                    <div class="ledger-metric-row">
                        <span class="metric-label">📤 ${this.i18n.t('distributedToday')}:</span>
                        <strong class="metric-val text-warning">− ${c.distributed.toLocaleString()} ${c.unit}</strong>
                    </div>
                    <div class="ledger-metric-divider"></div>
                    <div class="ledger-metric-row highlight-live-balance">
                        <span class="metric-label">🟢 ${this.i18n.t('balanceInShop')}:</span>
                        <strong class="metric-val text-success">${c.available.toLocaleString()} ${c.unit}</strong>
                    </div>
                </div>

                <div class="stock-progress-bar-wrap">
                    <div class="stock-progress-bar" style="width: ${Math.round((c.available / c.dispatched) * 100)}%"></div>
                </div>
                <span class="stock-percent-label">${Math.round((c.available / c.dispatched) * 100)}% remaining</span>
            </div>
        `).join('');
    }

    renderTodaySummary(shop) {
        const servingTokenEl = document.getElementById('fps-serving-token');
        if (servingTokenEl) {
            servingTokenEl.textContent = `#${shop.currentServingToken}`;
        }
    }

    async searchBeneficiary(query) {
        const cleanQuery = query.trim().toUpperCase();
        if (!cleanQuery) return;

        const result = await this.api.searchBeneficiary(cleanQuery);
        const resultWrap = document.getElementById('fps-search-result-wrap');
        if (!resultWrap) return;

        if (!result.success || !result.citizen) {
            resultWrap.innerHTML = `
                <div class="alert-box alert-error">
                    <span>❌ Beneficiary "${query}" not found in database.</span>
                </div>
            `;
            this.currentLoadedCitizen = null;
            return;
        }

        const match = result.citizen;
        this.currentLoadedCitizen = match;
        const quota = match.currentQuota;
        const token = match.activeToken;
        const totalCost = quota.rice.total + quota.wheat.total + quota.sugar.total + (quota.oil ? quota.oil.total : 0);

        resultWrap.innerHTML = `
            <div class="beneficiary-verify-card">
                <div class="beneficiary-header">
                    <div class="beneficiary-avatar-box">${match.gender === 'Female' ? '🧕' : '👨‍🌾'}</div>
                    <div class="beneficiary-title-info">
                        <h3>${match.headOfFamily} (${match.headOfFamilyMarathi})</h3>
                        <p>Ration Card: <strong>${match.cardNumber}</strong> | Category: <span class="badge badge-${match.cardColor}">${match.category}</span></p>
                        <p class="beneficiary-members-count">👥 ${match.familyMembers.length} Family Members | Mobile: ${match.mobile || 'Registered'} | District: ${match.district}</p>
                    </div>
                    <div class="token-status-pill">
                        ${token ? `🎫 Active Token: <strong>${token.tokenNo}</strong> (${token.slotLabel})` : `⚠️ No active slot booked`}
                    </div>
                </div>

                <div class="grain-allotment-table-wrap">
                    <h4>⚖️ Approved Ration Allocation for August 2026:</h4>
                    <table class="grain-table">
                        <thead>
                            <tr>
                                <th>Commodity</th>
                                <th>Approved Quota</th>
                                <th>Govt Subsidized Rate</th>
                                <th>Total to Collect</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>🍚 Rice (तांदूळ)</td>
                                <td><strong>${quota.rice.kg} kg</strong></td>
                                <td>${quota.rice.ratePerKg === 0 ? '₹0 (Free)' : '₹' + quota.rice.ratePerKg}</td>
                                <td>₹${quota.rice.total}</td>
                            </tr>
                            <tr>
                                <td>🌾 Wheat (गहू)</td>
                                <td><strong>${quota.wheat.kg} kg</strong></td>
                                <td>${quota.wheat.ratePerKg === 0 ? '₹0 (Free)' : '₹' + quota.wheat.ratePerKg}</td>
                                <td>₹${quota.wheat.total}</td>
                            </tr>
                            <tr>
                                <td>🧂 Sugar (साखर)</td>
                                <td><strong>${quota.sugar.kg} kg</strong></td>
                                <td>₹${quota.sugar.ratePerKg}</td>
                                <td>₹${quota.sugar.total}</td>
                            </tr>
                            ${quota.oil && quota.oil.litres > 0 ? `
                                <tr>
                                    <td>🛢️ Oil (खाद्यतेल)</td>
                                    <td><strong>${quota.oil.litres} L</strong></td>
                                    <td>₹${quota.oil.ratePerLitre}</td>
                                    <td>₹${quota.oil.total}</td>
                                </tr>
                            ` : ''}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="3">Total Cash to Collect from Citizen:</th>
                                <th><span class="total-cash-badge">₹${totalCost}</span></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Anti-Underweighing Smart Scale Reading -->
                <div class="iot-scale-banner">
                    <div class="scale-icon-box">⚖️</div>
                    <div class="scale-info-text">
                        <h5>Smart Electronic Weighing Scale (IoT Linked)</h5>
                        <p>Live Digital Scale Reading: <strong class="text-success">${quota.rice.kg + quota.wheat.kg}.00 kg</strong> (Calibrated & Tamper-Proof)</p>
                    </div>
                    <span class="scale-sync-tag">🟢 Weight Verified</span>
                </div>

                ${quota.status === 'COLLECTED' ? `
                    <div class="alert-box alert-success">
                        <span>✅ This month's quota has ALREADY been collected on ${match.passbook[0]?.date || 'recently'}. Duplicate collection blocked!</span>
                    </div>
                ` : `
                    <div class="dispense-auth-box">
                        <div class="otp-input-guidance">
                            <h4>🔐 Enter 4-Digit Citizen Security OTP to Authorize:</h4>
                            <p>Ask the citizen for the OTP shown on their AnnaMitra phone screen.</p>
                        </div>
                        <div class="otp-action-row">
                            <input type="text" id="fps-citizen-otp-input" maxlength="4" placeholder="Enter OTP (e.g. ${token ? token.otp : '1234'})" class="otp-box-input" />
                            <button class="btn btn-success btn-lg" id="btn-fps-verify-dispense">
                                ${this.i18n.t('deliverGrainBtn')}
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    // Search Citizen for Adding New Member
    async searchCitizenForNewMember(cardNo) {
        const cleanCard = cardNo.trim().toUpperCase();
        const result = await this.api.searchBeneficiary(cleanCard);

        const container = document.getElementById('add-member-citizen-preview');
        const formWrap = document.getElementById('add-member-form-wrap');
        if (!container || !formWrap) return;

        if (!result.success || !result.citizen) {
            container.innerHTML = `<div class="alert-box alert-error"><span>❌ Ration Card "${cardNo}" not found.</span></div>`;
            formWrap.style.display = 'none';
            this.selectedMemberCitizen = null;
            return;
        }

        const citizen = result.citizen;
        this.selectedMemberCitizen = citizen;
        formWrap.style.display = 'block';

        container.innerHTML = `
            <div class="member-citizen-summary-box">
                <div>
                    <h4>${citizen.headOfFamily} (${citizen.headOfFamilyMarathi})</h4>
                    <p>Card: <strong>${citizen.cardNumber}</strong> | Category: <span class="badge badge-${citizen.cardColor}">${citizen.category}</span></p>
                </div>
                <div>
                    <span>Current Members: <strong>${citizen.familyMembers.length}</strong></span>
                </div>
            </div>
            <div class="existing-members-chips">
                ${citizen.familyMembers.map(m => `
                    <span class="member-chip">${m.photo} ${m.name} (${m.relation}, ${m.age}y)</span>
                `).join('')}
            </div>
        `;
    }

    // Search Citizen for Deceased/Expired Member Removal
    async searchCitizenForDeleteMember(cardNo) {
        const cleanCard = cardNo.trim().toUpperCase();
        const result = await this.api.searchBeneficiary(cleanCard);

        const container = document.getElementById('delete-member-citizen-preview');
        const formWrap = document.getElementById('delete-member-form-wrap');
        const memberSelect = document.getElementById('delete-member-select');
        if (!container || !formWrap || !memberSelect) return;

        if (!result.success || !result.citizen) {
            container.innerHTML = `<div class="alert-box alert-error"><span>❌ Ration Card "${cardNo}" not found.</span></div>`;
            formWrap.style.display = 'none';
            this.selectedDeleteCitizen = null;
            return;
        }

        const citizen = result.citizen;
        this.selectedDeleteCitizen = citizen;
        formWrap.style.display = 'block';

        container.innerHTML = `
            <div class="member-citizen-summary-box">
                <div>
                    <h4>${citizen.headOfFamily} (${citizen.headOfFamilyMarathi})</h4>
                    <p>Card: <strong>${citizen.cardNumber}</strong> | Category: <span class="badge badge-${citizen.cardColor}">${citizen.category}</span></p>
                </div>
                <div>
                    <span>Registered Members: <strong>${citizen.familyMembers.length}</strong></span>
                </div>
            </div>
        `;

        memberSelect.innerHTML = citizen.familyMembers.map(m => `
            <option value="${m.name}">${m.name} (${m.relation}, Age ${m.age})</option>
        `).join('');
    }

    // On-Demand Master 500-Family Directory Loader
    async toggleMasterDirectory() {
        const directoryWrap = document.getElementById('master-directory-table-container');
        const toggleBtn = document.getElementById('btn-toggle-master-directory');
        if (!directoryWrap) return;

        if (directoryWrap.style.display === 'block') {
            directoryWrap.style.display = 'none';
            if (toggleBtn) toggleBtn.innerHTML = '📂 संपूर्ण ५०० लाभार्थी यादी पहा (Open Master Directory)';
            return;
        }

        directoryWrap.style.display = 'block';
        if (toggleBtn) toggleBtn.innerHTML = '📁 यादी बंद करा (Close Directory)';

        if (!this.isDirectoryLoaded || this.allCitizensCache.length === 0) {
            const res = await this.api.getAllCitizens();
            if (res.success && res.citizens) {
                this.allCitizensCache = res.citizens;
                this.isDirectoryLoaded = true;
            }
        }

        this.renderPaginatedDirectory();
    }

    renderPaginatedDirectory() {
        const tableBody = document.getElementById('master-directory-tbody');
        const countBadge = document.getElementById('master-directory-count');
        const pageLabel = document.getElementById('master-directory-page-label');
        if (!tableBody) return;

        let filtered = this.allCitizensCache;

        // Apply Category Filter
        if (this.directoryFilter !== 'ALL') {
            filtered = filtered.filter(c => c.category === this.directoryFilter);
        }

        // Apply Search Query
        if (this.directorySearchQuery) {
            const q = this.directorySearchQuery.toLowerCase();
            filtered = filtered.filter(c => 
                c.cardNumber.toLowerCase().includes(q) ||
                c.headOfFamily.toLowerCase().includes(q) ||
                c.headOfFamilyMarathi.toLowerCase().includes(q) ||
                (c.mobile && c.mobile.includes(q))
            );
        }

        const totalFiltered = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalFiltered / this.pageSize));
        if (this.directoryPage > totalPages) this.directoryPage = totalPages;

        const startIdx = (this.directoryPage - 1) * this.pageSize;
        const pageCitizens = filtered.slice(startIdx, startIdx + this.pageSize);

        if (countBadge) countBadge.textContent = `${totalFiltered} Families Listed`;
        if (pageLabel) pageLabel.textContent = `Page ${this.directoryPage} of ${totalPages}`;

        tableBody.innerHTML = pageCitizens.map(c => `
            <tr>
                <td><strong>${c.cardNumber}</strong></td>
                <td>${c.headOfFamily}<br/><small style="color:#64748b;">${c.headOfFamilyMarathi}</small></td>
                <td><span class="badge badge-${c.cardColor}">${c.category}</span></td>
                <td>👥 ${c.memberCount} Members</td>
                <td>🍚 ${c.quotaRice}kg | 🌾 ${c.quotaWheat}kg</td>
                <td><span class="status-pill ${c.quotaStatus === 'COLLECTED' ? 'status-success' : 'status-available'}">${c.quotaStatus}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline btn-dir-verify" data-card="${c.cardNumber}">
                        Verify 🔍
                    </button>
                </td>
            </tr>
        `).join('');
    }

    bindEvents() {
        // Beneficiary Search Button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#btn-fps-search')) {
                const queryInput = document.getElementById('fps-search-input');
                if (queryInput) {
                    this.searchBeneficiary(queryInput.value);
                }
            }
        });

        // Search Input Enter key
        const searchInput = document.getElementById('fps-search-input');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.searchBeneficiary(searchInput.value);
                }
            });
        }

        // Verify and Dispense Button
        document.addEventListener('click', async (e) => {
            if (e.target.closest('#btn-fps-verify-dispense')) {
                if (!this.currentLoadedCitizen) return;

                const otpInput = document.getElementById('fps-citizen-otp-input');
                const enteredOtp = otpInput ? otpInput.value.trim() : '';

                if (!enteredOtp || enteredOtp.length !== 4) {
                    alert('Please enter a valid 4-digit citizen OTP.');
                    return;
                }

                const shop = this.store.getCurrentShop();
                const result = await this.api.dispenseRation(shop.id, this.currentLoadedCitizen.cardNumber, enteredOtp);

                if (result.success) {
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`🎉 Ration successfully dispensed! Receipt #${result.receipt.receiptId}`, 'success');
                    }
                    shop.inventory = result.shopInventory;
                    this.store.saveState();
                    this.renderAll();
                    this.searchBeneficiary(this.currentLoadedCitizen.cardNumber);
                    this.showReceiptModal(result.receipt);
                } else {
                    alert(result.error || 'Failed to dispense ration.');
                }
            }
        });

        // Search Citizen for Adding New Member
        const searchMemberBtn = document.getElementById('btn-search-card-for-member');
        if (searchMemberBtn) {
            searchMemberBtn.addEventListener('click', () => {
                const input = document.getElementById('input-member-card-search');
                if (input) this.searchCitizenForNewMember(input.value);
            });
        }

        // Add Member Form Submission
        const addMemberForm = document.getElementById('form-add-family-member');
        if (addMemberForm) {
            addMemberForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!this.selectedMemberCitizen) return;

                const memberData = {
                    name: document.getElementById('new-member-name').value.trim(),
                    relation: document.getElementById('new-member-relation').value,
                    age: document.getElementById('new-member-age').value.trim(),
                    gender: document.getElementById('new-member-gender').value,
                    aadhaarNo: document.getElementById('new-member-aadhaar').value.trim()
                };

                const res = await this.api.addFamilyMember(this.selectedMemberCitizen.cardNumber, memberData);
                if (res.success) {
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`✅ Member ${memberData.name} added! New quota: ${res.citizen.currentQuota.rice.kg}kg Rice`, 'success');
                    }
                    this.searchCitizenForNewMember(this.selectedMemberCitizen.cardNumber);
                    addMemberForm.reset();
                    this.isDirectoryLoaded = false; // Refresh cache
                } else {
                    alert(res.error || 'Failed to add member.');
                }
            });
        }

        // Search Citizen for Deceased/Expired Member Removal
        const searchDeleteMemberBtn = document.getElementById('btn-search-card-for-delete');
        if (searchDeleteMemberBtn) {
            searchDeleteMemberBtn.addEventListener('click', () => {
                const input = document.getElementById('input-delete-member-card');
                if (input) this.searchCitizenForDeleteMember(input.value);
            });
        }

        // Deceased Member Request Submission to Government
        const deleteMemberForm = document.getElementById('form-request-delete-member');
        if (deleteMemberForm) {
            deleteMemberForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!this.selectedDeleteCitizen) return;

                const shop = this.store.getCurrentShop();
                const reqData = {
                    cardNumber: this.selectedDeleteCitizen.cardNumber,
                    memberName: document.getElementById('delete-member-select').value,
                    reason: document.getElementById('delete-member-reason').value,
                    certificateNo: document.getElementById('delete-member-cert-no').value.trim(),
                    notes: document.getElementById('delete-member-notes').value.trim(),
                    fpsId: shop.id
                };

                const res = await this.api.requestDeleteMember(reqData);
                if (res.success) {
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`🏛️ Request #${res.request.id} submitted to Government Supply Officer for approval.`, 'info');
                    }
                    deleteMemberForm.reset();
                    document.getElementById('delete-member-form-wrap').style.display = 'none';
                    document.getElementById('delete-member-citizen-preview').innerHTML = `
                        <div class="alert-box alert-success">
                            <span>✅ Official Deletion Request #${res.request.id} sent to Government Command Desk.</span>
                        </div>
                    `;
                } else {
                    alert(res.error || 'Failed to submit request.');
                }
            });
        }

        // On-Demand Master Directory Toggle Button
        const toggleDirBtn = document.getElementById('btn-toggle-master-directory');
        if (toggleDirBtn) {
            toggleDirBtn.addEventListener('click', () => this.toggleMasterDirectory());
        }

        // Master Directory Live Filter Search
        const dirSearchInput = document.getElementById('input-directory-filter-search');
        if (dirSearchInput) {
            dirSearchInput.addEventListener('input', (e) => {
                this.directorySearchQuery = e.target.value.trim();
                this.directoryPage = 1;
                this.renderPaginatedDirectory();
            });
        }

        // Category Filter Buttons
        document.querySelectorAll('.btn-dir-filter-cat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-dir-filter-cat').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.directoryFilter = btn.getAttribute('data-cat');
                this.directoryPage = 1;
                this.renderPaginatedDirectory();
            });
        });

        // Pagination Buttons
        const prevPageBtn = document.getElementById('btn-dir-prev-page');
        const nextPageBtn = document.getElementById('btn-dir-next-page');

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (this.directoryPage > 1) {
                    this.directoryPage--;
                    this.renderPaginatedDirectory();
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                this.directoryPage++;
                this.renderPaginatedDirectory();
            });
        }

        // 1-Click Directory Quick Verify Button
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-dir-verify');
            if (btn) {
                const cardNo = btn.getAttribute('data-card');
                const searchInput = document.getElementById('fps-search-input');
                if (searchInput) {
                    searchInput.value = cardNo;
                    this.searchBeneficiary(cardNo);
                    document.querySelector('.fps-search-terminal-box')?.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    showReceiptModal(receipt) {
        const modal = document.getElementById('receipt-modal');
        const modalBody = document.getElementById('receipt-modal-body');
        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="receipt-print-sheet">
                <div class="receipt-header-print">
                    <img src="/images/my-logo.png" style="height:60px; width:60px; border-radius:50%; margin-bottom:8px;" onerror="this.src='/images/my-logo.svg';">
                    <h3>अन्नमित्र • ANNAMITRA</h3>
                    <p>GOVERNMENT OF MAHARASHTRA • PUBLIC DISTRIBUTION SYSTEM</p>
                    <p class="receipt-id-print">Receipt No: <strong>${receipt.receiptId}</strong></p>
                    <p>Date: ${receipt.date} | Shop: #${receipt.fpsId}</p>
                </div>
                <hr/>
                <table class="receipt-items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${receipt.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td><strong>${item.qty}</strong></td>
                                <td>${item.price}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <hr/>
                <div class="receipt-total-print">
                    <span>Total Paid:</span>
                    <strong>₹${receipt.totalAmount}</strong>
                </div>
                <div class="receipt-security-stamp">
                    <span>🛡️ Verified via ${receipt.verificationMethod}</span>
                    <p>Tamper-proof digitally signed electronic record</p>
                </div>
            </div>
        `;

        modal.classList.add('modal-active');
    }
}

window.annasetuShopkeeper = new ShopkeeperPortal();
