/**
 * AnnaMitra (अन्नमित्र) - SmartPDS Data Layer
 * State Management and 500+ Citizen Database with LocalStorage synchronization
 */

const STORAGE_KEY = 'ANNASETU_PDS_STATE_V5';

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
        { en: 'Kavita', mr: 'कविता', hi: 'कविता', g: 'Female' }
    ];

    const lastNames = [
        'Gaikwad (गायकवाड)', 'Jadhav (जाधव)', 'Patil (पाटील)', 'Shinde (शिंदे)', 
        'Pawar (पवार)', 'Kadam (कदम)', 'Chavan (चव्हाण)', 'More (मोरे)', 
        'Deshmukh (देशमुख)', 'Bhosale (भोसले)', 'Koli (कोळी)', 'Sawant (सावंत)'
    ];

    const districts = ['Pune Rural', 'Satara', 'Solapur', 'Kolhapur', 'Ahmednagar', 'Sangli', 'Nashik', 'Nagpur'];

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
        passbook: []
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
            familyMembers: [
                {
                    name: `${fn.en} ${ln.split(' ')[0]}`,
                    relation: 'Head',
                    age: 42,
                    gender: fn.g,
                    aadhaarLinked: true,
                    aadhaarNo: `XXXX-XXXX-${String(1000 + i).slice(-4)}`,
                    photo: fn.g === 'Male' ? '👨‍🌾' : '🧕'
                }
            ],
            currentQuota: {
                month: 'August 2026',
                status: 'AVAILABLE',
                rice: { kg: isAAY ? 20 : memberCount * 3, ratePerKg: 0, total: 0 },
                wheat: { kg: isAAY ? 15 : memberCount * 2, ratePerKg: 0, total: 0 },
                sugar: { kg: 1, ratePerKg: 20, total: 20 },
                oil: { litres: isAAY ? 1 : 0, ratePerLitre: 100, total: isAAY ? 100 : 0 }
            },
            activeToken: null,
            passbook: []
        });
    }

    return families;
}

const defaultInitialState = {
    session: {
        isLoggedIn: false,
        role: null,
        citizenCard: 'MH-PDS-2026-4420',
        shopId: 'FPS1001',
        adminId: null
    },
    currentLanguage: 'mr',
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
    grievances: [],
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

class DataStore {
    constructor() {
        this.state = this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.citizens && parsed.citizens.length >= 100) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Failed to load local state:', e);
        }
        const initial = JSON.parse(JSON.stringify(defaultInitialState));
        this.saveState(initial);
        return initial;
    }

    saveState(stateToSave) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave || this.state));
        } catch (e) {
            console.error('Failed to save local state:', e);
        }
    }

    logout() {
        this.state.session = {
            isLoggedIn: false,
            role: null,
            citizenCard: null,
            shopId: null,
            adminId: null
        };
        this.saveState();
    }

    getCurrentCitizen() {
        const card = this.state.session.citizenCard || 'MH-PDS-2026-4420';
        return this.state.citizens.find(c => c.cardNumber.toUpperCase() === card.toUpperCase()) || this.state.citizens[0];
    }

    getCurrentShop() {
        const shopId = this.state.session.shopId || 'FPS1001';
        return this.state.shops.find(s => s.id === shopId) || this.state.shops[0];
    }

    getCitizenByCard(cardNo) {
        if (!cardNo) return null;
        return this.state.citizens.find(c => c.cardNumber.toUpperCase() === cardNo.trim().toUpperCase());
    }

    getShop(fpsId) {
        if (!fpsId) return this.state.shops[0];
        return this.state.shops.find(s => s.id.toUpperCase() === fpsId.trim().toUpperCase()) || this.state.shops[0];
    }

    setLanguage(lang) {
        if (!this.state) this.state = {};
        this.state.currentLanguage = lang;
        this.saveState();
    }
}

window.annasetuStore = new DataStore();
