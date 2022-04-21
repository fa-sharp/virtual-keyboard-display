import { makeStyles, Slider, Theme } from '@material-ui/core';
import { KeyboardSettings } from '../../state/useKeyboardSettings';
import { getOctaveKeyText } from '../../utils/KeyDataUtils';

interface RangeStaticProps {
    min: number;
    max: number;
    step: number;
    width: string;

    label: string;
    description: string;

    optionName: keyof KeyboardSettings;
    unit?: string;
}

interface RangeProps {
    staticProps: RangeStaticProps;

    value: [number, number] | number;
    useFlats: boolean;
    isDisabled?: boolean;
    onChange: (optionName: keyof KeyboardSettings, value: number | [number, number]) => void;
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


const KeyRange = ({staticProps: {min,max,step,description,label,width,optionName,unit},
    value, useFlats, isDisabled, onChange}: RangeProps) => {
        
    const sliderClass = useStyles({width: width});
    const valueText = (value: number) => getOctaveKeyText(value, useFlats);

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

                valueLabelFormat={valueText}
                getAriaValueText={valueText}
                valueLabelDisplay="auto"
                

                value={value}
                onChange={(_e, value) => onChange(optionName, value as number | [number, number])}
            />
        </label>
    )
}

export default KeyRange;