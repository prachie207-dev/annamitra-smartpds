/**
 * Annasetu (अन्नसेतू) - Government Command Center & Telemetry Logic
 * State-wide supply monitoring, AI Anomaly detection, citizen grievances,
 * and Shopkeeper Member Deletion / Modification Approval Desk.
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
                    <p style="color:#64748b;">✅ No pending shopkeeper deletion or modification requests.</p>
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
                                <td><span class="badge badge-orange">${r.reason.replace('_', ' ')}</span></td>
                                <td><code>${r.certificateNo}</code></td>
                                <td>
                                    <span class="status-pill ${r.status === 'APPROVED' ? 'status-success' : (r.status === 'REJECTED' ? 'status-urgent' : 'status-booked')}">
                                        ${r.status}
                                    </span>
                                </td>
                                <td>
                                    ${r.status === 'PENDING_GOVT_APPROVAL' ? `
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

        container.innerHTML = grievances.map(g => `
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
    }
}

window.annasetuAdmin = new AdminPortal();
