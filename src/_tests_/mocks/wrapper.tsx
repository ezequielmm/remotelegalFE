import { FloatingAlertContextProvider } from "../../contexts/FloatingAlertContext";
import { defineProviderValues } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";
import state from "./state";

const { dispatch } = state;
const wrapper = ({ children }) => defineProviderValues(state.state, dispatch, getMockDeps(), children);
export const wrapperWithOverrideState = ({ children }, overrideState) => (
    <FloatingAlertContextProvider>
        {defineProviderValues(overrideState, dispatch, getMockDeps(), children)}
    </FloatingAlertContextProvider>
);

export default wrapper;
