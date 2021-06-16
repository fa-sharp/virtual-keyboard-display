import React from 'react';
import { KeyboardOptions } from './App'

import KEY_DATA from '../res/json_data/piano_key_data.json'
import NOTE_NAMES from '../res/json_data/note_names.json'
import KBD_CODES from '../res/json_data/kbd_codes.json'

import '../styles/main.scss';

interface KeyProps {
    id: number; // id, equal to the MIDI number
    isPlaying: boolean;

    keyboardOptions: KeyboardOptions;
}
// should go in a type/utility file
interface KeyDataList {
    [keyId: number]: KeyData
}
interface KeyData {
    octave:  number;
    abc:     string[] | string;
    noteId:  number;
    midiNum: number;
    isBlackKey: boolean;
}
const keyDataList = KEY_DATA as KeyDataList;

const Key = React.memo(({id, isPlaying, keyboardOptions}: KeyProps) => {
    let keyData = keyDataList[id];
    let isBlackKey = keyData.isBlackKey;
    let keyClass = "key"
        + (isBlackKey ? " black" : "")
        + (isPlaying ? " playing" : "");

    // TODO key descriptions / long names!!!
    let keyTextData = NOTE_NAMES.English[keyData.noteId].text;
    let keyText = !isBlackKey ? keyTextData[0] :
        keyboardOptions.useSharps ? keyTextData[0] : keyTextData[1];
    
    let keyKbd = KBD_CODES[id-60] ?
        KBD_CODES[id-60].kbdText.US_QWERTY : null;

    return (
        <button className={keyClass}>
            {keyKbd &&
                <div className={"key-kbd" + (!keyboardOptions.showKbdMappings ? 
                                    " hidden" : "")}>{keyKbd}</div>}
            <div className={"key-text" + (!keyboardOptions.showNoteNames ? 
                                    " hidden" : "")}>{keyText}</div>
        </button>
    )
})

export default Key;