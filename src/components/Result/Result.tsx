import React from "react";
import { Result } from "antd";
import { ResultStatusType, ResultProps } from "antd/lib/result/index";
import styled from "styled-components";
import Icon from "../Icon";
import { ReactComponent as EmptyFolderIcon } from "../../assets/icons/empty-folder.svg";
import { getREM } from "../../constants/styles/utils";

export interface IResultProps extends Omit<ResultProps, "status"> {
    status?: ResultStatusType | "empty";
}

const emptyIcon = <Icon icon={EmptyFolderIcon} />;

const resultDefault = ({ icon, status, ...rest }: IResultProps) => {
    const defaultStatus = status === "empty" ? "info" : status;
    const defaultIcon = icon || (status === "empty" ? emptyIcon : null);

    return <Result status={defaultStatus} {...rest} icon={defaultIcon} />;
};

const StyledResult = styled(resultDefault)<IResultProps>`
    ${({ theme }) => {
        const styles = `
            .ant-result-title {
                font-family: ${theme.default.headerFontFamily};
                font-size: ${getREM(theme.default.spaces[5])};
                font-weight: 300;
            }
        `;
        return styles;
    }}
`;

const result = (props: IResultProps) => {
    return <StyledResult {...props} />;
};

export default result;
