import { Reducer, useReducer, useRef, useState } from 'react';
import { useKeyboardListeners, useMouseListeners } from '../listeners/MouseKeyboardListeners';
import useMIDIListeners from '../listeners/MIDIListeners';
import { PianoKeysAction, pianoKeysReducer } from '../state/PianoKeysReducer';
import useLocalSettings from '../state/useLocalSettings';

import Sidebar from './sidebar/Sidebar';
import Piano from './piano/Piano';
import Staff from './staff/Staff';
import '../styles/main.scss';

export const START_NUM_KEYS = 90;
export const MIN_KEY = 48;
export const MAX_KEY = 79;

export interface KeyboardSettings {
    showPiano: boolean;
    showStaff: boolean;
    showNoteNames: boolean;
    showKbdMappings: boolean;
    useFlats: boolean;
    stickyMode: boolean;
    pianoRange: [number, number];
}
const INITIAL_SETTINGS: KeyboardSettings = 
    {showPiano: true, showStaff: true, showNoteNames: false, showKbdMappings: false, 
        useFlats: true, stickyMode: false, pianoRange: [MIN_KEY, MAX_KEY]};

function App() {

    /** "pianoKeys" is the state that holds the current state of all the keys, stored as an array of booleans.
     * "pianoKeysDispatch" is a dispatch function used to "play the keys," i.e. update the pianoKeys state */
    const [pianoKeys, pianoKeysDispatch] = useReducer<Reducer<boolean[], PianoKeysAction>>(
        pianoKeysReducer, new Array<boolean>(START_NUM_KEYS).fill(false)
    );

    /** The state holding the current settings. Changes are persisted to local storage with the 'useLocalSettings' hook. */
    const { settings, updateSetting } = useLocalSettings("kbd-settings", INITIAL_SETTINGS);

    /** Holds the name of the currently connected MIDI device. */
    const [midiDeviceName, setMidiDeviceName] = useState("");
    
    /** Holds a reference to the actual piano display element. */
    const pianoElementRef = useRef<HTMLDivElement | null>(null);

    /** Setting up all event listeners to make the piano interactive */
    useMouseListeners(pianoKeysDispatch, pianoElementRef, settings.stickyMode);
    useKeyboardListeners(pianoKeysDispatch, settings.stickyMode);
    useMIDIListeners(pianoKeysDispatch, settings.stickyMode, setMidiDeviceName);

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
                settings={settings}
                updateSetting={updateSetting}
                midiDeviceName={midiDeviceName}
            />
            <div className="main-view">
                <div className="main-view-content">
                    <section className="staff-keyboard-view">
                        {settings.showStaff && <Staff
                            playingKeys={playingKeys}
                            abcjsOptions={{ scale: 1.5, paddingtop: 0 }}
                            useFlats={settings.useFlats}
                        />}
                        {settings.showPiano && <Piano
                            startKey={settings.pianoRange[0]}
                            endKey={settings.pianoRange[1]}
                            pianoKeys={pianoKeys}
                            settings={settings}
                            ref={pianoElementRef}
                        />}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default App;