import { Reducer, useMemo, useReducer, useRef, useState } from 'react';

import { PianoKeysAction, pianoKeysReducer } from './state/PianoKeysReducer';
import { useSettings } from './state/useSettings';
import { useMouseListeners } from './listeners/MouseListeners';
import { useKeyboardListeners } from './listeners/KeyboardListeners';
import { useMIDIListeners } from './listeners/MIDIListeners';
import { usePlayer } from './audio/usePlayer';

import Sidebar from './components/sidebar/Sidebar';
import Piano from './components/piano/Piano';
import Staff from './components/staff/Staff';
import './styles/main.scss';

import githubLogo from "./res/images/github-logo-default.png"
import { useChordID } from './theory/useChords';

function App() {

    /** 🎹 "pianoKeys" is an array of booleans that represents the current state of all piano keys.
     * "pianoKeysDispatch" is a dispatch function used to "play the keys," i.e. update the pianoKeys state */
    const [pianoKeys, pianoKeysDispatch] = useReducer<Reducer<boolean[], PianoKeysAction>>(
        pianoKeysReducer, new Array<boolean>(90).fill(false)
    );

    /** 🔧 The current settings. Changes are persisted to local storage. */
    const { settings, updateSetting } = useSettings();
    
    /** 👀 A reference to the piano display HTML element. */
    const pianoElementRef = useRef<HTMLDivElement | null>(null);

    /** ⌨️🖱 Setting up all event listeners to make the piano interactive */
    useMouseListeners(pianoKeysDispatch, pianoElementRef, settings.piano.show, settings.global.sustainMode);
    useKeyboardListeners(pianoKeysDispatch, settings, updateSetting);
    const { midiReady, midiDevices } = useMIDIListeners(pianoKeysDispatch, settings.global.sustainMode, settings.global.midiDevice, settings.global.midiEnabled);

    /** 🎹 Array that represents the currently playing keys, e.g. [60, 64, 67] */
    const playingKeys = useMemo(() => {
        let playingKeys: number[] = [];
        for (let i = 0, len = pianoKeys.length; i < len; i++)
            pianoKeys[i] && playingKeys.push(i)
        return playingKeys;
    }, [pianoKeys])

    /** 🎵 The audio player */
    const { playerReady } = usePlayer(playingKeys, settings.audio);

    /** Detecting chords */
    const { detectedChords } = useChordID(playingKeys, settings.global.useFlats, true);

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
                settings={settings}
                updateSetting={updateSetting}
                midiDevices={midiDevices}
                midiReady={midiReady}
                playerReady={playerReady}
            />
            <main className="main-view">
                <section className="staff-keyboard-view">
                    {settings.staff.show &&
                        <Staff
                            playingKeys={playingKeys}
                            abcjsOptions={{ staffwidth: 250 }}
                            useFlats={settings.global.useFlats}
                            clefDivideKey={settings.staff.clefDivideKey}
                        />}
                    {settings.piano.show && 
                        <Piano
                            startKey={settings.piano.pianoRange[0]}
                            endKey={settings.piano.pianoRange[1]}
                            pianoKeys={pianoKeys}
                            settings={settings}
                            ref={pianoElementRef}
                        />}
                    <div>
                        Detected: {detectedChords.map((chord, idx) =>
                            <span>{chord.symbol}{chord.name ? ` (${chord.name})` : ''}
                            {idx === detectedChords.length - 1 ? '' : ', '}</span>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;