import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createServiceCategory, updateServiceCategory, deleteServiceCategory, getServiceCategories, getServiceCategoryById } from "@/services/service-category-service";
import type { ServiceCategoryRequest } from "@/types/service.category.types";
import { toast } from "sonner";

export const useServiceCategories = (search: string, page: number, size: number, sort: string) => {
	return useQuery({
		queryKey: ["service-categories", search, page, size, sort],
		queryFn: () => getServiceCategories(search, page, size, sort),
	});
};

export const useCreateServiceCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (request: ServiceCategoryRequest) => createServiceCategory(request),
		onSuccess: () => {
			toast.success("Hizmet kategorisi başarıyla oluşturuldu");
			queryClient.invalidateQueries({ queryKey: ["service-categories"] });
		},
		onError: () => {
			toast.error("Hizmet kategorisi oluşturulurken hata oluştu");
		},
	});
};

export const useUpdateServiceCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, request }: { id: number; request: ServiceCategoryRequest }) => updateServiceCategory(id, request),
		onSuccess: () => {
			toast.success("Hizmet kategorisi başarıyla güncellendi");
			queryClient.invalidateQueries({ queryKey: ["service-categories"] });
		},
		onError: () => {
			toast.error("Hizmet kategorisi güncellenirken hata oluştu");
		},
	});
};

export const useDeleteServiceCategory = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteServiceCategory(id),
		onSuccess: () => {
			toast.success("Hizmet kategorisi başarıyla silindi");
			queryClient.invalidateQueries({ queryKey: ["service-categories"] });
		},
		onError: () => {
			toast.error("Hizmet kategorisi silinirken hata oluştu");
		},
	});
};

export const useGetServiceCategoryById = (id: number) => {
	return useQuery({
		queryKey: ["service-categories", id],
		queryFn: () => getServiceCategoryById(id),
	});
};
