import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

// eslint-disable-next-line import/prefer-default-export
export const InputSpacing = styled.div`
    & > *:not(:last-child) {
        margin-bottom: ${({ theme }) => getREM(theme.default.spaces[3])};
    }
`;
