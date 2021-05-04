import { createGlobalStyle } from "styled-components";
import FontFace from "./FontFace";
import MerriweatherRegular from "../../assets/fonts/Merriweather/Merriweather-Regular.ttf";
import MerriweatherLight from "../../assets/fonts/Merriweather/Merriweather-Light.ttf";
import MerriweatherBold from "../../assets/fonts/Merriweather/Merriweather-Bold.ttf";
import LatoRegular from "../../assets/fonts/Lato/Lato-Regular.ttf";
import LatoLight from "../../assets/fonts/Lato/Lato-Light.ttf";
import LatoBold from "../../assets/fonts/Lato/Lato-Bold.ttf";
import PTMonoRegular from "../../assets/fonts/PT Mono/PTMono-Regular.ttf";
import PTMonoBold from "../../assets/fonts/PT Mono/PTMono-Bold.ttf";
import { getREM } from "../../constants/styles/utils";

const GlobalStyle = createGlobalStyle`
    ${FontFace("Merriweather", MerriweatherRegular)};
    ${FontFace("Merriweather", MerriweatherLight, 300)};
    ${FontFace("Merriweather", MerriweatherBold, 700)};
    ${FontFace("Lato", LatoRegular)};
    ${FontFace("Lato", LatoLight, 300)};
    ${FontFace("Lato", LatoBold, 700)};
    ${FontFace("PT Mono", PTMonoRegular)};
    ${FontFace("PT Mono", PTMonoBold, 700)};

    .ant-form-vertical .ant-form-item-label {
        line-height: 1;

        & > * {
            line-height: 1;
        }

        & label {
            text-transform: uppercase;
            min-width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }

    .ant-checkbox-inner {
        border-radius: 2px;
    }

    .ant-layout-header {
        line-height: unset;
    }

    .ant-menu {
        &-item {
            display: flex;
            align-items: center;
        }
    }

    .ant-result {
        padding: 0;
        &-icon > .anticon {
            font-size: ${({ theme }) => getREM(theme.default.spaces[6] * 6)};        
        }
    }
    ${({ theme }) => `
        .ant-notification-notice-message{
            margin-bottom: 0;
            line-height: normal;
        }
        .ant-notification-notice-btn{
            margin-top: ${getREM(theme.default.spaces[3])}
        }
    `}
    
`;

export default GlobalStyle;
