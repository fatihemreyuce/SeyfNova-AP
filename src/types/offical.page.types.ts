import type { Page } from "./pagination";
export interface QualificationRequest{
    text: string;
    orderNumber:string;
}

export interface OfficalPageDocumentRequest{
    id: number;
    name: string;
    asset: File | string;
}


export interface OfficalPageRequest{
    description: string;
    document: OfficalPageDocumentRequest[];
    qualification: QualificationRequest[];
}

export interface OfficalPageResponse{
    id: number;
    description: string;
    document: Page<OfficalPageDocumentRequest>;
    qualification: Page<QualificationRequest>;
}