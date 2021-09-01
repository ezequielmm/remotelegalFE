import React from "react";
import useWindowSize from "../hooks/useWindowSize";

export const WindowSizeContext = React.createContext<number[]>([]);

const WindowSizeProvider = ({ children }: { children: React.ReactNode }) => {
    const size = useWindowSize();
    return <WindowSizeContext.Provider value={size}>{children}</WindowSizeContext.Provider>;
};
export default React.memo(WindowSizeProvider);
