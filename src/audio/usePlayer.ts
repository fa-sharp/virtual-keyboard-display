import { useEffect, useRef, useState } from "react"
import { Midi } from 'tone'
import * as Tone from 'tone'
import { AppInstrument, createInstrument } from "./instruments";
import { Instrument, InstrumentOptions } from "tone/build/esm/instrument/Instrument";


/**
 *  🎵 React hook that plays audio 🎵 
 * @param playingKeys Array of piano keys that are currently played
 * @param enabled Whether audio output is enabled
 * @param chosenInstrument What instrument the user has chosen
 */
export const usePlayer = (playingKeys: number[], enabled: boolean, chosenInstrument: AppInstrument, volume: number) => {

    /** The Tone.js instrument */
    const [loadedInstrument, setLoadedInstrument] = useState<Instrument<InstrumentOptions> | null>(null);

    /** Whether the Tone.js instrument is ready to play */
    const [ready, setReady] = useState(false);

    /** If the user has enabled audio output, load the instrument */
    useEffect(() => {
        if (enabled && !loadedInstrument) {
            setReady(false);
            setLoadedInstrument(createInstrument(chosenInstrument));
            Tone.loaded()
                .then(() => {
                    setReady(true);
                    console.log(`${chosenInstrument} ready!`);
                })
                .catch(err => console.error("Failed to start audio!", err));
        }

        return () => {
            // Clean-up (when user turns off audio, or before loading another instrument) 
            if (loadedInstrument) {
                loadedInstrument.dispose(); // dispose of Tone.js instrument
                setLoadedInstrument(null);
            }
        }
    }, [chosenInstrument, enabled, loadedInstrument]);

    /** Previous state of `playingKeys` */
    const prevPlayingKeys = useRef<number[]>([]);

    /** Play/release notes by comparing current `playingKeys` with `prevPlayingKeys`  */
    useEffect(() => {
        if (!enabled || !loadedInstrument || !ready)
            return;
        
        for (let keyId of playingKeys) {
            if (!prevPlayingKeys.current.includes(keyId))
                loadedInstrument.triggerAttack(Midi(keyId).toFrequency());
        }
        for (let keyId of prevPlayingKeys.current) {
            if (!playingKeys.includes(keyId))
                loadedInstrument.triggerRelease(Midi(keyId).toFrequency())
        }
    }, [enabled, ready, loadedInstrument, playingKeys]);

    /** Update `prevPlayingKeys` after playing/releasing notes */
    useEffect(() => { prevPlayingKeys.current = [...playingKeys] }, [playingKeys]);


    /** Change volume */
    useEffect(() => {
        if (!loadedInstrument)
            return;
        loadedInstrument.volume.value = volume;
    }, [loadedInstrument, volume]);

    return { 
        /** Whether the player is ready to output audio */
        playerReady: ready 
    }
}