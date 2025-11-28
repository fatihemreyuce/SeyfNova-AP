import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetServiceById } from "@/hooks/use-service";
import { ArrowLeft, Edit, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function ServiceDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetServiceById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Failed to load service data");
			navigate("/service");
		}
	}, [error, navigate]);

	if (isLoading) {
		return (
			<div className="space-y-6">
				{/* Header Skeleton */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Skeleton className="h-9 w-9 rounded" />
						<div className="space-y-2">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-64" />
						</div>
					</div>
					<Skeleton className="h-10 w-24" />
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
						{Array.from({ length: 5 }).map((_, index) => (
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
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/service")}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Hizmet Detayları
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							Bu hizmet hakkında detaylı bilgi görüntüle
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate(`/service/edit/${id}`)}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 w-full sm:w-auto"
				>
					<Edit className="h-4 w-4 sm:mr-2" />
					<span className="hidden sm:inline">Hizmeti Düzenle</span>
					<span className="sm:hidden">Düzenle</span>
				</Button>
			</div>

			{/* Detail Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<Briefcase className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">{data.title}</CardTitle>
							<CardDescription>
								Hizmet ID: {data.id}
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

					{/* Category ID */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Kategori ID</label>
						<div className="text-base">{data.categoryId}</div>
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
						<label className="text-sm font-medium text-muted-foreground">Sıra</label>
						<div className="text-base">{data.orderIndex}</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

