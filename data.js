/**
 * Annasetu (अन्नसेतू) - SmartPDS Data Layer
 * State Management and 200+ Citizen Database
 */

const STORAGE_KEY = 'ANNASETU_PDS_STATE_V3';

// Generator for 200 realistic Indian families
function generate200Families() {
    const firstNames = [
        { en: 'Tukaram', mr: 'तुकाराम', hi: 'तुकाराम', g: 'Male' },
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
        { en: 'Santosh', mr: 'संतोष', hi: 'संतोष', g: 'Male' },
        { en: 'Surekha', mr: 'सुरेखा', hi: 'सुरेखा', g: 'Female' },
        { en: 'Ashok', mr: 'अशोक', hi: 'अशोक', g: 'Male' }
    ];

    const lastNames = [
        'Jadhav (जाधव)', 'Patil (पाटील)', 'Gaikwad (गायकवाड)', 'Shinde (शिंदे)', 
        'Pawar (पवार)', 'Kadam (कदम)', 'Chavan (चव्हाण)', 'More (मोरे)', 
        'Deshmukh (देशमुख)', 'Bhosale (भोसले)', 'Koli (कोळी)', 'Sawant (सावंत)',
        'Salunkhe (साळुंखे)', 'Ghuge (घुगे)', 'Mane (माने)', 'Suryavanshi (सूर्यवंशी)',
        'Raut (राऊत)', 'Gholap (घोळप)', 'Kharat (खरात)', 'Waghmare (वाघमारे)'
    ];

    const districts = ['Pune Rural', 'Satara', 'Solapur', 'Kolhapur', 'Ahmednagar', 'Sangli', 'Nashik', 'Nagpur', 'Aurangabad', 'Amravati'];

    const families = [];

    for (let i = 1; i <= 200; i++) {
        const cardNum = `MH-PDS-2026-${String(i).padStart(4, '0')}`;
        const fn = firstNames[(i - 1) % firstNames.length];
        const ln = lastNames[(i - 1) % lastNames.length];
        const dist = districts[(i - 1) % districts.length];
        const isAAY = i % 3 === 1;
        const fpsId = i % 2 === 1 ? 'FPS1001' : 'FPS1002';
        const memberCount = (i % 4) + 2;

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
                name: `Anusaya ${ln.split(' ')[0]} (अनुसया)`,
                relation: 'Mother',
                age: 65 + (i % 12),
                gender: 'Female',
                aadhaarLinked: true,
                aadhaarNo: `XXXX-XXXX-${String(5000 + i).slice(-4)}`,
                photo: '👵'
            });
        }

        const riceKg = isAAY ? 20 : (memberCount * 3);
        const wheatKg = isAAY ? 15 : (memberCount * 2);
        const sugarKg = isAAY ? 2 : 1;
        const oilL = isAAY ? 1 : 0;

        const riceRate = isAAY ? 0 : 3;
        const wheatRate = isAAY ? 0 : 2;
        const sugarRate = 20;
        const oilRate = 45;

        families.push({
            cardNumber: cardNum,
            pin: '1234',
            password: '1234',
            headOfFamily: `${fn.en} ${ln.split(' ')[0]}`,
            headOfFamilyMarathi: `${fn.mr} ${ln.split(' ')[1]?.replace(/[()]/g, '') || ln.split(' ')[0]}`,
            headOfFamilyHindi: `${fn.hi} ${ln.split(' ')[1]?.replace(/[()]/g, '') || ln.split(' ')[0]}`,
            gender: fn.g,
            age: 42 + (i % 25),
            category: isAAY ? 'AAY' : 'PHH',
            categoryName: isAAY ? 'Antyodaya Anna Yojana (पिवळे कार्ड)' : 'Priority Household (केशरी कार्ड)',
            cardColor: isAAY ? 'yellow' : 'orange',
            district: dist,
            mobile: `98****${String(1000 + i * 37).slice(-4)}`,
            assignedFPS: fpsId,
            familyMembers: familyMembers,
            currentQuota: {
                month: 'August 2026',
                status: (i === 2) ? 'BOOKED' : 'AVAILABLE',
                rice: { kg: riceKg, ratePerKg: riceRate, total: riceKg * riceRate },
                wheat: { kg: wheatKg, ratePerKg: wheatRate, total: wheatKg * wheatRate },
                sugar: { kg: sugarKg, ratePerKg: sugarRate, total: sugarKg * sugarRate },
                oil: { litres: oilL, ratePerLitre: oilRate, total: oilL * oilRate }
            },
            activeToken: (i === 2) ? {
                tokenNo: 'TK-018',
                slotId: 'slot1',
                slotLabel: '10:00 AM - 12:00 PM',
                date: '2026-08-15',
                otp: '7842',
                status: 'READY_FOR_PICKUP',
                queuePosition: 4
            } : null,
            passbook: [
                {
                    month: 'July 2026',
                    date: '2026-07-08 11:24 AM',
                    tokenNo: `TK-07${String(i).padStart(2, '0')}`,
                    fpsId: fpsId,
                    dealerName: fpsId === 'FPS1001' ? 'Rameshwar Patil' : 'Santosh Shinde',
                    items: [
                        { name: 'Rice (तांदूळ)', qty: `${riceKg} kg`, price: `₹${riceKg * riceRate}` },
                        { name: 'Wheat (गहू)', qty: `${wheatKg} kg`, price: `₹${wheatKg * wheatRate}` },
                        { name: 'Sugar (साखर)', qty: `${sugarKg} kg`, price: `₹${sugarKg * sugarRate}` }
                    ],
                    totalAmount: (riceKg * riceRate) + (wheatKg * wheatRate) + (sugarKg * sugarRate),
                    verificationMethod: 'Aadhaar OTP Verified',
                    receiptId: `RCP-20260708-${String(i).padStart(4, '0')}`
                }
            ]
        });
    }

    return families;
}

