import { makeStyles, Slider, Theme } from '@material-ui/core';
import { AppSettings } from '../../state/useSettings';
import { getOctaveKeyText } from '../../utils/KeyDataUtils';

interface RangeStaticProps<T extends keyof AppSettings> {
    min: number;
    max: number;
    step: number;
    width: string;

    label: string;
    description: string;

    settingGroup: T
    settingName: keyof AppSettings[T];
    unit?: string;
}

interface RangeProps<T extends keyof AppSettings> {
    staticProps: RangeStaticProps<T>;

    value: [number, number] | number;
    useFlats: boolean;
    isDisabled?: boolean;
    onChange: (settingGroup: T, settingName: keyof AppSettings[T], value: number | [number, number]) => void;
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


const KeyRange = <T extends keyof AppSettings>({staticProps: {min,max,step,description,label,width,unit,settingGroup,settingName},
    value, useFlats, isDisabled, onChange}: RangeProps<T>) => {
        
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
                data-unit={unit}

                valueLabelFormat={valueText}
                getAriaValueText={valueText}
                valueLabelDisplay="auto"
                

                value={value}
                onChange={(_e, value) => onChange(settingGroup, settingName, value as number | [number, number])}
            />
        </label>
    )
}

export default KeyRange;