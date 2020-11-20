export const DISABLED_BUTTONS = ["selectToolButton, textSelectButton", "toolbarGroup-Edit", "fullscreenButton"];

export const ANNOTATE_ITEMS = [
    "highlightToolGroupButton",
    "underlineToolGroupButton",
    "freeTextToolGroupButton",
    "freeHandToolGroupButton",
];

export const SHAPES_ITEMS = [
    "shapeToolGroupButton",
    "ellipseToolGroupButton",
    "lineToolGroupButton",
    "polyLineToolGroupButton",
    "arrowToolGroupButton",
];

export const INSERT_ITEMS = ["signatureToolButton", "toolsOverlay", "calloutToolGroupButton"];

export const FULL_SCREEN_BUTTON = {
    img:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:#abb0c4;}</style></defs><title>icon - header - full screen</title><path class="cls-1" d="M4.22,4.22H9.78V2H2V9.78H4.22ZM9.78,19.78H4.22V14.22H2V22H9.78ZM22,14.22H19.78v5.56H14.22V22H22ZM19.78,9.78H22V2H14.22V4.22h5.56Z"></path></svg>',
    dataElement: "customFullScreenButton",
    title: "Full screen",
    toolGroup: "default",
    type: "actionButton",
};
