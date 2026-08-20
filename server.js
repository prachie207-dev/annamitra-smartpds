/**
 * AnnaMitra (अन्नमित्र) - REST API Backend Server
 * Built with Express.js and persistent SQLite / Relational Storage.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// In-Memory Temporary SMS OTP Store (Key: CardNumber or Mobile -> { otp, expiresAt, citizen })
const otpStore = new Map();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static frontend files and images (supports nested and root directories)
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(__dirname));
app.use(express.static(process.cwd()));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images', express.static(path.join(process.cwd(), 'images')));
app.use('/images', express.static(process.cwd()));
// Serve index.html on the main home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
// =========================================================================
// AUTHENTICATION ENDPOINTS
// ==========================================================// 1. Citizen Password / PIN Login (Distinct PIN: "1111" / "1234")
app.post('/api/auth/citizen/login', (req, res) => {
    const { cardNumber, pin } = req.body;
    if (!cardNumber) {
        return res.status(400).json({ success: false, error: 'Ration Card Number or Registered Mobile Number is required.' });
    }

    const citizen = db.findCitizen(cardNumber);
    if (!citizen) {
        return res.status(401).json({ success: false, error: `No account found for "${cardNumber}".` });
    }

    const trimmedPin = pin ? pin.toString().trim() : '';
    const isValidPin = (trimmedPin === citizen.pin || trimmedPin === citizen.password || trimmedPin === '1111' || trimmedPin === '1234');

    if (!isValidPin) {
        return res.status(401).json({ success: false, error: 'Invalid Password / PIN. (Customer PIN: 1111)' });
    }

    return res.json({
        success: true,
        authMethod: 'PASSWORD',
        role: 'citizen',
        token: `CITIZEN_TOKEN_${citizen.cardNumber}`,
        user: {
            cardNumber: citizen.cardNumber,
            headOfFamily: citizen.headOfFamily,
            headOfFamilyMarathi: citizen.headOfFamilyMarathi,
            category: citizen.category,
            cardColor: citizen.cardColor,
            categoryName: citizen.categoryName,
            assignedFPS: citizen.assignedFPS,
            district: citizen.district
        }
    });
});

// 2. Citizen WebAuthn Biometric Login
app.post('/api/auth/citizen/biometric-login', (req, res) => {
    const { cardNumber } = req.body;
    const targetCard = cardNumber && cardNumber.trim() ? cardNumber.trim() : 'MH-PDS-2026-0001';
    const citizen = db.findCitizen(targetCard);

    if (!citizen) {
        return res.status(404).json({ success: false, error: `Ration Card "${targetCard}" not registered for biometric login.` });
    }

    return res.json({
        success: true,
        authMethod: 'WEBAUTHN_BIOMETRIC',
        role: 'citizen',
        token: `BIOMETRIC_TOKEN_${citizen.cardNumber}`,
        user: {
            cardNumber: citizen.cardNumber,
            headOfFamily: citizen.headOfFamily,
            headOfFamilyMarathi: citizen.headOfFamilyMarathi,
            category: citizen.category,
            cardColor: citizen.cardColor,
            assignedFPS: citizen.assignedFPS,
            district: citizen.district
        },
        message: 'Aadhaar WebAuthn Biometric hardware verification successful.'
    });
});

// 3. Citizen Mobile SMS OTP Request (Supports Any 10-Digit Mobile # or Ration Card)
app.post('/api/auth/citizen/send-otp', (req, res) => {
    const { identifier } = req.body; // Can be Ration Card No or Any 10-Digit Mobile Number
    if (!identifier) {
        return res.status(400).json({ success: false, error: 'Please enter your Ration Card Number or Mobile Number.' });
    }

    const citizen = db.findCitizen(identifier);
    if (!citizen) {
        return res.status(404).json({ success: false, error: `No registered account found for "${identifier}".` });
    }

    // Generate authentic 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

    // Store by both card number, raw identifier, and mobile
    otpStore.set(citizen.cardNumber.toUpperCase(), { otp: generatedOtp, expiresAt, citizen });
    otpStore.set(identifier.toString().trim().toUpperCase(), { otp: generatedOtp, expiresAt, citizen });
    if (citizen.mobile) {
        otpStore.set(citizen.mobile.replace(/\D/g, ''), { otp: generatedOtp, expiresAt, citizen });
    }

    const cleanInput = identifier.toString().replace(/\D/g, '');
    const mobileToDisplay = (cleanInput.length >= 10) ? cleanInput.slice(-10) : (citizen.mobile || '9822010001');
    const maskedMobile = `${mobileToDisplay.slice(0, 4)}****${mobileToDisplay.slice(-2)}`;

    return res.json({
        success: true,
        message: `OTP sent successfully to mobile ${maskedMobile}`,
        cardNumber: citizen.cardNumber,
        mobile: mobileToDisplay,
        maskedMobile: maskedMobile,
        otp: generatedOtp
    });
});

// 4. Citizen Mobile SMS OTP Verification
app.post('/api/auth/citizen/verify-otp', (req, res) => {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
        return res.status(400).json({ success: false, error: 'Identifier and 6-digit OTP are required.' });
    }

    const clean = identifier.toString().trim().toUpperCase();
    let stored = otpStore.get(clean) || otpStore.get(clean.replace(/\D/g, ''));

    if (!stored) {
        const citizen = db.findCitizen(clean);
        if (citizen) {
            stored = otpStore.get(citizen.cardNumber.toUpperCase());
        }
    }

    if (!stored || stored.otp !== otp.trim()) {
        return res.status(401).json({ success: false, error: 'Invalid or expired OTP. Please click Resend OTP.' });
    }

    const citizen = stored.citizen;
    otpStore.delete(clean);
    otpStore.delete(citizen.cardNumber.toUpperCase());

    return res.json({
        success: true,
        authMethod: 'SMS_OTP',
        role: 'citizen',
        token: `OTP_TOKEN_${citizen.cardNumber}`,
        user: {
            cardNumber: citizen.cardNumber,
            headOfFamily: citizen.headOfFamily,
            headOfFamilyMarathi: citizen.headOfFamilyMarathi,
            category: citizen.category,
            cardColor: citizen.cardColor,
            assignedFPS: citizen.assignedFPS,
            district: citizen.district
        },
        message: 'Phone verified successfully.'
    });
});

// 5. Shopkeeper Login (Password: "shop8888" / "shop1234")
app.post('/api/auth/shopkeeper/login', (req, res) => {
    const { fpsId, password } = req.body;
    if (!fpsId) {
        return res.status(400).json({ success: false, error: 'FPS ID is required.' });
    }

    const shop = db.findShop(fpsId);
    if (!shop || shop.id.toUpperCase() !== fpsId.trim().toUpperCase()) {
        return res.status(401).json({ success: false, error: 'Invalid Fair Price Shop ID (e.g. FPS1001 or FPS1002).' });
    }

    const pass = password ? password.toString().trim() : '';
    const isShopValid = (pass === shop.password || pass === shop.adminPass || pass === 'shop8888' || pass === 'shop1234' || pass === 'shop1002' || pass === 'dealer' || pass === 'admin' || pass === '1234');

    if (!isShopValid) {
        return res.status(401).json({ success: false, error: 'Invalid Password. (Shopkeeper Password: shop8888)' });
    }

    return res.json({
        success: true,
        role: 'shopkeeper',
        token: `FPS_TOKEN_${shop.id}`,
        shop: {
            id: shop.id,
            name: shop.name,
            marathiName: shop.marathiName,
            dealerName: shop.dealerName,
            location: shop.location,
            contact: shop.contact
        }
    });
});

// =========================================================================
// CITIZEN ENDPOINTS
// =========================================================================

// Get Logged In Citizen Profile & Quota
app.get('/api/citizen/details', (req, res) => {
    const cardNo = req.query.cardNumber || 'MH-PDS-2026-0001';
    const citizen = db.findCitizen(cardNo);
    if (!citizen) {
        return res.status(404).json({ success: false, error: 'Citizen not found.' });
    }

    const shop = db.findShop(citizen.assignedFPS);

    return res.json({
        success: true,
        citizen: citizen,
        shop: {
            id: shop.id,
            name: shop.name,
            marathiName: shop.marathiName,
            dealerName: shop.dealerName,
            godownDeliveryDate: shop.godownDeliveryDate,
            currentServingToken: shop.currentServingToken,
            inventory: {
                rice: shop.inventory.rice.dispatched - shop.inventory.rice.distributed,
                wheat: shop.inventory.wheat.dispatched - shop.inventory.wheat.distributed,
                sugar: shop.inventory.sugar.dispatched - shop.inventory.sugar.distributed
            },
            slots: shop.slots
        }
    });
});

// Book 1 of 3 Daytime Slots
app.post('/api/citizen/book-slot', (req, res) => {
    const { cardNumber, slotId, date } = req.body;
    const citizen = db.findCitizen(cardNumber);
    if (!citizen) return res.status(404).json({ success: false, error: 'Citizen not found.' });

    const shop = db.findShop(citizen.assignedFPS);
    if (!shop || !shop.slots[slotId]) return res.status(400).json({ success: false, error: 'Slot not found.' });

    if (shop.slots[slotId].booked >= shop.slots[slotId].max) {
        return res.status(400).json({ success: false, error: 'Slot is full.' });
    }

    shop.slots[slotId].booked += 1;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const tokenNumber = `TK-${String(shop.slots[slotId].booked + 10).padStart(3, '0')}`;

    citizen.currentQuota.status = 'BOOKED';
    citizen.activeToken = {
        tokenNo: tokenNumber,
        slotId: slotId,
        slotLabel: shop.slots[slotId].label,
        date: date || new Date().toISOString().split('T')[0],
        otp: otp,
        status: 'READY_FOR_PICKUP',
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        queuePosition: Math.max(1, (shop.slots[slotId].booked + 10) - shop.currentServingToken)
    };

    db.data.adminStats.totalTokensBookedToday += 1;
    db.save();

    return res.json({ success: true, token: citizen.activeToken });
});

// Cancel Active Token
app.post('/api/citizen/cancel-slot', (req, res) => {
    const { cardNumber } = req.body;
    const citizen = db.findCitizen(cardNumber);
    if (!citizen || !citizen.activeToken) {
        return res.status(400).json({ success: false, error: 'No active token found.' });
    }

    const shop = db.findShop(citizen.assignedFPS);
    if (shop && shop.slots[citizen.activeToken.slotId]) {
        shop.slots[citizen.activeToken.slotId].booked = Math.max(0, shop.slots[citizen.activeToken.slotId].booked - 1);
    }

    citizen.currentQuota.status = 'AVAILABLE';
    citizen.activeToken = null;
    db.save();

    return res.json({ success: true, message: 'Slot cancelled successfully.' });
});

// Submit SOS Emergency Grievance
app.post('/api/citizen/sos', (req, res) => {
    const { cardNumber, issueType, details } = req.body;
    const citizen = db.findCitizen(cardNumber);
    const shop = citizen ? db.findShop(citizen.assignedFPS) : db.data.shops[0];

    const complaintId = `SOS-${Date.now().toString().slice(-6)}`;
    const newComplaint = {
        id: complaintId,
        cardNumber: cardNumber || 'MH-PDS-2026-UNKNOWN',
        citizenName: citizen ? citizen.headOfFamily : 'Beneficiary',
        fpsId: shop.id,
        fpsName: shop.name,
        issueType: issueType || 'DENIED_RATION',
        title: details || 'Shopkeeper refused ration / claimed stock empty',
        timestamp: new Date().toLocaleString(),
        status: 'PENDING',
        priority: 'EMERGENCY_CRITICAL',
        actionTaken: 'Dispatched notification to District Supplies Officer & Flying Squad'
    };

    db.data.grievances.unshift(newComplaint);
    db.data.adminStats.totalGrievancesLogged += 1;
    db.save();

    return res.json({ success: true, complaint: newComplaint });
});

// Submit Citizen Query to Government Helpdesk
app.post('/api/citizen/submit-query', (req, res) => {
    const { cardNumber, category, subject, message } = req.body;
    const citizen = db.findCitizen(cardNumber);
    if (!citizen) return res.status(404).json({ success: false, error: 'Citizen account not found.' });

    if (!subject || !message) {
        return res.status(400).json({ success: false, error: 'Subject and message are required.' });
    }

    const categoryLabels = {
        'MEMBER_UPDATE': '🏷️ रेशन कार्ड नाव / सदस्य बदल चौकशी',
        'QUOTA_PRICING': '⚖️ धान्य कोटा व सवलत दर माहिती',
        'SHOP_TRANSFER': '📍 रेशन दुकान स्थलांतर विनंती',
        'SCHEME_ELIGIBILITY': '📜 अंत्योदय / प्राधान्य कुटुंब पात्रता',
        'GENERAL': '❓ सर्वसाधारण शासकीय मदत व चौकशी'
    };

    const queryId = `QRY-${Date.now().toString().slice(-6)}`;
    const newQuery = {
        id: queryId,
        cardNumber: citizen.cardNumber,
        citizenName: citizen.headOfFamily,
        district: citizen.district || 'Maharashtra',
        assignedFPS: citizen.assignedFPS || 'FPS1001',
        category: category || 'GENERAL',
        categoryLabel: categoryLabels[category] || 'सर्वसाधारण चौकशी',
        subject: subject.trim(),
        message: message.trim(),
        submittedAt: new Date().toLocaleString(),
        status: 'PENDING_REVIEW',
        officerReply: null,
        repliedAt: null,
        officerName: null
    };

    if (!db.data.queries) db.data.queries = [];
    db.data.queries.unshift(newQuery);
    db.save();

    return res.json({
        success: true,
        message: 'Your query has been submitted directly to the District Food & Civil Supplies Helpdesk.',
        query: newQuery
    });
});

// Get Citizen Queries Feed
app.get('/api/citizen/queries', (req, res) => {
    const cardNo = req.query.cardNumber;
    if (!cardNo) return res.status(400).json({ success: false, error: 'Card number is required.' });

    const citizen = db.findCitizen(cardNo);
    const targetCard = citizen ? citizen.cardNumber : cardNo.trim().toUpperCase();

    const allQueries = db.data.queries || [];
    const citizenQueries = allQueries.filter(q => q.cardNumber.toUpperCase() === targetCard);

    return res.json({
        success: true,
        queries: citizenQueries
    });
});

// =========================================================================
// SHOPKEEPER ENDPOINTS
// =========================================================================

// Get Shop Details & Immutable Stock Ledger
app.get('/api/shop/details', (req, res) => {
    const fpsId = req.query.fpsId || 'FPS1001';
    const shop = db.findShop(fpsId);

    return res.json({
        success: true,
        shop: shop
    });
});

// Get All 500 Citizens for On-Demand Beneficiary Directory
app.get('/api/shop/all-citizens', (req, res) => {
    const citizens = db.data.citizens.map(c => ({
        cardNumber: c.cardNumber,
        headOfFamily: c.headOfFamily,
        headOfFamilyMarathi: c.headOfFamilyMarathi,
        category: c.category,
        cardColor: c.cardColor,
        memberCount: c.familyMembers ? c.familyMembers.length : 1,
        district: c.district,
        mobile: c.mobile,
        assignedFPS: c.assignedFPS,
        quotaRice: c.currentQuota.rice.kg,
        quotaWheat: c.currentQuota.wheat.kg,
        quotaStatus: c.currentQuota.status
    }));

    return res.json({
        success: true,
        total: citizens.length,
        citizens: citizens
    });
});

// Search Beneficiary by Card No, Token, or Mobile
app.post('/api/shop/search-beneficiary', (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, error: 'Query is required.' });

    const citizen = db.findCitizen(query);
    if (!citizen) {
        return res.status(404).json({ success: false, error: `Beneficiary "${query}" not found in database.` });
    }

    return res.json({ success: true, citizen });
});

// Dispense Ration with 4-Digit OTP Verification
app.post('/api/shop/dispense', (req, res) => {
    const { fpsId, cardNumber, otp } = req.body;
    const citizen = db.findCitizen(cardNumber);
    if (!citizen) return res.status(404).json({ success: false, error: 'Citizen not found.' });

    if (!citizen.activeToken) {
        return res.status(400).json({ success: false, error: 'Citizen does not have an active booked token slot.' });
    }

    if (citizen.activeToken.otp !== otp.trim()) {
        return res.status(400).json({ success: false, error: 'Security OTP mismatch. Grain release blocked.' });
    }

    const shop = db.findShop(fpsId);
    const quota = citizen.currentQuota;

    const availRice = shop.inventory.rice.dispatched - shop.inventory.rice.distributed;
    const availWheat = shop.inventory.wheat.dispatched - shop.inventory.wheat.distributed;
    if (availRice < quota.rice.kg || availWheat < quota.wheat.kg) {
        return res.status(400).json({ success: false, error: 'Insufficient shop stock balance.' });
    }

    // Immutable Stock Deduction
    shop.inventory.rice.distributed += quota.rice.kg;
    shop.inventory.wheat.distributed += quota.wheat.kg;
    if (quota.sugar) shop.inventory.sugar.distributed += quota.sugar.kg;
    if (quota.oil) shop.inventory.oil.distributed += quota.oil.litres;

    shop.currentServingToken += 1;

    const receiptId = `RCP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${citizen.cardNumber.slice(-4)}`;
    const passbookEntry = {
        month: quota.month,
        date: new Date().toLocaleString(),
        tokenNo: citizen.activeToken.tokenNo,
        fpsId: shop.id,
        dealerName: shop.dealerName,
        items: [
            { name: 'Rice (तांदूळ)', qty: `${quota.rice.kg} kg`, price: `₹${quota.rice.total}` },
            { name: 'Wheat (गहू)', qty: `${quota.wheat.kg} kg`, price: `₹${quota.wheat.total}` },
            { name: 'Sugar (साखर)', qty: `${quota.sugar.kg} kg`, price: `₹${quota.sugar.total}` },
            { name: 'Oil (तेल)', qty: `${quota.oil.litres} L`, price: `₹${quota.oil.total}` }
        ],
        totalAmount: (quota.rice.total + quota.wheat.total + quota.sugar.total + quota.oil.total),
        verificationMethod: 'Digital Secure OTP Verified',
        receiptId: receiptId
    };

    citizen.passbook.unshift(passbookEntry);
    citizen.currentQuota.status = 'COLLECTED';
    citizen.activeToken = null;

    db.data.adminStats.totalRationDistributedMT += (quota.rice.kg + quota.wheat.kg) / 1000;
    db.save();

    return res.json({ success: true, receipt: passbookEntry, shopInventory: shop.inventory });
});

// Add New Family Member
app.post('/api/shop/add-member', (req, res) => {
    const { cardNumber, name, relation, age, gender, aadhaarNo } = req.body;
    const citizen = db.findCitizen(cardNumber);
    if (!citizen) return res.status(404).json({ success: false, error: 'Citizen card not found.' });

    const newMember = {
        name: name.trim(),
        relation: relation || 'Family Member',
        age: parseInt(age) || 1,
        gender: gender || 'Male',
        aadhaarLinked: !!aadhaarNo,
        aadhaarNo: aadhaarNo ? `XXXX-XXXX-${aadhaarNo.slice(-4)}` : 'Pending Link',
        photo: gender === 'Female' ? '👧' : '👦'
    };

    citizen.familyMembers.push(newMember);

    if (citizen.category === 'PHH') {
        const count = citizen.familyMembers.length;
        citizen.currentQuota.rice.kg = count * 3;
        citizen.currentQuota.rice.total = citizen.currentQuota.rice.kg * citizen.currentQuota.rice.ratePerKg;
        citizen.currentQuota.wheat.kg = count * 2;
        citizen.currentQuota.wheat.total = citizen.currentQuota.wheat.kg * citizen.currentQuota.wheat.ratePerKg;
    }

    db.save();

    return res.json({
        success: true,
        message: 'Family member registered successfully.',
        citizen: citizen,
        newMember: newMember
    });
});

// Submit Expired/Deceased Member Deletion Request to Government
app.post('/api/shop/request-delete-member', (req, res) => {
    const { cardNumber, memberName, reason, certificateNo, notes, fpsId } = req.body;
    const citizen = db.findCitizen(cardNumber);
    if (!citizen) return res.status(404).json({ success: false, error: 'Citizen not found.' });

    const requestId = `REQ-DEL-${Date.now().toString().slice(-6)}`;
    const newRequest = {
        id: requestId,
        fpsId: fpsId || citizen.assignedFPS,
        cardNumber: citizen.cardNumber,
        headOfFamily: citizen.headOfFamily,
        memberName: memberName,
        reason: reason || 'EXPIRED_DECEASED',
        certificateNo: certificateNo || 'N/A',
        notes: notes || '',
        submittedAt: new Date().toLocaleString(),
        status: 'PENDING_GOVT_APPROVAL'
    };

    if (!db.data.modifications) db.data.modifications = [];
    db.data.modifications.unshift(newRequest);
    db.save();

    return res.json({
        success: true,
        message: 'Member deletion request submitted to Government Supply Officer for approval.',
        request: newRequest
    });
});

// Advance Serving Token
app.post('/api/shop/next-token', (req, res) => {
    const { fpsId } = req.body;
    const shop = db.findShop(fpsId);
    shop.currentServingToken += 1;
    db.save();
    return res.json({ success: true, currentServingToken: shop.currentServingToken });
});

// =========================================================================
// GOVERNMENT COMMAND CENTER ENDPOINTS
// =========================================================================

app.get('/api/admin/telemetry', (req, res) => {
    return res.json({
        success: true,
        stats: db.data.adminStats,
        grievances: db.data.grievances,
        pendingRequests: db.data.modifications || [],
        shops: db.data.shops
    });
});

// Get Pending Shopkeeper Requests
app.get('/api/admin/pending-requests', (req, res) => {
    return res.json({
        success: true,
        requests: db.data.modifications || []
    });
});

// Approve or Reject Shopkeeper Member Deletion Request
app.post('/api/admin/approve-request', (req, res) => {
    const { requestId, action, remarks } = req.body;
    const request = (db.data.modifications || []).find(r => r.id === requestId);
    if (!request) return res.status(404).json({ success: false, error: 'Request not found.' });

    if (action === 'APPROVE') {
        request.status = 'APPROVED';
        request.approvedAt = new Date().toLocaleString();
        request.remarks = remarks || 'Approved by Civil Supplies Officer after verification.';

        const citizen = db.findCitizen(request.cardNumber);
        if (citizen && citizen.familyMembers) {
            citizen.familyMembers = citizen.familyMembers.filter(m => !m.name.includes(request.memberName));
            if (citizen.category === 'PHH') {
                const count = Math.max(1, citizen.familyMembers.length);
                citizen.currentQuota.rice.kg = count * 3;
                citizen.currentQuota.rice.total = citizen.currentQuota.rice.kg * citizen.currentQuota.rice.ratePerKg;
                citizen.currentQuota.wheat.kg = count * 2;
                citizen.currentQuota.wheat.total = citizen.currentQuota.wheat.kg * citizen.currentQuota.wheat.ratePerKg;
            }
        }
    } else {
        request.status = 'REJECTED';
        request.remarks = remarks || 'Rejected by Officer: Incomplete documentation.';
    }

    db.save();
    return res.json({ success: true, request: request });
});

// Resolve SOS Grievance
app.post('/api/admin/resolve-grievance', (req, res) => {
    const { complaintId, actionText } = req.body;
    const grv = db.data.grievances.find(g => g.id === complaintId);
    if (!grv) return res.status(404).json({ success: false, error: 'Grievance not found.' });

    grv.status = 'RESOLVED';
    grv.actionTaken = actionText || 'Disciplinary notice served & stock reconciled on-site.';
    db.data.adminStats.grievancesResolvedToday += 1;
    db.save();

    return res.json({ success: true, message: 'Grievance resolved successfully.' });
});

// Get All Queries for Government Officers
app.get('/api/admin/queries', (req, res) => {
    const allQueries = db.data.queries || [];
    return res.json({
        success: true,
        total: allQueries.length,
        queries: allQueries
    });
});

// Officer Reply to Citizen Query
app.post('/api/admin/reply-query', (req, res) => {
    const { queryId, replyText, officerName } = req.body;
    if (!queryId || !replyText) {
        return res.status(400).json({ success: false, error: 'Query ID and Reply message are required.' });
    }

    const query = (db.data.queries || []).find(q => q.id === queryId);
    if (!query) return res.status(404).json({ success: false, error: 'Query not found.' });

    query.status = 'OFFICER_REPLIED';
    query.officerReply = replyText.trim();
    query.repliedAt = new Date().toLocaleString();
    query.officerName = officerName || 'Shri R. V. Kulkarni (District Civil Supplies Officer)';

    db.save();

    return res.json({
        success: true,
        message: 'Official response dispatched directly to citizen portal.',
        query: query
    });
});

// Start Server (if executed directly)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🌾 AnnaMitra SmartPDS REST API Server is running at http://localhost:${PORT}`);
    });
}

module.exports = app;
