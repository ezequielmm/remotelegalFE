import React from "react";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

const StyledLabel = styled.label`
    display: inline-block;
    overflow: hidden;
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[8])};
    text-transform: uppercase;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-wrap: normal;
    vertical-align: top;
`;

const label = (props) => <StyledLabel {...props} />;
export default label;
