import React from "react";
import style from "styled-components";

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
        </Container>
    );
}

export default App;
