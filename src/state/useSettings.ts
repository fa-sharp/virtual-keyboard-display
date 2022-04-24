import { useCallback, useEffect, useState } from "react";
import { AppInstrument } from "../audio/instruments";
import useLocalStorage from "./util/useLocalStorage";

const INITIAL_SETTINGS: AppSettings = {
    global: { useFlats: true, sustainMode: false, kbdMappingStartKey: 60, activeColor: '#00aaff' },
    piano: {
        show: true, pianoRange: [60, 72], showNoteNames: false, showKbdMappings: false, pianoSize: 3.0
    },
    staff: { show: true, clefDivideKey: 59 },
    audio: { enabled: false, instrument: AppInstrument.PIANO, volume: 1 }
}

enum CSS_VARIABLES { KEY_SIZE = "--piano-key-width", ACTIVE_COLOR = "--active-color" }
export const MIN_KEY = 48;
export const MAX_KEY = 84;

export type UpdateAppSetting =
    <Group extends keyof AppSettings, Setting extends keyof AppSettings[Group]>(settingGroup: Group, settingName: Setting, newValue: AppSettings[Group][Setting]) => void

/** Hook for retrieving and changing app settings. All changes are persisted to local storage */
export const useSettings = () => {

    /** Get settings from local storage. If not found, use `INITIAL_SETTINGS` */
    const { settings: globalSettings, updateAllSettings: updateGlobalSettings } = useLocalStorage("global", INITIAL_SETTINGS.global);
    const { settings: pianoSettings, updateAllSettings: updatePianoSettings } = useLocalStorage("piano", INITIAL_SETTINGS.piano);
    const { settings: staffSettings, updateAllSettings: updateStaffSettings } = useLocalStorage("staff", INITIAL_SETTINGS.staff);
    const { settings: audioSettings, updateAllSettings: updateAudioSettings } = useLocalStorage("audio", INITIAL_SETTINGS.audio);

    /** Main app settings. State will be stored and changed here, and then persisted to local storage using hooks above */
    const [appSettings, setAppSettings] = useState<AppSettings>({
        global: globalSettings, piano: pianoSettings, staff: staffSettings, audio: audioSettings
    });

    /** Update one of the app settings. */
    const updateAppSetting = useCallback<UpdateAppSetting>((settingGroup, settingName, newValue) => {
        setAppSettings(prevSettings => ({
            ...prevSettings, [settingGroup]: { ...prevSettings[settingGroup], [settingName]: newValue }
        }));
    }, []);

    /** Update CSS Variables as any styling settings are changed */
    useEffect(() => {
        document.documentElement.style.setProperty(CSS_VARIABLES.KEY_SIZE, pianoSettings.pianoSize + "rem");
        document.documentElement.style.setProperty(CSS_VARIABLES.ACTIVE_COLOR, globalSettings.activeColor);
    }, [globalSettings.activeColor, pianoSettings.pianoSize]);

    /** Update local storage as settings change. 
     * TODO debouncing here? Lots of unnecessary changes when using sliders/ranges */
    useEffect(() => {
        updateGlobalSettings(appSettings.global);
    }, [appSettings.global, updateGlobalSettings])
    useEffect(() => {
        updateAudioSettings(appSettings.audio);
    }, [appSettings.audio, updateAudioSettings]);
    useEffect(() => {
        updatePianoSettings(appSettings.piano);
    }, [appSettings.piano, updatePianoSettings]);
    useEffect(() => {
        updateStaffSettings(appSettings.staff);
    }, [appSettings.staff, updateStaffSettings]);


    return { settings: appSettings, updateSetting: updateAppSetting };
}

/** Shape of app settings (organized!) */
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