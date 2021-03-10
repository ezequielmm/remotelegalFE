type AddedBy = {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress?: string;
};

export type TranscriptFile = {
    id: string;
    name: string;
    displayName: string;
    size: number;
    creationDate: string;
    addedBy?: AddedBy;
    sharedAt?: string;
    stampLabel: string;
    documentType: string;
};
