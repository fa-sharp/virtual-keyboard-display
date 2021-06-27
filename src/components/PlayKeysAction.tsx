import { START_NUM_KEYS } from './App';


export type PlayKeysAction = { type: 'KEY_ON'; keyId: number; } | { type: 'KEY_OFF'; keyId: number; } |
{ type: 'KEY_TOGGLE'; keyId: number; } | { type: 'CHORD_ON'; keyIds: number[]; } |
{ type: 'CHORD_OFF'; keyIds: number[]; } | { type: 'CLEAR_KEYS'; };

export const playKeysReducer = (pianoKeys: boolean[], action: PlayKeysAction) => {
    let newPianoKeys = [...pianoKeys];
    switch (action.type) {
        case 'KEY_TOGGLE':
            newPianoKeys[action.keyId] = !newPianoKeys[action.keyId];
            break;
        case 'KEY_OFF':
            newPianoKeys[action.keyId] = false;
            break;
        case 'KEY_ON':
            newPianoKeys[action.keyId] = true;
            break;
        case 'CLEAR_KEYS':
            for (let i = 0; i < START_NUM_KEYS; i++) {
                newPianoKeys[i] = false;
            }
            break;
        default:
            console.error(`Error in App/playKeysReducer: action "${action.type}" not implemented!`);
    }
    return newPianoKeys;
};
