import styled from "styled-components";

export const ContainerSmall = styled.div`
    max-width: 16rem;
`;

export const ContainerMedium = styled.div`
    max-width: 32rem;
`;

export const ContainerBackground = styled.div`
    background: ${({ theme }) => theme.colors.neutrals[5]};
    padding: 1rem;
`;
