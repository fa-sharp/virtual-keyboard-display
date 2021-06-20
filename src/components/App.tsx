import React, { Reducer, useCallback, useReducer, useRef, useState } from 'react';
import Piano from './Piano';
import { useKeyboardListeners, useMouseListeners } from './listeners/MouseKeyboardListeners';
import Toggle from './nav/Toggle';
import logo from '../res/images/logo.svg';
import '../styles/main.scss';

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
    return newPianoKeys;
}

function App() {
    const [pianoKeys, playKeysDispatch] = useReducer<Reducer<boolean[], PlayKeysAction>>(
        playKeysReducer, new Array<boolean>(90).fill(false)
    );
    const [options, setOptions] = useState<KeyboardOptions>(
        {useFlats: true, showNoteNames: true, showKbdMappings: false, stickyMode: true}
    );
    const pianoElementRef = useRef<HTMLDivElement | null>(null);

    useMouseListeners(playKeysDispatch, pianoElementRef, options.stickyMode);
    useKeyboardListeners(playKeysDispatch, options.stickyMode);

    /** Array that represents the currently playing keys, e.g. [60, 64, 67] */
    let playingKeys: number[] = [];
    for (let i = 0, len = pianoKeys.length; i < len; i++) {
        pianoKeys[i] && playingKeys.push(i);
    }
    console.log(playingKeys);

    /** Callback fired when changing one of the toggle settings */
    const toggleOptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const changedOption = event.target.dataset.option;
        const newValue = event.target.checked;
        // check if changedOption is valid
        if (changedOption && changedOption in options)
            setOptions((prevOptions) => ({...prevOptions, [changedOption]: newValue}));
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
                    ref={pianoElementRef}
                />
                <Toggle
                    displayLabel="Show note names:"
                    description="Display text of note names for each key"
                    isChecked={options.showNoteNames}
                    optionName="showNoteNames"
                    onChange={toggleOptionChange}
                />
                <Toggle
                    displayLabel="Show keyboard shortcuts:"
                    description="Display keyboard mappings for each key"
                    isChecked={options.showKbdMappings}
                    optionName="showKbdMappings"
                    onChange={toggleOptionChange}
                />
                <Toggle
                    displayLabel="Sharps"
                    displayLabelRight="Flats"
                    description="Sharps (off) or Flats (on)"
                    isChecked={options.useFlats}
                    optionName="useFlats"
                    onChange={toggleOptionChange}
                />
                <Toggle
                    displayLabel="Sticky mode:"
                    description="Keys are toggled instead of immediately released"
                    isChecked={options.stickyMode}
                    optionName="stickyMode"
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
        pianoElementRef.current?.style.setProperty("--key-width", event.target.value + "rem");
    }
}

export default App;