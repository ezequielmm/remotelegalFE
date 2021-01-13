import { Row } from "antd";
import styled from "styled-components";
import { getREM } from "../../../../constants/styles/utils";

export const StyledExhibitViewerHeader = styled(Row)`
    margin-bottom: ${({ theme }) => getREM(theme.default.spaces[3] * 0.75)};
`;

export const StyledExhibitViewerContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
