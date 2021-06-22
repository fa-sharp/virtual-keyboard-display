import React from "react";
import { KeyboardOptions } from "../App";
import Toggle from "./Toggle";

interface SidebarProps {
    keyboardOptions: KeyboardOptions;
    toggleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar = ({keyboardOptions, toggleOptionChange}: SidebarProps) => {
    return (
        <div className="sidebar">
            <h2>Settings</h2>
            <Toggle
                displayLabel="Show note names:"
                description="Display text of note names for each key"
                isChecked={keyboardOptions.showNoteNames}
                optionName="showNoteNames"
                onChange={toggleOptionChange}
            />
            <Toggle
                displayLabel="Show keyboard shortcuts:"
                description="Display keyboard mappings for each key"
                isChecked={keyboardOptions.showKbdMappings}
                optionName="showKbdMappings"
                onChange={toggleOptionChange}
            />
            <Toggle
                displayLabel="Sharps"
                displayLabelRight="Flats"
                description="Sharps (off) or Flats (on)"
                isChecked={keyboardOptions.useFlats}
                optionName="useFlats"
                onChange={toggleOptionChange}
            />
            <Toggle
                displayLabel="Sticky mode:"
                description="Keys are toggled instead of immediately released"
                isChecked={keyboardOptions.stickyMode}
                optionName="stickyMode"
                onChange={toggleOptionChange}
            />
        </div>
    )
}

export default Sidebar;