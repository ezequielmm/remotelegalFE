import React, { useRef, useEffect, useState, useContext } from "react";
import WebViewer, { Annotations, WebViewerInstance } from "@pdftron/webviewer";
import * as CONSTANTS from "../../constants/PDFTronViewer";
import { StyledPDFTronViewerContainer } from "./styles";
import StampModal from "./components/StampModal";
import Message from "../Message";
import { GlobalStateContext } from "../../state/GlobalState";

export interface PdfTronViewerProps {
    document?: string | Blob | File;
    filename?: string;
    canStamp?: boolean;
}

const PDFTronViewer = ({ document, filename, canStamp }: PdfTronViewerProps) => {
    const { state } = useContext(GlobalStateContext);
    const { timeZone } = state.room;
    const [openStampModal, setStampModal] = useState(false);
    const viewerRef = useRef(null);
    const [PDFTron, setPDFTron] = useState<WebViewerInstance>(null);
    const stampRef = useRef(null);

    useEffect(() => {
        if (!canStamp && PDFTron) {
            PDFTron.setHeaderItems((header) => header.delete("rubberStampToolGroupButton"));
        }
        if (canStamp && PDFTron) {
            PDFTron.setHeaderItems((header) => {
                header.get("customFullScreenButton").insertAfter({
                    ...CONSTANTS.OPEN_STAMP_MODAL_BUTTON,
                    onClick() {
                        if (stampRef.current) {
                            return Message({
                                content: "Please delete the existing stamp and try again",
                                type: "error",
                                duration: 3,
                            });
                        }

                        return setStampModal(true);
                    },
                });
            });
        }
    }, [PDFTron, canStamp]);

    const resetRefOnStampDelete = (annotations: Annotations.Annotation[], action: string) => {
        if (action === "delete") {
            annotations.forEach((annotation: Annotations.Annotation) => {
                if (annotation.getCustomData("STAMP")) {
                    stampRef.current = null;
                }
            });
        }
    };

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
                    header
                        .get("panToolButton")
                        .insertAfter({
                            ...CONSTANTS.FULL_SCREEN_BUTTON,
                            onClick() {
                                instance.toggleFullScreen();
                            },
                        })
                        .get("customFullScreenButton");
                    const newItems = header
                        .getHeader("toolbarGroup-Annotate")
                        .getItems()
                        .filter((item: { dataElement: string; toolName: string }) =>
                            CONSTANTS.ANNOTATE_ITEMS.includes(item.dataElement || item.toolName)
                        );
                    header.update(newItems);
                });
                setPDFTron(instance);
            });
        };
        startViewer();
    }, []);

    useEffect(() => {
        if (PDFTron && document && filename) {
            stampRef.current = null;
            PDFTron.annotManager.on("annotationChanged", resetRefOnStampDelete);
            PDFTron.loadDocument(document, { filename });
        }

        return () => PDFTron?.annotManager.off("annotationChanged", resetRefOnStampDelete);
    }, [document, PDFTron, filename]);

    const stampDocument = async (stampImage: string) => {
        const { annotManager, Annotations } = PDFTron;
        const stamp = new Annotations.StampAnnotation();
        await stamp.setImageData(stampImage);
        stamp.LockedContents = true;
        stamp.setCustomData("STAMP", stampImage);
        stamp.PageNumber = 1;
        stamp.X = 440;
        stamp.Y = 2;
        stamp.Width = 150;
        stamp.Height = 60;
        stamp.MaintainAspectRatio = true;
        annotManager.addAnnotation(stamp, null);
        annotManager.redrawAnnotation(stamp);
        stampRef.current = stamp;
    };
    return (
        <>
            <StampModal
                open={openStampModal}
                timeZone={timeZone}
                onConfirm={stampDocument}
                handleClose={setStampModal}
            />
            <StyledPDFTronViewerContainer ref={viewerRef} />;
        </>
    );
};

export default PDFTronViewer;
