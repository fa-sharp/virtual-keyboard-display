import React, { ChangeEventHandler, useCallback, useState } from "react";
import { KeyboardSettings, MAX_KEY, MIN_KEY, UpdateKeyboardSetting } from "../../state/useKeyboardSettings";
import { StyleSettings, useStyleSettings } from "../../state/useStyleSettings";

import Tooltip from "../help/Tooltip";
import Toggle from "./Toggle";
import Range from "./Range";
import KeyRange from "./KeyRange";
import ColorSelect from "./ColorSelect";
import { AppInstrument } from "../../audio/instruments";
import Select from "./Select";

interface SidebarProps {
    keyboardSettings: KeyboardSettings;
    updateKeyboardSetting: UpdateKeyboardSetting;

    midiDeviceName: string;
    playerReady: boolean;
}

const Sidebar = React.memo(({ keyboardSettings, updateKeyboardSetting, midiDeviceName, playerReady }: SidebarProps) => {

    /** Sidebar open/close state */
    const [sidebarClosed, setSidebarClosed] = useState(true);
    const toggleSidebar = useCallback(() => setSidebarClosed((prevClosed) => !prevClosed), []);

    /** State for the styling options (size, color, etc.) **/
    const { styleSettings, updateStyleSetting } = useStyleSettings();

    /** Callback fired when changing one of the toggle settings */
    const onToggleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const changedSetting = event.target.dataset.option;
        const newValue = event.target.checked;
        updateKeyboardSetting(changedSetting as keyof KeyboardSettings, newValue);
    }, [updateKeyboardSetting]);

    /** Callback for changing a keyboard setting through a range/slider. TODO clean up settings to merge these callbacks */
    const onRangeChange = useCallback((optionName: keyof KeyboardSettings, value: number | [number, number]) => {
        updateKeyboardSetting(optionName, value);
    }, [updateKeyboardSetting]);

    /** Callback for changing a style setting through a range/slider */
    const onStylingRangeChange = useCallback((optionName: keyof StyleSettings, value: number) => {
        updateStyleSetting(optionName, value);
    }, [updateStyleSetting]);

    /** Callback for changing the instrument */
    const onInstrumentChange: ChangeEventHandler<HTMLSelectElement> = useCallback(e => {
        updateKeyboardSetting("audioInstrument", e.target.value as AppInstrument);
    }, [updateKeyboardSetting]);

    /** Callback for changing the active color */
    const onActiveColorChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        let newColor = event.target.value;
        updateStyleSetting('activeColor', newColor);
    }, [updateStyleSetting]);

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
                        isChecked={keyboardSettings.useFlats}
                        optionName="useFlats"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel="Sustain mode"
                        description="Toggle whether keys should be sustained instead of being released right away"
                        makeTooltip={true}
                        isChecked={keyboardSettings.stickyMode}
                        optionName="stickyMode"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />

                    <h3>Staff</h3>
                    <Toggle
                        displayLabel={keyboardSettings.showStaff ? "On" : "Off"}
                        description="Show/hide the staff display"
                        isChecked={keyboardSettings.showStaff}
                        optionName="showStaff"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    {keyboardSettings.showStaff && <>
                        <KeyRange
                            staticProps={{
                                min: 52, max: 70, step: 1, optionName: "clefDivideKey",
                                width: "5rem", label: "Clef divide", description: "Set dividing key between treble and bass clef"
                            }}
                            value={keyboardSettings.clefDivideKey}
                            useFlats={keyboardSettings.useFlats}
                            isDisabled={sidebarClosed}
                            onChange={onRangeChange} />
                    </>}

                    <h3>Piano</h3>
                    <Toggle
                        displayLabel={keyboardSettings.showPiano ? "On" : "Off"}
                        description="Show/hide the piano display"
                        isChecked={keyboardSettings.showPiano}
                        optionName="showPiano"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    {keyboardSettings.showPiano && <>
                        <Range
                            staticProps={{
                                min: 2.6, max: 4.5, step: 0.1, unit: "rem", optionName: "pianoSize",
                                width: "7.5rem", label: "Size", description: "Change visual size of piano"
                            }}
                            value={styleSettings.pianoSize}
                            isDisabled={sidebarClosed}
                            onChange={onStylingRangeChange}
                        />
                        <KeyRange
                            staticProps={{
                                min: MIN_KEY, max: MAX_KEY, step: 1, optionName: "pianoRange",
                                width: "7rem", label: "Range", description: "Set range of piano"
                            }}
                            value={keyboardSettings.pianoRange}
                            useFlats={keyboardSettings.useFlats}
                            isDisabled={sidebarClosed}
                            onChange={onRangeChange}
                        />
                        <Toggle
                            displayLabel="Note names"
                            description="Show/hide note names for each piano key"
                            isChecked={keyboardSettings.showNoteNames}
                            optionName="showNoteNames"
                            onChange={onToggleChange}
                            isDisabled={sidebarClosed} />
                        <Toggle
                            displayLabel="Keyboard shortcuts"
                            description="Show/hide keyboard shortcuts for each piano key"
                            isChecked={keyboardSettings.showKbdMappings}
                            optionName="showKbdMappings"
                            onChange={onToggleChange}
                            isDisabled={sidebarClosed} />
                    </>}

                    <h3>Audio</h3>
                    
                    <Toggle
                        displayLabel={
                            !keyboardSettings.audioEnabled ?
                                "Off" : playerReady ?
                                    "✅ On" : "⌛️ On"
                        }
                        description="Toggle audio output. May take a couple seconds to load!"
                        makeTooltip={true}
                        isChecked={keyboardSettings.audioEnabled}
                        optionName="audioEnabled"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    {keyboardSettings.audioEnabled && <>
                        <Select
                            label="Instrument"
                            description="Change the instrument for audio output"
                            onChange={onInstrumentChange}
                            options={Object.values(AppInstrument)}
                            selectedValue={keyboardSettings.audioInstrument}
                            isDisabled={sidebarClosed} />
                        <Range
                            staticProps={{
                                label: "Volume", description: "Change the volume of the audio output",
                                max: 5, min: -30, step: 1, optionName: "audioVolume", width: "7.5rem"
                            }}
                            onChange={onRangeChange}
                            value={keyboardSettings.audioVolume}
                            isDisabled={sidebarClosed} />
                    </>}

                    <h3>Colors</h3>
                    <ColorSelect label="Active color" description="Change highlight color for the piano keys and settings"
                        value={styleSettings.activeColor} onChange={onActiveColorChange} isDisabled={sidebarClosed} />
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