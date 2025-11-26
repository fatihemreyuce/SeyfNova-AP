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
            toast.success("Home page about created successfully");
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
        },
        onError: () => {
            toast.error("Failed to create home page about");
        },
    });
}

export const useUpdateHomePageAbout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, request }: { id: number; request: HomePageAboutRequest }) => updateHomePageAbout(id, request),
        onSuccess: () => {
            toast.success("Home page about updated successfully");
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
        },
        onError: () => {
            toast.error("Failed to update home page about");
        },
    });
}

export const useDeleteHomePageAbout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteHomePageAbout(id),
        onSuccess: () => {
            toast.success("Home page about deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["homepage-about"] });
        },
        onError: () => {
            toast.error("Failed to delete home page about");
        },
    });
}

export const useGetHomePageAboutById = (id: number) => {
    return useQuery({
        queryKey: ["homepage-about", id],
        queryFn: () => getHomePageAboutById(id),
    });
}