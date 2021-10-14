import * as deviceInfo from "react-device-detect";

const getBrowserInfo = (): { browser: string; device: string; OS: string } => {
    return {
        browser: `${deviceInfo.browserName} ${deviceInfo.fullBrowserVersion}`,
        device: `${deviceInfo.deviceType === "browser" ? "desktop" : deviceInfo.deviceType}`,
        OS: `${deviceInfo.osName} ${deviceInfo.osVersion}`,
    };
};

export default getBrowserInfo;
