import styled from "styled-components";
import Button from "@rl/prp-components-library/src/components/Button";
import { IButtonProps } from "@rl/prp-components-library/src/components/Button/Button";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";

// eslint-disable-next-line import/prefer-default-export
export const StyledButtonLink = styled(Button)<IButtonProps>`
    font-size: ${getREM(theme.default.fontSizes[4])};
    font-weight: 400;
    padding: 0;
    height: fit-content;
`;
