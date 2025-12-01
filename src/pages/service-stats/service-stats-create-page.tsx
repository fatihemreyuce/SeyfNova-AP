import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateServiceStats } from "@/hooks/use-service-stats";
import { ArrowLeft, Loader2, Check, Sparkles, TrendingUp, Image as ImageIcon } from "lucide-react";

export default function ServiceStatsCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreateServiceStats();

	const [iconFile, setIconFile] = useState<File | null>(null);
	const [iconPreview, setIconPreview] = useState<string | null>(null);
	const [title, setTitle] = useState("");
	const [numberValue, setNumberValue] = useState<number | "">("");

	// Seçilen dosya değiştiğinde önizleme URL'sini yönet
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!iconFile || !title || numberValue === "" || numberValue < 0) {
			return;
		}

		try {
			await createMutation.mutateAsync({
				icon: iconFile,
				title,
				numberValue: Number(numberValue),
			});
			navigate("/service-stats");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const isFormValid = iconFile && title.trim() && numberValue !== "" && numberValue >= 0;
	const isLoading = createMutation.isPending;

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
			<div className="max-w-3xl mx-auto space-y-8">
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
									Hizmet İstatistiği Oluştur
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Başarılarınızı sergilemek için yeni bir hizmet istatistiği ekleyin
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Form */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					{/* Decorative gradient bar */}
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					
					<form onSubmit={handleSubmit}>
						<CardHeader className="pb-6 pt-8 px-8">
							<div className="flex items-start gap-4">
								<div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
									<TrendingUp className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-2xl font-semibold mb-2">
										Hizmet İstatistiği Detayları
									</CardTitle>
									<CardDescription className="text-base">
										Yeni bir hizmet istatistiği oluşturmak için aşağıdaki bilgileri doldurun
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						
						<CardContent className="space-y-8 px-8 pb-8">
							{/* Image Upload */}
							<div className="space-y-3">
								<Label htmlFor="icon" className="text-base font-medium flex items-center gap-2">
									<span>Görsel</span>
									<span className="text-destructive">*</span>
								</Label>
								<div className="space-y-4">
									<div className="flex flex-col sm:flex-row gap-4 sm:items-center">
										<div className="flex items-center justify-center h-20 w-20 rounded-xl bg-muted/50 border border-dashed border-border/70">
											{iconPreview ? (
												<img
													src={iconPreview}
													alt="Seçilen görsel önizlemesi"
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
												required
												disabled={isLoading}
												className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/15"
											/>
											<p className="text-xs text-muted-foreground">
												PNG, JPG veya WEBP formatında, tercihen kare boyutlarda bir görsel yükleyin.
											</p>
										</div>
									</div>
								</div>
								<p className="text-sm text-muted-foreground flex items-center gap-1.5">
									<span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
									Bu istatistiği temsil etmek için bir görsel yükleyin
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
									disabled={isLoading}
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
									disabled={isLoading}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
								<p className="text-sm text-muted-foreground flex items-center gap-1.5">
									<span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
									Pozitif bir sayı girin
								</p>
							</div>
						</CardContent>
						
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/service-stats")}
								disabled={isLoading}
								className="h-11 px-6 font-medium border-2 hover:bg-muted/80 transition-all duration-200"
							>
								İptal
							</Button>
							<Button
								type="submit"
								disabled={!isFormValid || isLoading}
								className="h-11 px-8 font-medium bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
							>
								{isLoading ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Oluşturuluyor...
									</>
								) : (
									<>
										<Check className="h-4 w-4 mr-2" />
										Hizmet İstatistiği Oluştur
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

