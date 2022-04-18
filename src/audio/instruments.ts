import { PolySynth, Sampler } from "tone";

/** The different instruments that users can choose for audio output */
export enum AppInstrument {
    PIANO = "Piano",
    SYNTH = "Synth"
}

/** Create the Tone.js instrument */
export const createInstrument = (chosenInstrument: AppInstrument) => {
    switch (chosenInstrument) {
        case AppInstrument.PIANO:
            return createPianoSampler();
        case AppInstrument.SYNTH:
            return createSynth();
        default:
            return null;
    }
}

/** Create the synth instrument */
export const createSynth = () => new PolySynth().toDestination();

/** Create the piano sampler */
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