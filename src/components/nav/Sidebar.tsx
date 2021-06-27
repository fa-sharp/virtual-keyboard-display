import React, { useCallback, useState } from "react";
import { KeyboardOptions } from "../App";
import { Tooltip } from "../help/Tooltip";
import githubLogo from "../../res/images/github-logo-default.png"
import Toggle from "./Toggle";
import Range from "./Range";

interface SidebarProps {
    keyboardOptions: KeyboardOptions;
    setKeyboardOptions: React.Dispatch<React.SetStateAction<KeyboardOptions>>;

    midiDeviceName: string;
}

interface StyleOptions {
    pianoSize: number;
}

const Sidebar = React.memo(({keyboardOptions, setKeyboardOptions, midiDeviceName}: SidebarProps) => {

    // The Sidebar will handle the state of the styling options, as it doesn't affect the other components
    const [styleOptions, setStyleOptions] = useState<StyleOptions>({pianoSize: 3.0});
    const [sidebarClosed, setSidebarClosed] = useState(false);

    const toggleSidebar = useCallback(() => setSidebarClosed((prevClosed) => !prevClosed), []);

    /** Callback fired when changing one of the toggle settings */
    const onToggleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const changedOption = event.target.dataset.option;
        const newValue = event.target.checked;
        // check if changedOption is valid
        if (changedOption && changedOption in keyboardOptions)
            setKeyboardOptions((prevOptions) => ({...prevOptions, [changedOption]: newValue}));
        else
            console.error("Error toggling option in App: " + changedOption);
    }, [keyboardOptions, setKeyboardOptions]);

    /** Callback for changing the piano size */
    const onPianoSizeChange = useCallback((_e, value: number | number[]) => {
        let newSize = value as number;
        document.documentElement.style.setProperty("--piano-key-width", newSize + "rem");
        setStyleOptions((prevOptions) => ({...prevOptions, pianoSize: newSize}));
    }, []);

    return (
        <div className="sidebar-container">
            <button id="toggle-sidebar-button" className="header-button" title="Settings"
                aria-label="Open/close settings menu" onClick={toggleSidebar} tabIndex={1}>
                <i className="material-icons">settings</i>
            </button>
            <nav className={"sidebar" + ((sidebarClosed) ? " closed" : "")}>
                <div className="sidebar-content">
                    <h2>Settings</h2>
                    <Toggle
                        displayLabel="Sharps"
                        displayLabelRight="Flats"
                        description="Display Sharps (off) or Flats (on)"
                        isChecked={keyboardOptions.useFlats}
                        optionName="useFlats"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel="Show note names"
                        description="Display text of note names for each piano key"
                        isChecked={keyboardOptions.showNoteNames}
                        optionName="showNoteNames"
                        onChange={onToggleChange} 
                        isDisabled={sidebarClosed}/>
                    <Toggle
                        displayLabel="Show keyboard shortcuts"
                        description="Display keyboard shortcuts for each piano key"
                        isChecked={keyboardOptions.showKbdMappings}
                        optionName="showKbdMappings"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel='"Sticky" mode'
                        description="In 'sticky' mode, the keys are toggled instead of being released right away"
                        makeTooltip={true}
                        isChecked={keyboardOptions.stickyMode}
                        optionName="stickyMode"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    <Range 
                        staticProps={{min: 2.6, max: 4.5, step: 0.1, unit: "rem", optionName: "pianoSize",
                            width: "8rem", label: "Size", description: "Change visual size of piano"}}
                        value={styleOptions.pianoSize}
                        isDisabled={sidebarClosed}
                        onChange={onPianoSizeChange}
                    />
                </div>
                <div className="sidebar-bottom">
                    <div>
                        <Tooltip text="MIDI Device:" tooltip="May need additional plugins to work. See help for more info" />
                        <br />{midiDeviceName}
                    </div>
                    <hr />
                    <a href="https://github.com/fa-sharp/virtual-keyboard-display" target="_blank" rel="noreferrer">
                        <img src={githubLogo} alt="Link to GitHub repository" />
                    </a>
                </div>
            </nav>
        </div>
    );
});

export default Sidebar;