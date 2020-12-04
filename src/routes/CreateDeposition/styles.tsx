/* eslint-disable import/prefer-default-export */
import { Row } from "antd";
import { RowProps } from "antd/lib/row";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

export const SectionContainer = styled.div`
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 10px;
    align-items: center;
    height: 100%;
`;

export const CaseSectionContainer = styled(SectionContainer)`
    margin-top: 24px;
`;

interface SectionRowProps extends RowProps {
    separator?: boolean;
}

export const SectionRow = styled(Row).attrs((props: SectionRowProps) => ({
    separator: props.separator ? "true" : undefined,
}))<SectionRowProps>`
    width: 100%;
    border-bottom: ${({ theme, separator }) => separator && `1px solid ${theme.colors.neutrals[3]}`};
    margin-bottom: ${({ theme, separator }) => separator && getREM(theme.default.spaces[5])};
`;