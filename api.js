/**
 * Annasetu (अन्नसेतू) - Frontend API Client
 * Seamlessly interfaces with Node.js Express REST API backend.
 */

class AnnasetuAPI {
    constructor() {
        this.baseUrl = '';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API Error on ${endpoint}:`, error);
            return { success: false, error: 'Network error or server unreachable.' };
        }
    }

    // Auth Endpoints
    async loginCitizen(cardNumber, pin) {
        return this.request('/api/auth/citizen/login', {
            method: 'POST',
            body: JSON.stringify({ cardNumber, pin })
        });
    }

    async loginCitizenBiometric(cardNumber) {
        return this.request('/api/auth/citizen/biometric-login', {
            method: 'POST',
            body: JSON.stringify({ cardNumber })
        });
    }

    async sendCitizenOtp(identifier) {
        return this.request('/api/auth/citizen/send-otp', {
            method: 'POST',
            body: JSON.stringify({ identifier })
        });
    }

    async verifyCitizenOtp(identifier, otp) {
        return this.request('/api/auth/citizen/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ identifier, otp })
        });
    }

    async loginShopkeeper(fpsId, password) {
        return this.request('/api/auth/shopkeeper/login', {
            method: 'POST',
            body: JSON.stringify({ fpsId, password })
        });
    }

    // Citizen Endpoints
    async getCitizenDetails(cardNumber) {
        return this.request(`/api/citizen/details?cardNumber=${encodeURIComponent(cardNumber)}`);
    }

    async bookSlot(cardNumber, slotId, date) {
        return this.request('/api/citizen/book-slot', {
            method: 'POST',
            body: JSON.stringify({ cardNumber, slotId, date })
        });
    }

    async cancelSlot(cardNumber) {
        return this.request('/api/citizen/cancel-slot', {
            method: 'POST',
            body: JSON.stringify({ cardNumber })
        });
    }

    async fileSOS(cardNumber, issueType, details) {
        return this.request('/api/citizen/sos', {
            method: 'POST',
            body: JSON.stringify({ cardNumber, issueType, details })
        });
    }

    // Shopkeeper Endpoints
    async getShopDetails(fpsId) {
        return this.request(`/api/shop/details?fpsId=${encodeURIComponent(fpsId)}`);
    }

    async getAllCitizens() {
        return this.request('/api/shop/all-citizens');
    }

    async searchBeneficiary(query) {
        return this.request('/api/shop/search-beneficiary', {
            method: 'POST',
            body: JSON.stringify({ query })
        });
    }

    async dispenseRation(fpsId, cardNumber, otp) {
        return this.request('/api/shop/dispense', {
            method: 'POST',
            body: JSON.stringify({ fpsId, cardNumber, otp })
        });
    }

    async addFamilyMember(cardNumber, memberData) {
        return this.request('/api/shop/add-member', {
            method: 'POST',
            body: JSON.stringify({ cardNumber, ...memberData })
        });
    }

    async requestDeleteMember(data) {
        return this.request('/api/shop/request-delete-member', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async nextServingToken(fpsId) {
        return this.request('/api/shop/next-token', {
            method: 'POST',
            body: JSON.stringify({ fpsId })
        });
    }

    // Admin Endpoints
    async getAdminTelemetry() {
        return this.request('/api/admin/telemetry');
    }

    async getPendingRequests() {
        return this.request('/api/admin/pending-requests');
    }

    async approveRequest(requestId, action, remarks) {
        return this.request('/api/admin/approve-request', {
            method: 'POST',
            body: JSON.stringify({ requestId, action, remarks })
        });
    }

    async resolveGrievance(complaintId, actionText) {
        return this.request('/api/admin/resolve-grievance', {
            method: 'POST',
            body: JSON.stringify({ complaintId, actionText })
        });
    }
}

window.annasetuApi = new AnnasetuAPI();
