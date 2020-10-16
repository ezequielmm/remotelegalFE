import React from "react";

import "antd/dist/antd.less";
import style, { ThemeProvider } from "styled-components";
import { theme } from "../constants/theme";

import Button from "./Button";

const Container = style.div`
  background-color: #DFE8EE;
  height: 100vh;
  width: 100vw;
  text-align: center;
`;

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Container>
                <header>
                    <h1>Precision Reporters</h1>
                </header>
                <Button type="primary">Styled Button</Button>
                <br />
                <br />
                <Button type="secondary">Styled Button</Button>
            </Container>
        </ThemeProvider>
    );
}

export default App;
