import { PolySynth, Sampler } from "tone";

/** The different instruments that users can choose for audio output */
export enum AppInstrument {
    PIANO = "Piano",
    GUITAR = "Guitar",
    SYNTH = "Synth",
    XYLOPHONE = "Xylophone",
}

/** Create the Tone.js instrument */
export const createInstrument = (chosenInstrument: AppInstrument) => {
    switch (chosenInstrument) {
        case AppInstrument.PIANO:
            return createPianoSampler();
        case AppInstrument.GUITAR:
            return createGuitarSampler();
        case AppInstrument.SYNTH:
            return createSynth();
        case AppInstrument.XYLOPHONE:
            return createXylophoneSampler();
        default:
            return null;
    }
}

export const createSynth = () => new PolySynth().toDestination();

const createPianoSampler = () => new Sampler(pianoSamples, { release: 1, baseUrl: "audio/piano/" }).toDestination();
const pianoSamples = {
    "C4": "C4.wav",
    "D#4": "Ds4.wav",
    "F#4": "Fs4.wav",
    "A4": "A4.wav",
    "C5": "C5.wav",
    "D#5": "Ds5.wav",
    "A5": "A5.wav",
    "C6": "C6.wav"
};

const createGuitarSampler = () => new Sampler(guitarSamples, { release: 1, baseUrl: "audio/guitar/" }).toDestination();
const guitarSamples = {
    A2: "A2.mp3",
    A3: "A3.mp3",
    A4: "A4.mp3",
    C3: "C3.mp3",
    C4: "C4.mp3",
    C5: "C5.mp3",
    D5: "D5.mp3",
    "D#2": "Ds2.mp3",
    "D#3": "Ds3.mp3",
    "D#4": "Ds4.mp3",
    "F#2": "Fs2.mp3",
    "F#3": "Fs3.mp3",
    "F#4": "Fs4.mp3"
}

const createXylophoneSampler = () => new Sampler(xylophoneSamples, { release: 1, baseUrl: "audio/xylophone/" }).toDestination();
const xylophoneSamples = {
    C5: "C5.wav",
    C6: "C6.wav",
    G4: "G4.wav",
    G5: "G5.wav",
    G6: "G6.wav"
}