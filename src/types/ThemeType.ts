import { theme } from "../constants/styles/theme";

export enum ThemeMode {
    default = "default",
    inDepo = "inDepo",
}

export type Theme = Omit<typeof theme, "mode"> & { mode: ThemeMode };
