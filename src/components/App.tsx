import { Reducer, useCallback, useReducer, useRef, useState } from 'react';

import useKeyboardSettings from '../state/useKeyboardSettings';
import { PianoKeysAction, pianoKeysReducer } from '../state/PianoKeysReducer';
import { useMouseListeners } from '../listeners/MouseListeners';
import { useKeyboardListeners } from '../listeners/KeyboardListeners';
import { useMIDIListeners } from '../listeners/MIDIListeners';

import Sidebar from './sidebar/Sidebar';
import Piano from './piano/Piano';
import Staff from './staff/Staff';
import '../styles/main.scss';

import githubLogo from "../res/images/github-logo-default.png"

function App() {

    /** "pianoKeys" is the state that holds the current state of all the keys, stored as an array of booleans.
     * "pianoKeysDispatch" is a dispatch function used to "play the keys," i.e. update the pianoKeys state */
    const [pianoKeys, pianoKeysDispatch] = useReducer<Reducer<boolean[], PianoKeysAction>>(
        pianoKeysReducer, new Array<boolean>(90).fill(false)
    );

    /** The state holding the current settings. Changes are persisted to local storage with the 'useLocalSettings' hook. */
    const { settings, updateSetting } = useKeyboardSettings();
    const updateKbdMappingStartKey = useCallback((keyId) => updateSetting('kbdMappingStartKey', keyId), [updateSetting])

    /** Holds the name of the currently connected MIDI device. */
    const [midiDeviceName, setMidiDeviceName] = useState("");
    
    /** Holds a reference to the piano display element. */
    const pianoElementRef = useRef<HTMLDivElement | null>(null);

    /** Setting up all event listeners to make the piano interactive */
    useMouseListeners(pianoKeysDispatch, pianoElementRef, settings.showPiano, settings.stickyMode);
    useKeyboardListeners(pianoKeysDispatch, settings.stickyMode, settings.kbdMappingStartKey, updateKbdMappingStartKey);
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
                <a className="github-link" href="https://github.com/fa-sharp/virtual-keyboard-display"
                    target="_blank" rel="noreferrer">
                    <img src={githubLogo} alt="Link to GitHub repository" />
                </a>
            </header>
            <Sidebar
                keyboardSettings={settings}
                updateKeyboardSetting={updateSetting}
                midiDeviceName={midiDeviceName}
            />
            <main className="main-view">
                <section className="staff-keyboard-view">
                    {settings.showStaff &&
                        <Staff
                            playingKeys={playingKeys}
                            abcjsOptions={{ staffwidth: 220, wrap: { minSpacing: 1, maxSpacing: 1, preferredMeasuresPerLine: 2 } }}
                            useFlats={settings.useFlats}
                        />}
                    {settings.showPiano && 
                        <Piano
                            startKey={settings.pianoRange[0]}
                            endKey={settings.pianoRange[1]}
                            pianoKeys={pianoKeys}
                            settings={settings}
                            ref={pianoElementRef}
                        />}
                </section>
            </main>
        </div>
    );
}

export default App;