import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetServiceStatsById } from "@/hooks/use-service-stats";
import { ArrowLeft, Pencil, Sparkles, Info, TrendingUp, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

// Local geliştirmede backend yanlışlıkla https döndürse bile http'ye çevir
const normalizeImageUrl = (url: string | null | undefined): string | null => {
	if (!url) return null;
	// https://localhost:8080 -> http://localhost:8080
	return url.replace(/^https:\/\/localhost:8080/i, "http://localhost:8080");
};

export default function ServiceStatsDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetServiceStatsById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Failed to load service stat data");
			navigate("/service-stats");
		}
	}, [error, navigate]);

	const imageUrl = normalizeImageUrl(data?.iconName || null);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
				<div className="max-w-3xl mx-auto space-y-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="flex items-center gap-3">
								<Skeleton className="h-12 w-12 rounded-lg" />
								<div className="space-y-2">
									<Skeleton className="h-8 w-48" />
									<Skeleton className="h-4 w-56" />
								</div>
							</div>
						</div>
						<Skeleton className="h-11 w-24" />
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
									<Skeleton className="h-24 w-full rounded-xl" />
								</div>
							))}
						</CardContent>
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-10 px-4">
			<div className="space-y-10">
				{/* Header */}
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => navigate("/service-stats")}
							className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
								<Sparkles className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
									Hizmet İstatistiği Detayları
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Hizmet istatistiği bilgilerini görüntüle (ID: {id})
								</p>
							</div>
						</div>
					</div>
					<Button
						onClick={() => navigate(`/service-stats/edit/${id}`)}
						className="h-11 px-6 font-medium bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
					>
						<Pencil className="h-4 w-4 mr-2" />
						Düzenle
					</Button>
				</div>

				{/* Details – tüm genişliği kullanan panel */}
				<section className="rounded-2xl border border-border/50 bg-card/40 shadow-xl shadow-primary/10 backdrop-blur-sm px-6 lg:px-10 pt-10 pb-8 space-y-10">
					{/* Header */}
					<div className="flex items-start gap-4">
						<div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
							<TrendingUp className="h-6 w-6 text-primary" />
						</div>
						<div className="flex-1">
							<h2 className="text-2xl font-semibold mb-2">Hizmet İstatistiği Bilgileri</h2>
							<p className="text-base text-muted-foreground">Bu hizmet istatistiği hakkında detaylı bilgi</p>
						</div>
					</div>

					{/* Content */}
					<div className="space-y-10">
						{/* Image */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Görsel</span>
							</Label>
							<div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
								{imageUrl ? (
									<div className="flex items-center justify-center h-20 w-20 rounded-xl bg-background overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
										<img
											src={imageUrl}
											alt={data.title}
											className="h-full w-full object-contain"
										/>
									</div>
								) : (
									<div className="flex items-center justify-center h-20 w-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary border-2 border-primary/20 shadow-lg shadow-primary/10">
										<ImageIcon className="h-10 w-10" />
									</div>
								)}
								<div className="flex-1">
									<p className="font-mono text-sm font-semibold text-foreground mb-1">
										Görsel URL
									</p>
									<p className="font-mono text-xs text-muted-foreground bg-background/50 px-3 py-1.5 rounded-md border border-border/50 inline-block">
										{imageUrl || "Görsel bulunamadı"}
									</p>
								</div>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Title */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Başlık</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-lg font-semibold text-foreground">{data.title}</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Number Value */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Sayısal Değer</span>
							</Label>
							<div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg shadow-primary/10">
								<p className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
									{data.numberValue.toLocaleString()}
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

