import { useContext } from "react";
import FloatingAlertContext from "../contexts/FloatingAlertContext";

const useFloatingAlertContext = () => {
    return useContext(FloatingAlertContext);
};

export default useFloatingAlertContext;
