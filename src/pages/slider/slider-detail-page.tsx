import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSliderById } from "@/hooks/use-sliders";
import { ArrowLeft, Edit, Image as ImageIcon } from "lucide-react";
import { normalizeImageUrl } from "@/utils/image-url";
import { toast } from "sonner";

export default function SliderDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetSliderById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Slider verileri yüklenirken hata oluştu");
			navigate("/slider");
		}
	}, [error, navigate]);

	if (isLoading) {
		return (
			<div className="space-y-6">
				{/* Header Skeleton */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Skeleton className="h-9 w-9 rounded" />
						<div className="space-y-2">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-64" />
						</div>
					</div>
					<Skeleton className="h-10 w-32" />
				</div>

				{/* Card Skeleton */}
				<Card className="shadow-lg border-border/50">
					<CardHeader className="border-b border-border/50">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-32" />
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-6 space-y-6">
						<Skeleton className="h-6 w-16" />
						<Skeleton className="h-64 w-full rounded-lg" />
						{Array.from({ length: 3 }).map((_, index) => (
							<div key={index} className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-6 w-full" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!data) {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/slider")}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Slider Detayları
						</h1>
						<p className="text-muted-foreground mt-1">
							Bu slider hakkında detaylı bilgi görüntüle
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate(`/slider/edit/${id}`)}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
				>
					<Edit className="h-4 w-4 mr-2" />
					Slider Düzenle
				</Button>
			</div>

			{/* Detail Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<ImageIcon className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">{data.title}</CardTitle>
							<CardDescription>
								Slider ID: {data.id}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6 space-y-6">
					{/* ID */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">ID</label>
						<div className="text-base font-semibold">{data.id}</div>
					</div>

					{/* Image */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Resim</label>
						{normalizeImageUrl(data.imageUrl) ? (
							<div className="relative w-full max-w-2xl rounded-lg overflow-hidden border border-border/50">
								<img
									src={normalizeImageUrl(data.imageUrl)}
									alt={data.title}
									className="w-full h-auto object-cover"
								/>
							</div>
						) : (
							<div className="flex items-center justify-center h-48 rounded-lg border border-border/50 bg-muted/50">
								<div className="text-center space-y-2">
									<ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
									<p className="text-sm text-muted-foreground">Resim mevcut değil</p>
								</div>
							</div>
						)}
					</div>

					{/* Title */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Başlık</label>
						<div className="text-base font-semibold">{data.title}</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Açıklama</label>
						<div className="text-base whitespace-pre-wrap bg-muted/50 rounded-lg p-4 border border-border/50">
							{data.description}
						</div>
					</div>

					{/* Order Index */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Sıralama</label>
						<div className="text-base">{data.orderIndex}</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

