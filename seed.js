/**
 * AnnaMitra (अन्नमित्र) - Standalone Database Seeder
 * Seeds 500 realistic Indian families/citizens into the database.
 * Primary Customer: Laxmibai Dashrath Gaikwad (MH-PDS-2026-4420) - PIN: "1111"
 * Shopkeeper: Shivaji Maharaj Sahakari FPS (FPS1001) - Password: "shop8888"
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
        { en: 'Laxmibai', mr: 'लक्ष्मीबाई', hi: 'लक्ष्मीबाई', g: 'Female' },
        { en: 'Tukaram', mr: 'तुकाराम', hi: 'तुकाराम', g: 'Male' },
        { en: 'Santoshrao', mr: 'संतोषराव', hi: 'संतोषराव', g: 'Male' },
        { en: 'Sunita', mr: 'सुनिता', hi: 'सुनिता', g: 'Female' },
        { en: 'Sambhaji', mr: 'संभाजी', hi: 'संभाजी', g: 'Male' },
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

    // Family 1: Laxmibai Dashrath Gaikwad (MH-PDS-2026-4420)
    families.push({
        cardNumber: 'MH-PDS-2026-4420',
        pin: '1111',
        password: '1111',
        headOfFamily: 'Laxmibai Dashrath Gaikwad',
        headOfFamilyMarathi: 'लक्ष्मीबाई दशरथ गायकवाड',
        gender: 'Female',
        category: 'PHH',
        cardColor: 'orange',
        categoryName: 'Priority Household (केशरी कार्ड)',
        assignedFPS: 'FPS1001',
        district: 'Pune Rural',
        state: 'Maharashtra',
        mobile: '9876543210',
        familyMembers: [
            {
                name: 'Laxmibai Gaikwad (लक्ष्मीबाई गायकवाड)',
                relation: 'Head',
                age: 62,
                gender: 'Female',
                aadhaarLinked: true,
                aadhaarNo: 'XXXX-XXXX-4420',
                photo: '👵'
            },
            {
                name: 'Prakash Gaikwad (प्रकाश गायकवाड)',
                relation: 'Son',
                age: 35,
                gender: 'Male',
                aadhaarLinked: true,
                aadhaarNo: 'XXXX-XXXX-8912',
                photo: '👨'
            },
            {
                name: 'Kavita Gaikwad (कविता गायकवाड)',
                relation: 'Daughter-in-law',
                age: 30,
                gender: 'Female',
                aadhaarLinked: true,
                aadhaarNo: 'XXXX-XXXX-3341',
                photo: '👩'
            }
        ],
        currentQuota: {
            month: 'August 2026',
            status: 'BOOKED',
            rice: { kg: 9, ratePerKg: 0, total: 0 },
            wheat: { kg: 6, ratePerKg: 0, total: 0 },
            sugar: { kg: 1, ratePerKg: 20, total: 20 },
            oil: { litres: 0, ratePerLitre: 100, total: 0 }
        },
        activeToken: {
            tokenNo: 'TK-029',
            slotId: 'slot1',
            slotLabel: 'Morning Slot (10:00 AM – 12:00 PM)',
            date: '2026-08-20',
            otp: '4829',
            issuedAt: '2026-08-19 10:15 AM'
        },
        passbook: [
            {
                month: 'July 2026',
                date: '2026-07-06 11:20 AM',
                tokenNo: 'TK-018',
                fpsId: 'FPS1001',
                dealerName: 'Chandrakant Vithalrao Kadam (चंद्रकांत कदम)',
                items: [
                    { name: 'Rice (तांदूळ)', qty: '9 kg', price: '₹0 (Free)' },
                    { name: 'Wheat (गहू)', qty: '6 kg', price: '₹0 (Free)' },
                    { name: 'Sugar (साखर)', qty: '1 kg', price: '₹20' }
                ],
                totalAmount: 20,
                verificationMethod: 'Aadhaar Biometric e-KYC',
                receiptId: 'RCP-20260706-4420'
            },
            {
                month: 'June 2026',
                date: '2026-06-08 04:45 PM',
                tokenNo: 'TK-031',
                fpsId: 'FPS1001',
                dealerName: 'Chandrakant Vithalrao Kadam (चंद्रकांत कदम)',
                items: [
                    { name: 'Rice (तांदूळ)', qty: '9 kg', price: '₹0 (Free)' },
                    { name: 'Wheat (गहू)', qty: '6 kg', price: '₹0 (Free)' }
                ],
                totalAmount: 0,
                verificationMethod: 'OTP Mobile Authentication',
                receiptId: 'RCP-20260608-4420'
            }
        ]
    });

    // Family 2: Tukaram Jadhav (AAY - पिवळे कार्ड)
    families.push({
        cardNumber: 'MH-PDS-2026-0001',
        pin: '1111',
        password: '1111',
        headOfFamily: 'Tukaram Pandurang Jadhav',
        headOfFamilyMarathi: 'तुकाराम पांडुरंग जाधव',
        gender: 'Male',
        category: 'AAY',
        cardColor: 'yellow',
        categoryName: 'Antyodaya Anna Yojana (AAY - पिवळे कार्ड)',
        assignedFPS: 'FPS1001',
        district: 'Pune Rural',
        state: 'Maharashtra',
        mobile: '9822010001',
        familyMembers: [
            {
                name: 'Tukaram Jadhav (तुकाराम जाधव)',
                relation: 'Head',
                age: 58,
                gender: 'Male',
                aadhaarLinked: true,
                aadhaarNo: 'XXXX-XXXX-1001',
                photo: '👨‍🌾'
            },
            {
                name: 'Sunita Jadhav (सुनिता जाधव)',
                relation: 'Wife',
                age: 52,
                gender: 'Female',
                aadhaarLinked: true,
                aadhaarNo: 'XXXX-XXXX-2001',
                photo: '🧕'
            },
            {
                name: 'Ganesh Jadhav (गणेश जाधव)',
                relation: 'Son',
                age: 24,
                gender: 'Male',
                aadhaarLinked: true,
                aadhaarNo: 'XXXX-XXXX-3001',
                photo: '👦'
            }
        ],
        currentQuota: {
            month: 'August 2026',
            status: 'AVAILABLE',
            rice: { kg: 20, ratePerKg: 0, total: 0 },
            wheat: { kg: 15, ratePerKg: 0, total: 0 },
            sugar: { kg: 1, ratePerKg: 20, total: 20 },
            oil: { litres: 1, ratePerLitre: 100, total: 100 }
        },
        activeToken: null,
        passbook: [
            {
                month: 'July 2026',
                date: '2026-07-04 10:30 AM',
                tokenNo: 'TK-012',
                fpsId: 'FPS1001',
                dealerName: 'Chandrakant Vithalrao Kadam (चंद्रकांत कदम)',
                items: [
                    { name: 'Rice (तांदूळ)', qty: '20 kg', price: '₹0 (Free)' },
                    { name: 'Wheat (गहू)', qty: '15 kg', price: '₹0 (Free)' },
                    { name: 'Sugar (साखर)', qty: '1 kg', price: '₹20' },
                    { name: 'Cooking Oil (तेल)', qty: '1 L', price: '₹100' }
                ],
                totalAmount: 120,
                verificationMethod: 'Aadhaar Biometric e-KYC',
                receiptId: 'RCP-20260704-0001'
            }
        ]
    });

    for (let i = 3; i <= 500; i++) {
        const cardNum = `MH-PDS-2026-${String(i).padStart(4, '0')}`;
        const fn = firstNames[(i - 1) % firstNames.length];
        const ln = lastNames[(i - 1) % lastNames.length];
        const dist = districts[(i - 1) % districts.length];
        const isAAY = i % 3 === 1;
        const fpsId = i % 2 === 1 ? 'FPS1001' : 'FPS1002';
        const memberCount = (i % 4) + 2;
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
                dealerName: fpsId === 'FPS1001' ? 'Chandrakant Vithalrao Kadam (चंद्रकांत कदम)' : 'Dnyaneshwar Shinde (ज्ञानेश्वर शिंदे)',
                items: [
                    { name: 'Rice (तांदूळ)', qty: `${riceKg} kg`, price: '₹0 (Free)' },
                    { name: 'Wheat (गहू)', qty: `${wheatKg} kg`, price: '₹0 (Free)' },
                    { name: 'Sugar (साखर)', qty: `${sugarKg} kg`, price: `₹${sugarKg * 20}` }
                ],
                totalAmount: sugarKg * 20,
                verificationMethod: 'Aadhaar Biometric e-KYC',
                receiptId: `RCP-20260706-${String(i).padStart(4, '0')}`
            }
        ];

        families.push({
            cardNumber: cardNum,
            pin: '1111',
            password: '1111',
            headOfFamily: `${fn.en} ${ln.split(' ')[0]}`,
            headOfFamilyMarathi: `${fn.mr} ${ln.split(' ')[1] || ''}`.replace(/[()]/g, '').trim(),
            gender: fn.g,
            category: isAAY ? 'AAY' : 'PHH',
            cardColor: isAAY ? 'yellow' : 'orange',
            categoryName: isAAY ? 'Antyodaya Anna Yojana (AAY - पिवळे कार्ड)' : 'Priority Household (PHH - केशरी कार्ड)',
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
            password: 'shop8888',
            adminPass: 'dealer',
            name: 'Shivaji Maharaj Sahakari FPS',
            marathiName: 'श्री शिवाजी महाराज सहकारी रास्त भाव धान्य दुकान',
            dealerName: 'Chandrakant Vithalrao Kadam (चंद्रकांत विठ्ठलराव कदम)',
            contact: '+91 98220 54321',
            location: 'Pune Rural - Baramati Ward #4',
            pincode: '413102',
            isOpen: true,
            currentServingToken: 14,
            godownDeliveryDate: '2026-08-01',
            inventory: {
                rice: { dispatched: 15000, distributed: 4850 },
                wheat: { dispatched: 6000, distributed: 4900 },
                sugar: { dispatched: 1000, distributed: 790 },
                oil: { dispatched: 1800, distributed: 510 }
            },
            slots: {
                slot1: { id: 'slot1', label: 'Morning Slot (10:00 AM – 12:00 PM)', time: '10:00 - 12:00', max: 50, booked: 43 },
                slot2: { id: 'slot2', label: 'Mid-Day Slot (12:00 PM – 02:00 PM)', time: '12:00 - 14:00', max: 50, booked: 39 },
                slot3: { id: 'slot3', label: 'Evening Slot (04:00 PM – 08:00 PM)', time: '16:00 - 20:00', max: 60, booked: 46 }
            }
        },
        {
            id: 'FPS1002',
            password: 'shop1002',
            adminPass: 'dealer',
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
                rice: { dispatched: 12000, distributed: 3600 },
                wheat: { dispatched: 10000, distributed: 2800 },
                sugar: { dispatched: 2000, distributed: 600 },
                oil: { dispatched: 1200, distributed: 340 }
            },
            slots: {
                slot1: { id: 'slot1', label: 'Morning Slot (10:00 AM – 12:00 PM)', time: '10:00 - 12:00', max: 50, booked: 20 },
                slot2: { id: 'slot2', label: 'Mid-Day Slot (12:00 PM – 02:00 PM)', time: '12:00 - 14:00', max: 50, booked: 15 },
                slot3: { id: 'slot3', label: 'Evening Slot (04:00 PM – 08:00 PM)', time: '16:00 - 20:00', max: 60, booked: 18 }
            }
        }
    ],
    citizens: generate500Families(),
    modifications: [],
    queries: [
        {
            id: 'QRY-2026-001',
            cardNumber: 'MH-PDS-2026-4420',
            citizenName: 'Laxmibai Dashrath Gaikwad (लक्ष्मीबाई गायकवाड)',
            district: 'Pune Rural',
            assignedFPS: 'FPS1001',
            category: 'SCHEME_ELIGIBILITY',
            categoryLabel: '📜 प्राधान्य कुटुंब (PHH) धान्य वाटप चौकशी',
            subject: 'दरमहा गहू व तांदूळ मोफत वाटपाबाबत चौकशी',
            message: 'नमस्कार साहेब, आमच्या केशरी रेशन कार्डावर ३ व्यक्तींचे एकूण १५ किलो धान्य (९ किलो तांदूळ + ६ किलो गहू) मोफत मिळते. या महिन्याचे धान्य दुकानात उपलब्ध झाले आहे का?',
            submittedAt: '2026-08-16 10:30 AM',
            status: 'OFFICER_REPLIED',
            officerReply: 'होय लक्ष्मीबाईजी. आपल्या अधिकृत शिवाजी महाराज सहकारी दुकानात (FPS1001) ऑगस्ट महिन्याचा साठा उपलब्ध आहे. आपण बुक केलेल्या TK-029 टोकननुसार सकाळी १० ते १२ या वेळेत जाऊन धान्य घेऊ शकता.',
            repliedAt: '2026-08-16 02:15 PM',
            officerName: 'Shri R. V. Kulkarni (District Civil Supplies Officer, Pune)'
        },
        {
            id: 'QRY-2026-002',
            cardNumber: 'MH-PDS-2026-4420',
            citizenName: 'Laxmibai Dashrath Gaikwad (लक्ष्मीबाई गायकवाड)',
            district: 'Pune Rural',
            assignedFPS: 'FPS1001',
            category: 'MEMBER_UPDATE',
            categoryLabel: '🏷️ रेशन कार्डात नवीन बालकाचे नाव नोंदणी',
            subject: 'रेशन कार्डात नवीन बालकाचे नाव नोंदणी प्रक्रिया',
            message: 'आमच्या कुटुंबात नवजात बाळ जन्माला आले आहे. त्याचे नाव रेशन कार्डात जोडण्यासाठी कोणत्या कागदपत्रांची आवश्यकता आहे?',
            submittedAt: '2026-08-18 09:45 AM',
            status: 'PENDING_REVIEW',
            officerReply: null,
            repliedAt: null,
            officerName: null
        }
    ],
    grievances: [
        {
            id: 'GRV-2026-108',
            cardNumber: 'MH-PDS-2026-0012',
            citizenName: 'Kishor More (किशोर मोरे)',
            fpsId: 'FPS1001',
            fpsName: 'Shivaji Maharaj Sahakari FPS',
            issueType: 'DENIED_RATION',
            title: 'Dealer claimed stock finished despite portal showing 10,150 kg balance',
            timestamp: '2026-08-15 11:15 AM',
            status: 'INVESTIGATING',
            priority: 'CRITICAL',
            actionTaken: 'Food Supply Inspector dispatched to FPS1001'
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

// Also write flat root fallback
const rootDbFile = path.join(__dirname, 'annasetu.json');
fs.writeFileSync(rootDbFile, JSON.stringify(completeDatabase, null, 2), 'utf8');

console.log(`✅ Successfully seeded 500 realistic citizens into ${DB_FILE}`);
console.log(`👤 Customer #1: Laxmibai Dashrath Gaikwad (MH-PDS-2026-4420) - PIN: "1111"`);
console.log(`🏪 Shopkeeper #1: Shivaji Maharaj Sahakari FPS (FPS1001) - Password: "shop8888"`);
