import React from "react";
import { Image } from "antd";
import { ImageProps } from "rc-image/lib/Image";
import styled from "styled-components";
import LogoDark from "../../assets/layout/logo-dark.svg";
import LogoLight from "../../assets/layout/logo-light.svg";

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
    display: block;
    width: auto;
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
`;

const Logo = ({ alt = "Remote Legal logo", version = "dark", ...rest }: ILogoProps) => {
    return <StyledImage preview={false} src={logoSrc[version]} alt={alt} {...rest} />;
};

export default Logo;
