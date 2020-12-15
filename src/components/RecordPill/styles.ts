import styled, { keyframes } from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
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
    box-shadow: 0 0 0 ${getREM(spaces[1] * 0.75)} ${hexToRGBA(neutrals[6], 0)};
    background: transparent;
  }
  
  100% {
    box-shadow: 0 0 0 0 ${hexToRGBA(neutrals[6], 0)};
  }
`;

export const StyledRecordPill = styled.span<IRecordPillPropsStyles>`
    background-color: ${(props: IRecordPillPropsStyles) => (props.$on ? error[5] : neutrals[0])};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${textColorInverse};
    font-size: ${getREM(fontSizes[8])};
    line-height: 1;
    font-weight: 400;
    border-radius: ${getREM(spaces[2])};
    text-transform: uppercase;
    padding: 0 ${getREM(spaces[1])};
    width: ${getREM(spaces[7] * 4.1)};
    height: ${getREM(spaces[7] * 0.95)};
    box-shadow: 0 0 0 0 ${hexToRGBA(neutrals[6], 0)};
    transition: background-color 400ms ease-in-out;
`;

export const StyledIcon = styled(Icon)<IRecordPillPropsStyles>`
    display: ${({ $on }) => ($on ? "inline-block" : "none")};
    margin-right: ${getREM(spaces[1] * 0.75)};
    border-radius: 100%;
    animation: ${pulse} 3.5s infinite;
    background: transparent;
    box-shadow: 0 0 0 0 ${hexToRGBA(neutrals[6], 0)};
`;
