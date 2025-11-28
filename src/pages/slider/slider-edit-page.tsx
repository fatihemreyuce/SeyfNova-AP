import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateSlider, useGetSliderById } from "@/hooks/use-sliders";
import { normalizeImageUrl } from "@/utils/image-url";
import type { SliderRequest } from "@/types/sliders.types";
import { ArrowLeft, Save, Image as ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function SliderEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateSlider();
	const { data, isLoading, error } = useGetSliderById(Number(id));

	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [orderIndex, setOrderIndex] = useState<number | "">("");

	useEffect(() => {
		if (data) {
			setTitle(data.title || "");
			setDescription(data.description || "");
			setOrderIndex(data.orderIndex || "");
			if (data.imageUrl) {
				setImagePreview(normalizeImageUrl(data.imageUrl) ?? null);
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load slider data");
			navigate("/slider");
		}
	}, [error, navigate]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setImage(null);
		if (data?.imageUrl) {
			setImagePreview(normalizeImageUrl(data.imageUrl) ?? null);
		} else {
			setImagePreview(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!id ||
			!title.trim() ||
			!description.trim() ||
			orderIndex === "" ||
			Number(orderIndex) < 0
		) {
			return;
		}

		try {
			const request: SliderRequest = {
				image: image || (data?.imageUrl || ""),
				title: title.trim(),
				description: description.trim(),
				orderIndex: Number(orderIndex),
			};
			await updateMutation.mutateAsync({
				id: Number(id),
				request,
			});
			navigate("/slider");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/slider");
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<Skeleton className="h-9 w-9 rounded" />
					<div className="space-y-2">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-4 w-64" />
					</div>
				</div>
				<Card className="shadow-lg border-border/50">
					<CardHeader className="border-b border-border/50">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-64" />
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-6 space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-64 w-full rounded-lg" />
						</div>
						{Array.from({ length: 3 }).map((_, index) => (
							<div key={index} className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						))}
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-32 w-full" />
						</div>
						<div className="flex items-center justify-end gap-3 pt-4 border-t">
							<Skeleton className="h-10 w-20" />
							<Skeleton className="h-10 w-24" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
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
					<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
						Slider Düzenle
					</h1>
					<p className="text-muted-foreground mt-1">
						Slider bilgilerini güncelle
					</p>
				</div>
			</div>

			{/* Form Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<ImageIcon className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">Slider Bilgileri</CardTitle>
							<CardDescription>
								Bu sliderin detaylarını güncelleyin
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Image Upload */}
						<div className="space-y-2">
							<Label htmlFor="image">Image {!imagePreview && "*"}</Label>
							{!imagePreview ? (
								<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
									<input
										type="file"
										id="image"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
										disabled={updateMutation.isPending}
									/>
									<label
										htmlFor="image"
										className="cursor-pointer flex flex-col items-center gap-3"
									>
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
											<Upload className="h-6 w-6 text-primary" />
										</div>
										<div>
											<p className="text-sm font-medium">Resim yüklemek için tıklayın</p>
											<p className="text-xs text-muted-foreground mt-1">
												PNG, JPG, GIF, 10MB'a kadar
											</p>
										</div>
									</label>
								</div>
							) : (
								<div className="relative">
									<div className="relative w-full h-64 rounded-lg overflow-hidden border border-border/50">
										<img
											src={imagePreview}
											alt="Önizleme"
											className="w-full h-full object-cover"
										/>
										<Button
											type="button"
											variant="destructive"
											size="icon"
											onClick={handleRemoveImage}
											className="absolute top-2 right-2 h-8 w-8"
											disabled={updateMutation.isPending}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
									<input
										type="file"
										id="image"
										accept="image/*"
										onChange={handleImageChange}
										className="hidden"
										disabled={updateMutation.isPending}
									/>
									<Button
										type="button"
										variant="outline"
										onClick={() => document.getElementById("image")?.click()}
										className="mt-2 w-full"
										disabled={updateMutation.isPending}
									>
										<Upload className="h-4 w-4 mr-2" />
										Resmi Değiştir
									</Button>
								</div>
							)}
						</div>

						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="title">Başlık *</Label>
							<Input
								id="title"
								placeholder="Örn: Hizmetimize Hoş Geldiniz"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								disabled={updateMutation.isPending}
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
								disabled={updateMutation.isPending}
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
								disabled={updateMutation.isPending}
								className="h-11"
							/>
							<p className="text-xs text-muted-foreground">
								Düşük sayılar listede daha önce görünür
							</p>
						</div>

						{/* Form Actions */}
						<div className="flex items-center justify-end gap-3 pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={updateMutation.isPending}
							>
								İptal
							</Button>
							<Button
								type="submit"
								disabled={updateMutation.isPending}
								className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								{updateMutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Güncelleniyor...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Sliderı Güncelle
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

