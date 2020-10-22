import styled from "styled-components";
import { getREM } from "../../../constants/styles/utils";

export const StyledFormContainer = styled.section`
    background: ${({ theme }) => theme.colors.neutrals[4]};
    border-radius: 43px 0 0 43px;
    display: grid;
    @media (max-width: 1024px) {
        border-radius: 43px 43px 0 0;
        padding: ${({ theme }) => getREM(theme.default.spaces[7])} 0;
    }
`;

export const StyledLabelContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;
