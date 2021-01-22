import styled, { keyframes } from "styled-components";
import { getREM, hexToRGBA, getWeightNumber } from "../../constants/styles/utils";
import Icon from "../Icon";
import { theme } from "../../constants/styles/theme";

const { textColorInverse, fontSizes, spaces } = theme.default;
const { error, neutrals } = theme.colors;

export interface IRecordPillPropsStyles {
    $on: boolean;
}

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${hexToRGBA(neutrals[6], 1)};
    background: ${hexToRGBA(neutrals[6], 0.7)};
  }

	30% {
    box-shadow: 0 0 0 ${getREM(spaces[3] * spaces[4])} ${hexToRGBA(neutrals[6], 0)};
    background: transparent;
  }}
  
  100% {
    box-shadow: 0 0 0 0 ${hexToRGBA(neutrals[6], 0)};
  }
`;

export const StyledRecordPill = styled.span<IRecordPillPropsStyles>`
    position: absolute;
    top: ${getREM(spaces[2])};
    left: ${getREM(spaces[2])};
    z-index: 50;
    display: inline-flex;
    background-color: ${(props: IRecordPillPropsStyles) => (props.$on ? error[5] : neutrals[0])};
    align-items: center;
    justify-content: center;
    color: ${textColorInverse};
    font-size: ${getREM(fontSizes[6] * 0.625)};
    line-height: 1;
    font-weight: ${getWeightNumber("normal")};
    border-radius: ${getREM(spaces[5])};
    text-transform: uppercase;
    padding: 0 ${getREM(spaces[3])};
    width: ${getREM(spaces[12] * 3.65)};
    height: ${getREM(spaces[12] * 0.95)};
    box-shadow: 0 0 1px 0 ${hexToRGBA(neutrals[2], 0.5)};
    transition: background-color 400ms ease-in-out;
    word-break: break-all;
`;

export const StyledIcon = styled(Icon)<IRecordPillPropsStyles>`
    display: ${({ $on }) => ($on ? "inline-block" : "none")};
    margin-right: ${getREM(spaces[3] * spaces[4])};
    border-radius: 100%;
    animation: ${pulse} 3.5s infinite;
    background: transparent;
    box-shadow: 0 0 0 0 ${hexToRGBA(neutrals[6], 0)};
`;
