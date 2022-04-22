import { ChangeEventHandler } from "react"

interface SelectProps {
    label: string;
    description: string;
    options: string[];
    selectedValue: string;
    onChange: ChangeEventHandler<HTMLSelectElement>
    isDisabled?: boolean;
}

const Select = ({label, description, options, selectedValue, onChange, isDisabled=false}: SelectProps) => {
    return (
        <label className="select">
            {label}
            <select name="instrumentSelect" id="instrumentSelect" 
                value={selectedValue} title={description} onChange={onChange} disabled={isDisabled}>
                {options.map((optionText, idx) => <option key={idx} value={optionText}>{optionText}</option>)}
            </select>
        </label>
    )
}

export default Select
