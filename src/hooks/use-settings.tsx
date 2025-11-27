import {useAuthQuery} from "./use-auth-query";
import { getSettings, getSettingsById, updateSettings, deleteSettings, createSettings } from "@/services/settings-service";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SettingsRequest } from "@/types/settings.types";

export const useSettings = (search: string, page: number, size: number, sort: string) =>{
    return useAuthQuery({
        queryKey: ["settings", search, page, size, sort],
        queryFn: () => getSettings(search, page, size, sort),
    });
}

export const useUpdateSettings = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: SettingsRequest }) => updateSettings(id, request),
        onSuccess: () => {
            toast.success("Ayarlar başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => {
            toast.error("Ayarlar güncellenirken hata oluştu");
        },
    });
}

export const useDeleteSettings = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteSettings(id),
        onSuccess: () => {
            toast.success("Ayarlar başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => {
            toast.error("Ayarlar silinirken hata oluştu");
        },
    });
}

export const useCreateSettings = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: SettingsRequest) => createSettings(request),
        onSuccess: () => {
            toast.success("Ayarlar başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => {
            toast.error("Ayarlar oluşturulurken hata oluştu");
        },
    });
}

export const useGetSettingsById = (id: number) =>{
    return useAuthQuery({
        queryKey: ["settings", id],
        queryFn: () => getSettingsById(id),
    });
}
