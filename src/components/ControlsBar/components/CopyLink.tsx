import React from "react";
import styled from "styled-components";
import Title from "../../Typography/Title";
import Text from "../../Typography/Text";
import Icon from "../../Icon";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CopyIcon } from "../../../assets/icons/copy.svg";
import Button from "../../Button";
import { getREM } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";

const StyledPopOverContent = styled.div`
    ${({ theme }) => `
        padding: ${getREM(theme.default.spaces[7] * 2)};

        h5 {
            font-size: ${getREM(theme.default.fontSizes[5])};
            padding-bottom: ${getREM(theme.default.spaces[9])};
            margin-bottom: ${getREM(theme.default.spaces[9])};
            border-bottom: 1px solid ${theme.colors.neutrals[3]};
            font-weight: 300;
        }

        button {
            margin-top: ${getREM(theme.default.spaces[3])};
        }
        .close-icon {
            position: absolute;
            top: ${getREM(theme.default.spaces[6])};
            right: ${getREM(theme.default.spaces[6])};
            font-size: ${getREM(theme.default.fontSizes[7])};
            
            svg {
                path {
                    fill: ${theme.colors.secondary[5]};

                }
            }
    `}
`;

const CopyLink = ({ closePopOver }: { closePopOver: () => void }) => {
    return (
        <StyledPopOverContent>
            <Icon className="close-icon" icon={CloseIcon} onClick={closePopOver} />
            <Title level={5}>Deposition information</Title>
            <Text state={ColorStatus.disabled}> Invite participants to join the deposition.</Text>
            <Button type="link" icon={<Icon icon={CopyIcon} />}>
                COPY INVITE LINK
            </Button>
        </StyledPopOverContent>
    );
};
export default CopyLink;
