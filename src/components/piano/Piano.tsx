import Key from "./Key";
import { KeyboardOptions } from "../App";
import { forwardRef } from "react";

interface PianoProps {
    startKey: number
    endKey: number

    pianoKeys: boolean[]
    keyboardOptions: KeyboardOptions
}

const generateKeyElements = 
    (startKey: number, endKey: number, pianoKeys: boolean[], keyboardOptions: KeyboardOptions) => {

    let keyElements: JSX.Element[] = [];
    for (let keyId = startKey; keyId <= endKey; keyId++) {
        keyElements.push(
            <Key
                key={keyId}
                keyId={keyId}
                isPlaying={pianoKeys[keyId]}
                keyboardOptions={keyboardOptions}
            />
        )
    }
    return keyElements;
}

const Piano = 
    forwardRef<HTMLDivElement, PianoProps>(({ startKey, endKey, pianoKeys, keyboardOptions }, pianoElementRef) => {

    return (
        <div ref={pianoElementRef} className="piano">
            {generateKeyElements(startKey, endKey, pianoKeys, keyboardOptions)}
        </div>
    )

});

export default Piano;
