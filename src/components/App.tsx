import React, { useState } from 'react';
import Toggle from './nav/Toggle';
import logo from '../images/logo.svg';
import '../styles/main.scss';

function App() {
    interface keyboardOptions {
        showNoteNames: boolean;
        showKbdMappings: boolean;
    }

    let [options, setOptions] = useState<keyboardOptions>(
        {showNoteNames: true, showKbdMappings: false});

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>
                    The Virtual Keyboard
                </h2>

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
            </header>
        </div>
    );


    // Changing one of the toggle settings
    function toggleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const option = event.target.dataset.option;
        const newValue = event.target.checked;
        // check if option is defined
        option && option in options ? 
            setOptions((prevOptions) => ({...options, [option]: newValue})) // set new option
            : console.error("Error toggling option in App: " + option);
    }
}

export default App;