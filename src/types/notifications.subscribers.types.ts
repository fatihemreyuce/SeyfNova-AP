export interface NotificationSubscriberRequest {
    email: string;
    name: string;
    surname: string;
    companyName: string;
    title: string;
}

export interface NotificationSubscriberResponse {
    id: number;
    email: string;
    name: string;
    surname: string;
}