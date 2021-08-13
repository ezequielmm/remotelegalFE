type AddedBy = {
    firstName: string;
    id: string;
    lastName: string;
};

export type ExhibitFile = {
    id: string;
    name: string;
    displayName: string;
    size: number;
    preSignedUrl?: string;
    addedBy?: AddedBy;
    close?: boolean;
    sharedAt?: string;
    isPublic?: boolean;
    stampLabel?: string;
};
