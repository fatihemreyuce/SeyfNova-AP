import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFaq, updateFaq, deleteFaq, getFaqs, getFaqById } from "@/services/faqs-service";
import type { FaqRequest } from "@/types/faqs.types";
import { toast } from "sonner";

export const useFaqs = (search: string, page: number, size: number, sort: string) => {
    return useQuery({
        queryKey: ["faqs", search, page, size, sort],
        queryFn: () => getFaqs(search, page, size, sort),
    });
}

export const useCreateFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: FaqRequest) => createFaq(request),
        onSuccess: () => {
            toast.success("SSS başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: () => {
            toast.error("SSS oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: FaqRequest }) => updateFaq(id, request),
        onSuccess: () => {
            toast.success("SSS başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: () => {
            toast.error("SSS güncellenirken hata oluştu");
        },
    });
}

export const useDeleteFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteFaq(id),
        onSuccess: () => {
            toast.success("SSS başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: () => {
            toast.error("SSS silinirken hata oluştu");
        },
    });
}

export const useGetFaqById = (id: number) => {
    return useQuery({
        queryKey: ["faq", id],
        queryFn: () => getFaqById(id),
    });
}