const defaultInitialState = {
    session: {
        isLoggedIn: false,
        role: null, // 'citizen' | 'shopkeeper' | 'admin'
        citizenCard: null,
        shopId: null,
        adminId: null
    },
    shops: [
        {
            id: 'FPS1001',
            password: '1234',
            adminPass: 'admin',
            name: 'Shivaji Maharaj Sahakari FPS',
            marathiName: 'श्री शिवाजी महाराज सहकारी रास्त भाव धान्य दुकान',
            dealerName: 'Rameshwar Patil (रामेश्वर पाटील)',
            contact: '+91 98220 12345',
            location: 'Pune Rural - Baramati Ward #4',
            pincode: '413102',
            isOpen: true,
            currentServingToken: 14,
            godownDeliveryDate: '2026-08-01',
            inventory: {
                rice: { dispatched: 8000, distributed: 2850 },
                wheat: { dispatched: 6500, distributed: 2100 },
                sugar: { dispatched: 1200, distributed: 490 },
                oil: { dispatched: 900, distributed: 310 }
            },
            slots: {
                slot1: { id: 'slot1', label: '10:00 AM - 12:00 PM', time: '10:00 - 12:00', max: 50, booked: 18 },
                slot2: { id: 'slot2', label: '12:00 PM - 02:00 PM', time: '12:00 - 14:00', max: 50, booked: 14 },
                slot3: { id: 'slot3', label: '04:00 PM - 08:00 PM', time: '16:00 - 20:00', max: 60, booked: 21 }
            }
        },
        {
            id: 'FPS1002',
            password: '1234',
            adminPass: 'admin',
            name: 'Kisan Seva Kendra FPS',
            marathiName: 'किसान सेवा केंद्र रास्त भाव दुकान',
            dealerName: 'Santosh Shinde (संतोष शिंदे)',
            contact: '+91 98221 67890',
            location: 'Satara District - Karad East',
            pincode: '415110',
            isOpen: true,
            currentServingToken: 9,
            godownDeliveryDate: '2026-08-02',
            inventory: {
                rice: { dispatched: 7500, distributed: 1900 },
                wheat: { dispatched: 5500, distributed: 1480 },
                sugar: { dispatched: 1100, distributed: 390 },
                oil: { dispatched: 800, distributed: 240 }
            },
            slots: {
                slot1: { id: 'slot1', label: '10:00 AM - 12:00 PM', time: '10:00 - 12:00', max: 50, booked: 12 },
                slot2: { id: 'slot2', label: '12:00 PM - 02:00 PM', time: '12:00 - 14:00', max: 50, booked: 8 },
                slot3: { id: 'slot3', label: '04:00 PM - 08:00 PM', time: '16:00 - 20:00', max: 60, booked: 15 }
            }
        }
    ],
    citizens: generate200Families(),
    grievances: [
        {
            id: 'GRV-2026-108',
            cardNumber: 'MH-PDS-2026-0012',
            citizenName: 'Kishor More (किशोर मोरे)',
            fpsId: 'FPS1001',
            fpsName: 'Shivaji Maharaj Sahakari FPS',
            issueType: 'DENIED_RATION',
            title: 'Dealer claimed stock finished despite portal showing 5,150 kg balance',
            timestamp: '2026-08-15 11:15 AM',
            status: 'INVESTIGATING',
            priority: 'CRITICAL',
            actionTaken: 'Food Supply Inspector Shri S. Deshmukh dispatched to FPS1001'
        },
        {
            id: 'GRV-2026-102',
            cardNumber: 'MH-PDS-2026-0045',
            citizenName: 'Anusaya Bai (अनुसया बाई)',
            fpsId: 'FPS1002',
            fpsName: 'Kisan Seva Kendra FPS',
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
        const card = this.state.session.citizenCard || 'MH-PDS-2026-0001';
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

    setLanguage(lang) {
        if (!this.state) this.state = {};
        this.state.currentLanguage = lang;
        this.saveState();
    }
}

window.annasetuStore = new DataStore();
