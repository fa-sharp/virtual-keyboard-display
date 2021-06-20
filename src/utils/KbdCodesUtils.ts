import keyboardCodesList from "../res/json_data/kbd_codes.json"

export const KBD_MAPPING_START_KEY = 60;


type KeyCodeToKeyIdMap = {
    [keyCode: number]: number | undefined;
}

/**
 * Maps keyboard codes (deprecated, but will work for now) to piano key IDs.
 * Ex: keyCodeToKeyId[65] => 60, keyCodeToKeyId['keyA'] => 60 (Pressing the letter A will activate middle C) 
 */
export const keyCodeToKeyId = keyboardCodesList.reduce<KeyCodeToKeyIdMap>((map, currentKey, index) => {
    if (index === 0) console.log("Processing keyboard codes");
    
    return {...map, [currentKey.keyCode]: index + KBD_MAPPING_START_KEY};
}, {})

console.log(keyCodeToKeyId);