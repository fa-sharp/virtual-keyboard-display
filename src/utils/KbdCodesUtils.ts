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
export const kbdCodeToKeyId = keyboardCodesList.reduce<KbdCodeToKeyIdMap>((map, currentKey, index) => {
    return {...map, [currentKey.keyCode]: index + KBD_MAPPING_START_KEY, 
                    [currentKey.code]: index + KBD_MAPPING_START_KEY };
}, {})