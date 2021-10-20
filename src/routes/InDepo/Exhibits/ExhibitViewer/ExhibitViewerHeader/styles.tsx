import styled from "styled-components";
import button from "@rl/prp-components-library/src/components/Button";

// eslint-disable-next-line import/prefer-default-export
export const StyledCloseButton = styled(button)`
    ${({ theme }) => {
        const { error } = theme.colors;
        const { textColorInverse } = theme.default;

        return `
            background: ${error[5]};
            border-color: ${error[5]};
            color: ${textColorInverse}; // TODO get contrast and return white or black text

            &:hover,
            &:focus {
                background: ${error[4]};
                border-color: ${error[4]};
                color: ${textColorInverse}; // TODO get contrast and return white or black text
            }

            &:active {
                background: ${error[6]};
                border-color: ${error[6]};
                color: ${textColorInverse}; // TODO get contrast and return white or black text
            }
        `;
    }}
`;
