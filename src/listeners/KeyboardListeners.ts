import { Dispatch, useCallback, useEffect, useMemo } from "react";
import { PianoKeysAction } from "../state/PianoKeysReducer";
import { KeyboardSettings, UpdateKeyboardSetting } from "../state/useKeyboardSettings";
import { getKeyboardCodeToKeyIdMap } from "../utils/KbdCodesUtils";

/**
 * React Hook to set up the keyboard listeners. Single-quote (`'`) is a reserved shortcut in Firefox, so it won't work there
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param stickyMode Whether "sticky mode" in options is enabled
 */
export const useKeyboardListeners = (
    playKeys: Dispatch<PianoKeysAction>, 
    stickyMode: boolean, 
    kbdSettings: KeyboardSettings, 
    updateKbdSetting: UpdateKeyboardSetting
) => {

    /** Map of keyboard shortcuts to piano key IDs */
    const kbdCodeToKeyIdMap = useMemo(() => getKeyboardCodeToKeyIdMap({
        startKeyId: kbdSettings.kbdMappingStartKey
    }), [kbdSettings.kbdMappingStartKey]);

    const handleKeyboardDown = useCallback((event: KeyboardEvent) => {
        const { kbdMappingStartKey } = kbdSettings;

        if (event.repeat)
            return;
        switch (event.code) {
            // octave down
            case 'KeyZ':
                if (kbdMappingStartKey > 48)
                    updateKbdSetting('kbdMappingStartKey', kbdMappingStartKey - 12);
                break;
            // octave up
            case 'Slash':
                if (kbdMappingStartKey < 72)
                    updateKbdSetting('kbdMappingStartKey', kbdMappingStartKey + 12);
                break;
            // toggle sharps/flats
            case 'KeyB':
                updateKbdSetting('useFlats', !kbdSettings.useFlats);
                break;
            // toggle sticky mode
            case 'KeyC':
                updateKbdSetting('stickyMode', !kbdSettings.stickyMode);
                break;
            // clear all keys
            case 'Escape':
                playKeys({ type: "CLEAR_KEYS" });
                break;
            // default: check if note pressed
            default:
                const keyId = (event.code !== "") ?   // checking if code property is supported
                    kbdCodeToKeyIdMap[event.code] : kbdCodeToKeyIdMap[event.keyCode];
                if (!keyId)
                    return;
                if (stickyMode)
                    playKeys({ type: "KEY_TOGGLE", keyId: keyId });
                else
                    playKeys({ type: "KEY_ON", keyId: keyId });
        }
    }, [kbdCodeToKeyIdMap, playKeys, stickyMode, kbdSettings, updateKbdSetting]);

    const handleKeyboardUp = useCallback((event: KeyboardEvent) => {
        if (event.repeat)
            return;
        const keyId = (event.code !== "") ? // checking if code property is supported
            kbdCodeToKeyIdMap[event.code] : kbdCodeToKeyIdMap[event.keyCode];
        if (!keyId)
            return;
        playKeys({ type: "KEY_OFF", keyId: keyId });
    }, [kbdCodeToKeyIdMap, playKeys]);


    /** 
     * Setting up and tearing down the keyboard listeners. 
     * TODO This will rerun on toggling of ANY settings. Possible to change so it only happens on pertinent settings?
     */
    useEffect(() => {
        console.log("Setting up / tearing down keyboard listeners");
        document.addEventListener("keydown", handleKeyboardDown);
        if (!stickyMode)
            document.addEventListener("keyup", handleKeyboardUp);

        return () => {
            document.removeEventListener("keydown", handleKeyboardDown);
            document.removeEventListener("keyup", handleKeyboardUp);
        }
    }, [handleKeyboardDown, handleKeyboardUp, stickyMode]);
}