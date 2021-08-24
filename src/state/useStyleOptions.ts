import { useEffect } from "react";
import useLocalSettings from "./useLocalSettings";

interface StyleOptions {
    pianoSize: number;
    activeColor: string;
}

const CSS_VARIABLES = 
    { KEY_SIZE: "--piano-key-width", ACTIVE_COLOR: "--active-color" }

const INITIAL_STYLE_OPTIONS: StyleOptions =
    { pianoSize: 3.0, activeColor: '#00aaff' };

/**
 * Custom hook that saves and updates the style options. Automatically updates the relevant CSS variables.
 */
const useStyleOptions = () => {
    
    /** State for the styling options (size, color, etc.). Saves to local storage using the 'useLocalSettings' hook **/
    const { settings: styleOptions, updateSetting: updateStyleOption } = useLocalSettings("style-options", INITIAL_STYLE_OPTIONS);
    
    /** Update CSS Variables as the style options are changed */
    useEffect(() => {
        document.documentElement.style.setProperty(CSS_VARIABLES.KEY_SIZE, styleOptions.pianoSize + "rem");
        document.documentElement.style.setProperty(CSS_VARIABLES.ACTIVE_COLOR, styleOptions.activeColor);
    }, [styleOptions])

    return { styleOptions, updateStyleOption }
}

export default useStyleOptions