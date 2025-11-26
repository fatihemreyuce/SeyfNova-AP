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
            toast.success("Faq created successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: () => {
            toast.error("Failed to create faq");
        },
    });
}

export const useUpdateFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: FaqRequest }) => updateFaq(id, request),
        onSuccess: () => {
            toast.success("Faq updated successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: () => {
            toast.error("Failed to update faq");
        },
    });
}

export const useDeleteFaq = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteFaq(id),
        onSuccess: () => {
            toast.success("Faq deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: () => {
            toast.error("Failed to delete faq");
        },
    });
}

export const useGetFaqById = (id: number) => {
    return useQuery({
        queryKey: ["faq", id],
        queryFn: () => getFaqById(id),
    });
}