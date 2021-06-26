import React from 'react'

interface RangeStaticProps {
    min: string;
    max: string;
    step: string;

    label: string;
    description: string;

    optionName: string;
    unit?: string;
}

interface RangeProps {
    staticProps: RangeStaticProps;

    value: number | string;
    isDisabled?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Range = ({staticProps: {min,max,step,description,label,optionName,unit},
                                value,isDisabled,onChange}: RangeProps) => {
    return (
        <label className="range-display">{label}
            <input
                type="range" disabled={isDisabled}
                min={min} max={max} step={step}
                title={description}
                data-option={optionName}
                data-unit={unit}
                value={value}
                onChange={onChange}
            />
        </label>
    )
}

export default Range;