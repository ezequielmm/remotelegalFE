import React, { useRef, useEffect, useState, useCallback, useContext } from "react";
import WebViewer, { Annotations, WebViewerInstance } from "@pdftron/webviewer";
import { initializeVideoViewer, renderControlsToDOM } from "@pdftron/webviewer-video";
import * as CONSTANTS from "../../constants/PDFTronViewer";
import { StyledPDFTronViewerContainer } from "./styles";
import StampModal from "./components/StampModal";
import Message from "../Message";
import { GlobalStateContext } from "../../state/GlobalState";
import { convertToXfdf } from "../../helpers/convertToXfdf";
import { AnnotationAction, AnnotationActionType } from "../../types/Annotation";
import { serializeToString } from "../../helpers/serializeToString";

export type AnnotationPayload = {
    action: string;
    details: string;
};
export interface PdfTronViewerProps {
    document?: string | Blob | File;
    filename?: string;
    canStamp?: boolean;
    showStamp?: boolean;
    annotations?: [];
    onAnnotationChange?: (data: AnnotationPayload) => void;
}

const PDFTronViewer = ({
    document,
    filename,
    canStamp,
    showStamp,
    annotations,
    onAnnotationChange,
}: PdfTronViewerProps) => {
    const { state } = useContext(GlobalStateContext);
    const { timeZone } = state.room;
    const [openStampModal, setStampModal] = useState(false);
    const viewerRef = useRef(null);
    const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
    const [PDFTron, setPDFTron] = useState<WebViewerInstance>(null);
    const stampRef = useRef(null);
    const shouldToastAppear = useRef(true);

    useEffect(() => {
        if (!showStamp && PDFTron) {
            PDFTron.setHeaderItems((header) => header.delete("rubberStampToolGroupButton"));
        }
        if (showStamp && canStamp && PDFTron) {
            PDFTron.setHeaderItems((header) => {
                header.get("customFullScreenButton").insertAfter({
                    ...CONSTANTS.OPEN_STAMP_MODAL_BUTTON,
                    onClick() {
                        if (stampRef.current && shouldToastAppear.current) {
                            shouldToastAppear.current = false;
                            return Message({
                                content: "Please delete the existing stamp and try again",
                                type: "error",
                                duration: 3,
                            });
                        }
                        if (!stampRef.current) {
                            shouldToastAppear.current = true;
                            return setStampModal(true);
                        }
                    },
                });
            });
        }
    }, [PDFTron, showStamp, canStamp]);

    const sendAnnotationChange = useCallback(
        (annotation, action: AnnotationActionType) => {
            if (annotation.nodeType !== annotation.TEXT_NODE) {
                const annotationString = serializeToString(annotation);
                if (!onAnnotationChange) return;
                onAnnotationChange({
                    action,
                    details: convertToXfdf(annotationString, action),
                });
            }
        },
        [onAnnotationChange]
    );

    const onAnnotationChangeHandler = async (changedAnnotations: Annotations.Annotation[], action: string) => {
        const { annotManager } = PDFTron;
        const xfdfString = await annotManager.exportAnnotCommand();
        const parser = new DOMParser();
        const commandData = parser.parseFromString(xfdfString, "text/xml");
        const addedAnnots = commandData.getElementsByTagName("add")[0];
        const modifiedAnnots = commandData.getElementsByTagName("modify")[0];
        const deletedAnnots = commandData.getElementsByTagName("delete")[0];

        addedAnnots.childNodes.forEach((child) => {
            sendAnnotationChange(child, AnnotationAction.Create);
        });
        modifiedAnnots.childNodes.forEach((child) => {
            if (child.nodeName !== "stamp" || canStamp) {
                sendAnnotationChange(child, AnnotationAction.Modify);
            }
        });
        deletedAnnots.childNodes.forEach((child) => {
            sendAnnotationChange(child, AnnotationAction.Delete);
        });

        if (action === "delete") {
            changedAnnotations.forEach((annotation: Annotations.Annotation) => {
                if (annotation.getCustomData("STAMP")) {
                    stampRef.current = null;
                }
            });
        }
    };

    const onDocumentLoadedHandler = () => {
        const { FitMode } = PDFTron;
        PDFTron.setFitMode(FitMode.FitWidth);
        setIsDocumentLoaded(true);
    };

    useEffect(() => {
        if (isDocumentLoaded) {
            annotations?.forEach(async (row) => {
                const annotations = await PDFTron?.annotManager.importAnnotCommand(row);
                const stamp = PDFTron.annotManager.getAnnotationById("STAMP");
                if (stamp) {
                    if (!canStamp) {
                        stamp.ReadOnly = true;
                    }
                    stampRef.current = stamp;
                }
                await PDFTron?.annotManager.drawAnnotationsFromList(annotations);
                // TODO: Add BE integration
            });
        }
    }, [annotations, canStamp, isDocumentLoaded, PDFTron]);

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
                instance.setTheme("dark");
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
                instance.setToolbarGroup("toolbarGroup-View", true);
                setPDFTron(instance);
            });
        };

        startViewer();
    }, []);

    const loadPDFTronVideo = async (instance, video) => {
        const { loadVideo } = await initializeVideoViewer(instance, "");
        loadVideo(video);
        instance.docViewer.on("documentLoaded", () => {
            const customContainer = instance.iframeWindow.document.querySelector(".custom-container");
            renderControlsToDOM(instance, customContainer);
        });
    };

    useEffect(() => {
        if (PDFTron && document && filename) {
            stampRef.current = null;
            PDFTron.annotManager.on("annotationChanged", onAnnotationChangeHandler);
            PDFTron.docViewer.on("documentLoaded", onDocumentLoadedHandler);
            PDFTron.setToolbarGroup("toolbarGroup-View", true);
            if (filename.toLowerCase().includes(".mp4")) {
                loadPDFTronVideo(PDFTron, document);
            } else {
                PDFTron.loadDocument(document, { filename });
            }
        }
        return () => {
            PDFTron?.annotManager.off("annotationChanged", onAnnotationChangeHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canStamp, document, PDFTron, filename]);

    const stampDocument = async (stampImage: string) => {
        const { annotManager, Annotations } = PDFTron;
        const stamp = new Annotations.StampAnnotation();
        await stamp.setImageData(stampImage);
        stamp.LockedContents = true;
        stamp.setCustomData("STAMP", stampImage);
        stamp.Id = "STAMP";
        stamp.PageNumber = 1;
        stamp.setX(0);
        stamp.setY(0);
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
