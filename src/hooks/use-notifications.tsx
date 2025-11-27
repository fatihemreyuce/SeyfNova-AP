import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotification, updateNotification, deleteNotification, getNotifications, getNotificationById, sendNotification } from "@/services/notifications-service";
import type { NotificationRequest } from "@/types/notifications.types";
import { toast } from "sonner";
import { useAuthQuery } from "./use-auth-query";

export const useNotifications = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["notifications", page, size, sort],
        queryFn: () => getNotifications(page, size, sort),
    });
}

export const useCreateNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: NotificationRequest) => createNotification(request),
        onSuccess: () => {
            toast.success("Bildirim başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: () => {
            toast.error("Bildirim oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: string, request: NotificationRequest }) => updateNotification(id, request),
        onSuccess: () => {
            toast.success("Bildirim başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: () => {
            toast.error("Bildirim güncellenirken hata oluştu");
        },
    });
}

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: () => {
            toast.success("Bildirim başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
}

export const useGetNotificationById = (id: string) => {
    return useAuthQuery({
        queryKey: ["notification", id],
        queryFn: () => getNotificationById(id),
    });
}

export const useSendNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: NotificationRequest) => sendNotification(request),
        onSuccess: () => {
            toast.success("Bildirim başarıyla gönderildi");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: () => {
            toast.error("Bildirim gönderilirken hata oluştu");
        },
    });
}