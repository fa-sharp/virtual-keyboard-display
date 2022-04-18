import { makeStyles, Slider, Theme } from '@material-ui/core';
import { KeyboardSettings } from '../../state/useKeyboardSettings';
import { StyleSettings } from '../../state/useStyleSettings';


interface RangeStaticProps<T> {
    min: number;
    max: number;
    step: number;
    width: string;

    label: string;
    description: string;

    optionName: keyof T;
    unit?: string;
}

interface RangeProps<T> {
    staticProps: RangeStaticProps<T>;

    value: number;
    isDisabled?: boolean;
    onChange: (optionName: keyof T, value: number) => void;
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

const Range = <T extends KeyboardSettings | StyleSettings>({staticProps: {min,max,step,description,label,width,optionName,unit},
    value, isDisabled, onChange}: RangeProps<T>) => {
        
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
                onChange={(_e, value) => onChange(optionName, value as number)}
            />
        </label>
    )
}

export default Range;