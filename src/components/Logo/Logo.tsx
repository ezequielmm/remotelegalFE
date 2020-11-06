import React from "react";
import { Image } from "antd";
import styled from "styled-components";

const LogoDark = require("../../assets/layout/logo-dark.svg");
const LogoLight = require("../../assets/layout/logo-light.svg");

const logoSrc = {
    dark: LogoDark,
    light: LogoLight,
};

export interface ILogoProps {
    alt?: string;
    version?: "light" | "dark";
}

const StyledImage = styled(Image)`
    img {
        display: block;
        width: auto;
        height: 100%;
    }
`;

const logo = ({ alt = "Remote Legal logo", version = "dark" }: ILogoProps) => {
    return <StyledImage src={logoSrc[version]} alt={alt} />;
};

export default logo;
