import React from "react";
import { Result } from "antd";
import { ResultStatusType, ResultProps } from "antd/lib/result/index";
import styled from "styled-components";
import Icon from "../Icon";
import { ReactComponent as EmptyFolderIcon } from "../../assets/icons/empty-folder.svg";
import { ReactComponent as CaseSuccessIcon } from "../../assets/icons/case-success.svg";
import { getREM } from "../../constants/styles/utils";

export interface IResultProps extends Omit<ResultProps, "status"> {
    status?: ResultStatusType | "empty" | "case-success";
}

const emptyIcon = <Icon icon={EmptyFolderIcon} />;
const caseSuccessIcon = <Icon icon={CaseSuccessIcon} />;

const resultDefault = ({ icon, status, ...rest }: IResultProps) => {
    const defaultStatus = status === "empty" || status === "case-success" ? "info" : status;

    const customStatus = () => {
        switch (status) {
            case "empty":
                return emptyIcon;

            case "case-success":
                return caseSuccessIcon;

            default:
                return null;
        }
    };

    const defaultIcon = customStatus() || icon;

    return <Result status={defaultStatus} {...rest} icon={defaultIcon} />;
};

const StyledResult = styled(resultDefault)<IResultProps>`
    ${({ theme }) => {
        const styles = `
            .ant-result-title {
                font-family: ${theme.default.headerFontFamily};
                font-weight: 300;
                line-height: ${theme.default.lineHeightBase};
                margin-bottom: ${getREM(theme.default.spaces[1])};
            }
        `;
        return styles;
    }}
`;

const result = (props: IResultProps) => {
    return <StyledResult {...props} />;
};

export default result;
