import styled from "styled-components";
import { Layout } from "antd";

import backgroundImage from "../../../assets/post-depo/End.bg.png";

export const StyledEndDepoScreenLayout = styled(Layout)`
    height: 100vh;
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center bottom;
`;
