import { useEffect, useRef, useState } from "react"
import { Frequency, Midi, Sampler } from 'tone'
import * as Tone from 'tone'
import { getPianoSampler } from "./pianoSampler";

/** 🎵 React hook that plays audio 🎵 */
export const usePlayer = (playingKeys: number[], enabled: boolean) => {

    /** The Tone.js piano sampler */
    const [sampler, setSampler] = useState<Sampler | null>(null);

    /** Whether the Tone.js sampler is ready to play */
    const [ready, setReady] = useState(false);

    /** If player is enabled, load the sampler */
    useEffect(() => {
        if (enabled && !sampler) {
            setSampler(getPianoSampler());
            Tone.loaded()
                .then(() => {
                    setReady(true);
                    console.log("Audio ready!");
                })
                .catch(err => console.error("Failed to start audio", err));
        }
    }, [enabled, sampler]);

    /** Previous state of `playingKeys` */
    const prevPlayingKeys = useRef<number[]>([]);

    /** Play/release notes by comparing current `playingKeys` with `prevPlayingKeys`  */
    useEffect(() => {
        if (!enabled || !sampler || !ready)
            return;
        
        for (let keyId of playingKeys) {
            if (!prevPlayingKeys.current.includes(keyId))
                sampler.triggerAttack(Midi(keyId).toFrequency());
        }
        for (let keyId of prevPlayingKeys.current) {
            if (!playingKeys.includes(keyId))
                sampler.triggerRelease(Midi(keyId).toFrequency())
        }
    }, [enabled, ready, sampler, playingKeys]);

    /** Update `prevPlayingKeys` */
    useEffect(() => { prevPlayingKeys.current = [...playingKeys] }, [playingKeys]);
}