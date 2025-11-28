import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateServiceCategory, useGetServiceCategoryById } from "@/hooks/use-service-category";
import { ArrowLeft, FolderTree, Save } from "lucide-react";
import { toast } from "sonner";

export default function ServiceCategoryEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateServiceCategory();
	const { data, isLoading, error } = useGetServiceCategoryById(Number(id));

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [orderIndex, setOrderIndex] = useState<number | "">("");

	useEffect(() => {
		if (data) {
			setName(data.name || "");
			setDescription(data.description || "");
			setOrderIndex(data.orderIndex ?? "");
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load service category data");
			navigate("/service-category");
		}
	}, [error, navigate]);

	const isSubmitting = updateMutation.isPending;
	const isFormValid =
		name.trim() !== "" && description.trim() !== "" && orderIndex !== "" && Number(orderIndex) >= 0;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !isFormValid) return;

		try {
			await updateMutation.mutateAsync({
				id: Number(id),
				request: {
					name: name.trim(),
					description: description.trim(),
					orderIndex: Number(orderIndex),
				},
			});
			navigate("/service-category");
		} catch {
			// handled in mutation
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
				<div className="max-w-3xl mx-auto space-y-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="flex items-center gap-3">
							<Skeleton className="h-12 w-12 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-8 w-48" />
								<Skeleton className="h-4 w-56" />
							</div>
						</div>
					</div>
					<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
						<Skeleton className="h-1.5 w-full" />
						<CardHeader className="pb-6 pt-8 px-4 sm:px-8">
							<Skeleton className="h-7 w-48 mb-2" />
							<Skeleton className="h-4 w-64" />
						</CardHeader>
						<CardContent className="px-4 sm:px-8 pb-8 space-y-8">
							{Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className="space-y-3">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
						</CardContent>
						<CardFooter className="px-4 sm:px-8 pb-8 pt-6">
							<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-4 w-full">
								<Skeleton className="h-11 w-24" />
								<Skeleton className="h-11 w-32" />
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
			<div className="max-w-3xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/service-category")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1 flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
							<FolderTree className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
								Hizmet Kategorisi Düzenle
							</h1>
							<p className="text-muted-foreground mt-1.5 text-base">
								Hizmet kategorisi bilgilerini güncelle (ID: {id})
							</p>
						</div>
					</div>
				</div>

				{/* Form */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					<form onSubmit={handleSubmit}>
						<CardHeader className="pb-6 pt-8 px-8">
							<CardTitle className="text-2xl font-semibold mb-2">
								Hizmet Kategorisi Detayları
							</CardTitle>
							<CardDescription className="text-base">
								Bu hizmet kategorisini değiştirmek için aşağıdaki alanları güncelleyin
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-8 px-8 pb-8">
							{/* Name */}
							<div className="space-y-3">
								<Label
									htmlFor="name"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>İsim</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="name"
									placeholder="Örn: Web Geliştirme"
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Description */}
							<div className="space-y-3">
								<Label
									htmlFor="description"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Açıklama</span>
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="description"
									placeholder="Hizmet kategorisi için net bir açıklama verin..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[120px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>

							{/* Order Index */}
							<div className="space-y-3">
								<Label
									htmlFor="orderIndex"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Sıra</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="orderIndex"
									type="number"
									min="0"
									placeholder="Örn: 1"
									value={orderIndex}
									onChange={(e) => {
										const value = e.target.value;
										setOrderIndex(value === "" ? "" : Number(value));
									}}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
								<p className="text-sm text-muted-foreground">
									Düşük sayılar kategori listelerinde daha önce görünür
								</p>
							</div>
						</CardContent>
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/service-category")}
								disabled={isSubmitting}
								className="h-11 px-6 font-medium border-2 hover:bg-muted/80 transition-all duration-200"
							>
								İptal
							</Button>
							<Button
								type="submit"
								disabled={!isFormValid || isSubmitting}
								className="h-11 px-8 font-medium bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Güncelleniyor...
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										Hizmet Kategorisini Güncelle
									</>
								)}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}

