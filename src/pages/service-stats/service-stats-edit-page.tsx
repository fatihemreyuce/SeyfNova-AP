import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateServiceStats, useGetServiceStatsById } from "@/hooks/use-service-stats";
import { ArrowLeft, Sparkles, TrendingUp, Check, Info, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

// Local geliştirmede backend yanlışlıkla https döndürse bile http'ye çevir
const normalizeImageUrl = (url: string | null | undefined): string | null => {
	if (!url) return null;
	return url.replace(/^https:\/\/localhost:8080/i, "http://localhost:8080");
};

export default function ServiceStatsEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateServiceStats();
	const { data, isLoading, error } = useGetServiceStatsById(Number(id));

	const [iconFile, setIconFile] = useState<File | null>(null);
	const [iconPreview, setIconPreview] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [numberValue, setNumberValue] = useState<number | "">("");
	const [existingIconUrl, setExistingIconUrl] = useState<string | null>(null);

	useEffect(() => {
		if (data) {
			setExistingIconUrl(normalizeImageUrl(data.iconName || null));
			setTitle(data.title || "");
			setNumberValue(data.numberValue || "");
		}
	}, [data]);

	// Yeni dosya seçildiğinde önizleme URL'sini yönet
	useEffect(() => {
		if (!iconFile) {
			setIconPreview(null);
			return;
		}

		const objectUrl = URL.createObjectURL(iconFile);
		setIconPreview(objectUrl);

		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [iconFile]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load service stat data");
			navigate("/service-stats");
		}
	}, [error, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !title || numberValue === "" || numberValue < 0) {
			return;
		}

		try {
			await updateMutation.mutateAsync({
				id: Number(id),
				request: {
					// Yeni bir görsel seçildiyse gönder, aksi halde backend mevcut görseli korusun
					icon: iconFile ?? undefined,
					title,
					numberValue: Number(numberValue),
				},
			});
			navigate("/service-stats");
		} catch (error) {
			// Error handled by mutation
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

	if (!data) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
				<Card className="max-w-md border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
					<CardContent className="pt-6 text-center space-y-4">
						<div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
							<Info className="h-8 w-8 text-destructive" />
						</div>
						<p className="text-lg font-semibold text-foreground">Hizmet istatistiği bulunamadı</p>
						<p className="text-sm text-muted-foreground">Aradığınız hizmet istatistiği mevcut değil veya kaldırılmış.</p>
						<Button 
							onClick={() => navigate("/service-stats")} 
							className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Geri Dön
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isFormValid = title.trim() && numberValue !== "" && numberValue >= 0;
	const isSubmitting = updateMutation.isPending;

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-10 px-4">
			<div className="space-y-10">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/service-stats")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
								<Sparkles className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
									Hizmet İstatistiği Düzenle
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Hizmet istatistiğini güncelle (ID: {id})
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Form – tüm genişliği kullanan panel */}
				<form
					onSubmit={handleSubmit}
					className="rounded-2xl border border-border/50 bg-card/40 shadow-xl shadow-primary/10 backdrop-blur-sm px-6 lg:px-10 pt-10 pb-8 space-y-10"
				>
					{/* Form Header */}
					<div className="flex items-start gap-4">
						<div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
							<TrendingUp className="h-6 w-6 text-primary" />
						</div>
						<div className="flex-1">
							<h2 className="text-2xl font-semibold mb-2">Hizmet İstatistiği Detayları</h2>
							<p className="text-base text-muted-foreground">
								Bu hizmet istatistiğini değiştirmek için aşağıdaki bilgileri güncelleyin
							</p>
						</div>
					</div>

					{/* Form Fields */}
					<div className="space-y-10">
							{/* Image Upload */}
							<div className="space-y-3">
								<Label htmlFor="icon" className="text-base font-medium flex items-center gap-2">
									<span>Görsel</span>
								</Label>
								<div className="space-y-4">
									<div className="flex flex-col sm:flex-row gap-4 sm:items-center">
										<div className="flex items-center justify-center h-20 w-20 rounded-xl bg-muted/50 border border-dashed border-border/70 overflow-hidden">
											{iconPreview ? (
												<img
													src={iconPreview}
													alt="Seçilen görsel önizlemesi"
													className="h-full w-full object-contain rounded-lg"
												/>
											) : existingIconUrl ? (
												<img
													src={existingIconUrl}
													alt={title || "Mevcut görsel"}
													className="h-full w-full object-contain rounded-lg"
												/>
											) : (
												<ImageIcon className="h-8 w-8 text-muted-foreground" />
											)}
										</div>
										<div className="flex-1 space-y-2">
											<Input
												id="icon"
												type="file"
												accept="image/*"
												onChange={(e) => {
													const file = e.target.files?.[0] || null;
													setIconFile(file);
												}}
												disabled={isSubmitting}
												className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/15"
											/>
											<p className="text-xs text-muted-foreground">
												İsterseniz yeni bir görsel yükleyerek mevcut görseli güncelleyebilirsiniz.
											</p>
										</div>
									</div>
								</div>
								<p className="text-sm text-muted-foreground flex items-center gap-1.5">
									<span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
									Bu istatistiği temsil etmek için bir görsel kullanılır
								</p>
							</div>

							{/* Divider */}
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

							{/* Title */}
							<div className="space-y-3">
								<Label htmlFor="title" className="text-base font-medium flex items-center gap-2">
									<span>Başlık</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="title"
									placeholder="Örn: Mutlu Müşteriler"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									required
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Divider */}
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

							{/* Number Value */}
							<div className="space-y-3">
								<Label htmlFor="numberValue" className="text-base font-medium flex items-center gap-2">
									<span>Sayısal Değer</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="numberValue"
									type="number"
									placeholder="Örn: 1000"
									value={numberValue}
									onChange={(e) => {
										const value = e.target.value;
										setNumberValue(value === "" ? "" : Number(value));
									}}
									min="0"
									required
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
								<p className="text-sm text-muted-foreground flex items-center gap-1.5">
									<span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
									Pozitif bir sayı girin
								</p>
							</div>
						</div>

					{/* Actions */}
					<div className="flex items-center justify-end gap-4 border-t border-border/50 pt-6">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/service-stats")}
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
									<Check className="h-4 w-4 mr-2" />
									Hizmet İstatistiğini Güncelle
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

