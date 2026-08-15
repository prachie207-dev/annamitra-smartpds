/**
 * AnnaMitra (अन्नमित्र) - Standalone Database Seeder
 * Seeds 500 realistic Indian families/citizens into the database.
 * Distinct names for Customer (Santoshrao Gaikwad) and Shopkeeper (Chandrakant Kadam).
 * Run via: node seed.js
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const DB_FILE = path.join(dataDir, 'annasetu.json');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function generate500Families() {
    const firstNames = [
        { en: 'Santoshrao', mr: 'संतोषराव', hi: 'संतोषराव', g: 'Male' },
        { en: 'Laxmibai', mr: 'लक्ष्मीबाई', hi: 'लक्ष्मीबाई', g: 'Female' },
        { en: 'Sambhaji', mr: 'संभाजी', hi: 'संभाजी', g: 'Male' },
        { en: 'Sunita', mr: 'सुनिता', hi: 'सुनिता', g: 'Female' },
        { en: 'Dattatray', mr: 'दत्तात्रय', hi: 'दत्तात्रय', g: 'Male' },
        { en: 'Anusaya', mr: 'अनुसया', hi: 'अनुसया', g: 'Female' },
        { en: 'Pandurang', mr: 'पांडुरंग', hi: 'पांडुरंग', g: 'Male' },
        { en: 'Shantabai', mr: 'शांताबाई', hi: 'शांताबाई', g: 'Female' },
        { en: 'Eknath', mr: 'एकनाथ', hi: 'एकनाथ', g: 'Male' },
        { en: 'Kavita', mr: 'कविता', hi: 'कविता', g: 'Female' },
        { en: 'Babanrao', mr: 'बबनराव', hi: 'बबनराव', g: 'Male' },
        { en: 'Parvatibai', mr: 'पार्वतीबाई', hi: 'पार्वतीबाई', g: 'Female' },
        { en: 'Ganesh', mr: 'गणेश', hi: 'गणेश', g: 'Male' },
        { en: 'Rukmini', mr: 'रुक्मिणी', hi: 'रुक्मिणी', g: 'Female' },
        { en: 'Maruti', mr: 'मारुती', hi: 'मारुती', g: 'Male' },
        { en: 'Kashibai', mr: 'काशीबाई', hi: 'काशीबाई', g: 'Female' },
        { en: 'Vishnu', mr: 'विष्णू', hi: 'विष्णू', g: 'Male' },
        { en: 'Mandakini', mr: 'मंदाकिनी', hi: 'मंदाकिनी', g: 'Female' },
        { en: 'Mahadev', mr: 'महादेव', hi: 'महादेव', g: 'Male' },
        { en: 'Sushila', mr: 'सुशीला', hi: 'सुशीला', g: 'Female' },
        { en: 'Ramesh', mr: 'रमेश', hi: 'रमेश', g: 'Male' },
        { en: 'Pooja', mr: 'पूजा', hi: 'पूजा', g: 'Female' },
        { en: 'Ashok', mr: 'अशोक', hi: 'अशोक', g: 'Male' },
        { en: 'Surekha', mr: 'सुरेखा', hi: 'सुरेखा', g: 'Female' },
        { en: 'Urmila', mr: 'उर्मिला', hi: 'उर्मिला', g: 'Female' },
        { en: 'Kishor', mr: 'किशोर', hi: 'किशोर', g: 'Male' },
        { en: 'Rekha', mr: 'रेखा', hi: 'रेखा', g: 'Female' },
        { en: 'Sanjay', mr: 'संजय', hi: 'संजय', g: 'Male' },
        { en: 'Vidya', mr: 'विद्या', hi: 'विद्या', g: 'Female' }
    ];

    const lastNames = [
        'Gaikwad (गायकवाड)', 'Jadhav (जाधव)', 'Patil (पाटील)', 'Shinde (शिंदे)', 
        'Pawar (पवार)', 'Kadam (कदम)', 'Chavan (चव्हाण)', 'More (मोरे)', 
        'Deshmukh (देशमुख)', 'Bhosale (भोसले)', 'Koli (कोळी)', 'Sawant (सावंत)', 
        'Salunkhe (साळुंखे)', 'Ghuge (घुगे)', 'Mane (माने)', 'Suryavanshi (सूर्यवंशी)', 
        'Raut (राऊत)', 'Gholap (घोळप)', 'Kharat (खरात)', 'Waghmare (वाघमारे)', 
        'Jagatap (जगताप)', 'Gore (गोरे)', 'Thorat (थोरात)', 'Lokhande (लोखंडे)'
    ];

    const districts = [
        'Pune Rural', 'Satara', 'Solapur', 'Kolhapur', 'Ahmednagar', 
        'Sangli', 'Nashik', 'Nagpur', 'Aurangabad', 'Amravati', 
        'Nanded', 'Jalgaon', 'Latur', 'Dhule', 'Thane'
    ];

    const families = [];

    for (let i = 1; i <= 500; i++) {
        const cardNum = `MH-PDS-2026-${String(i).padStart(4, '0')}`;
        const fn = firstNames[(i - 1) % firstNames.length];
        const ln = lastNames[(i - 1) % lastNames.length];
        const dist = districts[(i - 1) % districts.length];
        const isAAY = i % 3 === 1; // Antyodaya (Yellow) vs PHH (Orange)
        const fpsId = i % 2 === 1 ? 'FPS1001' : 'FPS1002';
        const memberCount = (i % 4) + 2; // 2 to 5 members
        const mobileNum = `98220${String(10000 + i).slice(-5)}`;

        const familyMembers = [
            {
                name: `${fn.en} ${ln.split(' ')[0]} (${fn.mr} ${ln.split(' ')[1] || ''})`,
                relation: 'Head',
                age: 40 + (i % 28),
                gender: fn.g,
                aadhaarLinked: true,
                aadhaarNo: `XXXX-XXXX-${String(1000 + i).slice(-4)}`,
                photo: fn.g === 'Male' ? '👨‍🌾' : '🧕'
            }
        ];

        if (memberCount >= 2) {
            familyMembers.push({
                name: fn.g === 'Male' ? `Sunita ${ln.split(' ')[0]} (सुनिता)` : `Sambhaji ${ln.split(' ')[0]} (संभाजी)`,
                relation: fn.g === 'Male' ? 'Wife' : 'Husband',
                age: 36 + (i % 24),
                gender: fn.g === 'Male' ? 'Female' : 'Male',
                aadhaarLinked: true,
                aadhaarNo: `XXXX-XXXX-${String(2000 + i).slice(-4)}`,
                photo: fn.g === 'Male' ? '🧕' : '👨‍🌾'
            });
        }
        if (memberCount >= 3) {
            familyMembers.push({
                name: `Ganesh ${ln.split(' ')[0]} (गणेश)`,
                relation: 'Son',
                age: 16 + (i % 10),
                gender: 'Male',
                aadhaarLinked: true,
                aadhaarNo: `XXXX-XXXX-${String(3000 + i).slice(-4)}`,
                photo: '👦'
            });
        }
        if (memberCount >= 4) {
            familyMembers.push({
                name: `Radha ${ln.split(' ')[0]} (राधा)`,
                relation: 'Daughter',
                age: 12 + (i % 8),
                gender: 'Female',
                aadhaarLinked: true,
                aadhaarNo: `XXXX-XXXX-${String(4000 + i).slice(-4)}`,
                photo: '👧'
            });
        }
        if (memberCount >= 5) {
            familyMembers.push({
                name: `Dattatray ${ln.split(' ')[0]} (दत्तात्रय)`,
                relation: 'Father',
                age: 68 + (i % 10),
                gender: 'Male',
                aadhaarLinked: true,
                aadhaarNo: `XXXX-XXXX-${String(5000 + i).slice(-4)}`,
                photo: '👴'
            });
        }

        const riceKg = isAAY ? 20 : memberCount * 3;
        const wheatKg = isAAY ? 15 : memberCount * 2;
        const sugarKg = isAAY ? 1 : (memberCount > 3 ? 1 : 0);
        const oilLitres = isAAY ? 1 : 0;

        const currentQuota = {
            month: 'August 2026',
            status: i % 7 === 0 ? 'COLLECTED' : 'AVAILABLE',
            rice: { kg: riceKg, ratePerKg: 0, total: 0 },
            wheat: { kg: wheatKg, ratePerKg: 0, total: 0 },
            sugar: { kg: sugarKg, ratePerKg: 20, total: sugarKg * 20 },
            oil: { litres: oilLitres, ratePerLitre: 100, total: oilLitres * 100 }
        };

        const passbook = [
            {
                month: 'July 2026',
                date: '2026-07-06 11:20 AM',
                tokenNo: `TK-${String(100 + (i % 40)).padStart(3, '0')}`,
                fpsId: fpsId,
                dealerName: fpsId === 'FPS1001' ? 'Chandrakant Kadam (चंद्रकांत कदम)' : 'Dnyaneshwar Shinde (ज्ञानेश्वर शिंदे)',
                items: [
                    { name: 'Rice (तांदूळ)', qty: `${riceKg} kg`, price: '₹0 (Free)' },
                    { name: 'Wheat (गहू)', qty: `${wheatKg} kg`, price: '₹0 (Free)' },
                    { name: 'Sugar (साखर)', qty: `${sugarKg} kg`, price: `₹${sugarKg * 20}` }
                ],
                totalAmount: sugarKg * 20,
                verificationMethod: 'Aadhaar Biometric e-KYC',
                receiptId: `RCP-20260706-${String(i).padStart(4, '0')}`
            },
            {
                month: 'June 2026',
                date: '2026-06-08 04:45 PM',
                tokenNo: `TK-${String(80 + (i % 30)).padStart(3, '0')}`,
                fpsId: fpsId,
                dealerName: fpsId === 'FPS1001' ? 'Chandrakant Kadam (चंद्रकांत कदम)' : 'Dnyaneshwar Shinde (ज्ञानेश्वर शिंदे)',
                items: [
                    { name: 'Rice (तांदूळ)', qty: `${riceKg} kg`, price: '₹0 (Free)' },
                    { name: 'Wheat (गहू)', qty: `${wheatKg} kg`, price: '₹0 (Free)' }
                ],
                totalAmount: 0,
                verificationMethod: 'OTP Mobile Authentication',
                receiptId: `RCP-20260608-${String(i).padStart(4, '0')}`
            }
        ];

        families.push({
            cardNumber: cardNum,
            pin: '1234',
            password: '1234',
            headOfFamily: `${fn.en} ${ln.split(' ')[0]}`,
            headOfFamilyMarathi: `${fn.mr} ${ln.split(' ')[1] || ''}`.replace(/[()]/g, '').trim(),
            gender: fn.g,
            category: isAAY ? 'AAY' : 'PHH',
            cardColor: isAAY ? 'yellow' : 'orange',
            assignedFPS: fpsId,
            district: dist,
            state: 'Maharashtra',
            mobile: mobileNum,
            familyMembers: familyMembers,
            currentQuota: currentQuota,
            activeToken: null,
            passbook: passbook
        });
    }

    return families;
}

const completeDatabase = {
    shops: [
        {
            id: 'FPS1001',
            password: 'shop1234',
            adminPass: 'admin',
            name: 'Shree Gajanan Maharaj Sahakari FPS',
            marathiName: 'श्री गजानन महाराज सहकारी रास्त भाव धान्य दुकान',
            dealerName: 'Chandrakant Vithalrao Kadam (चंद्रकांत विठ्ठलराव कदम)',
            contact: '+91 98220 54321',
            location: 'Pune Rural - Baramati Ward #4',
            pincode: '413102',
            isOpen: true,
            currentServingToken: 14,
            godownDeliveryDate: '2026-08-01',
            inventory: {
                rice: { dispatched: 15000, distributed: 4850 },
                wheat: { dispatched: 12000, distributed: 3600 },
                sugar: { dispatched: 2500, distributed: 890 },
                oil: { dispatched: 1800, distributed: 510 }
            },
            slots: {
                slot1: { id: 'slot1', label: '10:00 AM - 12:00 PM', time: '10:00 - 12:00', max: 50, booked: 18 },
                slot2: { id: 'slot2', label: '12:00 PM - 02:00 PM', time: '12:00 - 14:00', max: 50, booked: 14 },
                slot3: { id: 'slot3', label: '04:00 PM - 08:00 PM', time: '16:00 - 20:00', max: 60, booked: 21 }
            }
        },
        {
            id: 'FPS1002',
            password: 'shop1002',
            adminPass: 'admin',
            name: 'Jai Kisan Gramin Sahakari Bhandar',
            marathiName: 'जय किसान ग्रामीण सहकारी धान्य भांडार',
            dealerName: 'Dnyaneshwar Mahadevrao Shinde (ज्ञानेश्वर महादेवराव शिंदे)',
            contact: '+91 98221 98765',
            location: 'Satara District - Karad East',
            pincode: '415110',
            isOpen: true,
            currentServingToken: 9,
            godownDeliveryDate: '2026-08-02',
            inventory: {
                rice: { dispatched: 14000, distributed: 3900 },
                wheat: { dispatched: 11000, distributed: 2880 },
                sugar: { dispatched: 2200, distributed: 720 },
                oil: { dispatched: 1600, distributed: 440 }
            },
            slots: {
                slot1: { id: 'slot1', label: '10:00 AM - 12:00 PM', time: '10:00 - 12:00', max: 50, booked: 12 },
                slot2: { id: 'slot2', label: '12:00 PM - 02:00 PM', time: '12:00 - 14:00', max: 50, booked: 8 },
                slot3: { id: 'slot3', label: '04:00 PM - 08:00 PM', time: '16:00 - 20:00', max: 60, booked: 15 }
            }
        }
    ],
    citizens: generate500Families(),
    modifications: [],
    grievances: [
        {
            id: 'GRV-2026-108',
            cardNumber: 'MH-PDS-2026-0012',
            citizenName: 'Kishor More (किशोर मोरे)',
            fpsId: 'FPS1001',
            fpsName: 'Shree Gajanan Maharaj Sahakari FPS',
            issueType: 'DENIED_RATION',
            title: 'Dealer claimed stock finished despite portal showing 10,150 kg balance',
            timestamp: '2026-08-15 11:15 AM',
            status: 'INVESTIGATING',
            priority: 'CRITICAL',
            actionTaken: 'Food Supply Inspector dispatched to FPS1001'
        },
        {
            id: 'GRV-2026-102',
            cardNumber: 'MH-PDS-2026-0045',
            citizenName: 'Anusaya Bai (अनुसया बाई)',
            fpsId: 'FPS1002',
            fpsName: 'Jai Kisan Gramin Sahakari Bhandar',
            issueType: 'OVERCHARGING',
            title: 'Demanded ₹50 extra for sugar handling charges',
            timestamp: '2026-08-14 03:30 PM',
            status: 'RESOLVED',
            priority: 'HIGH',
            actionTaken: 'Fine of ₹5,000 imposed on FPS1002 and ₹50 refunded to citizen'
        }
    ],
    adminStats: {
        totalFairPriceShops: 52410,
        activeShopsOnline: 51892,
        totalBeneficiaries: 18452090,
        totalTokensBookedToday: 642890,
        totalRationDistributedMT: 12480.5,
        totalGrievancesLogged: 34,
        grievancesResolvedToday: 29,
        aiAnomaliesFlagged: 3
    }
};

fs.writeFileSync(DB_FILE, JSON.stringify(completeDatabase, null, 2), 'utf8');
console.log(`✅ Successfully seeded ${completeDatabase.citizens.length} realistic citizens into ${DB_FILE}`);
console.log(`👤 Customer #1: ${completeDatabase.citizens[0].headOfFamily} (${completeDatabase.citizens[0].cardNumber}) - PIN: "1234"`);
console.log(`🏪 Shopkeeper #1: ${completeDatabase.shops[0].dealerName} (${completeDatabase.shops[0].id}) - Password: "${completeDatabase.shops[0].password}"`);
