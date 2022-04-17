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

export const MIN_KEY = 48;
export const MAX_KEY = 79;

const INITIAL_SETTINGS: KeyboardSettings = 
    {showPiano: true, showStaff: true, showNoteNames: false, showKbdMappings: false, 
        useFlats: true, stickyMode: false, pianoRange: [MIN_KEY, MAX_KEY], kbdMappingStartKey: 60 };


const useKeyboardSettings = () => {
    const { settings, updateSetting } = useLocalStorage("kbd-settings", INITIAL_SETTINGS);

    return { settings, updateSetting }
}

export default useKeyboardSettings