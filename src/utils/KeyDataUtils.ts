import KEY_DATA from '../res/json_data/piano_key_data.json';
import NOTE_NAMES from  '../res/json_data/note_names.json';

const SHARP_INDEX = 0;
const FLAT_INDEX = 1;

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

interface NoteTextLanguages {
    [language: string]: NoteTextList;
}

interface NoteTextList {
    [noteId: number]: NoteText | NoteText[];
}

interface NoteText {
    text:        string;
    description: string;
}

export const keyDataList = KEY_DATA as KeyDataList;
export const noteTextLanguages = NOTE_NAMES as NoteTextLanguages;

// TODO use type guards instead?
export const getKeyData = (keyId: number, useFlats: boolean) => {
    let keyData = keyDataList[keyId];
    if (!keyData)
        return null;
    
    let noteText = noteTextLanguages["English"][keyData.noteId]; // TODO add language support
    if (Array.isArray(noteText)) {
        let sharpOrFlatIndex = useFlats ? FLAT_INDEX : SHARP_INDEX;
        return {...keyData, noteText: noteText[sharpOrFlatIndex]};
    } else
        return {...keyData, noteText: noteText};
}

export const getKeyAbc = (keyId: number, useFlats: boolean) => {
    let keyData = keyDataList[keyId];
    if (!keyData)
        return null;
    return (Array.isArray(keyData.abc)) ? 
        (useFlats ? keyData.abc[FLAT_INDEX] : keyData.abc[SHARP_INDEX]) : keyData.abc;
}