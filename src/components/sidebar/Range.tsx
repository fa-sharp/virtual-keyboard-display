import { makeStyles, Slider, Theme } from '@material-ui/core';
import React from 'react'

interface RangeStaticProps {
    min: number;
    max: number;
    step: number;
    width: string;

    label: string;
    description: string;

    optionName: string;
    unit?: string;
}

interface RangeProps {
    staticProps: RangeStaticProps;

    value: number;
    isDisabled?: boolean;
    onChange: (event: React.ChangeEvent<{}>, value: number | number[]) => void;
}

const useStyles = makeStyles<Theme,{width: string}>({
    root: props => ({
        width: props.width,
        color: "var(--active-color)"
    }), 
    rail: {
        backgroundColor: "var(--text-settings-color)",
    }
  });

const Range = ({staticProps: {min,max,step,description,label,width,optionName,unit},
    value, isDisabled, onChange}: RangeProps) => {
        
    const sliderClass = useStyles({width: width});
    return (
        <label className="range-display">
            {label}
            <Slider
                classes={{
                    root: sliderClass.root,
                    rail: sliderClass.rail
                }}
                disabled={isDisabled}
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