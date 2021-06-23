import KEY_DATA from '../res/json_data/piano_key_data.json';
import NOTE_NAMES from  '../res/json_data/note_names.json';

const SHARP_INDEX = 0;
const FLAT_INDEX = 1;

const DEFAULT_TWELVE_KEYS = [60,61,62,63,64,65,66,55,56,57,58,59]

/**
 * List of piano keys, indexed by the MIDI number. Each element is of 
 * type KeyData, with data on the note name, octave, etc.
 */
interface KeyDataList {
    [keyId: number]: KeyData | undefined;
}

interface KeyData {
    octave: number;
    abc: string[] | string;
    noteId: number;
    midiNum: number;
    isBlackKey: boolean;
}

const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>

const keyDataList = KEY_DATA as KeyDataList;
const noteTextData = NOTE_NAMES;

export type NoteTextLanguageType = keyof typeof noteTextData;
export const noteTextLanguages = getObjectKeys(noteTextData);

export const getKeyData = (keyId: number, useFlats: boolean, language?: NoteTextLanguageType) => {
    let keyData = keyDataList[keyId];
    if (!keyData)
        return null;
    
    let noteText = noteTextData[language ?? "English"][keyData.noteId];
    if (Array.isArray(noteText)) {
        let sharpOrFlatIndex = useFlats ? FLAT_INDEX : SHARP_INDEX;
        return {...keyData, noteText: noteText[sharpOrFlatIndex]};
    } else
        return {...keyData, noteText: noteText};
}

export const getDefaultTwelveKeyDatas = (useFlats: boolean, language?: NoteTextLanguageType) => {
    let twelveKeys: KeyData[] = [];
    DEFAULT_TWELVE_KEYS.forEach(keyId => twelveKeys.push(getKeyData(keyId,useFlats,language) as KeyData));

    return twelveKeys;
}

export const getKeyAbc = (keyId: number, useFlats: boolean) => {
    let keyData = keyDataList[keyId];
    if (!keyData)
        return null;
    return (Array.isArray(keyData.abc)) ? 
        ((useFlats) ? keyData.abc[FLAT_INDEX] : keyData.abc[SHARP_INDEX]) : keyData.abc;
}