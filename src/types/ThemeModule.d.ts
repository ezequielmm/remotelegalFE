import "styled-components";
import { Theme } from "./ThemeType";

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}
