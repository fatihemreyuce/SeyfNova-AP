import { fetchClient } from "@/utils/fetch-client";
import type { NotificationRequest, NotificationResponse } from "@/types/notifications.types";
import type { Page } from "@/types/pagination";

export const createNotification = async (request: NotificationRequest): Promise<NotificationResponse> => {
    return await fetchClient<NotificationRequest, NotificationResponse>("/admin/notifications", {
        method: "POST",
        body: request,
    });
}

export const sendNotification = async (request: NotificationRequest): Promise<NotificationResponse> => {
    return await fetchClient<NotificationRequest, NotificationResponse>("/admin/notifications/send", {
        method: "POST",
        body: request,
    });
}

export const getNotifications = async (page: number, size: number, sort: string): Promise<Page<NotificationResponse>> => {
    return await fetchClient<void, Page<NotificationResponse>>(`/admin/notifications?page=${page}&size=${size}&sort=${sort}`, {
        method: "GET",
    });
}

export const getNotificationById = async (id: string): Promise<NotificationResponse> => {
    return await fetchClient<void, NotificationResponse>(`/admin/notifications/${id}`, {
        method: "GET",
    });
}

export const updateNotification = async (id: string, request: NotificationRequest): Promise<NotificationResponse> => {
    return await fetchClient<NotificationRequest, NotificationResponse>(`/admin/notifications/${id}`, {
        method: "PUT",
        body: request,
    });
}


export const deleteNotification = async (id: string): Promise<void> => {
    return await fetchClient<void, void>(`/admin/notifications/${id}`, {
        method: "DELETE",
    });
}