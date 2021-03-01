import React, { useRef, useEffect, useState, useCallback, useContext } from "react";
import WebViewer, { Annotations, CoreControls, WebViewerInstance } from "@pdftron/webviewer";
import { initializeVideoViewer, renderControlsToDOM } from "@pdftron/webviewer-video";
import * as CONSTANTS from "../../constants/PDFTronViewer";
import { StyledPDFTronViewerContainer } from "./styles";
import StampModal from "./components/StampModal";
import Message from "../Message";
import { GlobalStateContext } from "../../state/GlobalState";
import { convertToXfdf } from "../../helpers/convertToXfdf";
import { AnnotationAction, AnnotationActionType } from "../../types/Annotation";
import { serializeToString } from "../../helpers/serializeToString";
import actions from "../../state/InDepo/InDepoActions";

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
    disableElements?: string[];
    readOnly?: boolean;
}

const PDFTronViewer = ({
    document,
    filename,
    canStamp,
    showStamp,
    annotations,
    onAnnotationChange,
    disableElements = [],
    readOnly = false,
}: PdfTronViewerProps) => {
    const { state, dispatch } = useContext(GlobalStateContext);
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

    const onAnnotationChangeHandler = async (
        changedAnnotations: Annotations.Annotation[],
        action: string,
        info: CoreControls.AnnotationManager.AnnotationChangedInfoObject
    ) => {
        if (info.imported) return;
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

        const annotData = await annotManager.exportAnnotations();
        dispatch(actions.setExhibitDocument(PDFTron?.docViewer?.getDocument(), annotData));

        if (action === "delete") {
            changedAnnotations.forEach((annotation: Annotations.Annotation) => {
                if (annotation.getCustomData("STAMP")) {
                    stampRef.current = null;
                    dispatch(actions.setStampLabel(""));
                }
            });
        }
    };

    const onDocumentLoadedHandler = () => {
        if (filename.toLowerCase().includes(".mp4")) {
            const customContainer = PDFTron.iframeWindow.document.querySelector(".custom-container");
            renderControlsToDOM(PDFTron, customContainer);
        }

        const { FitMode } = PDFTron;
        PDFTron.setFitMode(FitMode.FitWidth);
        setIsDocumentLoaded(true);
    };

    useEffect(() => {
        if (isDocumentLoaded) {
            annotations?.forEach(async (row) => {
                const importedAnnotations = await PDFTron?.annotManager.importAnnotCommand(row);
                await PDFTron?.annotManager.drawAnnotationsFromList(importedAnnotations);
                const stamp = PDFTron?.annotManager.getAnnotationById("STAMP");
                if (stamp) {
                    if (!canStamp) {
                        stamp.ReadOnly = true;
                    }
                    dispatch(actions.setStampLabel(stamp.getCustomData("STAMP_LABEL")));
                    stampRef.current = stamp;
                }
            });
            const exportAnnotations = async () => {
                const annotationsData = await PDFTron?.annotManager.exportAnnotations();
                dispatch(actions.setExhibitDocument(PDFTron?.docViewer?.getDocument(), annotationsData));
            };
            exportAnnotations();
        }
    }, [annotations, canStamp, isDocumentLoaded, PDFTron, dispatch]);

    useEffect(() => {
        const startViewer = () => {
            WebViewer(
                {
                    // TODO: Add License Key
                    css: "./PDFTronStyles.css",
                    path: "/webviewer/lib/",
                    disabledElements: CONSTANTS.DISABLED_BUTTONS.concat(disableElements),
                },
                viewerRef.current
            ).then((instance) => {
                instance.setTheme("dark");
                if (readOnly) {
                    instance.annotManager.setReadOnly(true);
                }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPDFTronVideo = async (instance, video) => {
        const { loadVideo } = await initializeVideoViewer(instance, "");
        loadVideo(`${video}&`);
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

    const stampDocument = async (stampImage: string, stampLabel: string) => {
        const { annotManager, Annotations } = PDFTron;
        const stamp = new Annotations.StampAnnotation();
        await stamp.setImageData(stampImage);
        stamp.LockedContents = true;
        stamp.setCustomData("STAMP", stampImage);
        stamp.setCustomData("STAMP_LABEL", stampLabel);
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
        dispatch(actions.setStampLabel(stampLabel));
    };
    return (
        <>
            <StampModal
                open={openStampModal}
                timeZone={timeZone}
                onConfirm={stampDocument}
                handleClose={setStampModal}
            />
            <StyledPDFTronViewerContainer ref={viewerRef} />
        </>
    );
};

export default PDFTronViewer;
