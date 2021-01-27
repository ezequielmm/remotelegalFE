import React from "react";
import { Result as ANTResult } from "antd";
import { ResultStatusType, ResultProps } from "antd/lib/result/index";
import styled from "styled-components";
import Icon from "../Icon";
import { ReactComponent as EmptyFolderIcon } from "../../assets/icons/empty-folder.svg";
import { ReactComponent as SuccessCreateIcon } from "../../assets/icons/success-create.svg";
import { ReactComponent as ErrorFetchIcon } from "../../assets/icons/error-fetch.svg";
import { getREM } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";

export enum CustomStatus {
    empty = "empty",
    successCreate = "success-create",
    errorFetch = "error-fetch",
}

function isResultStatusType(status: string | number): status is ResultStatusType {
    return ["403", "404", "500", "success", "error", "info", "warning"].includes(String(status as string));
}

export interface IResultProps extends Omit<ResultProps, "status"> {
    status?: ResultStatusType | CustomStatus;
    titleColor?: string;
    subTitleColor?: string;
}

const emptyIcon = <Icon icon={EmptyFolderIcon} />;
const successCreateIcon = <Icon icon={SuccessCreateIcon} />;
const errorFetchIcon = <Icon icon={ErrorFetchIcon} />;

const resultDefault = ({ icon, status, ...rest }: IResultProps) => {
    const setStatus = !isResultStatusType(status) ? "info" : status;
    const defaultStatus: ResultStatusType = setStatus;

    const customIcon = () => {
        switch (status) {
            case "empty":
                return emptyIcon;

            case "success-create":
                return successCreateIcon;

            case "error-fetch":
                return errorFetchIcon;

            default:
                return null;
        }
    };

    const defaultIcon = icon || customIcon();

    return <ANTResult status={defaultStatus} {...rest} icon={defaultIcon} />;
};

const StyledResult = styled(resultDefault)<IResultProps>`
    ${({ theme, titleColor, subTitleColor }) => {
        const inDepoTheme =
            theme.mode === ThemeMode.inDepo
                ? `
            color: ${theme.default.primaryColor};
        `
                : "";

        const titleColorStyle = titleColor ? `.ant-result-title{color: ${titleColor}}` : "";
        const subTitleColorStyle = subTitleColor ? `.ant-result-subtitle{color: ${subTitleColor}}` : "";
        const styles = `
            .ant-result-title {
                font-family: ${theme.default.headerFontFamilies};
                font-weight: 300;
                line-height: ${theme.default.lineHeightBase};
                margin-bottom: ${getREM(theme.default.spaces[3])};
                ${inDepoTheme}
            }
            ${titleColorStyle}
            ${subTitleColorStyle}
        `;
        return styles;
    }}
`;

const Result = (props: IResultProps) => {
    return <StyledResult {...props} />;
};

export default Result;
