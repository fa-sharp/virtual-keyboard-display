import React from 'react';
import '../../styles/main.scss'

type ToggleProps = {
    displayLabel: string;
    displayLabelRight?: string;
    ariaLabel: string;
    isChecked: boolean;
    optionName: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Toggle = (props: ToggleProps) => {
    return (
        <div className="toggle-display">
            <div className="toggle-label">
                {props.displayLabel}
            </div>
            <label className="toggle" aria-label={props.ariaLabel} >
                <input type="checkbox" checked={props.isChecked} 
                    onChange={props.onChange.bind(this)} data-option={props.optionName} />
                <span className="slider"></span>
            </label>
            <div className="toggle-label">
                {props.displayLabelRight ? props.displayLabelRight : null}
            </div>
        </div>
    )
}

export default Toggle;