import { Form } from "antd";
import styled from "styled-components";

export const StyledFormContainer = styled.section`
    background: #eff2f4;
    border-radius: 43px 43px 0 0;
    display: grid;
    padding: 2rem;
    @media (min-width: 1000px) {
        place-items: center;
        border-radius: 43px 0 0 43px;
        padding: 0;
    }
`;

export const StyledForm = styled(Form)`
    @media (min-width: 1000px) {
        width: 25.25rem;
    }
`;

export const StyledLabelContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const StyledNewUserParagraph = styled.span`
    color: #2f2f2f;
    padding-right: 0.5rem;
    font-size: 0.875rem;
    font-family: Lato, sans-serif;
    font-weight: 400;
`;
