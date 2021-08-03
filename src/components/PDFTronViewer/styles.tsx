import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

export const StyledPDFTronViewerContainer = styled.div`
    width: 100%;
    flex-basis: 100%;
    ${({ theme }) => `
        @media (max-width: ${theme.default.breakpoints.sm}) {
            padding-top: ${getREM(theme.default.spaces[12])};
            iframe {
                border: 0;
            }
        }
    `}
`;
