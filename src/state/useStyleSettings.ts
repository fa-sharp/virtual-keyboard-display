import { useEffect } from "react";
import useLocalStorage from "./util/useLocalStorage";

interface StyleSettings {
    /** Size of piano keys, in `rem` units */
    pianoSize: number;
    /** Active color used to color the played keys as well as in the sidebar */
    activeColor: string;
}

const CSS_VARIABLES = 
    { KEY_SIZE: "--piano-key-width", ACTIVE_COLOR: "--active-color" }

const INITIAL_STYLE_SETTINGS: StyleSettings =
    { pianoSize: 3.0, activeColor: '#00aaff' };

/**
 * Custom hook that saves and updates the style options. Automatically updates the relevant CSS variables.
 */
const useStyleSettings = () => {
    
    /** State for the styling options (size, color, etc.). Saves and retrieves from local storage using the 'useLocalSettings' hook **/
    const { settings: styleSettings, updateSetting: updateStyleSetting } = useLocalStorage("style-options", INITIAL_STYLE_SETTINGS);
    
    /** Update CSS Variables as the style options are changed */
    useEffect(() => {
        document.documentElement.style.setProperty(CSS_VARIABLES.KEY_SIZE, styleSettings.pianoSize + "rem");
        document.documentElement.style.setProperty(CSS_VARIABLES.ACTIVE_COLOR, styleSettings.activeColor);
    }, [styleSettings])

    return { styleSettings, updateStyleSetting }
}

export default useStyleSettings