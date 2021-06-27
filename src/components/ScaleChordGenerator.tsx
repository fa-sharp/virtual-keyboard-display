import { Dispatch, useEffect, useRef, useState } from "react";
import { setTimeout } from "timers";
import { PlayKeysAction } from "./PlayKeysAction";

interface PlayerProps {
    playKeys: Dispatch<PlayKeysAction>
    useFlats: boolean
}

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11, 12];
const timer = (milliSeconds: number) => new Promise(res => setTimeout(res, milliSeconds));

async function playMajorScale(startKey: number, playKeys: Dispatch<PlayKeysAction>) {
    for (let i = 0; i < MAJOR_SCALE.length; i++) {
        playKeys({ type: "KEY_ON", keyId: (startKey + MAJOR_SCALE[i]) });
        await timer(500);
        playKeys({ type: "KEY_OFF", keyId: (startKey + MAJOR_SCALE[i]) });
    }
}

const ScaleGenerator = ({playKeys, useFlats} : PlayerProps) => {

    const [currentKey, setCurrentKey] = useState(58); // KeyData? number?
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(false);

    const previousKey = useRef(currentKey);

    useEffect(() => {
        if (currentKey !== previousKey.current) {
            previousKey.current = currentKey;
            setCurrentIndex(() => 0);
            return;
        }
        if (!playing) {
            return;
        }
        
        playKeys({ type: "KEY_ON", keyId: (currentKey + MAJOR_SCALE[currentIndex]) });
        setTimeout(() => {
            playKeys({ type: "KEY_OFF", keyId: (currentKey + MAJOR_SCALE[currentIndex]) });
            if (currentIndex < (MAJOR_SCALE.length - 1)) {
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }
            else {
                setPlaying(false);
                setCurrentIndex(0);
            }
        }, 700);

    }, [currentIndex, currentKey, playKeys, playing])

    return (
        <div className="generator">
            <span>Play/Stop: </span>
            <input type="checkbox" checked={playing} onChange={() => setPlaying((playing) => !playing)}></input>
        </div>
    );
}

export default ScaleGenerator;