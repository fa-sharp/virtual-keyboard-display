import Key from "./Key";
import { KeyboardSettings } from "../App";
import { forwardRef } from "react";

interface PianoProps {
    startKey: number
    endKey: number

    pianoKeys: boolean[]
    settings: KeyboardSettings
}

const generateKeyElements = 
    (startKey: number, endKey: number, pianoKeys: boolean[], keyboardOptions: KeyboardSettings) => {

    let keyElements: JSX.Element[] = [];
    for (let keyId = startKey; keyId <= endKey; keyId++) {
        keyElements.push(
            <Key
                key={keyId}
                keyId={keyId}
                isPlaying={pianoKeys[keyId]}
                settings={keyboardOptions}
            />
        )
    }
    return keyElements;
}

const Piano = 
    forwardRef<HTMLDivElement, PianoProps>(({ startKey, endKey, pianoKeys, settings }, pianoElementRef) => {

    return (
        <div ref={pianoElementRef} className="piano">
            {generateKeyElements(startKey, endKey, pianoKeys, settings)}
        </div>
    )

});

export default Piano;
