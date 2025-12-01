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
import { useUpdateReference, useGetReferenceById } from "@/hooks/use-references";
import type { ReferenceRequest } from "@/types/references.types";
import { normalizeImageUrl } from "@/utils/image-url";
import { ArrowLeft, Briefcase, Save, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ReferenceEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateReference();
	const { data, isLoading, error } = useGetReferenceById(Number(id));

	const [logo, setLogo] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [websiteUrl, setWebsiteUrl] = useState("");
	const [orderIndex, setOrderIndex] = useState<number | "">("");

	useEffect(() => {
		if (data) {
			setName(data.name || "");
			setDescription(data.description || "");
			setWebsiteUrl(data.websiteUrl || "");
			setOrderIndex(data.orderIndex ?? "");
			if (data.logoUrl) {
				setLogoPreview(normalizeImageUrl(data.logoUrl) ?? null);
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load reference data");
			navigate("/reference");
		}
	}, [error, navigate]);

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setLogo(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveLogo = () => {
		setLogo(null);
		if (data?.logoUrl) {
			setLogoPreview(normalizeImageUrl(data.logoUrl) ?? null);
		} else {
			setLogoPreview(null);
		}
	};

	const isSubmitting = updateMutation.isPending;
	const isFormValid =
		name.trim() !== "" &&
		description.trim() !== "" &&
		websiteUrl.trim() !== "" &&
		orderIndex !== "" &&
		Number(orderIndex) >= 0;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !isFormValid) return;

		try {
			// Only include logo if it's a File (new upload)
			// objectToFormData will skip null/undefined values
			// Backend will keep existing logo if no new file is sent
			const request: ReferenceRequest = {
				logo: logo || (null as any), // null will be skipped by objectToFormData
				name: name.trim(),
				description: description.trim(),
				websiteUrl: websiteUrl.trim(),
				orderIndex: Number(orderIndex),
			};
			await updateMutation.mutateAsync({
				id: Number(id),
				request,
			});
			navigate("/reference");
		} catch {
			// handled in mutation
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
				<div className="space-y-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="flex items-center gap-3">
							<Skeleton className="h-12 w-12 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-8 w-40" />
								<Skeleton className="h-4 w-48" />
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
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-40 w-full max-w-xs rounded-lg" />
							</div>
							{Array.from({ length: 4 }).map((_, index) => (
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
			<div className="space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/reference")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1 flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
							<Briefcase className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
								Referans Düzenle
							</h1>
							<p className="text-muted-foreground mt-1.5 text-base">
								Referans bilgilerini güncelle (ID: {id})
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
								Referans Detayları
							</CardTitle>
							<CardDescription className="text-base">
								Bu referansı değiştirmek için aşağıdaki alanları güncelleyin
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-8 px-8 pb-8">
							{/* Logo Upload */}
							<div className="space-y-3">
								<Label
									htmlFor="logo"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Logo</span>
								</Label>
								{!logoPreview ? (
									<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
										<input
											type="file"
											id="logo"
											accept="image/*"
											onChange={handleLogoChange}
											className="hidden"
											disabled={isSubmitting}
										/>
										<label
											htmlFor="logo"
											className="cursor-pointer flex flex-col items-center gap-3"
										>
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
												<Upload className="h-6 w-6 text-primary" />
											</div>
											<div>
												<p className="text-sm font-medium">Logo yüklemek için tıklayın</p>
												<p className="text-xs text-muted-foreground mt-1">
													PNG, JPG, SVG, 5MB'a kadar
												</p>
											</div>
										</label>
									</div>
								) : (
									<div className="relative">
										<div className="relative w-full h-48 rounded-lg overflow-hidden border border-border/50 bg-muted flex items-center justify-center">
											<img
												src={logoPreview}
												alt="Logo Önizleme"
												className="max-h-full max-w-full object-contain"
											/>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												onClick={handleRemoveLogo}
												className="absolute top-2 right-2 h-8 w-8"
												disabled={isSubmitting}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
										<input
											type="file"
											id="logo"
											accept="image/*"
											onChange={handleLogoChange}
											className="hidden"
											disabled={isSubmitting}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() => document.getElementById("logo")?.click()}
											className="mt-2 w-full"
											disabled={isSubmitting}
										>
											<Upload className="h-4 w-4 mr-2" />
											Logoyu Değiştir
										</Button>
									</div>
								)}
							</div>

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
									placeholder="Örn: Acme Corporation"
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
									placeholder="Referans için bir açıklama verin..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[120px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>

							{/* Website URL */}
							<div className="space-y-3">
								<Label
									htmlFor="websiteUrl"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Web Sitesi URL</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="websiteUrl"
									type="url"
									placeholder="Örn: https://example.com"
									value={websiteUrl}
									onChange={(e) => setWebsiteUrl(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
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
									Düşük sayılar referans listelerinde daha önce görünür
								</p>
							</div>
						</CardContent>
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/reference")}
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
										Referansı Güncelle
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

