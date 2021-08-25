import useLocalSettings from "./useLocalSettings";

export interface KeyboardSettings {
    showPiano: boolean;
    showStaff: boolean;
    showNoteNames: boolean;
    showKbdMappings: boolean;
    useFlats: boolean;
    stickyMode: boolean;
    pianoRange: [number, number];
}

export const MIN_KEY = 48;
export const MAX_KEY = 79;

const INITIAL_SETTINGS: KeyboardSettings = 
    {showPiano: true, showStaff: true, showNoteNames: false, showKbdMappings: false, 
        useFlats: true, stickyMode: false, pianoRange: [MIN_KEY, MAX_KEY]};


const useKeyboardSettings = () => {
    const { settings, updateSetting } = useLocalSettings("kbd-settings", INITIAL_SETTINGS);

    return { settings, updateSetting }
}

export default useKeyboardSettings