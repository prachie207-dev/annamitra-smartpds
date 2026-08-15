/**
 * Annasetu (अन्नसेतू) - Voice Assistant & Audio Feedback System
 * Designed specifically for low-literacy, rural, and elderly citizens.
 * Integrates Web Speech API (Marathi, Hindi, English) + Web Audio Synthesizer.
 */

class AudioAssistant {
    constructor() {
        this.synth = window.speechSynthesis;
        this.enabled = true;
        this.audioCtx = null;
        this.voices = [];
        this.initVoices();
    }

    initVoices() {
        if ('speechSynthesis' in window) {
            this.voices = this.synth.getVoices();
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = () => {
                    this.voices = this.synth.getVoices();
                };
            }
        }
    }

    getAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }

    // Play subtle synthetic audio cues (sound feedback)
    playChime(type = 'click') {
        if (!this.enabled) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'success') {
                // Happy high chime
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                osc.start(now);
                osc.stop(now + 0.45);
            } else if (type === 'alert' || type === 'sos') {
                // Urgent warning tone
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(330, now + 0.15);
                osc.frequency.setValueAtTime(440, now + 0.3);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            } else if (type === 'token') {
                // Token booking announcement sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            } else {
                // Clean subtle tap
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            }
        } catch (e) {
            console.warn('Audio chime error:', e);
        }
    }

    speak(text, lang = null) {
        if (!this.enabled || !('speechSynthesis' in window)) return;

        // Cancel existing utterance
        this.synth.cancel();

        const currentLang = lang || (window.annasetuI18n ? window.annasetuI18n.currentLang : 'mr');
        const utterance = new SpeechSynthesisUtterance(text);
        
        let targetVoiceLang = 'mr-IN';
        if (currentLang === 'hi') targetVoiceLang = 'hi-IN';
        if (currentLang === 'en') targetVoiceLang = 'en-IN';

        utterance.lang = targetVoiceLang;
        utterance.rate = 0.92; // Slightly slower pace for illiterate/elderly clarity
        utterance.pitch = 1.0;

        // Try finding matching voice
        const matchedVoice = this.voices.find(v => v.lang === targetVoiceLang || v.lang.startsWith(currentLang));
        if (matchedVoice) {
            utterance.voice = matchedVoice;
        }

        this.synth.speak(utterance);
    }

    speakQuota(quota) {
        const lang = window.annasetuI18n ? window.annasetuI18n.currentLang : 'mr';
        let text = '';
        if (lang === 'mr') {
            text = `ऑगस्ट महिन्यासाठी तुमचे हक्काचे धान्य: ${quota.rice.kg} किलो तांदूळ, ${quota.wheat.kg} किलो गहू, ${quota.sugar.kg} किलो साखर. एकूण देय रक्कम ₹${quota.rice.total + quota.wheat.total + quota.sugar.total + quota.oil.total} रुपये.`;
        } else if (lang === 'hi') {
            text = `अगस्त महीने के लिए आपका राशन: ${quota.rice.kg} किलो चावल, ${quota.wheat.kg} किलो गेहूं, ${quota.sugar.kg} किलो चीनी। कुल देय राशि ₹${quota.rice.total + quota.wheat.total + quota.sugar.total + quota.oil.total} रुपये।`;
        } else {
            text = `Your August ration quota: ${quota.rice.kg} kg rice, ${quota.wheat.kg} kg wheat, and ${quota.sugar.kg} kg sugar. Total amount payable is ₹${quota.rice.total + quota.wheat.total + quota.sugar.total + quota.oil.total}.`;
        }
        this.speak(text, lang);
    }

    speakToken(token) {
        const lang = window.annasetuI18n ? window.annasetuI18n.currentLang : 'mr';
        let text = '';
        if (lang === 'mr') {
            text = `तुमचे टोकन यशस्वीपणे बुक झाले आहे! टोकन क्रमांक ${token.tokenNo}. वेळ: ${token.slotLabel}. दुकानात धान्य घेताना तुमचा ओटीपी ${token.otp.split('').join(' ')} सांगा.`;
        } else if (lang === 'hi') {
            text = `आपका टोकन सफलतापूर्वक बुक हो गया है! टोकन नंबर ${token.tokenNo}. समय: ${token.slotLabel}. राशन लेते समय आपका ओटीपी ${token.otp.split('').join(' ')} बताएं।`;
        } else {
            text = `Your token has been successfully booked! Token number ${token.tokenNo}. Slot: ${token.slotLabel}. Share your OTP ${token.otp.split('').join(' ')} at the counter.`;
        }
        this.playChime('token');
        this.speak(text, lang);
    }

    speakSOS() {
        const lang = window.annasetuI18n ? window.annasetuI18n.currentLang : 'mr';
        let text = '';
        if (lang === 'mr') {
            text = `तुमची तातडीची तक्रार नोंदवली आहे. अन्न निरीक्षक व दक्षता पथकाला तात्काळ संदेश पाठवला गेला आहे.`;
        } else if (lang === 'hi') {
            text = `आपकी आपातकालीन शिकायत दर्ज कर ली गई है। खाद्य आपूर्ति निरीक्षक को तुरंत अलर्ट भेज दिया गया है।`;
        } else {
            text = `Your emergency SOS grievance has been dispatched to the District Food Supply Officer.`;
        }
        this.playChime('sos');
        this.speak(text, lang);
    }

    onLanguageChange(lang) {
        let welcomeText = '';
        if (lang === 'mr') welcomeText = 'अन्नसेतू प्रणालीमध्ये आपले स्वागत आहे.';
        else if (lang === 'hi') welcomeText = 'अन्नसेतू प्रणाली में आपका स्वागत है.';
        else welcomeText = 'Welcome to Annasetu Smart Public Distribution System.';
        this.speak(welcomeText, lang);
    }
}

window.annasetuAudio = new AudioAssistant();
