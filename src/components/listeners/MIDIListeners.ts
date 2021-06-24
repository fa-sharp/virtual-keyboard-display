import { Dispatch, useCallback, useEffect } from "react";
import { PlayKeysAction } from "../App";
import JZZ from "jzz";

/**
 * Sets up the listener to connect the app to a MIDI keyboard. Currently using the JZZ MIDI library
 * for this: https://jazz-soft.net/doc/JZZ/. In the future, might use the native Web MIDI interface if it's
 * more solidified and widely implemented
 * 
 * @param playKeys Dispatch method to send messages to App component and manipulate the pianoKeys state
 * @param stickyMode Whether "sticky mode" in options is enabled
 */
const useMIDIListeners = (playKeys: Dispatch<PlayKeysAction>, stickyMode: boolean) => {

    const handleMIDIMessage = useCallback((midiMessage) => {

        if (midiMessage.isNoteOn())
            handleMIDIKeyDown(midiMessage.getNote(), playKeys);
        else if (!stickyMode)
            handleMIDIKeyUp(midiMessage.getNote(), playKeys);
        
    }, [playKeys, stickyMode]);

    useEffect(() => {
        const midiPort = JZZ({sysex: true}).wait(3000).openMidiIn(0).or('Cannot open MIDI In port!')
            .connect(handleMIDIMessage).and("MIDI port opened. Cool!");

        return () => {
            midiPort.close().and("MIDI port closed!").or("Failed closing MIDI port!");
        }
    }, [handleMIDIMessage]);
}

const handleMIDIKeyDown = (keyId: number, playKeys: Dispatch<PlayKeysAction>) => {
    playKeys({type: "KEY_TOGGLE", keyId: keyId});
};

const handleMIDIKeyUp = (keyId: number, playKeys: Dispatch<PlayKeysAction>) => {
    playKeys({type: "KEY_OFF", keyId: keyId});
};


export default useMIDIListeners;