import { Chord, Midi } from "@tonaljs/tonal"
import { useEffect, useState } from "react"

interface ChordDetails {
    symbol: string;
    name: string;
    root: string;
    intervals: string[];
}

export const useChordID = (playingKeys: number[], useFlats: boolean, enabled: boolean) => {

    const [detected, setDetected] = useState<ChordDetails[]>([]);

    useEffect(() => {
        if (!enabled || playingKeys.length < 3)
            return;

        // detect chord and update `detected`
        const noteNames = playingKeys.map(midiNum =>
            Midi.midiToNoteName(midiNum, { sharps: !useFlats }
        ));
        const chordSymbols = Chord.detect(noteNames);
        const chords = chordSymbols.map(symbol => {
            const chordInfo = Chord.get(symbol);
            return {
                symbol,
                name: chordInfo.name,
                root: chordInfo.root,
                intervals: chordInfo.intervals
            }
        });
        setDetected(chords);

        // reset chord ID on changing keys
        return () => setDetected([]);

    }, [enabled, playingKeys, useFlats])

    return { detectedChords: detected };
}