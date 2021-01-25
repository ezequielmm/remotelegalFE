import React, { useContext } from "react";
import { List as ANTList } from "antd";
import { ListProps, ListItemProps } from "antd/lib/list/index";
import styled, { ThemeContext } from "styled-components";
import Text from "../Typography/Text";
import ColorStatus from "../../types/ColorStatus";

export interface IListProps extends ListProps<ListItemProps | any[]> {}

const StyledList = styled(ANTList)<IListProps>`
    ${({ theme }) => {
        const inDepoTheme =
            theme.mode === "inDepo"
                ? `
                    color: ${theme.default.whiteColor};
                    .ant-list-item {
                        border-color: ${theme.colors.inDepoNeutrals[0]};
                    }
                `
                : "";

        const styles = `
            .ant-list-item {
                border-color: ${theme.colors.neutrals[3]};
                
                &:not(:last-child) {
                    margin-bottom: -1px;
                }
            }
            ${inDepoTheme}
        `;

        return styles;
    }}
`;

const List = (props: IListProps) => {
    const themeContext = useContext(ThemeContext);
    const textColor = themeContext.mode === "inDepo" ? ColorStatus.white : null;
    const { renderItem, ...rest } = props;
    const defaultRenderItem = (item, i: number) => (
        <ANTList.Item>{renderItem ? renderItem(item, i) : <Text state={textColor}>{item}</Text>}</ANTList.Item>
    );

    return <StyledList renderItem={defaultRenderItem} {...rest} />;
};

export default List;
