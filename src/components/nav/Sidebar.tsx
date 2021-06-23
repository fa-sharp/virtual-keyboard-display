import React, { useCallback, useState } from "react";
import { KeyboardOptions } from "../App";
import Toggle from "./Toggle";

interface SidebarProps {
    keyboardOptions: KeyboardOptions;
    toggleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar = React.memo(({keyboardOptions, toggleOptionChange}: SidebarProps) => {

    const [closed, setClosed] = useState(false);

    const toggleSettingsMenu = useCallback(() => setClosed((prevClosed) => !prevClosed), []);

    return (
        <div className="sidebar-container">
            <button id="toggle-sidebar-button" className="header-button" title="Settings"
                aria-label="Open/close settings menu" onClick={toggleSettingsMenu} tabIndex={1}>
                <i className="material-icons">settings</i>
            </button>
            <nav className={"sidebar" + ((closed) ? " closed" : "")}>
                <div className="sidebar-overlay"></div>
                <div className="sidebar-content">
                    <h2>Settings</h2>
                    <Toggle
                        displayLabel="Show note names"
                        description="Display text of note names for each piano key"
                        isChecked={keyboardOptions.showNoteNames}
                        optionName="showNoteNames"
                        onChange={toggleOptionChange} 
                        isDisabled={closed}/>
                    <Toggle
                        displayLabel="Show keyboard shortcuts"
                        description="Display keyboard shortcuts for each piano key"
                        isChecked={keyboardOptions.showKbdMappings}
                        optionName="showKbdMappings"
                        onChange={toggleOptionChange}
                        isDisabled={closed} />
                    <Toggle
                        displayLabel="Sharps"
                        displayLabelRight="Flats"
                        description="Sharps (off) or Flats (on)"
                        isChecked={keyboardOptions.useFlats}
                        optionName="useFlats"
                        onChange={toggleOptionChange}
                        isDisabled={closed} />
                    <Toggle
                        displayLabel='"Sticky" mode'
                        description="In 'sticky' mode, the keys are toggled instead of being released right away"
                        makeTooltip={true}
                        isChecked={keyboardOptions.stickyMode}
                        optionName="stickyMode"
                        onChange={toggleOptionChange}
                        isDisabled={closed} />
                </div>
            </nav>
        </div>
    );
});

export default Sidebar;