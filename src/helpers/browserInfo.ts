// eslint-disable-next-line import/prefer-default-export
export const getBrowserInfo = (): { browser: string; device: string } => {
    const ua = navigator.userAgent;
    let browser: string;

    function getFirstMatch(regex: RegExp) {
        const match = ua.match(regex);
        return (match && match.length > 1 && match[1]) || "";
    }

    function getSecondMatch(regex: RegExp) {
        const match = ua.match(regex);
        return (match && match.length > 1 && match[2]) || "";
    }

    function getDeviceType() {
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (
            /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            )
        ) {
            return "mobile";
        }
        return "desktop";
    }

    if (/opera|opr/i.test(ua)) {
        browser = `Opera ${
            getFirstMatch(/version\/(\d+(\.\d+)?)/i) || getFirstMatch(/(?:opera|opr)[\s\\/](\d+(\.\d+)?)/i)
        }`;
    } else if (/msie|trident/i.test(ua)) {
        browser = `Internet Explorer ${getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)}`;
    } else if (/chrome.+? edge/i.test(ua)) {
        browser = `Microsft Edge ${getFirstMatch(/edge\/(\d+(\.\d+)?)/i)}`;
    } else if (/chrome|crios|crmo/i.test(ua)) {
        browser = `Google Chrome ${getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}`;
    } else if (/firefox/i.test(ua)) {
        browser = `Firefox ${getFirstMatch(/(?:firefox)[ \\/](\d+(\.\d+)?)/i)}`;
    } else if (!/like android/i.test(ua) && /android/i.test(ua)) {
        browser = `Android ${getFirstMatch(/version\/(\d+(\.\d+)?)/i)}`;
    } else if (/safari/i.test(ua)) {
        browser = `Safari ${getFirstMatch(/version\/(\d+(\.\d+)?)/i)}`;
    } else {
        browser = `${getFirstMatch(/^(.*)\/(.*) /)} ${getSecondMatch(/^(.*)\/(.*) /)}`;
    }
    return { browser, device: getDeviceType() };
};
