export interface SliderRequest {
    image: File | string;
    title: string;
    description: string;
    orderIndex: number;
}

export interface SliderResponse {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    orderIndex: number;
}
