import React, { ChangeEventHandler, useCallback, useState } from "react";
import { KeyboardSettings, MAX_KEY, MIN_KEY } from "../App";
import { Tooltip } from "../help/Tooltip";
import githubLogo from "../../res/images/github-logo-default.png"
import Toggle from "./Toggle";
import Range from "./Range";
import KeyRange from "./KeyRange";
import ColorSelect from "./ColorSelect";

const CSS_VARIABLES = { KEY_SIZE: "--piano-key-width", ACTIVE_COLOR: "--active-color" }

interface SidebarProps {
    settings: KeyboardSettings;
    updateSetting: <K extends keyof KeyboardSettings>(setting: K, newValue: KeyboardSettings[K]) => void

    midiDeviceName: string;
}

interface StyleOptions {
    pianoSize: number;
    activeColor: string;
}

const Sidebar = React.memo(({settings, updateSetting, midiDeviceName}: SidebarProps) => {

    /** Sidebar open/close state */
    const [sidebarClosed, setSidebarClosed] = useState(false);
    const toggleSidebar = useCallback(() => setSidebarClosed((prevClosed) => !prevClosed), []);

    /** State for the styling options (size, color, etc.) **/
    const [styleOptions, setStyleOptions] = useState<StyleOptions>({pianoSize: 3.0, activeColor: '#00aaff'});

    /** Callback fired when changing the range of the piano */
    const onPianoRangeChange = useCallback((_e, value: number | number[]) => 
       updateSetting('pianoRange', value as [number, number]), [updateSetting]);

    /** Callback fired when changing one of the toggle settings */
    const onToggleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const changedSetting = event.target.dataset.option;
        const newValue = event.target.checked;
        updateSetting(changedSetting as keyof KeyboardSettings, newValue);
    }, [updateSetting]);

    /** Callback for changing the piano size */
    const onPianoSizeChange = useCallback((_e, value: number | number[]) => {
        let newSize = value as number;
        document.documentElement.style.setProperty(CSS_VARIABLES.KEY_SIZE, newSize + "rem");
        setStyleOptions((prevOptions) => ({...prevOptions, pianoSize: newSize}));
    }, []);

    /** Callback for changing the active color */
    const onActiveColorChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        let newColor = event.target.value;
        document.documentElement.style.setProperty(CSS_VARIABLES.ACTIVE_COLOR, newColor);
        setStyleOptions((prevOptions) => ({...prevOptions, activeColor: newColor}));
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
                        isChecked={settings.useFlats}
                        optionName="useFlats"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel="Show note names"
                        description="Display text of note names for each piano key"
                        isChecked={settings.showNoteNames}
                        optionName="showNoteNames"
                        onChange={onToggleChange} 
                        isDisabled={sidebarClosed}/>
                    <Toggle
                        displayLabel="Show keyboard shortcuts"
                        description="Display keyboard shortcuts for each piano key"
                        isChecked={settings.showKbdMappings}
                        optionName="showKbdMappings"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel='"Sticky" mode'
                        description="In 'sticky' mode, the keys are toggled instead of being released right away"
                        makeTooltip={true}
                        isChecked={settings.stickyMode}
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
                        value={settings.pianoRange}
                        useFlats={settings.useFlats}
                        isDisabled={sidebarClosed}
                        onChange={onPianoRangeChange}
                    />
                    <ColorSelect label="Custom color" description="Change highlight color for the piano keys and settings"
                        value={styleOptions.activeColor} onChange={onActiveColorChange} isDisabled={sidebarClosed} />
                </div>
                <div className="sidebar-bottom">
                    <div>
                        <Tooltip text="MIDI Device:" tooltip="Currently only works in Chrome and Edge browsers." />
                        <br />{midiDeviceName}
                    </div>
                    <hr />
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href={!sidebarClosed ? "https://github.com/fa-sharp/virtual-keyboard-display" : undefined}
                        target="_blank" rel="noreferrer">
                        <img src={githubLogo} alt="Link to GitHub repository" />
                    </a>
                </div>
            </nav>
        </>
    );
});

export default Sidebar;