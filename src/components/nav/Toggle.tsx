import React from 'react';
import '../../styles/main.scss'

type ToggleProps = {
    displayLabel: string;
    displayLabelRight?: string;
    description: string;
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
            <label className="toggle" title={props.description} aria-label={props.description} >
                <input type="checkbox" checked={props.isChecked} 
                    onChange={props.onChange.bind(this)} data-option={props.optionName} />
                <span className="slider"></span>
            </label>
            {props.displayLabelRight && <div className="toggle-label">
                {props.displayLabelRight}
            </div>}
        </div>
    )
}

export default Toggle;