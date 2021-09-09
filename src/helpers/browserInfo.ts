import UAParser from "ua-parser-js";

const getBrowserInfo = (): { browser: string; device: string; OS: string; isIOS: boolean } => {
    const parser = new UAParser();
    return {
        browser: `${parser.getBrowser().name} ${parser.getBrowser().version}`,
        device: `${parser.getDevice().type || "desktop"}`,
        OS: `${parser.getOS().name} ${parser.getOS().version}`,
        isIOS: parser.getOS().name.includes("iOS"),
    };
};
export default getBrowserInfo;
