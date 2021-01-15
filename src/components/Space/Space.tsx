import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";

enum SpaceEnum {
    p = "p",
    px = "px",
    py = "py",
    pt = "pt",
    pr = "pr",
    pb = "pb",
    pl = "pl",
    m = "m",
    mx = "mx",
    my = "my",
    mt = "mt",
    mr = "mr",
    mb = "mb",
    ml = "ml",
}

const spaceDic = {
    p: "padding",
    m: "margin",
    t: "-top",
    r: "-right",
    b: "-bottom",
    l: "-left",
};

const range12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
type range12Type = typeof range12[number];

type SpaceProps = {
    [property in SpaceEnum]?: range12Type | string;
};

enum SizeType {
    small = 3,
    middle = 6,
    large = 9,
}

function isSizeType(size: string): size is keyof typeof SizeType {
    return Object.keys(SizeType).includes(String(size as string));
}

export interface ISpaceProps extends PropsWithChildren<SpaceProps> {
    size?: keyof typeof SizeType | range12Type | string;
    direction?: "horizontal" | "vertical";
}

const spaceStyle = (props: SpaceProps): string => {
    const filteredProps = Object.keys(props).filter((prop) => Object.keys(SpaceEnum).includes(prop));
    const propsArr = filteredProps;

    const styleReducer = (style, prop) => {
        const [firstLetter, secondLetter] = prop.split("");
        const isAxisProperty = (val) => [SpaceEnum.px, SpaceEnum.py, SpaceEnum.mx, SpaceEnum.my].includes(val);
        const sizeValue = typeof props[prop] === "string" ? props[prop] : getREM(theme.default.spaces[props[prop]]);

        if (isAxisProperty(prop)) {
            if (prop === SpaceEnum.px || prop === SpaceEnum.mx) {
                return `${style}
                    ${spaceDic[firstLetter]}${spaceDic.l}: ${sizeValue};
                    ${spaceDic[firstLetter]}${spaceDic.r}: ${sizeValue};
                    `;
            }
            if (prop === SpaceEnum.py || prop === SpaceEnum.my) {
                return `${style}
                    ${spaceDic[firstLetter]}${spaceDic.t}: ${sizeValue};
                    ${spaceDic[firstLetter]}${spaceDic.b}: ${sizeValue};
                    `;
            }
        }

        return `${style}
            ${spaceDic[firstLetter]}${secondLetter ? spaceDic[secondLetter] : ""}: ${sizeValue};
            `;
    };

    return propsArr.reduce(styleReducer, "");
};

const StyledSpace = styled.div.attrs((props: ISpaceProps) => ({
    size: props.size,
}))<ISpaceProps>`
    ${(props: ISpaceProps) => {
        const { size, direction } = props;

        const sizeStyles = (): string => {
            if (size) {
                if (typeof size === "string") {
                    if (isSizeType(size)) {
                        const calculatedSize = getREM(theme.default.spaces[SizeType[size]]);

                        return `
                            &:not(:last-child) {
                                margin-${direction === "horizontal" ? "right" : "bottom"}: ${calculatedSize};
                            }
                        `;
                    }

                    return `
                        &:not(:last-child) {
                            margin-${direction === "horizontal" ? "right" : "bottom"}: ${size};
                        }
                    `;
                }
                if (typeof size === "number") {
                    return `
                        &:not(:last-child) {
                            margin-${direction === "horizontal" ? "right" : "bottom"}: ${getREM(
                        theme.default.spaces[size]
                    )};
                        }
                    `;
                }
            }

            return "";
        };

        const directionStyles = `
            display: flex;
            flex-direction: ${direction === "horizontal" ? "row" : "column"};
        `;

        const styles = `
            ${directionStyles}
            ${spaceStyle(props)}

            > * {
                ${sizeStyles()}
            }
        `;
        return styles;
    }}
`;

const Space = ({ direction = "horizontal", ...rest }: ISpaceProps) => {
    return <StyledSpace direction={direction} {...rest} />;
};

export default Space;
