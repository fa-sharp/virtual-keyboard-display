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
    kbdSettings: KeyboardSettings, 
    updateKbdSetting: UpdateKeyboardSetting
) => {

    const { kbdMappingStartKey, useFlats, stickyMode } = kbdSettings;

    /** Map of keyboard shortcuts to piano key IDs */
    const kbdCodeToKeyIdMap = useMemo(() => getKeyboardCodeToKeyIdMap({
        startKeyId: kbdMappingStartKey
    }), [kbdMappingStartKey]);

    const handleKeyboardDown = useCallback((event: KeyboardEvent) => {
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
                updateKbdSetting('useFlats', !useFlats);
                break;
            // toggle sticky mode
            case 'KeyC':
                updateKbdSetting('stickyMode', !stickyMode);
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
    }, [playKeys, updateKbdSetting, kbdMappingStartKey, useFlats, stickyMode, kbdCodeToKeyIdMap]);

    const handleKeyboardUp = useCallback((event: KeyboardEvent) => {
        if (event.repeat)
            return;
        const keyId = (event.code !== "") ? // checking if code property is supported
            kbdCodeToKeyIdMap[event.code] : kbdCodeToKeyIdMap[event.keyCode];
        if (!keyId)
            return;
        playKeys({ type: "KEY_OFF", keyId: keyId });
    }, [playKeys, kbdCodeToKeyIdMap]);


    /** 
     * Setting up and tearing down the keyboard listeners.
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