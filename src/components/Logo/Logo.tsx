import React from "react";
import { Image } from "antd";
import { ImageProps } from "rc-image/lib/Image";
import styled from "styled-components";

const LogoDark = require("../../assets/layout/logo-dark.svg");
const LogoLight = require("../../assets/layout/logo-light.svg");

const logoSrc = {
    dark: LogoDark,
    light: LogoLight,
};

export interface ILogoProps extends Omit<ImageProps, "preview"> {
    version?: "light" | "dark";
}

const StyledImage = styled(Image)`
    max-width: 100%;
    max-height: 100%;

    img {
        display: block;
        ${({ height }) => {
            return height
                ? `
                    width: auto;
                    height: 100%;            
                `
                : `
                    width: 100%;
                    height: auto;
                `;
        }}
    }
`;

const logo = ({ alt = "Remote Legal logo", version = "dark", ...rest }: ILogoProps) => {
    return <StyledImage preview={false} src={logoSrc[version]} alt={alt} {...rest} />;
};

export default logo;
