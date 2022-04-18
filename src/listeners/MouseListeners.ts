import { Dispatch, MutableRefObject, useCallback, useEffect } from "react";
import { PianoKeysAction } from "../state/PianoKeysReducer";

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
            
            console.log("Setting up / tearing down mouse listeners");

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