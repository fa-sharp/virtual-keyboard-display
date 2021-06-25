import { Sampler } from "tone";

const samples = {
    C4: "C4.wav",
    "D#4": "Ds4.wav",
    "F#4": "Fs4.wav",
    "A4": "A4.wav"
};

const audioPath = "audio/";

export const pianoSampler = new Sampler(samples, {release: 1, baseUrl: audioPath}).toDestination();