import React, { useCallback, useState } from "react";
import { KeyboardOptions, MAX_KEY, MIN_KEY } from "../App";
import { Tooltip } from "../help/Tooltip";
import githubLogo from "../../res/images/github-logo-default.png"
import Toggle from "./Toggle";
import Range from "./Range";
import KeyRange from "./KeyRange";

interface SidebarProps {
    keyboardOptions: KeyboardOptions;
    setKeyboardOptions: React.Dispatch<React.SetStateAction<KeyboardOptions>>;

    midiDeviceName: string;
}

interface StyleOptions {
    pianoSize: number;
}

const Sidebar = React.memo(({keyboardOptions, setKeyboardOptions, midiDeviceName}: SidebarProps) => {

    /** Sidebar open/close state */
    const [sidebarClosed, setSidebarClosed] = useState(false);
    const toggleSidebar = useCallback(() => setSidebarClosed((prevClosed) => !prevClosed), []);

    /** State for the styling options, such as the visual size of the piano **/
    const [styleOptions, setStyleOptions] = useState<StyleOptions>({pianoSize: 3.0});

    /** Callback fired when changing the range of the piano */
    const onPianoRangeChange = useCallback((_e, value: number | number[]) => 
        setKeyboardOptions(prevOptions => ({...prevOptions, pianoRange: value as [number, number]})), [setKeyboardOptions]);

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
        <>
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
                            width: "7.5rem", label: "Size", description: "Change visual size of piano"}}
                        value={styleOptions.pianoSize}
                        isDisabled={sidebarClosed}
                        onChange={onPianoSizeChange}
                    />
                    <KeyRange 
                        staticProps={{min: MIN_KEY, max: MAX_KEY, step: 1, optionName: "pianoRange",
                            width: "7rem", label: "Range", description: "Set range of piano"}}
                        value={keyboardOptions.pianoRange}
                        useFlats={keyboardOptions.useFlats}
                        isDisabled={sidebarClosed}
                        onChange={onPianoRangeChange}
                    />
                </div>
                <div className="sidebar-bottom">
                    <div>
                        <Tooltip text="MIDI Device:" tooltip="Currently only works in Chrome and Edge browsers." />
                        <br />{midiDeviceName}
                    </div>
                    <hr />
                    <a href="https://github.com/fa-sharp/virtual-keyboard-display" target="_blank" rel="noreferrer">
                        <img src={githubLogo} alt="Link to GitHub repository" />
                    </a>
                </div>
            </nav>
        </>
    );
});

export default Sidebar;