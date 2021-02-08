import styled from "styled-components";
import button from "../../../../../components/Button";

export const StyledCloseButton = styled(button)`
    background: ${({ theme }) => theme.colors.error[5]};
    border: none;
    &:hover {
        background: ${({ theme }) => theme.colors.error[5]};
    }
`;
