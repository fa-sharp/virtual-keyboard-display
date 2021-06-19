import React, { Reducer, useCallback, useReducer, useRef, useState } from 'react';
import Piano from './Piano';
import Toggle from './nav/Toggle';
import logo from '../res/images/logo.svg';
import '../styles/main.scss';
import PianoListeners from './PianoListeners';

export interface KeyboardOptions {
    showNoteNames: boolean;
    showKbdMappings: boolean;
    useFlats: boolean;
    stickyMode: boolean;
}

export type PlayKeysAction = { type: 'KEY_ON', keyId: number } |
        { type: 'KEY_OFF', keyId: number } | {type: 'KEY_TOGGLE', keyId: number };

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
    }
    return [...newPianoKeys];
}

function App() {
    const [pianoKeys, playKeysDispatch] = useReducer<Reducer<boolean[], PlayKeysAction>>(
        playKeysReducer, new Array<boolean>(90).fill(false)
    );
    const [options, setOptions] = useState<KeyboardOptions>(
        {useFlats: true, showNoteNames: true, showKbdMappings: false, stickyMode: true}
    );
    const pianoElement = useRef<HTMLDivElement>(null);

    // TODO useEffect to load pianoElement and other needed DOM elements?

    /** Array that represents the currently playing keys, e.g. [60, 64, 67] */
    let playingKeys: number[] = [];
    for (let i = 0, len = pianoKeys.length; i < len; i++) {
        pianoKeys[i] && playingKeys.push(i);
    }
    console.log(playingKeys);

    // Changing one of the toggle settings
    const toggleOptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const changedOption = event.target.dataset.option;
        const newValue = event.target.checked;
        // check if option is defined
        if (changedOption && changedOption in options)
            setOptions((prevOptions) => ({...options, [changedOption]: newValue}));
        else
            console.error("Error toggling option in App: " + changedOption);
    }, [options])

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>
            <section className="keyboard-view">
                <h2>
                    The Virtual Keyboard
                </h2>
                <Piano
                    startKey={60}
                    endKey={70}
                    pianoKeys={pianoKeys}
                    keyboardOptions={options}
                    parentRef={pianoElement}>
                    <PianoListeners playKeys={playKeysDispatch} keyboardOptions={options}/>
                </Piano>
                <Toggle
                    displayLabel="Show note names:"
                    ariaLabel="Display text of note names for each key"
                    isChecked={options.showNoteNames}
                    optionName="showNoteNames"
                    onChange={toggleOptionChange}
                />
                <Toggle
                    displayLabel="Show keyboard shortcuts:"
                    ariaLabel="Display keyboard mappings for each key"
                    isChecked={options.showKbdMappings}
                    optionName="showKbdMappings"
                    onChange={toggleOptionChange}
                />
                <label>Size:
                <input
                    type="range"
                    min="3" max="4.5" step="0.1"
                    defaultValue="3"
                    onChange={changeKeyboardSize}
                />
                </label>

            </section>
        </div>
    );

    // Changing display size of the keyboard. Using Ref hook here https://reactjs.org/docs/refs-and-the-dom.html
    function changeKeyboardSize(event: React.ChangeEvent<HTMLInputElement>) {
        pianoElement.current?.style.setProperty("--key-width", event.target.value + "rem");
    }
}

export default App;