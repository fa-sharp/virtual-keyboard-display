import { Dispatch, MutableRefObject, useCallback, useEffect, useMemo, useState } from "react";
import { PianoKeysAction } from "../state/PianoKeysReducer";
import { getKeyboardCodeToKeyIdMap } from "../utils/KbdCodesUtils";

/**
 * React Hook to activate the mouse listeners. TODO: Add touch support and fix the mouse-up issue.
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param pianoElement Reference to the piano HTML element on which to activate the mouse click listeners.
 * @param stickyMode Whether "sticky mode" in options is enabled
 */
export const useMouseListeners =
    (playKeys: Dispatch<PianoKeysAction>, pianoElementRef: MutableRefObject<HTMLDivElement | null>, pianoEnabled: boolean, stickyMode: boolean) => {

        const handleMouseClick = useCallback(((event: MouseEvent) => {
            const clickedKeyId = getClickedKeyId(event);
            if (clickedKeyId)
                playKeys({ type: "KEY_TOGGLE", keyId: parseInt(clickedKeyId) });
            else {
                console.log(event.target);
                console.error("Error in mouse down listener: Couldn't find key at event target listed above!");
            }
        }), [playKeys])

        const handleMouseUp = useCallback(((event: MouseEvent) => {
            const clickedKeyId = getClickedKeyId(event);
            if (clickedKeyId)
                playKeys({ type: "KEY_OFF", keyId: parseInt(clickedKeyId) });
            else {
                console.log(event.target);
                console.error("Error in mouse up listener: Couldn't find key at event target listed above!");
            }
        }), [playKeys])

        /** 
         * Setting up and tearing down the mouse listeners. The dependencies array (2nd argument of useEffect) 
         * ensures that the listeners will only be created/removed when needed. 
         */
        useEffect(() => {

            if (!pianoEnabled)
                return;

            const currentPianoElement = pianoElementRef.current;

            if (!currentPianoElement) {
                console.log("Error setting up click listener: Piano element not found!");
                return;
            }

            if (stickyMode) {
                currentPianoElement.addEventListener("click", handleMouseClick);
            } else {
                currentPianoElement.addEventListener("mousedown", handleMouseClick);
                currentPianoElement.addEventListener("mouseup", handleMouseUp);
            }

            return () => {
                currentPianoElement.removeEventListener("click", handleMouseClick);
                currentPianoElement.removeEventListener("mousedown", handleMouseClick);
                currentPianoElement.removeEventListener("mouseup", handleMouseUp);
            }
        }, [playKeys, pianoElementRef, stickyMode, handleMouseUp, handleMouseClick, pianoEnabled]);
    }

function getClickedKeyId(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const keyElement = clickedElement.closest(".key") as HTMLElement | null;

    return keyElement?.dataset.keyid ?? null;
}

// /** The possible piano keys that shortcuts can start from  */
// export enum KbdShortcutsStartKeys {
//     C3 = 48,
//     C4 = 60,
//     C5 = 72
// }

/**
 * React Hook to set up the keyboard listeners. Single-quote (`'`) is a reserved shortcut in Firefox, so it won't work there
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param stickyMode Whether "sticky mode" in options is enabled
 */
export const useKeyboardListeners = (playKeys: Dispatch<PianoKeysAction>, stickyMode: boolean) => {

    /** Which piano key to start the keyboard shortcuts from. (Default: C4) */
    const [kbdShortcutsStartKey, setKbdShortcutsStartKey] = useState<number>(60);

    /** Map of keyboard shortcuts to piano key IDs */
    const kbdCodeToKeyIdMap = useMemo(() => getKeyboardCodeToKeyIdMap({
        startKeyId: kbdShortcutsStartKey
    }), [kbdShortcutsStartKey]);

    const handleKeyboardDown = useCallback((event: KeyboardEvent) => {
        if (event.repeat)
            return;
        const keyId = (event.code !== "") ?   // checking if code property is supported
            kbdCodeToKeyIdMap[event.code] : kbdCodeToKeyIdMap[event.keyCode];
        if (!keyId)
            return;
        if (stickyMode)
            playKeys({ type: "KEY_TOGGLE", keyId: keyId });
        else
            playKeys({ type: "KEY_ON", keyId: keyId });
    }, [kbdCodeToKeyIdMap, playKeys, stickyMode]);

    const handleKeyboardUp = useCallback((event: KeyboardEvent) => {
        if (event.repeat)
            return;
        switch (event.code) {
            // handle octave down
            case 'KeyZ':
            case 'ShiftLeft':
                if (kbdShortcutsStartKey > 48) setKbdShortcutsStartKey(value => value - 12);
                break;
            // handle octave up
            case 'Slash':
            case 'ShiftRight':
                if (kbdShortcutsStartKey < 72) setKbdShortcutsStartKey(value => value + 12);
                break;
            // default: check if note pressed
            default:
                const keyId = (event.code !== "") ? // checking if code property is supported
                    kbdCodeToKeyIdMap[event.code] : kbdCodeToKeyIdMap[event.keyCode];
                if (!keyId)
                    return;
                playKeys({ type: "KEY_OFF", keyId: keyId });
        }
    }, [kbdCodeToKeyIdMap, kbdShortcutsStartKey, playKeys]);


    /** 
     * Setting up and tearing down the keyboard listeners. Re-runs on toggling of "Sticky" mode
     */
    useEffect(() => {
        console.log("Setting up / tearing down keyboard listeners"); // NOT FOR PRODUCTION
        document.addEventListener("keydown", handleKeyboardDown);
        if (!stickyMode)
            document.addEventListener("keyup", handleKeyboardUp);

        return () => {
            document.removeEventListener("keydown", handleKeyboardDown);
            document.removeEventListener("keyup", handleKeyboardUp);
        }
    }, [handleKeyboardDown, handleKeyboardUp, stickyMode]);
}