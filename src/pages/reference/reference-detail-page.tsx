import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetReferenceById } from "@/hooks/use-references";
import { normalizeImageUrl } from "@/utils/image-url";
import { ArrowLeft, Briefcase, Pencil, Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ReferenceDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetReferenceById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Failed to load reference data");
			navigate("/reference");
		}
	}, [error, navigate]);

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
									<Skeleton className="h-8 w-40" />
									<Skeleton className="h-4 w-48" />
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
							{Array.from({ length: 5 }).map((_, index) => (
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
						<p className="text-lg font-semibold text-foreground">Referans bulunamadı</p>
						<p className="text-sm text-muted-foreground">
							Aradığınız referans mevcut değil veya kaldırılmış.
						</p>
						<Button
							onClick={() => navigate("/reference")}
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
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
			<div className="max-w-3xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => navigate("/reference")}
							className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
								<Briefcase className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
									Referans Detayları
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Referans bilgilerini görüntüle (ID: {id})
								</p>
							</div>
						</div>
					</div>
					<Button
						onClick={() => navigate(`/reference/edit/${id}`)}
						className="h-11 px-6 font-medium bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
					>
						<Pencil className="h-4 w-4 mr-2" />
						Düzenle
					</Button>
				</div>

				{/* Detail Card */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					<CardHeader className="pb-6 pt-8 px-8">
						<CardTitle className="text-2xl font-semibold mb-2">
							Referans Bilgileri
						</CardTitle>
						<CardDescription className="text-base">
							Bu referans hakkında detaylı bilgi
						</CardDescription>
					</CardHeader>
					<CardContent className="px-8 pb-8 space-y-8">
						{/* Logo */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Logo</span>
							</Label>
							{normalizeImageUrl(data.logoUrl) ? (
								<div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-border/50 bg-white flex items-center justify-center p-4">
									<img
										src={normalizeImageUrl(data.logoUrl)}
										alt={data.name}
										className="max-h-48 max-w-full object-contain"
									/>
								</div>
							) : (
								<div className="flex items-center justify-center h-40 rounded-lg border border-border/50 bg-muted/50">
									<div className="text-center space-y-2">
										<Briefcase className="h-12 w-12 text-muted-foreground mx-auto" />
										<p className="text-sm text-muted-foreground">Logo mevcut değil</p>
									</div>
								</div>
							)}
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Name */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>İsim</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-lg font-semibold text-foreground">
									{data.name}
								</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Description */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Açıklama</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-base text-foreground whitespace-pre-line">
									{data.description}
								</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Website URL */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Web Sitesi URL</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								{data.websiteUrl ? (
									<a
										href={data.websiteUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-primary hover:underline"
									>
										<span>{data.websiteUrl}</span>
										<ExternalLink className="h-4 w-4" />
									</a>
								) : (
									<p className="text-base text-muted-foreground">-</p>
								)}
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Order Index */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<span>Sıra</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-lg font-semibold text-foreground">
									{data.orderIndex}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

