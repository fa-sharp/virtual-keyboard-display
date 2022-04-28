import { ChangeEventHandler } from "react"

interface SelectProps {
    label: string;
    description: string;
    options: string[];
    values?: number[] | string[];
    selectedValue: number | string;
    onChange: ChangeEventHandler<HTMLSelectElement>
    isDisabled?: boolean;
}

const Select = ({label, description, options, values, selectedValue, onChange, isDisabled=false}: SelectProps) => {
    return (
        <label className="select">
            {label}
            <select
                value={selectedValue} title={description} onChange={onChange} disabled={isDisabled}>
                {options.map((optionText, idx) => <option key={idx} value={values ? values[idx] : optionText}>{optionText}</option>)}
            </select>
        </label>
    )
}

export default Select
