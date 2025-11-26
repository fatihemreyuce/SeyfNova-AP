import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetServiceById } from "@/hooks/use-service";
import { ArrowLeft, Edit, Briefcase, Loader2 } from "lucide-react";
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
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
					<p className="text-muted-foreground">Loading service data...</p>
				</div>
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
						onClick={() => navigate("/service")}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Service Details
						</h1>
						<p className="text-muted-foreground mt-1">
							View detailed information about this service
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate(`/service/edit/${id}`)}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
				>
					<Edit className="h-4 w-4 mr-2" />
					Edit Service
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
								Service ID: {data.id}
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
						<label className="text-sm font-medium text-muted-foreground">Category ID</label>
						<div className="text-base">{data.categoryId}</div>
					</div>

					{/* Title */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Title</label>
						<div className="text-base font-semibold">{data.title}</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Description</label>
						<div className="text-base whitespace-pre-wrap bg-muted/50 rounded-lg p-4 border border-border/50">
							{data.description}
						</div>
					</div>

					{/* Order Index */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-muted-foreground">Order Index</label>
						<div className="text-base">{data.orderIndex}</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

