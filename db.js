/**
 * AnnaMitra (अन्नमित्र) - SQLite / Relational Database Layer
 * Stores Citizens (500), Quotas, Tokens, Fair Price Shops,
 * Grievances, and Pending Modification/Deletion Requests.
 */

const fs = require('fs');
const path = require('path');

function getDbFile() {
    const candidates = [
        path.join(__dirname, '..', 'data', 'annasetu.json'),
        path.join(__dirname, 'data', 'annasetu.json'),
        path.join(__dirname, 'annasetu.json'),
        path.join(__dirname, '..', 'annasetu.json'),
        path.join(process.cwd(), 'data', 'annasetu.json'),
        path.join(process.cwd(), 'annasetu.json')
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return candidates[0];
}

const DB_FILE = getDbFile();

class Database {
    constructor() {
        this.data = this.load();
    }

    load() {
        try {
            if (fs.existsSync(DB_FILE)) {
                const raw = fs.readFileSync(DB_FILE, 'utf8');
                const parsed = JSON.parse(raw);
                if (parsed.citizens && parsed.citizens.length >= 50) {
                    if (!parsed.modifications) parsed.modifications = [];
                    if (!parsed.queries) parsed.queries = [];
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Error reading database file:', e);
        }

        try {
            require('../seed.js');
            if (fs.existsSync(DB_FILE)) {
                const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                if (!parsed.modifications) parsed.modifications = [];
                if (!parsed.queries) parsed.queries = [];
                return parsed;
            }
        } catch (err) {
            console.error('Error seeding initial data:', err);
        }

        return { citizens: [], shops: [], grievances: [], modifications: [], queries: [], adminStats: {} };
    }

    save() {
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
        } catch (e) {
            console.error('Error writing database file:', e);
        }
    }

    // Universal Citizen Queries (Supports Ration Card # OR Any 10-Digit Mobile #)
    findCitizen(query) {
        if (!query) return null;
        const clean = query.toString().trim().toUpperCase();
        const cleanDigits = clean.replace(/\D/g, '');

        this.data = this.load();

        // 1. Search by Card Number
        let citizen = this.data.citizens.find(c => c.cardNumber.toUpperCase() === clean);
        if (citizen) return citizen;

        // 2. Search by Mobile Number
        if (cleanDigits.length >= 10) {
            const phoneSuffix = cleanDigits.slice(-10);
            citizen = this.data.citizens.find(c => c.mobile && c.mobile.replace(/\D/g, '').endsWith(phoneSuffix));
            if (citizen) return citizen;

            // 3. Dynamic Self-Registration / Association for Custom User Phone Numbers
            // If user enters their real personal phone number for demo, dynamically link it to the primary demo card
            citizen = this.data.citizens[0];
            if (citizen) {
                citizen.mobile = phoneSuffix;
                this.save();
                return citizen;
            }
        }

        // 4. Case-insensitive substring match on name
        citizen = this.data.citizens.find(c => c.headOfFamily.toUpperCase().includes(clean));
        return citizen || null;
    }

    // Shop Queries
    findShop(fpsId) {
        if (!fpsId) return this.data.shops[0];
        const clean = fpsId.trim().toUpperCase();
        return this.data.shops.find(s => s.id.toUpperCase() === clean) || this.data.shops[0];
    }
}

module.exports = new Database();
