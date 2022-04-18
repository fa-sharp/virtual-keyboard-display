/**
 * Defines the types of action that can be taken on the pianoKeys state
 */
export type PianoKeysAction = { type: 'KEY_ON'; keyId: number; } | { type: 'KEY_OFF'; keyId: number; } |
{ type: 'KEY_TOGGLE'; keyId: number; } | { type: 'CHORD_ON'; keyIds: number[]; } |
{ type: 'CHORD_OFF'; keyIds: number[]; } | { type: 'CLEAR_KEYS'; };

/**
 * Processes the actions for changing the pianoKeys state
 * @param pianoKeys The incoming/previous pianoKeys state
 * @param action The action to take
 * @returns The new pianoKeys state
 */
export const pianoKeysReducer = (pianoKeys: boolean[], action: PianoKeysAction) => {
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
            for (let i = 0; i < newPianoKeys.length; i++) {
                newPianoKeys[i] = false;
            }
            break;
        default:
            console.error(`Error in App/playKeysReducer: action "${action.type}" not implemented!`);
    }
    return newPianoKeys;
};
