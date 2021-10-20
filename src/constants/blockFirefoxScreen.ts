import chromeIcon from "../assets/in-depo/chrome.svg";
import edgeIcon from "../assets/in-depo/edge.svg";
import safariIcon from "../assets/in-depo/safari.svg";

export const BLOCK_FIREFOX_SCREEN_TITLE = "You are using an unsupported browser";
export const BLOCK_FIREFOX_SCREEN_SUBTITLE1 = "You're using a web browser we don't currently support.";
export const BLOCK_FIREFOX_SCREEN_SUBTITLE2 = "Try one of these options to have a better experience on the platform.";
export const BLOCK_FIREFOX_SCREEN_BROWSERS = [
    { name: "Google Chrome", icon: chromeIcon, link: "https://www.google.com/chrome/" },
    { name: "Microsoft Edge", icon: edgeIcon, link: "https://www.microsoft.com/en-us/edge" },
    { name: "Safari", icon: safariIcon, link: "https://support.apple.com/downloads/safari" },
];
export const BLOCK_FIREFOX_SCREEN_BROWSER_BUTTON = "Download";
export const BLOCK_FIREFOX_SCREEN_COPY_INVITATION_DESCRIPTION = `If you already have one of these browsers, please click the "Copy Invitation" link to copy the URL and join using one of the supported browsers.`;
export const BLOCK_FIREFOX_SCREEN_COPY_INVITATION_BUTTON = "COPY INVITATION";
