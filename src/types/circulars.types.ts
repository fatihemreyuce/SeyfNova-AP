export interface CircularRequest {
    file: File | string;
    title: string;
    description: string;
}

export interface CircularResponse {
    id: number;
    title: string;
    description: string;
    fileUrl: string;
}