import React from 'react';
import { getKeyData, NoteTextLanguageType } from '../../utils/KeyDataUtils';
import KBD_CODES from '../../res/json_data/kbd_codes.json'
import { AppSettings } from '../../state/useSettings';

interface KeyProps {
    keyId: number; // key id, equal to the MIDI number
    isPlaying: boolean;
    language?: NoteTextLanguageType;

    settings: AppSettings;
}

const Key = React.memo(({ keyId, isPlaying, settings, language = "English" }: KeyProps) => {

    const { showKbdMappings, showNoteNames } = settings.piano;
    const { useFlats, kbdMappingStartKey } = settings.global;

    let keyData = getKeyData(keyId, useFlats, language);
    if (!keyData) {
        console.error(`Error rendering Key component: key data with id ${keyId} not found!`);
        return null;
    }

    const { isBlackKey, octave, noteText: { text: keyText, description: keyDescription } } = keyData;
    /** Whether the key is a C */
    const keyIsC = keyId % 12 === 0;

    const keyClass = "key"
        + (keyIsC ? " key-C" : "")
        + (isBlackKey ? " black" : "")
        + (isPlaying ? " playing" : "");
    const keyKbd = KBD_CODES[keyId - kbdMappingStartKey]?.kbdText.US_QWERTY;

    return (
        <button className={keyClass} data-keyid={keyId} title={(showNoteNames && isBlackKey) ? keyDescription : undefined} aria-label={keyDescription}>
            {/* Show keyboard shortcuts if enabled */}
            {keyKbd && showKbdMappings &&
                <div className={"key-kbd"}>{keyKbd}</div>}
            
            {/* Show all note names if enabled in settings. Otherwise only show Cs */}
            <div className={"key-text" + ((showNoteNames || keyIsC) ? "" :  " hidden")}>

                {/* If key is a C, display the octave info. Otherwise, use the default keyText. */}
                {keyText}{keyIsC && <span className="octave">{octave}</span>}
            </div>
        </button>
    )
})

export default Key;