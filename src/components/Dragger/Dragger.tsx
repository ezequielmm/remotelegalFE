import Dragger from "antd/lib/upload/Dragger";
import styled from "styled-components";
import { ThemeMode } from "../../types/ThemeType";

const StyledDragger = styled(Dragger)`
    ${({ theme }) => {
        const { textColorInverse } = theme.default;
        const { primary } = theme.colors;
        const inDepoTheme =
            theme.mode === ThemeMode.inDepo
                ? `
                &.ant-upload.ant-upload-drag {
                  background: none;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: dashed 1px ${primary[5]};
                  height: unset;
                  .anticon {
                    color: ${primary[5]};
                  }
                  label {
                    cursor: pointer;
                    color: ${textColorInverse};
                  }
                }
            `
                : `
                ""
            `;
        const styles = `
            ${inDepoTheme}
        `;
        return styles;
    }}
`;

export default StyledDragger;
