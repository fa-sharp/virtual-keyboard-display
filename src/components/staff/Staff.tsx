import { renderAbc, AbcVisualParams } from 'abcjs';
import { useEffect } from 'react';
import { getKeyAbc } from '../../utils/KeyDataUtils';

interface StaffProps {
    playingKeys: number[]
    clefDivideKey?: number
    useFlats: boolean
    staffHeight?: number
    abcjsOptions?: AbcVisualParams
}

const ABCJS_DOM_ID = "abcjs-display";

/** 🎼 The staff display */
const Staff = ({playingKeys, abcjsOptions, staffHeight, clefDivideKey = 59, useFlats}: StaffProps) => {

    useEffect(() => {
        renderAbc(ABCJS_DOM_ID,
            generateAbcNotation(playingKeys, clefDivideKey, useFlats), 
            {
                ...abcjsOptions,
                scale: staffHeight ? 
                    calculateStaffScale(staffHeight) : (abcjsOptions?.scale || 1.5),
            });
    });
    
    return (
        <div className="staff">
            <div id={ABCJS_DOM_ID} />
        </div>
    );
}


const calculateStaffScale = (staffHeight: number) => staffHeight / 9.1667;

const ABC_HEADER = "%%stretchlast\nX:1\nL:1\n";
const ABC_TREBLE_START = "[V:1 clef=treble]]";
const ABC_BASS_START = "[V:2 clef=bass]]";

const generateAbcNotation = (playingKeys: number[], clefDivideKey: number, useFlats: boolean) => {

    let abcTreble = "", abcBass = "";

    playingKeys.forEach(playingKey => {
        const abcKey = getKeyAbc(playingKey, useFlats);
        if (abcKey) {
            playingKey >= clefDivideKey ? abcTreble += abcKey : abcBass += abcKey;
        } else
            console.error("Couldn't find abc notation for key id " + playingKey);
    });

    abcTreble = (abcTreble === "") ? `${ABC_TREBLE_START} x` : `${ABC_TREBLE_START} [${abcTreble}]`;
    abcBass = (abcBass === "") ? `${ABC_BASS_START} x` : `${ABC_BASS_START} [${abcBass}]`;

    return `${ABC_HEADER}${abcTreble}|\n${abcBass}|`;
}

export default Staff;