import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateServiceStats, useGetServiceStatsById } from "@/hooks/use-service-stats";
import { ArrowLeft, Save, Sparkles, TrendingUp, Check, Info } from "lucide-react";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function ServiceStatsEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateServiceStats();
	const { data, isLoading, error } = useGetServiceStatsById(Number(id));

	const [icon, setIcon] = useState<string>("BarChart3");
	const [title, setTitle] = useState("");
	const [numberValue, setNumberValue] = useState<number | "">("");

// Popular Lucide icons for service stats
const popularIcons = [
	"BarChart3",
	"TrendingUp",
	"Users",
	"Award",
	"Star",
	"Target",
	"Zap",
	"Rocket",
	"ThumbsUp",
	"CheckCircle",
	"Heart",
	"Smile",
	"Trophy",
	"Gift",
	"Shield",
	"Globe",
	"Building",
	"Briefcase",
	"Mail",
	"Phone",
	"MessageSquare",
	"Clock",
	"Calendar",
	"Folder",
	"FileText",
] as const;

	// Helper function to extract icon name from URL
	const extractIconNameFromUrl = (iconValue: string | null | undefined): string => {
		if (!iconValue) {
			return "BarChart3";
		}

		// If it's a URL, extract icon name from it
		if (iconValue.includes("http://") || iconValue.includes("https://")) {
			// URL format: https://localhost:8080/uploads/uuid IconName
			const parts = iconValue.trim().split(/\s+/);
			if (parts.length > 1) {
				// Last part should be the icon name
				const iconName = parts[parts.length - 1];
				if (iconName && /^[A-Z][a-zA-Z0-9]*$/.test(iconName)) {
					return iconName;
				}
			}
			return "BarChart3";
		}

		// If it's already a clean icon name, return it
		return iconValue.trim();
	};

	useEffect(() => {
		if (data) {
			setIcon(extractIconNameFromUrl(data.iconName) || "BarChart3");
			setTitle(data.title || "");
			setNumberValue(data.numberValue || "");
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load service stat data");
			navigate("/service-stats");
		}
	}, [error, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !icon || !title || numberValue === "" || numberValue < 0) {
			return;
		}

		try {
			await updateMutation.mutateAsync({
				id: Number(id),
				request: {
					icon,
					title,
					numberValue: Number(numberValue),
				},
			});
			navigate("/service-stats");
		} catch (error) {
			// Error handled by mutation
		}
	};

	// Icon render helper
	const renderIcon = (iconName: string) => {
		try {
			const IconComponent = (LucideIcons as any)[iconName];
			if (IconComponent) {
				return <IconComponent className="h-5 w-5" />;
			}
		} catch (error) {
			// Icon not found
		}
		return null;
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

	const isFormValid = icon && title.trim() && numberValue !== "" && numberValue >= 0;
	const isSubmitting = updateMutation.isPending;

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
									Hizmet İstatistiği Düzenle
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Hizmet istatistiğini güncelle (ID: {id})
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
										Bu hizmet istatistiğini değiştirmek için aşağıdaki bilgileri güncelleyin
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						
						<CardContent className="space-y-8 px-8 pb-8">
							{/* Icon Selection */}
							<div className="space-y-3">
								<Label htmlFor="icon" className="text-base font-medium flex items-center gap-2">
									<span>İkon</span>
									<span className="text-destructive">*</span>
								</Label>
								<Select value={icon} onValueChange={setIcon}>
									<SelectTrigger 
										id="icon" 
										className="h-12 border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
									>
										<div className="flex items-center gap-3 w-full">
											{renderIcon(icon) && (
												<div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-sm">
													{renderIcon(icon)}
												</div>
											)}
											<SelectValue placeholder="Bir ikon seçin" className="text-base" />
										</div>
									</SelectTrigger>
									<SelectContent className="max-h-[300px]">
										{popularIcons.map((iconName) => {
											const IconComponent = (LucideIcons as any)[iconName];
											return (
												<SelectItem 
													key={iconName} 
													value={iconName}
													className="cursor-pointer hover:bg-muted/80 transition-colors"
												>
													<div className="flex items-center gap-3 py-1">
														{IconComponent && (
															<div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 text-primary">
																<IconComponent className="h-4 w-4" />
															</div>
														)}
														<span className="font-medium">{iconName}</span>
													</div>
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
								<p className="text-sm text-muted-foreground flex items-center gap-1.5">
									<span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
									Bu istatistiği temsil etmek için bir ikon seçin
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
						</CardContent>
						
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
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
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}

