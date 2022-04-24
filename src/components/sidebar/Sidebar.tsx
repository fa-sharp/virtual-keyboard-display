import React, { ChangeEventHandler, useCallback, useState } from "react";

import { AppInstrument } from "../../audio/instruments";
import { AppSettings, UpdateAppSetting, MIN_KEY, MAX_KEY } from "../../state/useSettings";

import Tooltip from "../help/Tooltip";
import Toggle from "./Toggle";
import Range from "./Range";
import KeyRange from "./KeyRange";
import ColorSelect from "./ColorSelect";
import Select from "./Select";

interface SidebarProps {
    settings: AppSettings;
    updateSetting: UpdateAppSetting;

    midiDeviceName: string;
    playerReady: boolean;
}

const Sidebar = React.memo(({ settings, updateSetting, midiDeviceName, playerReady }: SidebarProps) => {

    /** Sidebar open/close state */
    const [sidebarClosed, setSidebarClosed] = useState(true);
    const toggleSidebar = useCallback(() => setSidebarClosed((prevClosed) => !prevClosed), []);

    /** Callback fired when changing one of the toggle settings */
    const onToggleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const settingGroup = event.target.dataset.group;
        const settingName = event.target.dataset.setting;
        const newValue = event.target.checked;
        //@ts-expect-error
        updateSetting(settingGroup, settingName, newValue);
    }, [updateSetting]);

    /** Callback for changing a setting through a range/slider. */
    const onRangeChange = useCallback(<T extends keyof AppSettings>(settingGroup: T, settingName: keyof AppSettings[T], value: number | [number, number]) => {
        updateSetting(settingGroup, settingName, value as any);
    }, [updateSetting]);

    /** Callback for changing the instrument */
    const onInstrumentChange: ChangeEventHandler<HTMLSelectElement> = useCallback(e => {
        updateSetting("audio", "instrument", e.target.value as AppInstrument);
    }, [updateSetting]);

    /** Callback for changing the active color */
    const onActiveColorChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        let newColor = event.target.value;
        updateSetting("global", "activeColor", newColor);
    }, [updateSetting]);

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
                        isChecked={settings.global.useFlats}
                        settingGroup='global'
                        settingName="useFlats"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    <Toggle
                        displayLabel="Sustain mode"
                        description="Toggle whether keys should be sustained instead of being released right away"
                        makeTooltip={true}
                        isChecked={settings.global.sustainMode}
                        settingGroup='global'
                        settingName="sustainMode"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />

                    <h3>Staff</h3>
                    <Toggle
                        displayLabel={settings.staff.show ? "On" : "Off"}
                        description="Show/hide the staff display"
                        isChecked={settings.staff.show}
                        settingGroup="staff"
                        settingName="show"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    {settings.staff.show && <>
                        <KeyRange
                            staticProps={{
                                min: 52, max: 70, step: 1, settingGroup: "staff", settingName: "clefDivideKey",
                                width: "5rem", label: "Clef divide", description: "Set dividing key between treble and bass clef"
                            }}
                            value={settings.staff.clefDivideKey}
                            useFlats={settings.global.useFlats}
                            isDisabled={sidebarClosed}
                            onChange={onRangeChange} />
                    </>}

                    <h3>Piano</h3>
                    <Toggle
                        displayLabel={settings.piano.show ? "On" : "Off"}
                        description="Show/hide the piano display"
                        isChecked={settings.piano.show}
                        settingGroup="piano"
                        settingName="show"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    {settings.piano.show && <>
                        <Range
                            staticProps={{
                                min: 2.6, max: 4.5, step: 0.1, unit: "rem", settingGroup: "piano", settingName: "pianoSize",
                                width: "7.5rem", label: "Size", description: "Change visual size of piano"
                            }}
                            value={settings.piano.pianoSize}
                            isDisabled={sidebarClosed}
                            onChange={onRangeChange}
                        />
                        <KeyRange
                            staticProps={{
                                min: MIN_KEY, max: MAX_KEY, step: 1, settingGroup: "piano", settingName: "pianoRange",
                                width: "7rem", label: "Range", description: "Set range of piano"
                            }}
                            value={settings.piano.pianoRange}
                            useFlats={settings.global.useFlats}
                            isDisabled={sidebarClosed}
                            onChange={onRangeChange}
                        />
                        <Toggle
                            displayLabel="Note names"
                            description="Show/hide note names for each piano key"
                            isChecked={settings.piano.showNoteNames}
                            settingGroup="piano"
                            settingName="showNoteNames"
                            onChange={onToggleChange}
                            isDisabled={sidebarClosed} />
                        <Toggle
                            displayLabel="Keyboard shortcuts"
                            description="Show/hide keyboard shortcuts for each piano key"
                            isChecked={settings.piano.showKbdMappings}
                            settingGroup="piano"
                            settingName="showKbdMappings"
                            onChange={onToggleChange}
                            isDisabled={sidebarClosed} />
                    </>}

                    <h3>Audio</h3>
                    <Toggle
                        displayLabel={
                            !settings.audio.enabled ?
                                "Off" : playerReady ?
                                    "✅ On" : "⌛️ On"
                        }
                        description="Toggle audio output. May take a couple seconds to load!"
                        makeTooltip={true}
                        isChecked={settings.audio.enabled}
                        settingGroup='audio'
                        settingName="enabled"
                        onChange={onToggleChange}
                        isDisabled={sidebarClosed} />
                    {settings.audio.enabled && <>
                        <Select
                            label="Instrument"
                            description="Change the instrument for audio output"
                            onChange={onInstrumentChange}
                            options={Object.values(AppInstrument)}
                            selectedValue={settings.audio.instrument}
                            isDisabled={sidebarClosed} />
                        <Range
                            staticProps={{
                                label: "Volume", description: "Change the volume of the audio output",
                                max: 5, min: -30, step: 1, settingGroup: "audio", settingName: "volume", width: "7.5rem"
                            }}
                            onChange={onRangeChange}
                            value={settings.audio.volume}
                            isDisabled={sidebarClosed} />
                    </>}

                    <h3>Colors</h3>
                    <ColorSelect label="Active color" description="Change highlight color for the piano keys and settings"
                        value={settings.global.activeColor} onChange={onActiveColorChange} isDisabled={sidebarClosed} />
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