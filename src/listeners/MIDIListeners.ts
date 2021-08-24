import { Dispatch, useCallback, useEffect, useState } from "react";
import { PianoKeysAction } from "../state/PianoKeysReducer";
import JZZ from "jzz";

/**
 * Sets up the listener to connect the app to a MIDI keyboard. Currently using the JZZ MIDI library
 * for this: https://jazz-soft.net/doc/JZZ/. In the future, might use the native Web MIDI interface if it's
 * more solidified and widely implemented
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param stickyMode Whether "sticky mode" in options is enabled
 */
const useMIDIListeners = (playKeys: Dispatch<PianoKeysAction>, stickyMode: boolean, 
            setMidiDeviceName: ((name: string) => void)) => {

    const [midiDeviceFound, setMidiDeviceFound] = useState(true);

    const handleMIDIMessage = useCallback((midiMessage) => {

        if (midiMessage.isNoteOn()) {
            playKeys({ type: "KEY_TOGGLE", keyId: midiMessage.getNote() });
        }
        else if (midiMessage.isNoteOff() && !stickyMode) {
            playKeys({ type: "KEY_OFF", keyId: midiMessage.getNote() });
        }
        
    }, [playKeys, stickyMode]);

    useEffect(() => {
        // If MIDI device not found, this won't run again (user will have to refresh the browser
        // if they connect a device later)
        if (!midiDeviceFound) {
            setMidiDeviceName("None found");
            return;
        }

        // Try opening a MIDI In port
        const midiPort = JZZ({sysex: true}).wait(2000).refresh().openMidiIn()
            .or(handleMIDINotFound)
            .and(handleMIDIFound).connect(handleMIDIMessage);
        
        function handleMIDIFound() {
            let { name } = midiPort.info();

            console.log("Found MIDI Device: " + name);
            setMidiDeviceName(name + "  ✅");
        }

        function handleMIDINotFound() {
            console.log("MIDI Device not found!");
            setMidiDeviceFound(false);
        }

        // Closing the MIDI port
        return () => {
            midiPort.close().and("MIDI port closed!").or("Couldn't close MIDI port!");
            setMidiDeviceName("");
        }

    }, [handleMIDIMessage, midiDeviceFound, setMidiDeviceName]);
}

export default useMIDIListeners;