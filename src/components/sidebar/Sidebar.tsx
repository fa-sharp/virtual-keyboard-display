import React, { ChangeEventHandler, useCallback, useState } from "react";
import { KeyboardSettings, MAX_KEY, MIN_KEY } from "../../state/useKeyboardSettings";
import useStyleOptions from "../../state/useStyleOptions";

import Tooltip from "../help/Tooltip";
import Toggle from "./Toggle";
import Range from "./Range";
import KeyRange from "./KeyRange";
import ColorSelect from "./ColorSelect";

interface SidebarProps {
    settings: KeyboardSettings;
    updateSetting: <K extends keyof KeyboardSettings>(setting: K, newValue: KeyboardSettings[K]) => void

    midiDeviceName: string;
}

const Sidebar = React.memo(({settings, updateSetting, midiDeviceName}: SidebarProps) => {

    /** Sidebar open/close state */
    const [sidebarClosed, setSidebarClosed] = useState(true);
    const toggleSidebar = useCallback(() => setSidebarClosed((prevClosed) => !prevClosed), []);

    /** State for the styling options (size, color, etc.) **/
    const { styleOptions, updateStyleOption } = useStyleOptions();

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
        updateStyleOption('pianoSize', newSize);
    }, [updateStyleOption]);

    /** Callback for changing the active color */
    const onActiveColorChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        let newColor = event.target.value;
        updateStyleOption('activeColor', newColor);
    }, [updateStyleOption]);

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
                        displayLabel='"Sticky" mode'
                        description="In 'sticky' mode, the keys are toggled instead of being released right away"
                        makeTooltip={true}
                        isChecked={settings.stickyMode}
                        optionName="stickyMode"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel="Staff display"
                        description="Show/hide the staff display"
                        isChecked={settings.showStaff}
                        optionName="showStaff"
                        onChange={onToggleChange} 
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel="Piano display"
                        description="Show/hide the piano display"
                        isChecked={settings.showPiano}
                        optionName="showPiano"
                        onChange={onToggleChange} 
                        isDisabled={sidebarClosed} />

                    <h3>Piano</h3>
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
                    <Toggle
                        displayLabel="Note names"
                        description="Show/hide note names for each piano key"
                        isChecked={settings.showNoteNames}
                        optionName="showNoteNames"
                        onChange={onToggleChange} 
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel="Keyboard shortcuts"
                        description="Show/hide keyboard shortcuts for each piano key"
                        isChecked={settings.showKbdMappings}
                        optionName="showKbdMappings"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />


                    <h3>Colors</h3>
                    <ColorSelect label="Active color" description="Change highlight color for the piano keys and settings"
                        value={styleOptions.activeColor} onChange={onActiveColorChange} isDisabled={sidebarClosed} />
                </div>
                
                <div className="sidebar-bottom">
                    <hr />
                    <div>
                        <Tooltip text="MIDI Device:" tooltip="Supported in Chrome and Edge browsers." />
                        <br />{midiDeviceName}
                    </div>
                </div>
            </nav>
        </>
    );
});

export default Sidebar;