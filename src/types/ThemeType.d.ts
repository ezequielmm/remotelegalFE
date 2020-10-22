import { theme } from "../constants/styles/theme";
import "styled-components";

type Theme = typeof theme;

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}
