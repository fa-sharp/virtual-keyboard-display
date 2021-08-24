import { useState } from "react"

/**
 * 
 * @param key The key used to save to the browser's local storage
 * @param initialValue The initial value of the settings
 * @returns The settings object, as well as methods to update/change the settings, 
 * which will be persisted to browser's local storage (if available).
 */
const useLocalSettings = <T>(key: string, initialValue: T) => {

    const [settings, setSettings] = useState<T>(() => {
        try {
            // Find saved settings in local storage, if there
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (err) {
            console.log("Was not able to read browser's local storage. Settings won't be saved.", err);
            return initialValue;
        }
    });

    /** Updates the entire settings in state, and also persists to local storage. */
    const updateAllSettings = (value: T | ((prevState: T) => T)) => {
        try {
            const newSettings = value instanceof Function ?
                value(settings) : value;
            setSettings(newSettings);
            window.localStorage.setItem(key, JSON.stringify(newSettings));
        } catch (err) {
            console.log(err);
        }
    };

    /** Updates one setting in state, and persists to local storage. */
    const updateSetting = <K extends keyof T>(setting: K, newValue: T[K]) => {
        try {
            const newSettings = { ...settings, [setting]: newValue };
            setSettings(newSettings);
            window.localStorage.setItem(key, JSON.stringify(newSettings));
        } catch (err) {
            console.log(err);
        }
    }
    
    return { settings, updateSetting, updateAllSettings };
}

export default useLocalSettings;