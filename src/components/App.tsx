import React, { Reducer, useReducer, useRef, useState } from 'react';
import '../styles/main.scss';
import { useKeyboardListeners, useMouseListeners } from './listeners/MouseKeyboardListeners';
import useMIDIListeners from './listeners/MIDIListeners';
import Sidebar from './nav/Sidebar';
import Piano from './Piano';
import Staff from './Staff';

const MAX_NUM_KEYS = 90;

export interface KeyboardOptions {
    showNoteNames: boolean;
    showKbdMappings: boolean;
    useFlats: boolean;
    stickyMode: boolean;
}

export type PlayKeysAction = { type: 'KEY_ON', keyId: number } | { type: 'KEY_OFF', keyId: number } |
{ type: 'KEY_TOGGLE', keyId: number } | { type: 'CHORD_ON', keyIds: number[] } |
{ type: 'CHORD_OFF', keyIds: number[] } | { type: 'CLEAR_KEYS' };

const playKeysReducer = (pianoKeys: boolean[], action: PlayKeysAction) => {
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
            for(let i = 0; i < MAX_NUM_KEYS; i++) {
                newPianoKeys[i] = false;
            }
            break;
        default:
            console.error(`Error in App/playKeysReducer: action "${action.type}" not implemented!`);
    }
    return newPianoKeys;
}

function App() {
    const [pianoKeys, playKeysDispatch] = useReducer<Reducer<boolean[], PlayKeysAction>>(
        playKeysReducer, new Array<boolean>(90).fill(false)
    );
    const [options, setOptions] = useState<KeyboardOptions>(
        {useFlats: true, showNoteNames: true, showKbdMappings: false, stickyMode: true}
    );
    const [midiDeviceName, setMidiDeviceName] = useState("");
    const pianoElementRef = useRef<HTMLDivElement | null>(null);

    /** Setting up all event listeners to make the piano interactive */
    useMouseListeners(playKeysDispatch, pianoElementRef, options.stickyMode);
    useKeyboardListeners(playKeysDispatch, options.stickyMode);
    useMIDIListeners(playKeysDispatch, options.stickyMode, setMidiDeviceName);

    /** Array that represents the currently playing keys, e.g. [60, 64, 67] */
    let playingKeys: number[] = [];
    for (let i = 0, len = pianoKeys.length; i < len; i++) {
        pianoKeys[i] && playingKeys.push(i);
    }
    console.log(playingKeys);

    return (
        <div className="app-view">
            <header className="header">
                <div className="header-title">The Virtual Keyboard</div>
            </header>
            <Sidebar
                keyboardOptions={options}
                setKeyboardOptions={setOptions}
                midiDeviceName={midiDeviceName}
            />
            <div className="main-view">
                <div className="main-view-content">
                    <section className="staff-keyboard-view">
                        <Staff
                            playingKeys={playingKeys}
                            abcjsOptions={{ scale: 1.5, paddingtop: 0 }}
                            useFlats={options.useFlats}
                        />
                        <Piano
                            startKey={55}
                            endKey={72}
                            pianoKeys={pianoKeys}
                            keyboardOptions={options}
                            ref={pianoElementRef}
                        />
                    </section>
                    <section>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default App;