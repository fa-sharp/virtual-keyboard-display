import { Reducer, useReducer, useRef, useState } from 'react';
import '../styles/main.scss';
import { useKeyboardListeners, useMouseListeners } from '../listeners/MouseKeyboardListeners';
import useMIDIListeners from '../listeners/MIDIListeners';
import { PlayKeysAction, playKeysReducer } from '../state/PlayKeysReducer';
import Sidebar from './nav/Sidebar';
import Piano from './piano/Piano';
import Staff from './staff/Staff';

export const START_NUM_KEYS = 90;

export interface KeyboardOptions {
    showNoteNames: boolean;
    showKbdMappings: boolean;
    useFlats: boolean;
    stickyMode: boolean;
}

function App() {
    const [pianoKeys, playKeysDispatch] = useReducer<Reducer<boolean[], PlayKeysAction>>(
        playKeysReducer, new Array<boolean>(START_NUM_KEYS).fill(false)
    );
    const [options, setOptions] = useState<KeyboardOptions>(
        {useFlats: true, showNoteNames: false, showKbdMappings: false, stickyMode: false}
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
                        <div className="piano-container">
                            <Piano
                                startKey={55}
                                endKey={72}
                                pianoKeys={pianoKeys}
                                keyboardOptions={options}
                                ref={pianoElementRef}
                            />
                        </div>
                    </section>
                    <section>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default App;