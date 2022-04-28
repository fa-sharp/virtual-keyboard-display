import { Dispatch, useCallback, useEffect, useState } from "react";
import { PianoKeysAction } from "../state/PianoKeysReducer";
import { Input, NoteMessageEvent, WebMidi } from "webmidi";

/**
 * Sets up the listener to connect the app to a MIDI keyboard. Using WebMidi library
 * for this: https://webmidijs.org/.
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param sustainMode Whether "sustain mode" in options is enabled
 * @param selectedDevice The index of the selected MIDI device
 */
export const useMIDIListeners = (playKeys: Dispatch<PianoKeysAction>, sustainMode: boolean, selectedDevice: number, midiEnabled: boolean) => {

    const { midiReady, midiDevices } = useMidi(midiEnabled);

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
        // Return if MIDI is disabled, not ready, or if no devices found
        if (!midiEnabled || !midiReady || midiDevices.length === 0)
            return;

        // Add listener(s) to the MIDI device
        const midiDevice = midiDevices[selectedDevice] || midiDevices[0];
        midiDevice.addListener('noteon', handleNoteOn);
        if (!sustainMode)
            midiDevice.addListener('noteoff', handleNoteOff)

        // Clean-up: Remove listeners
        return () => {
            console.log("Setting up / tearing down MIDI listeners")
            midiDevice.removeListener();
        }

    }, [handleNoteOff, handleNoteOn, midiDevices, midiEnabled, midiReady, selectedDevice, sustainMode]);

    return { midiReady, midiDevices };
}

/**
 * Connect to browser's WebMidi API and find connected devices *
 * @param enabled whether MIDI input is enabled in app settings
 */
const useMidi = (enabled: boolean) => {

    const [ready, setReady] = useState(false);
    const [devices, setDevices] = useState<Input[]>([]);

    useEffect(() => {
        if (!enabled)
            return;

        // enable WebMidi
        WebMidi.enable({ sysex: true })
            .then(onEnabled)
            .catch(err => console.error("Error enabling MIDI: ", err));

        function onEnabled() {
            setDevices([...WebMidi.inputs]);
            setReady(true);
            console.log("MIDI ready!");

            // Refresh device list if connected devices change
            WebMidi.addListener("portschanged", () => setDevices([...WebMidi.inputs]));
        }

        // Clean-up
        return () => {
            WebMidi.disable();
            setDevices([]);
            setReady(false);
        }
    }, [enabled]);

    return { midiReady: ready, midiDevices: devices }
}