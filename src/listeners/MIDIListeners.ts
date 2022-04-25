import { Dispatch, useCallback, useEffect, useState } from "react";
import { PianoKeysAction } from "../state/PianoKeysReducer";
import { Input, NoteMessageEvent, WebMidi } from "webmidi";

/**
 * Sets up the listener to connect the app to a MIDI keyboard. Using WebMidi library
 * for this: https://webmidijs.org/.
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param sustainMode Whether "sustain mode" in options is enabled
 */
export const useMIDIListeners = (playKeys: Dispatch<PianoKeysAction>, sustainMode: boolean, 
            setMidiDeviceName: ((name: string) => void)) => {

    const { midiReady, midiDevices } = useMidi();

    const handleNoteOn = useCallback((event: NoteMessageEvent) => {
        if (sustainMode)
            playKeys({ type: "KEY_TOGGLE", keyId: event.note.number })
        else
            playKeys({ type: "KEY_ON", keyId: event.note.number })
    }, [playKeys, sustainMode]);

    const handleNoteOff = useCallback((event: NoteMessageEvent) => {
        playKeys({ type: "KEY_OFF", keyId: event.note.number })
    }, [playKeys]);

    useEffect(() => {
        // Return if no MIDI devices found
        if (!midiReady || (midiReady && midiDevices.length === 0))
            return;

        // Add listener to first MIDI device
        const midiDevice = WebMidi.inputs[0];
        midiDevice.addListener('noteon', handleNoteOn);
        if (!sustainMode)
            WebMidi.inputs[0].addListener('noteoff', handleNoteOff)

        // Update display to reflect MIDI device
        setMidiDeviceName(midiDevice.name);

        // Clean-up: Remove listeners
        return () => {
            console.log("Setting up / tearing down MIDI listeners")
            WebMidi.inputs[0].removeListener();
        }

    }, [handleNoteOff, handleNoteOn, midiDevices.length, midiReady, setMidiDeviceName, sustainMode]);
}

/** Connect to browser's WebMidi API and find connected devices */
const useMidi = () => {

    const [ready, setReady] = useState(false);
    const [devices, setDevices] = useState<Input[]>([]);

    useEffect(() => {
        // enable WebMidi
        WebMidi.enable({ sysex: true })
            .then(onEnabled)
            .catch(err => console.error("Error enabling MIDI: ", err));

        function onEnabled() {
            setDevices(WebMidi.inputs);
            setReady(true);

            // Refresh device list if connected devices change
            WebMidi.addListener("portschanged", () => setDevices(WebMidi.inputs));
        }

        // Clean-up
        return () => {
            WebMidi.disable();
            setDevices([]);
            setReady(false);
        }
    }, []);

    return { midiReady: ready, midiDevices: devices }
}