import { makeStyles, Slider, Theme } from '@material-ui/core';
import { AppSettings } from '../../state/useSettings';

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

    value: number;
    isDisabled?: boolean;
    onChange: (settingGroup: T, settingName: keyof AppSettings[T], value: number) => void;
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

const Range = <T extends keyof AppSettings>({staticProps: {min,max,step,description,label,width,unit,settingGroup,settingName},
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
                data-unit={unit}

                value={value}
                onChange={(_e, value) => onChange(settingGroup, settingName, value as number)}
            />
        </label>
    )
}

export default Range;