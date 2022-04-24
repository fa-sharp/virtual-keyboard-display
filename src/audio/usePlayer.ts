import { useEffect, useLayoutEffect, useState } from "react"
import * as Tone from 'tone'
import { AppInstrument, createInstrument } from "./instruments";
import { Instrument, InstrumentOptions } from "tone/build/esm/instrument/Instrument";
import { usePrevious } from "../state/util/usePrevious";


/**
 *  🎵 React hook that plays audio based on the `playingKeys` 🎵 
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
    const prevPlayingKeys = usePrevious(playingKeys, []);

    /** Play/release notes by comparing current `playingKeys` with `prevPlayingKeys`  */
    useLayoutEffect(() => {
        if (!enabled || !loadedInstrument || !ready)
            return;
        
        for (let keyId of playingKeys) {
            if (!prevPlayingKeys.includes(keyId))
                loadedInstrument.triggerAttack(Tone.Midi(keyId).toFrequency());
        }
        for (let keyId of prevPlayingKeys) {
            if (!playingKeys.includes(keyId))
                loadedInstrument.triggerRelease(Tone.Midi(keyId).toFrequency())
        }
    });

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