/**
 * AnnaMitra (अन्नमित्र) - Voice Assistant & Audio Feedback System
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
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                osc.start(now);
                osc.stop(now + 0.45);
            } else if (type === 'alert' || type === 'sos') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(330, now + 0.15);
                osc.frequency.setValueAtTime(440, now + 0.3);
                gain.gain.setValueAtTime(0.4, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            } else {
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
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang || 'mr-IN';
        utterance.rate = 0.95;
        this.synth.speak(utterance);
    }
}

window.annasetuAudio = new AudioAssistant();
