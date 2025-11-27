import { useAuthQuery } from "./use-auth-query";
import { getOfficalPage, updateOfficalPage, deleteOfficalPage } from "@/services/offical-page-service";
import type { OfficalPageRequest } from "@/types/offical.page.types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useOfficalPage = () => {
    return useAuthQuery({
        queryKey: ["official-page"],
        queryFn: () => getOfficalPage(),
    });
}

export const useUpdateOfficalPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: OfficalPageRequest) => updateOfficalPage(request),
        onSuccess: () => {
            toast.success("Resmi sayfa başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["official-page"] });
        },
        onError: () => {
            toast.error("Resmi sayfa güncellenirken hata oluştu");
        },
    });
}

export const useDeleteOfficalPage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteOfficalPage(id),
        onSuccess: () => {
            toast.success("Resmi sayfa başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["official-page"] });
        },
        onError: () => {
            toast.error("Resmi sayfa silinirken hata oluştu");
        },
    });
}
