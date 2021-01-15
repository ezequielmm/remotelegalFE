export enum AnnotationAction {
    Create = "Create",
    Modify = "Modify",
    Delete = "Delete",
}
export type AnnotationActionType = AnnotationAction.Create | AnnotationAction.Modify | AnnotationAction.Delete;
