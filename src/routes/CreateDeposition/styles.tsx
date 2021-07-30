import Button from "prp-components-library/src/components/Button";
import styled from "styled-components";

export const DeleteWitnessButton = styled(Button)`
    color: ${({ theme }) => theme.default.errorColor};
    :hover {
        color: ${({ theme }) => theme.default.errorColor};
        opacity: 0.5;
    }
    font-weight: 400;
`;

export const WitnessTitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
