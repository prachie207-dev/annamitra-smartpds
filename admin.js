/**
 * AnnaMitra (अन्नमित्र) - Government Command Center & Telemetry Logic
 * State-wide supply monitoring, AI Anomaly detection, citizen grievances,
 * Shopkeeper Member Deletion Approvals, and Direct Citizen Query & Support Desk.
 */

class AdminPortal {
    constructor() {
        this.store = window.annasetuStore;
        this.i18n = window.annasetuI18n;
        this.api = window.annasetuApi;
    }

    init() {
        this.renderAll();
        this.bindEvents();
    }

    async renderAll() {
        const telemetry = await this.api.getAdminTelemetry();
        if (!telemetry.success) return;

        this.renderTelemetryStats(telemetry.stats);
        this.renderAIAnomalies();
        this.renderPendingShopkeeperRequests(telemetry.pendingRequests || []);
        this.renderGrievancesQueue(telemetry.grievances);
        this.renderQueriesQueue('ALL');
    }

    renderTelemetryStats(stats) {
        const fpsEl = document.getElementById('admin-stat-fps');
        const benEl = document.getElementById('admin-stat-beneficiaries');
        const tokEl = document.getElementById('admin-stat-tokens');
        const mtEl = document.getElementById('admin-stat-mt');
        const grvEl = document.getElementById('admin-stat-grievances');

        if (fpsEl) fpsEl.textContent = stats.totalFairPriceShops.toLocaleString();
        if (benEl) benEl.textContent = `${(stats.totalBeneficiaries / 10000000).toFixed(2)} Cr`;
        if (tokEl) tokEl.textContent = stats.totalTokensBookedToday.toLocaleString();
        if (mtEl) mtEl.textContent = `${stats.totalRationDistributedMT.toFixed(1)} MT`;
        if (grvEl) grvEl.textContent = Math.max(0, stats.totalGrievancesLogged - stats.grievancesResolvedToday);
    }

    renderAIAnomalies() {
        const container = document.getElementById('admin-ai-anomalies-feed');
        if (!container) return;

        const anomalies = [
            {
                type: 'TIME_SLOT_SPIKE',
                severity: 'MEDIUM',
                title: 'Unusual rush detected at FPS1002 (Satara)',
                description: '18 tokens scanned in under 12 minutes. AI automated queue pacing activated.',
                time: '14 mins ago'
            },
            {
                type: 'STOCK_VARIANCE',
                severity: 'LOW',
                title: 'Weight calibration match: 99.8%',
                description: 'IoT Electronic Weighing scale accuracy confirmed for all Baramati ward counters.',
                time: '32 mins ago'
            }
        ];

        container.innerHTML = anomalies.map(a => `
            <div class="ai-anomaly-item anomaly-${a.severity.toLowerCase()}">
                <div class="anomaly-header">
                    <span class="anomaly-type-tag">⚡ ${a.type}</span>
                    <span class="anomaly-time">${a.time}</span>
                </div>
                <h4>${a.title}</h4>
                <p>${a.description}</p>
            </div>
        `).join('');
    }

