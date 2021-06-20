import { Dispatch, RefObject, useCallback, useEffect } from "react";
import { PlayKeysAction } from "../App";
import { keyCodeToKeyId } from "../../utils/KbdCodesUtils";

/**
 * React Hook to activate the mouse listeners. TODO: Add touch support and fix the mouse-up issue.
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param pianoElement Reference to the piano HTML element on which to activate the mouse click listeners.
 * @param stickyMode Whether "sticky mode" in options is enabled
 */
export const useMouseListeners = 
    (playKeys: Dispatch<PlayKeysAction>, pianoElement: RefObject<HTMLDivElement | null>, stickyMode: boolean) => {

    const handleMouseClick = useCallback(((event: MouseEvent) => {
        const clickedKeyId = getClickedKeyId(event);
        if (clickedKeyId)
            playKeys({ type: "KEY_TOGGLE", keyId: parseInt(clickedKeyId)});
        else {
            console.log(event.target);
            console.error("Error in mouse down listener: Couldn't find key at event target listed above!");
        }
    }), [playKeys])

    const handleMouseUp = useCallback(((event: MouseEvent) => {
        const clickedKeyId = getClickedKeyId(event);
        if (clickedKeyId)
            playKeys({ type: "KEY_OFF", keyId: parseInt(clickedKeyId)});
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
        console.log("Setting up the mouse listeners!");

        const currentPianoElement = pianoElement.current;
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
            console.log("Cleaning up the mouse listeners!");
            currentPianoElement.removeEventListener("click", handleMouseClick);
            currentPianoElement.removeEventListener("mousedown", handleMouseClick);
            currentPianoElement.removeEventListener("mouseup", handleMouseUp);
        }
    }, [playKeys, pianoElement, stickyMode, handleMouseUp, handleMouseClick]);
}

function getClickedKeyId(event: MouseEvent) {
    let keyElement = event.target as HTMLElement
    if (!keyElement.classList.contains("key")) // could use element.closest() here if this gets messy in the future
        keyElement = keyElement.parentNode as HTMLElement; // switch to parent Key element if clicked on inner text
    return keyElement.dataset.keyid ?? null;
}

/**
 * React Hook to set up the keyboard listeners. TODO add 'code' support in addition 
 * to keyCode. Semicolon and single-quote doesn't work in Firefox
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param stickyMode Whether "sticky mode" in options is enabled
 */
export const useKeyboardListeners = (playKeys: Dispatch<PlayKeysAction>, stickyMode: boolean) => {
    
    const handleKeyboardDown = useCallback((event: KeyboardEvent) => {
        if (event.repeat)
            return;
        const keyId = keyCodeToKeyId[event.keyCode];
        if (!keyId)
            return;
        if (stickyMode)
            playKeys({type: "KEY_TOGGLE", keyId: keyId});
        else
            playKeys({type: "KEY_ON", keyId: keyId});
    }, [playKeys, stickyMode]);

    const handleKeyboardUp = useCallback((event: KeyboardEvent) => {
        if (event.repeat)
            return;
        const keyId = keyCodeToKeyId[event.keyCode];
        if (!keyId)
            return;
        if (stickyMode)
            playKeys({type: "KEY_TOGGLE", keyId: keyId});
        else
            playKeys({type: "KEY_OFF", keyId: keyId});
    }, [playKeys, stickyMode]);

    useEffect(() => {
        console.log("Setting up the keyboard listeners!");
        document.addEventListener("keydown", handleKeyboardDown);
        if (!stickyMode)
            document.addEventListener("keyup", handleKeyboardUp);

        return () => {
            console.log("Cleaning up keyboard listeners!");
            document.removeEventListener("keydown", handleKeyboardDown);
            document.removeEventListener("keyup", handleKeyboardUp);
        }
    }, [handleKeyboardDown, handleKeyboardUp, stickyMode]);
}