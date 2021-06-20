import abcjsObj from 'abcjs';
import { useEffect } from 'react';
import { getKeyAbc } from '../utils/KeyDataUtils';

interface StaffProps {
    playingKeys: number[]
    useFlats: boolean
    abcjsOptions: {}
}

const ABCJS_DOM_ID = "abcjs-display";

const ABC_HEADER = "X:1\nL:1\n";
const ABC_TREBLE_START = "[V:1 clef=treble]]";
const ABC_BASS_START = "[V:2 clef=bass]]";
const CLEF_DIVIDE_KEY = 59;

const generateAbcNotation = (playingKeys: number[], useFlats: boolean) => {

    let abcTreble = "", abcBass = "";

    playingKeys.forEach(playingKey => {
        let abcKey = getKeyAbc(playingKey, useFlats);
        if (abcKey) {
            playingKey >= CLEF_DIVIDE_KEY ? abcTreble += abcKey : abcBass += abcKey;
        } else
            console.error("Couldn't find abc notation for key id " + playingKey);
    });

    abcTreble = (abcTreble === "") ? `${ABC_TREBLE_START} x` : `${ABC_TREBLE_START} [${abcTreble}]`;
    abcBass = (abcBass === "") ? `${ABC_BASS_START} x` : `${ABC_BASS_START} [${abcBass}]`;

    return `${ABC_HEADER}${abcTreble}|\n${abcBass}|`;
}

const Staff = ({playingKeys, abcjsOptions, useFlats}: StaffProps) => {

    useEffect(() => abcjsObj.renderAbc(ABCJS_DOM_ID, generateAbcNotation(playingKeys, useFlats), abcjsOptions));
    
    return (
        <div className="staff">
            <div id={ABCJS_DOM_ID} />
        </div>
    );
}



export default Staff;