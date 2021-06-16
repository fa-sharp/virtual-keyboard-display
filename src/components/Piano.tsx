import Key from "./Key";
import { KeyboardOptions } from "./App";

interface PianoProps {
    startKey: number
    endKey: number

    pianoKeys: boolean[]
    keyboardOptions: KeyboardOptions

    parentRef: React.RefObject<HTMLDivElement>
}

const Piano = ({ startKey, endKey, pianoKeys, keyboardOptions, parentRef }: PianoProps) => {

    return (
        <div ref={parentRef} className="piano">
            {generateKeyElements()}
        </div>
    )

    function generateKeyElements() {
        let keyElements: JSX.Element[] = [];
        for (let keyId = startKey; keyId <= endKey; keyId++) {
            keyElements.push(
                <Key
                    key={keyId}
                    id={keyId}
                    isPlaying={pianoKeys[keyId]}
                    keyboardOptions={keyboardOptions}
                />
            )
        }
        return keyElements;
    }
}

export default Piano;
