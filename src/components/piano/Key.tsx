import React from 'react';
import { KeyboardSettings } from '../../state/useKeyboardSettings'
import { getKeyData, NoteTextLanguageType } from '../../utils/KeyDataUtils';
import { KBD_MAPPING_START_KEY } from '../../utils/KbdCodesUtils';
import KBD_CODES from '../../res/json_data/kbd_codes.json'

interface KeyProps {
    keyId: number; // id, equal to the MIDI number
    isPlaying: boolean;
    language?: NoteTextLanguageType;

    settings: KeyboardSettings;
}

const Key = React.memo(({ keyId, isPlaying, settings, language = "English" }: KeyProps) => {

    const { showKbdMappings, showNoteNames, useFlats } = settings;

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
    const keyKbd = KBD_CODES[keyId - KBD_MAPPING_START_KEY]?.kbdText.US_QWERTY;

    return (
        <button className={keyClass} data-keyid={keyId} title={(showNoteNames && isBlackKey) ? keyDescription : undefined} aria-label={keyDescription}>
            {keyKbd && showKbdMappings &&
                <div className={"key-kbd"}>{keyKbd}</div>}
            <div className={"key-text" + (showNoteNames ? "" :  " hidden")}>
                {/* If key is a C, display the octave info. Otherwise, use the default keyText. */}
                {keyText}{keyIsC && <span className="octave">{octave}</span>}
            </div>
        </button>
    )
})

export default Key;