import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUsefulInformation, deleteUsefulInformation, getUsefulInformation, getUsefulInformationById, updateUsefulInformation } from "@/services/useful-information-service";
import type { UsefulInformationRequest } from "@/types/useful.information.types";
import { toast } from "sonner";
import { useAuthQuery } from "./use-auth-query";

export const useUsefulInformation = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["useful-information", page, size, sort],
        queryFn: () => getUsefulInformation(page, size, sort),
    });
}

export const useCreateUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: UsefulInformationRequest) => createUsefulInformation(request),
        onSuccess: () => {
            toast.success("Faydalı bilgi başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
        },
        onError: () => {
            toast.error("Faydalı bilgi oluşturulurken hata oluştu");
        },
    });
}

export const useDeleteUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteUsefulInformation(id),
        onSuccess: () => {
            toast.success("Faydalı bilgi başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
        },
        onError: () => {
            toast.error("Faydalı bilgi silinirken hata oluştu");
        },
    });
}

export const useUpdateUsefulInformation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: UsefulInformationRequest }) => updateUsefulInformation(id, request),
        onSuccess: () => {
            toast.success("Faydalı bilgi başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["useful-information"] });
        },
        onError: () => {
            toast.error("Faydalı bilgi güncellenirken hata oluştu");
        },
    });
}

export const useGetUsefulInformationById = (id: number) => {
    return useAuthQuery({
        queryKey: ["useful-information", id],
        queryFn: () => getUsefulInformationById(id),
    });
}