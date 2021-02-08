import styled from "styled-components";
import { getREM } from "../../../../../constants/styles/utils";

export const StyledFileNameCell = styled.div`
    display: flex;
    align-items: center;

    > :first-child {
        margin-right: ${({ theme }) => getREM(theme.default.spaces[6])};
    }
`;
