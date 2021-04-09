import styled from "styled-components";
import { getREM } from "../../../../constants/styles/utils";
import Text from "../../../../components/Typography/Text";

export const StyledItem = styled.div<{ isCurrentUser: boolean; isSameAuthor: boolean }>`
    ${({ isCurrentUser, isSameAuthor, theme }) => {
        const { spaces } = theme.default;

        const currentUserStyles = isCurrentUser
            ? `
            align-items: flex-end;
            padding: ${
                isSameAuthor
                    ? `0 0 ${getREM(spaces[3] / 2)} ${getREM(spaces[6])}`
                    : `${getREM(spaces[3])} 0 ${getREM(spaces[3] / 2)} ${getREM(spaces[6])}`
            };
            `
            : "";

        return `
            padding: ${
                isSameAuthor
                    ? `0 ${getREM(spaces[6])} ${getREM(spaces[3] / 2)} 0`
                    : `${getREM(spaces[3])} ${getREM(spaces[6])} ${getREM(spaces[3] / 2)} 0`
            };
            margin-left: 0;
            display: flex;
            flex-direction: column;
            ${currentUserStyles}

            &:first-child {
                padding-top: ${getREM(spaces[6])};
            }

            &:last-child {
                padding-bottom: ${getREM(spaces[6])};
            }
        `;
    }};
`;

export const StyledBubble = styled.div<{ isCurrentUser: boolean; failed: boolean }>`
    ${({ theme, isCurrentUser, failed }) => {
        const { spaces } = theme.default;

        const currentUserStyles = isCurrentUser
            ? `
            color: white;
            background-color: ${failed ? theme.colors.disabled[6] : theme.default.primaryColor};
            border-radius: ${`${getREM(spaces[6])} ${getREM(spaces[6])} 0 ${getREM(spaces[6])}`};
            `
            : "";

        return `
            padding: ${`${getREM(spaces[4])} ${getREM(spaces[6])}`};
            width: fit-content;
            background-color: ${theme.default.disabledBg};
            border-radius: ${`${getREM(spaces[6])} ${getREM(spaces[6])} ${getREM(spaces[6])} 0`};
            ${currentUserStyles}
        `;
    }}
`;

export const StyledText = styled(Text)`
    color: ${({ theme }) => theme.default.disabledColor};
`;