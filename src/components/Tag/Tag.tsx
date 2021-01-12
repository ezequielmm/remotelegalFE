import React from "react";
import { Tag as AntTag } from "antd";
import styled from "styled-components";
import { TagProps } from "antd/lib/tag";
import { getREM, getWeightNumber } from "../../constants/styles/utils";
import ColorStatus from "../../types/ColorStatus";
export interface ITagProps extends Omit<TagProps, "color"> {
    pill?: boolean;
    color?: ColorStatus;
}
interface StyledTagProps extends Omit<ITagProps, "pill"> {
    $pill?: boolean;
}
const StyledTag = styled(AntTag)<StyledTagProps>`
    ${({ theme, $pill, color }) => {
        const inDepoTheme = !color
            ? theme.mode === "inDepo"
                ? `
                background-color: ${theme.colors.inDepoNeutrals[9]};
                `
                : `
                background-color: ${theme.colors.primary[5]};
            `
            : `background-color: ${theme.default[`${color}Color`]};`;
        const isPill = $pill
            ? `
                border-radius: ${getREM(theme.default.spaces[6])};
            `
            : `
                border-radius: ${getREM(theme.default.spaces[1] + theme.default.spaces[2])};
            `;
        const styles = `
            border: 0;
            color: ${theme.default.whiteColor};
            font-size: ${getREM(theme.default.fontSizes[8])};
            font-weight: ${getWeightNumber("bold")};
            padding: 0 ${getREM(theme.default.spaces[4])};
            ${isPill}
            ${inDepoTheme}
        `;
        return styles;
    }}
`;
const Tag = ({ pill, ...rest }: ITagProps) => {
    return <StyledTag $pill={pill} {...rest} />;
};
export default Tag;
