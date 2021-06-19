import Key from "./Key";
import { KeyboardOptions } from "./App";
import React from "react";

interface PianoProps {
    startKey: number
    endKey: number

    pianoKeys: boolean[]
    keyboardOptions: KeyboardOptions

    children?: React.ReactNode
    parentRef?: React.RefObject<HTMLDivElement>
}

const generateKeyElements = (startKey: number, endKey: number, pianoKeys: boolean[], keyboardOptions: KeyboardOptions) => {
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

const Piano = ({ startKey, endKey, pianoKeys, keyboardOptions, children, parentRef }: PianoProps) => {

    return (
        <div ref={parentRef} className="piano">
            {generateKeyElements(startKey, endKey, pianoKeys, keyboardOptions)}
            {children}
        </div>
    )

}

export default Piano;
