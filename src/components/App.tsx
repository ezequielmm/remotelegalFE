import React from "react";
import style from "styled-components";
import "./App.less";
import AntButton from "./AntButton";

const Container = style.div`
  background-color: #17232d;
  height: 100vh;
  width: 100vw;
  text-align: center;
`;

const Title = style.h1`
  color: white;
`;

function App() {
    return (
        <Container>
            <header>
                <Title>Precision Reporters</Title>
            </header>
            <AntButton />
        </Container>
    );
}

export default App;
