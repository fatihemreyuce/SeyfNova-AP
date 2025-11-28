import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateService } from "@/hooks/use-service";
import type { ServiceRequest } from "@/types/service.types";
import { ArrowLeft, Save, Loader2, Briefcase } from "lucide-react";

export default function ServiceCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreateService();

	const [categoryId, setCategoryId] = useState<number | "">("");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [orderIndex, setOrderIndex] = useState<number | "">("");

	const isSubmitting = createMutation.isPending;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (
			categoryId === "" ||
			!title.trim() ||
			!description.trim() ||
			orderIndex === "" ||
			Number(orderIndex) < 0 ||
			Number(categoryId) < 0
		) {
			return;
		}

		try {
			const request: ServiceRequest = {
				categoryId: Number(categoryId),
				title: title.trim(),
				description: description.trim(),
				orderIndex: Number(orderIndex),
			};
			await createMutation.mutateAsync(request);
			navigate("/service");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/service");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={handleCancel}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Hizmet Oluştur
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							Kataloğunuza yeni bir hizmet ekleyin
						</p>
					</div>
				</div>
			</div>

			{/* Form Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<Briefcase className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">Hizmet Bilgileri</CardTitle>
							<CardDescription>
								Yeni bir hizmet oluşturmak için detayları doldurun
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Category ID */}
						<div className="space-y-2">
							<Label htmlFor="categoryId">Kategori ID *</Label>
							<Input
								id="categoryId"
								type="number"
								min="0"
								placeholder="Örn: 1"
								value={categoryId}
								onChange={(e) => {
									const value = e.target.value;
									setCategoryId(value === "" ? "" : Number(value));
								}}
								required
								disabled={isSubmitting}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Bu hizmet için kategori ID'sini girin
							</p>
						</div>

						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="title">Başlık *</Label>
							<Input
								id="title"
								placeholder="Örn: Web Geliştirme"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								disabled={isSubmitting}
								className="h-11"
							/>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Açıklama *</Label>
							<Textarea
								id="description"
								placeholder="Detaylı bir açıklama girin..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
								disabled={isSubmitting}
								rows={6}
								className="resize-none"
							/>
						</div>

						{/* Order Index */}
						<div className="space-y-2">
							<Label htmlFor="orderIndex">Sıra *</Label>
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
								required
								disabled={isSubmitting}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Düşük sayılar listede daha önce görünür
							</p>
						</div>

						{/* Form Actions */}
						<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={isSubmitting}
								className="w-full sm:w-auto"
							>
								İptal
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 w-full sm:w-auto"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										<span className="hidden sm:inline">Oluşturuluyor...</span>
										<span className="sm:hidden">Yükleniyor...</span>
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										<span className="hidden sm:inline">Hizmet Oluştur</span>
										<span className="sm:hidden">Oluştur</span>
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

