import keyboardCodesList from "../res/json_data/kbd_codes.json"

export const KBD_MAPPING_START_KEY = 60;

type KbdCodeToKeyIdMap = {
    [keyCode: number]: number | undefined;
    [code: string]: number | undefined;
}

/**
 * Maps keyboard codes to piano key IDs. Includes both keyCode and code properties
 * from the KeyboardEvent: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 * 
 * Ex: kbdCodeToKeyId[65] => 60, kbdCodeToKeyId['keyA'] => 60 (The letter A on the keyboard corresponds to middle C) 
 */
export const getKeyboardCodeToKeyIdMap = (options: {
    /** Which piano key to start the shortcuts from. e.g. if `startkeyId = 60`, keyboard shortcuts will start from C4 / middle C */
    startKeyId: number
}) =>
    keyboardCodesList.reduce<KbdCodeToKeyIdMap>((map, currentKey, index) =>
    ({
        ...map,
        [currentKey.keyCode]: index + options.startKeyId,
        [currentKey.code]: index + options.startKeyId
    }), {});
