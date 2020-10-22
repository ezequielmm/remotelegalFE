import React from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
    display: inline-block;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-wrap: normal;
    vertical-align: top;
`;

const label = (props) => <StyledLabel {...props} />;
export default label;
