import { useAuthQuery } from "./use-auth-query";
import { createContact, getContacts, deleteContact, getContactById } from "@/services/contact-service";
import type { ContactRequest } from "@/types/contact.types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useContacts = (page: number, size: number, sort: string) => {
    return useAuthQuery({
        queryKey: ["contacts", page, size, sort],
        queryFn: () => getContacts(page, size, sort),
    });
}

export const useCreateContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: ContactRequest) => createContact(request),
        onSuccess: () => {
            toast.success("İletişim başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
        onError: () => {
            toast.error("İletişim oluşturulurken hata oluştu");
        },
    });
}

export const useDeleteContact = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteContact(id),
        onSuccess: () => {
            toast.success("İletişim başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        },
        onError: () => {
            toast.error("İletişim silinirken hata oluştu");
        },
    });
}

export const useGetContactById = (id: number) => {
    return useAuthQuery({
        queryKey: ["contacts", id],
        queryFn: () => getContactById(id),
    });
}