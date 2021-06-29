import styled from "styled-components";

const StyledDiv = styled.div`
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000000000;
`;

const Overlay = () => <StyledDiv data-testid="overlay" />;
export default Overlay;
