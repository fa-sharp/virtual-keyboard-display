import { useEffect, useLayoutEffect, useState } from "react"
import * as Tone from 'tone'
import { createInstrument } from "./instruments";
import { Instrument, InstrumentOptions } from "tone/build/esm/instrument/Instrument";
import { usePrevious } from "../state/util/usePrevious";
import { AppSettings } from "../state/useSettings";


/**
 *  🎵 React hook that plays audio based on the `playingKeys` 🎵 
 * @param playingKeys Array of piano keys that are currently played
 * @param settings Audio settings
 */
export const usePlayer = (playingKeys: number[], settings: AppSettings["audio"]) => {

    /** The Tone.js instrument */
    const [loadedInstrument, setLoadedInstrument] = useState<Instrument<InstrumentOptions> | null>(null);

    /** Whether the Tone.js instrument is ready to play */
    const [ready, setReady] = useState(false);

    /** If the user has enabled audio output, load the instrument */
    useEffect(() => {
        if (settings.enabled && !loadedInstrument) {
            setReady(false);
            setLoadedInstrument(createInstrument(settings.instrument));
            Tone.loaded()
                .then(() => {
                    setReady(true);
                    console.log(`${settings.instrument} ready!`);
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
    }, [settings.instrument, settings.enabled, loadedInstrument]);

    /** Previous state of `playingKeys` */
    const prevPlayingKeys = usePrevious(playingKeys, []);

    /** Play/release notes by comparing current `playingKeys` with `prevPlayingKeys`  */
    useLayoutEffect(() => {
        if (!settings.enabled || !loadedInstrument || !ready)
            return;
        
        for (let keyId of playingKeys) {
            if (!prevPlayingKeys.includes(keyId))
                loadedInstrument.triggerAttack(Tone.Midi(keyId).toFrequency(), Tone.context.currentTime);
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
        loadedInstrument.volume.value = settings.volume;
    }, [loadedInstrument, settings.volume]);

    return { 
        /** Whether the player is ready to output audio */
        playerReady: ready 
    }
}