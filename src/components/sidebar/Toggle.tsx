import React from 'react';
import { AppSettings } from '../../state/useSettings';
import '../../styles/main.scss'
import Tooltip from '../help/Tooltip';

interface ToggleProps<T extends keyof AppSettings> {
    displayLabel: string;
    description: string;
    isChecked: boolean;

    settingGroup: T
    settingName: keyof AppSettings[T];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

    displayLabelRight?: string;
    makeTooltip?: boolean;
    isDisabled?: boolean;
}

const Toggle = <T extends keyof AppSettings>(props: ToggleProps<T>) => {

    return (
        <label className="toggle-display">
            {props.makeTooltip ? 
                <Tooltip text={props.displayLabel} tooltip={props.description} /> 
                : props.displayLabel}
            <div className="toggle" title={props.description} aria-label={props.description} >
                <input type="checkbox" checked={props.isChecked} disabled={props.isDisabled}
                    onChange={props.onChange.bind(this)} data-setting={props.settingName} data-group={props.settingGroup} />
                <span className="slider"></span>
            </div>
            {props.displayLabelRight && <div className="toggle-label">
                {props.displayLabelRight}
            </div>}
        </label>
    )
}

export default Toggle;