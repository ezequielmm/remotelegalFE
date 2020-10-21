import React from "react"
import { ThemeProvider } from "styled-components"
import { theme } from "../src/constants/styles/theme"
import "../src/assets/fonts/fontface.less"

export const decorators = [
    (Story) => (
        <ThemeProvider theme={theme}>
            <Story />
        </ThemeProvider>
    ),
]

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
}
