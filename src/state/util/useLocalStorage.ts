import { useCallback, useState } from "react"

/**
 * Custom hook to save and retrieve settings to/from local storage.
 * 
 * @param key The key used to save to the browser's local storage
 * @param initialValue The initial value of the settings
 * @returns The settings object, as well as methods to update/change the settings, 
 * which will be persisted to browser's local storage (if available).
 */
const useLocalStorage = <T>(key: string, initialValue: T) => {

    /** Whether the browser supports local storage. */
    const [canAccessStorage, setCanAccessStorage] = useState(true);

    const [settings, setSettings] = useState<T>(() => {
        try {
            // Find saved settings in local storage, if there
            const item = window.localStorage.getItem(key);
            return item ?
                sanitizeLocalStorageSettings(JSON.parse(item), initialValue) : initialValue;
        }
        catch (err) {
            console.log("Was not able to read browser's local storage. Settings won't be saved.", err);
            setCanAccessStorage(false);
            return initialValue;
        }
    });

    /** Updates the entire settings in state, and also persists to local storage. */
    const updateAllSettings = useCallback((value: T | ((prevState: T) => T)) => {
        try {
            const newSettings = value instanceof Function ?
                value(settings) : value;
            setSettings(newSettings);

            if (canAccessStorage)
                window.localStorage.setItem(key, JSON.stringify(newSettings));
        } catch (err) {
            console.log(err);
        }
    }, [canAccessStorage, key, settings]);

    /** Updates one setting in state, and persists to local storage. */
    const updateSetting = useCallback(<K extends keyof T>(setting: K, newValue: T[K]) => {
        try {
            setSettings(prevSettings => {
                if (prevSettings[setting] === undefined) throw new TypeError(`No such setting: '${setting}'`)

                const newSettings = { ...prevSettings, [setting]: newValue };
                if (canAccessStorage)
                    window.localStorage.setItem(key, JSON.stringify(newSettings));
                return newSettings;
            });
        } catch (err) {
            console.log(err);
        }
    }, [canAccessStorage, key]);

    return { settings, updateSetting, updateAllSettings };
}

/** 
 * Sanitizes the `value` from local storage to ensure it matches the shape of `initialValue`.
 * Returns a 'safe-ish' version of the settings.
 */
const sanitizeLocalStorageSettings = <T>(valueFromLocalStorage: any, initialValue: T) => {
    const safeValue = Object.assign({}, initialValue);
    for (let key in safeValue) {
        if (typeof valueFromLocalStorage[key] === typeof safeValue[key])
            safeValue[key] = valueFromLocalStorage[key];
    }
    return safeValue;
}

export default useLocalStorage;