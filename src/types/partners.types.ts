export interface PartnerRequest {
    logo: File | string;
    name: string;
    orderIndex: number;
}

export interface PartnerResponse {
    id: number;
    logoUrl: string;
    name: string;
    orderIndex: number;
}