    // Pending Shopkeeper Member Removal & Modification Approvals
    renderPendingShopkeeperRequests(requests) {
        const container = document.getElementById('admin-pending-requests-queue');
        if (!container) return;

        if (!requests || requests.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card" style="padding:24px; text-align:center; background:#f8fafc; border-radius:12px;">
                    <p style="color:#64748b;">✅ कोणतीही प्रलंबित विनंती नाही (No pending deletion requests).</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="pending-requests-table-wrap">
                <table class="grain-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Shop / Card</th>
                            <th>Member Name</th>
                            <th>Reason</th>
                            <th>Certificate / Proof</th>
                            <th>Status</th>
                            <th>Officer Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${requests.map(r => `
                            <tr>
                                <td><strong>#${r.id}</strong></td>
                                <td>${r.fpsId}<br/><small style="color:#64748b;">${r.cardNumber}</small></td>
                                <td><strong class="text-danger">${r.memberName}</strong></td>
                                <td><span class="badge badge-orange">${r.reason ? r.reason.replace('_', ' ') : 'DECEASED'}</span></td>
                                <td><code>${r.certificateNo || r.deathCertificateNo || 'DOC-VERIFIED'}</code></td>
                                <td>
                                    <span class="status-pill ${r.status === 'APPROVED' ? 'status-success' : (r.status === 'REJECTED' ? 'status-urgent' : 'status-booked')}">
                                        ${r.status}
                                    </span>
                                </td>
                                <td>
                                    ${r.status === 'PENDING_GOVT_APPROVAL' || r.status === 'PENDING' ? `
                                        <div style="display:flex; gap:6px;">
                                            <button class="btn btn-sm btn-primary btn-approve-request" data-req-id="${r.id}">
                                                ✅ Approve
                                            </button>
                                            <button class="btn btn-sm btn-danger-outline btn-reject-request" data-req-id="${r.id}">
                                                ❌ Reject
                                            </button>
                                        </div>
                                    ` : `
                                        <small style="color:#64748b;">${r.remarks || 'Action taken'}</small>
                                    `}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderGrievancesQueue(grievances) {
        const container = document.getElementById('admin-grievances-queue');
        if (!container) return;

        container.innerHTML = (grievances || []).map(g => `
            <div class="grievance-card ${g.status === 'RESOLVED' ? 'grv-resolved' : 'grv-pending'}">
                <div class="grv-header">
                    <div>
                        <span class="grv-id">#${g.id}</span>
                        <span class="badge ${g.priority === 'CRITICAL' || g.priority === 'EMERGENCY_CRITICAL' ? 'badge-danger' : 'badge-orange'}">${g.priority}</span>
                        <span class="status-pill ${g.status === 'RESOLVED' ? 'status-success' : 'status-urgent'}">${g.status}</span>
                    </div>
                    <span class="grv-time">${g.timestamp}</span>
                </div>
                <div class="grv-body">
                    <h4>${g.citizenName} (${g.cardNumber}) ➔ ${g.fpsName} (#${g.fpsId})</h4>
                    <p class="grv-title-text">${g.title}</p>
                    <div class="grv-action-box">
                        <strong>Action Ordered:</strong> ${g.actionTaken}
                    </div>
                </div>
                ${g.status !== 'RESOLVED' ? `
                    <div class="grv-footer">
                        <button class="btn btn-sm btn-primary btn-resolve-grv" data-grv-id="${g.id}">
                            ✅ Mark Resolved & Issue Disciplinary Notice
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    async renderQueriesQueue(filter = 'ALL') {
        const container = document.getElementById('admin-queries-queue');
        if (!container) return;

        const res = await this.api.getAdminQueries();
        const allQueries = (res && res.success) ? res.queries : [];

        const countAllEl = document.getElementById('count-all-queries');
        const countPendingEl = document.getElementById('count-pending-queries');
        const countRepliedEl = document.getElementById('count-replied-queries');

        const pending = allQueries.filter(q => q.status === 'PENDING_REVIEW');
        const replied = allQueries.filter(q => q.status === 'OFFICER_REPLIED');

        if (countAllEl) countAllEl.textContent = allQueries.length;
        if (countPendingEl) countPendingEl.textContent = pending.length;
        if (countRepliedEl) countRepliedEl.textContent = replied.length;

        let filtered = allQueries;
        if (filter === 'PENDING') filtered = pending;
        if (filter === 'REPLIED') filtered = replied;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state-box" style="padding: 24px; text-align: center; color: var(--text-muted); background: #f8fafc; border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
                    <div style="font-size: 2rem; margin-bottom: 6px;">📬</div>
                    <p>या श्रेणीमध्ये कोणतेही नागरिक प्रश्न नाहीत.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(q => {
            const isReplied = q.status === 'OFFICER_REPLIED';
            return `
                <div class="admin-query-card ${isReplied ? 'admin-query-answered' : 'admin-query-pending'}">
                    <div class="admin-query-top">
                        <div class="query-meta-left">
                            <span class="query-id-tag">#${q.id}</span>
                            <span class="query-category-tag">${q.categoryLabel || q.category}</span>
                            <strong style="margin-left: 6px; font-size: 0.95rem;">${q.citizenName}</strong>
                            <span class="district-badge">📍 ${q.district} (FPS: ${q.assignedFPS})</span>
                        </div>
                        <span class="query-status-badge ${isReplied ? 'badge-replied' : 'badge-pending'}">
                            ${isReplied ? '✅ उत्तर दिलेले (Replied)' : '⏳ उत्तर प्रलंबित (Pending Review)'}
                        </span>
                    </div>

                    <div class="admin-query-content">
                        <h4 style="margin: 8px 0 4px 0; color: #0b2545;">${q.subject}</h4>
                        <p style="margin: 0 0 8px 0; color: #334155; line-height: 1.5;">${q.message}</p>
                        <small style="color: #64748b;">📅 विचारले: ${q.submittedAt} • रेशन कार्ड: <code>${q.cardNumber}</code></small>
                    </div>

                    ${isReplied ? `
                        <div class="admin-reply-box-done" style="margin-top: 10px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                                <strong style="color: #065f46;">🏛️ ${q.officerName || 'District Civil Supplies Officer'}</strong>
                                <small style="color: #059669;">✓ उत्तर पाठवले: ${q.repliedAt}</small>
                            </div>
                            <p style="margin: 0; color: #064e3b; line-height: 1.5;">
                                ${q.officerReply}
                            </p>
                        </div>
                    ` : `
                        <div class="admin-reply-form-inline" id="reply-box-${q.id}" style="margin-top: 12px; background: #f1f5f9; padding: 14px; border-radius: 8px; border: 1px solid var(--border-light);">
                            <label style="display: block; font-weight: 600; font-size: 0.875rem; margin-bottom: 6px; color: #0f172a;">
                                ✍️ नागरिकास अधिकृत शासकीय उत्तर व मार्गदर्शन पाठवा:
                            </label>
                            <textarea id="reply-text-${q.id}" class="form-control" rows="2" placeholder="उदा. आपल्या अर्जाची तपासणी झाली असून, आवश्यक कागदपत्रांसह अधिकृत दुकानात संपर्क साधावा..." style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; font-family: inherit; margin-bottom: 8px; resize: vertical;"></textarea>
                            <div style="display: flex; justify-content: flex-end; gap: 8px;">
                                <button class="btn btn-primary btn-sm btn-send-officer-reply" data-query-id="${q.id}">
                                    शासकीय उत्तर पाठवा 🚀
                                </button>
                            </div>
                        </div>
                    `}
                </div>
            `;
        }).join('');
    }

    bindEvents() {
        // Resolve Grievance Button
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-resolve-grv');
            if (btn) {
                const id = btn.getAttribute('data-grv-id');
                const res = await this.api.resolveGrievance(id, 'Civil Supplies Officer on-site reconciliation completed.');
                if (res.success) {
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`Grievance #${id} resolved.`, 'success');
                    }
                    this.renderAll();
                }
            }
        });

        // Approve Shopkeeper Member Deletion Request
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-approve-request');
            if (btn) {
                const reqId = btn.getAttribute('data-req-id');
                const res = await this.api.approveRequest(reqId, 'APPROVE', 'Verified by Civil Supplies Officer. Member de-linked and quota updated.');
                if (res.success) {
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`✅ Request #${reqId} approved. Member removed & quota recalculated!`, 'success');
                    }
                    this.renderAll();
                }
            }
        });

        // Reject Shopkeeper Request
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-reject-request');
            if (btn) {
                const reqId = btn.getAttribute('data-req-id');
                const res = await this.api.approveRequest(reqId, 'REJECT', 'Rejected due to invalid or unverified certificate.');
                if (res.success) {
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`❌ Request #${reqId} rejected.`, 'info');
                    }
                    this.renderAll();
                }
            }
        });

        // Query Filter Pills
        document.addEventListener('click', (e) => {
            const pill = e.target.closest('#admin-query-filter-pills .pill-btn');
            if (pill) {
                document.querySelectorAll('#admin-query-filter-pills .pill-btn').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const filter = pill.getAttribute('data-filter') || 'ALL';
                this.renderQueriesQueue(filter);
            }
        });

        // Officer Send Reply Button
        document.addEventListener('click', async (e) => {
            const btn = e.target.closest('.btn-send-officer-reply');
            if (btn) {
                const queryId = btn.getAttribute('data-query-id');
                const textarea = document.getElementById(`reply-text-${queryId}`);
                const replyText = textarea ? textarea.value.trim() : '';

                if (!replyText) {
                    alert('कृपया नागरिकास पाठवावयाचे उत्तर टाईप करा.');
                    return;
                }

                btn.disabled = true;
                btn.textContent = '⏳ पाठवत आहे...';

                const res = await this.api.replyAdminQuery({
                    queryId: queryId,
                    replyText: replyText,
                    officerName: 'Shri R. V. Kulkarni (District Civil Supplies Officer)'
                });

                if (res.success) {
                    if (window.annasetuApp) {
                        window.annasetuApp.showToast(`✅ Query #${queryId} ला अधिकृत उत्तर पाठवले गेले!`, 'success');
                    }
                    this.renderQueriesQueue();
                } else {
                    btn.disabled = false;
                    btn.textContent = 'शासकीय उत्तर पाठवा 🚀';
                    alert(res.error || 'Failed to send reply.');
                }
            }
        });
    }
}

window.annasetuAdmin = new AdminPortal();
