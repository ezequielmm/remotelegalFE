import styled from "styled-components";
import Card from "prp-components-library/src/components/Card";
import { getREM } from "../../../constants/styles/utils";

export const StyledSummaryLayout = styled.div`
    height: min-content;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: min-content auto;
`;

export const StyledCard = styled(Card)`
    height: 100%;
    overflow: hidden;

    .ant-card-body {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
`;

export const StyledRealTimeWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-bottom: ${({ theme }) => getREM(theme.default.spaces[6])};
    }
`;
