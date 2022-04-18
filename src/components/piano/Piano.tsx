import Key from "./Key";
import { KeyboardSettings } from "../../state/useKeyboardSettings";
import { forwardRef } from "react";

interface PianoProps {
    startKey: number
    endKey: number

    pianoKeys: boolean[]
    settings: KeyboardSettings
}

const generateKeyElements =
    (startKey: number, endKey: number, pianoKeys: boolean[], settings: KeyboardSettings) => {
        let keyElements: JSX.Element[] = [];
        for (let keyId = startKey; keyId <= endKey; keyId++) {
            keyElements.push(
                <Key
                    key={keyId}
                    keyId={keyId}
                    isPlaying={pianoKeys[keyId]}
                    settings={settings}
                />
            )
        }
        return keyElements;
    }

/** 🎹 The piano display */
const Piano =
    forwardRef<HTMLDivElement, PianoProps>(({ startKey, endKey, pianoKeys, settings }, pianoElementRef) => {

        return (
            <div className="piano-container">
                <div ref={pianoElementRef} className="piano">
                    {generateKeyElements(startKey, endKey, pianoKeys, settings)}
                </div>

                {settings.showKbdMappings &&
                    <ul className="other-kbd-shortcuts">
                        <li>
                            <kbd className="key-kbd">Z</kbd>
                            : Octave down
                        </li>
                        <li>
                            <kbd className="key-kbd">/</kbd>
                            : Octave up
                        </li>
                        <li>
                            <kbd className="key-kbd">B</kbd>
                            : Toggle sharps/flats
                        </li>
                        <li>
                            <kbd className="key-kbd">C</kbd>
                            : Toggle sticky/sustain mode
                        </li>
                        <li>
                            <kbd className="key-kbd medium">Esc</kbd>
                            : Clear all keys
                        </li>
                    </ul>}
            </div>
        )

    });

export default Piano;