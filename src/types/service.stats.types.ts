export interface ServiceStatsRequest{
    // Backend multipart/form-data için ikon artık dosya (resim) olarak gönderilecek
    icon?: File | null;
    numberValue : number;
    title : string;
}

export interface ServiceStatsResponse{
    id:number;
    iconName:string;
    numberValue:number;
    title:string;
}