import styled from "styled-components";
import { Space as AntSpace } from "antd";

export const ExhibitTabPaneSpacer = styled(AntSpace)`
    height: inherit;
    width: 100%;

    > :last-child {
        height: inherit;
    }
`;


export const StyledUploadButtonContainer = styled.div`
    z-index: 1;
`;
