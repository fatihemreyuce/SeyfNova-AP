export interface ReferenceRequest{
    logo: File | string;
    name: string;
    description: string;
    websiteUrl: string;
    orderIndex: number;
}

export interface ReferenceResponse{
    id: number;
    name: string;
    description: string;
    logoUrl: string;
    websiteUrl: string;
    orderIndex: number;
}