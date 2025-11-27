export interface UsefulInformationRequest {
    file: File | string;
    title: string;
    description: string;
}

export interface UsefulInformationResponse {
    id: number;
    fileUrl: string;
    title: string;
    description: string;
}