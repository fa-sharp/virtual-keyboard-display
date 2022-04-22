import { useCallback, useEffect, useState } from "react";
import { AppInstrument } from "../audio/instruments";
import useLocalStorage from "./util/useLocalStorage";

/**
 * EXPERIMENT!!
 * NOT USED!!
 */

const INITIAL_SETTINGS: AppSettings =
{
    global: { useFlats: true, sustainMode: false, kbdMappingStartKey: 60, activeColor: '#00aaff' },
    piano: {
        show: true, pianoRange: [60, 72], showNoteNames: false, showKbdMappings: false, pianoSize: 3.0
    },
    staff: { show: true, clefDivideKey: 59 },
    audio: { enabled: false, instrument: AppInstrument.PIANO, volume: 1 }
}
const CSS_VARIABLES = { KEY_SIZE: "--piano-key-width", ACTIVE_COLOR: "--active-color" }

// some Typescript jank right here
export type UpdateAppSetting =
    <Group extends keyof AppSettings, Name extends keyof AppSettings[Group]>(settingGroup: Group, settingName: Name, newValue: AppSettings[Group][Name]) => void

export const useSettings = () => {

    const { settings: globalSettings, updateSetting: updateGlobalSetting } = useLocalStorage("global", INITIAL_SETTINGS.global);
    const { settings: pianoSettings, updateSetting: updatePianoSetting } = useLocalStorage("piano", INITIAL_SETTINGS.piano);
    const { settings: staffSettings, updateSetting: updateStaffSetting } = useLocalStorage("staff", INITIAL_SETTINGS.staff);
    const { settings: audioSettings, updateSetting: updateAudioSetting } = useLocalStorage("audio", INITIAL_SETTINGS.audio);

    const [appSettings, setAppSettings] = useState<AppSettings>({
        global: globalSettings, piano: pianoSettings, staff: staffSettings, audio: audioSettings
    });

    /** Update one of the app settings and persist in local storage. TODO this is quite ugly and has to ignore all TS errors. Better way? */
    const updateAppSetting = useCallback<UpdateAppSetting>((settingGroup, settingName, newValue) => {
        switch (settingGroup) {
            case 'global':
                //@ts-expect-error
                updateGlobalSetting(settingName, newValue);
                break;
            case 'piano':
                //@ts-expect-error
                updatePianoSetting(settingName, newValue);
                break;
            case 'staff':
                //@ts-expect-error
                updateStaffSetting(settingName, newValue);
                break;
            case 'audio':
                //@ts-expect-error
                updateAudioSetting(settingName, newValue);
                break;
        }
    }, [updateAudioSetting, updateGlobalSetting, updatePianoSetting, updateStaffSetting]);

    /** Update CSS Variables as any styling settings are changed */
    useEffect(() => {
        document.documentElement.style.setProperty(CSS_VARIABLES.KEY_SIZE, pianoSettings.pianoSize + "rem");
        document.documentElement.style.setProperty(CSS_VARIABLES.ACTIVE_COLOR, globalSettings.activeColor);
    }, [globalSettings.activeColor, pianoSettings.pianoSize])


}

/** New and improved settings (organized!) */
export interface AppSettings {
    global: {
        sustainMode: boolean
        useFlats: boolean
        kbdMappingStartKey: number;
        /** Color used for the currently played keys, as well as in the sidebar */
        activeColor: string;
    }
    piano: {
        show: boolean;
        pianoRange: [number, number];
        showNoteNames: boolean
        showKbdMappings: boolean;
        /** Size of piano keys, in `rem` units */
        pianoSize: number;
    }
    staff: {
        show: boolean
        clefDivideKey: number;
    }
    audio: {
        enabled: boolean
        instrument: AppInstrument
        volume: number
    }
}