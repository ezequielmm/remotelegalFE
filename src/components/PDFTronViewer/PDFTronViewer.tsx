import React, { useRef, useEffect, useState } from "react";
import WebViewer, { WebViewerInstance } from "@pdftron/webviewer";
import {
    SHAPES_ITEMS,
    INSERT_ITEMS,
    DISABLED_BUTTONS,
    ANNOTATE_ITEMS,
    FULL_SCREEN_BUTTON,
} from "../../constants/PDFTronViewer";
import customisePDFTronToolbars from "../../helpers/customisePDFTronToolbars";
import { StyledPDFTronViewerContainer } from "./styles";

interface PdfTronViewerProps {
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
                    disabledElements: DISABLED_BUTTONS,
                },
                viewerRef.current
            ).then((instance) => {
                instance.setHeaderItems((header) => {
                    header.get("panToolButton").insertAfter({
                        ...FULL_SCREEN_BUTTON,
                        onClick() {
                            instance.toggleFullScreen();
                        },
                    });
                    instance.setTheme("dark");
                    const FitMode = instance.FitMode;
                    instance.setFitMode(FitMode.FitWidth);
                    customisePDFTronToolbars(header, "toolbarGroup-Annotate", ANNOTATE_ITEMS);
                    customisePDFTronToolbars(header, "toolbarGroup-Shapes", SHAPES_ITEMS);
                    customisePDFTronToolbars(header, "toolbarGroup-Insert", INSERT_ITEMS);
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
