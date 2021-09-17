import { useLayoutEffect, useState } from "react";
import ORIENTATION_STATE from "../types/orientation";

const useWindowOrientation = (): ORIENTATION_STATE => {
    const isPortrait = () => window.matchMedia("(orientation: portrait)").matches;
    const [orientation, setOrientation] = useState(
        isPortrait() ? ORIENTATION_STATE.PORTRAIT : ORIENTATION_STATE.LANDSCAPE
    );
    useLayoutEffect(() => {
        function updateOrientation() {
            setOrientation(isPortrait() ? ORIENTATION_STATE.PORTRAIT : ORIENTATION_STATE.LANDSCAPE);
        }
        window.addEventListener("resize", updateOrientation);
        updateOrientation();
        return () => window.removeEventListener("resize", updateOrientation);
    }, []);
    return orientation;
};

export default useWindowOrientation;
