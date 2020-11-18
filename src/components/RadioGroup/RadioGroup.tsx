import React from "react";
import styled from "styled-components";
import { Radio } from "antd";

const StyledRadioGroup = styled(Radio.Group)`
    display: flex;
    align-items: center;
`;

const RadioGroup = (props) => <StyledRadioGroup {...props} />;

export default RadioGroup;
