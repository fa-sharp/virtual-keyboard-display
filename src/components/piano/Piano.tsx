import Key from "./Key";
import { forwardRef } from "react";
import { AppSettings } from "../../state/useSettings";

interface PianoProps {
    startKey: number
    endKey: number

    pianoKeys: boolean[]
    settings: AppSettings
}

const generateKeyElements =
    (startKey: number, endKey: number, pianoKeys: boolean[], settings: AppSettings) => {
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

                {settings.piano.showKbdMappings &&
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
                            : Toggle sustain
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