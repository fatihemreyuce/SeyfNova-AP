import { createHomePageAbout,getHomePageAbout,getHomePageAboutById,updateHomePageAbout,deleteHomePageAbout } from "@/services/homepage-about-service";
import type { HomePageAboutRequest } from "@/types/homepage.about.types";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useHomePageAbout = (
    search:string,
    page:number,
    size:number,
    sort:string
) => {
    return useQuery({
        queryKey: ["homepage-about", search, page, size, sort],
        queryFn: () => getHomePageAbout(search, page, size, sort),
    });
}

export const useCreateHomePageAbout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: HomePageAboutRequest) => createHomePageAbout(request),
        onSuccess: () => {
            toast.success("Ana sayfa hakkında başarıyla oluşturuldu");
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
        },
        onError: () => {
            toast.error("Ana sayfa hakkında oluşturulurken hata oluştu");
        },
    });
}

export const useUpdateHomePageAbout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: HomePageAboutRequest }) => updateHomePageAbout(id, request),
        onSuccess: () => {
            toast.success("Ana sayfa hakkında başarıyla güncellendi");
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
        },
        onError: () => {
            toast.error("Ana sayfa hakkında güncellenirken hata oluştu");
        },
    });
}

export const useDeleteHomePageAbout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteHomePageAbout(id),
        onSuccess: () => {
            toast.success("Ana sayfa hakkında başarıyla silindi");
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
        },
        onError: () => {
            toast.error("Ana sayfa hakkında silinirken hata oluştu");
        },
    });
}

export const useGetHomePageAboutById = (id: number) => {
    return useQuery({
        queryKey: ["homepage-about", id],
        queryFn: () => getHomePageAboutById(id),
    });
}