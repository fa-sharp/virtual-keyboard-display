import React from 'react';
import { KeyboardOptions } from './App'
import { getKeyData } from './KeyDataUtils';
import KBD_CODES from '../res/json_data/kbd_codes.json'

const KBD_MAPPING_START_KEY = 60;

interface KeyProps {
    keyId: number; // id, equal to the MIDI number
    isPlaying: boolean;

    keyboardOptions: KeyboardOptions;
}

const Key = React.memo(({keyId, isPlaying, keyboardOptions}: KeyProps) => {
    let keyData = getKeyData(keyId, keyboardOptions.useFlats);
    if (!keyData) {
        console.error(`Error rendering Key component: key data with id ${keyId} not found!`);
        return null;
    }

    let isBlackKey = keyData.isBlackKey;
    let keyClass = "key"
        + (isBlackKey ? " black" : "")
        + (isPlaying ? " playing" : "");
    let keyText = keyData.noteText.text;
    let keyDescription = keyData.noteText.description;
    let keyKbd = KBD_CODES[keyId - KBD_MAPPING_START_KEY]?.kbdText.US_QWERTY;

    return (
        <button className={keyClass} data-keyid={keyId} title={keyDescription} aria-label={keyDescription}>
            {keyKbd &&
                <div className={"key-kbd" + (!keyboardOptions.showKbdMappings ? 
                                    " hidden" : "")}>{keyKbd}</div>}
            <div className={"key-text" + (!keyboardOptions.showNoteNames ? 
                                    " hidden" : "")}>{keyText}</div>
        </button>
    )
})

export default Key;