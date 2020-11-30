import { defineProviderValues } from "../../state/GlobalState";
import state from "./state";

const wrapper = ({ children }) => defineProviderValues(state, children);
export default wrapper;
