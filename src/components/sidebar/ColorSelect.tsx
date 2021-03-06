import { ChangeEventHandler } from "react"

interface ColorSelectProps {
    label: string;
    description: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>
    isDisabled?: boolean;
}

const ColorSelect = ({label, description, value, onChange, isDisabled=false}: ColorSelectProps) => {
    return (
        <label className="color-select">
            {label}
            <input type="color" name="activeColorInput" id="activeColorInput" 
                value={value} title={description}  onChange={onChange} disabled={isDisabled} />
        </label>
    )
}

export default ColorSelect
