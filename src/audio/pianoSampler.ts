import { Sampler } from "tone";

const samples = {
    "C4": "C4.wav",
    "D#4": "Ds4.wav",
    "F#4": "Fs4.wav",
    "A4": "A4.wav",
    "C5": "C5.wav",
    "D#5": "Ds5.wav",
    "A5": "A5.wav",
    "C6": "C6.wav"
};

export const getPianoSampler = () => new Sampler(samples, { release: 1, baseUrl: "audio/" }).toDestination();