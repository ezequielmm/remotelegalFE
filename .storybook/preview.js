import React from "react"
import "antd/dist/antd.less"
import { ThemeProvider } from "styled-components"
import { theme } from "../src/constants/theme.js"

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
