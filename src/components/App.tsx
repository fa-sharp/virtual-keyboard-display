import React, { useRef, useState } from 'react';
import Piano from './Piano';
import Toggle from './nav/Toggle';
import logo from '../res/images/logo.svg';
import '../styles/main.scss';

function App() {
    let [pianoKeys, setPianoKeys] = useState<boolean[]>(
        new Array<boolean>(90).fill(false)
    );
    let [options, setOptions] = useState<KeyboardOptions>(
        {useSharps: true, showNoteNames: true, showKbdMappings: false}
    );
    const pianoElement = useRef<HTMLDivElement>(null);

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
                    parentRef={pianoElement}
                />
                <Toggle
                    displayLabel="Show note names:"
                    ariaLabel="Display text of note names for each key"
                    isChecked={options.showNoteNames}
                    optionName="showNoteNames"
                    onChange={toggleChange}
                />
                <Toggle
                    displayLabel="Show keyboard shortcuts:"
                    ariaLabel="Display keyboard mappings for each key"
                    isChecked={options.showKbdMappings}
                    optionName="showKbdMappings"
                    onChange={toggleChange}
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


    // Changing one of the toggle settings
    function toggleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const option = event.target.dataset.option;
        const newValue = event.target.checked;
        // check if option is defined
        if (option && option in options)
            setOptions((prevOptions) => ({...options, [option]: newValue}));
        else
            console.error("Error toggling option in App: " + option);
    }

    // Changing display size of the keyboard. Using Ref hook here https://reactjs.org/docs/refs-and-the-dom.html
    function changeKeyboardSize(event: React.ChangeEvent<HTMLInputElement>) {
        pianoElement.current?.style.setProperty("--key-width", event.target.value + "rem");
    }
}

export interface KeyboardOptions {
    showNoteNames: boolean;
    showKbdMappings: boolean;
    useSharps: boolean;
}

export default App;