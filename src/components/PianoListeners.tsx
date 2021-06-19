import React, { useCallback } from "react";
import { Dispatch, useEffect } from "react";
import { KeyboardOptions, PlayKeysAction } from "./App";

interface PianoListenersProps {
    playKeys: Dispatch<PlayKeysAction>
    keyboardOptions: KeyboardOptions
}

/**
 * Utility component that activates the keyboard, mouse, and MIDI listeners.
 * 
 * @param playKeys Dispatch method to send events to manipulate the piano keys
 * @returns null! Nothing to display here.
 */
const PianoListeners = React.memo(({playKeys, keyboardOptions}: PianoListenersProps) => {

    const handleMouseDown = useCallback(((event: MouseEvent) => {
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

    // Set up the mouse listeners
    useEffect(() => {
        console.log("Setting up the mouse listeners!");

        const pianoElement = document.querySelector<HTMLDivElement>(".piano");
        if (pianoElement) {
            pianoElement.addEventListener("mousedown", handleMouseDown);
            if (!keyboardOptions.stickyMode)
                pianoElement.addEventListener("mouseup", handleMouseUp);
        } else
            console.log("Error setting up click listener: Piano element not found!");
        
        return () => {
            console.log("Cleaning up the mouse listeners!");
            pianoElement?.removeEventListener("mousedown", handleMouseDown);
            pianoElement?.removeEventListener("mouseup", handleMouseUp);
        }
    }, [playKeys, keyboardOptions.stickyMode, handleMouseDown, handleMouseUp]);

    return null;
})

function getClickedKeyId(event: MouseEvent) {
    let keyElement = event.target as HTMLElement
    if (!keyElement.classList.contains("key")) // switch to parent Key element if clicked on inner text
        keyElement = keyElement.parentNode as HTMLElement;
    return keyElement.dataset.keyid ?? null;
}

export default PianoListeners;