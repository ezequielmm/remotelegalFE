import React, { useRef, useEffect, useState } from "react";
import WebViewer, { WebViewerInstance } from "@pdftron/webviewer";
import * as CONSTANTS from "../../constants/PDFTronViewer";
import customisePDFTronToolbars from "../../helpers/customisePDFTronToolbars";
import { StyledPDFTronViewerContainer } from "./styles";

export interface PdfTronViewerProps {
    document?: string | Blob | File;
    filename?: string;
}
const PDFTronViewer = ({ document, filename }: PdfTronViewerProps) => {
    const viewerRef = useRef(null);
    const [PDFTron, setPDFTron] = useState<WebViewerInstance>(null);

    useEffect(() => {
        const startViewer = () => {
            WebViewer(
                {
                    // TODO: Add License Key
                    css: "./PDFTronStyles.css",
                    path: "/webviewer/lib/",
                    disabledElements: CONSTANTS.DISABLED_BUTTONS,
                },
                viewerRef.current
            ).then((instance) => {
                const { FitMode } = instance;
                instance.setTheme("dark");
                instance.setFitMode(FitMode.FitWidth);
                instance.setHeaderItems((header) => {
                    header.get("panToolButton").insertAfter({
                        ...CONSTANTS.FULL_SCREEN_BUTTON,
                        onClick() {
                            instance.toggleFullScreen();
                        },
                    });
                    customisePDFTronToolbars(header, "toolbarGroup-Annotate", CONSTANTS.ANNOTATE_ITEMS);
                });
                instance.setToolbarGroup("toolbarGroup-View", true);
                setPDFTron(instance);
            });
        };
        startViewer();
    }, []);

    useEffect(() => {
        if (PDFTron && document && filename) {
            PDFTron.loadDocument(document, { filename });
        }
    }, [document, PDFTron, filename]);

    return <StyledPDFTronViewerContainer ref={viewerRef} />;
};

export default PDFTronViewer;
