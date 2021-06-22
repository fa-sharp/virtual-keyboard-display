import React from 'react';
import { KeyboardOptions } from './App'
import { getKeyData, NoteTextLanguageType } from '../utils/KeyDataUtils';
import { KBD_MAPPING_START_KEY } from '../utils/KbdCodesUtils';
import KBD_CODES from '../res/json_data/kbd_codes.json'

interface KeyProps {
    keyId: number; // id, equal to the MIDI number
    isPlaying: boolean;
    language?: NoteTextLanguageType;

    keyboardOptions: KeyboardOptions;
}

const Key = React.memo(({keyId, isPlaying, keyboardOptions, language="English"}: KeyProps) => {
    let keyData = getKeyData(keyId, keyboardOptions.useFlats, language);
    if (!keyData) {
        console.error(`Error rendering Key component: key data with id ${keyId} not found!`);
        return null;
    }

    let {isBlackKey, noteText: {text: keyText, description: keyDescription}} = keyData;
    let keyClass = "key"
        + (isBlackKey ? " black" : "")
        + (isPlaying ? " playing" : "");
    let keyKbd = KBD_CODES[keyId - KBD_MAPPING_START_KEY]?.kbdText.US_QWERTY;

    return (
        <button className={keyClass} data-keyid={keyId} title={keyDescription} aria-label={keyDescription}>
            {keyKbd &&
                <div className={"key-kbd" + (keyboardOptions.showKbdMappings ? 
                                            "" : " hidden")}>{keyKbd}</div>}
            <div className={"key-text" + (keyboardOptions.showNoteNames ? 
                                            "" :  " hidden")}>{keyText}</div>
        </button>
    )
})

export default Key;