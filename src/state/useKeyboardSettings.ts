import useLocalStorage from "./util/useLocalStorage";

export interface KeyboardSettings {
    showPiano: boolean;
    showStaff: boolean;
    showNoteNames: boolean;
    showKbdMappings: boolean;
    useFlats: boolean;
    stickyMode: boolean;
    pianoRange: [number, number];
    kbdMappingStartKey: number;
}
export type UpdateKeyboardSetting = <K extends keyof KeyboardSettings>(setting: K, newValue: KeyboardSettings[K]) => void;

export const MIN_KEY = 48;
export const MAX_KEY = 84;

const INITIAL_SETTINGS: KeyboardSettings = 
    {showPiano: true, showStaff: true, showNoteNames: false, showKbdMappings: false, 
        useFlats: true, stickyMode: false, pianoRange: [MIN_KEY, MAX_KEY], kbdMappingStartKey: 60 };


const useKeyboardSettings = () => {
    const { settings, updateSetting } = useLocalStorage("kbd-settings", INITIAL_SETTINGS);

    return { settings, updateSetting }
}

export default useKeyboardSettings