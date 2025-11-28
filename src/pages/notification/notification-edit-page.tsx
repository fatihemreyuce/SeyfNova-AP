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
import { useUpdateNotification, useGetNotificationById } from "@/hooks/use-notifications";
import type { NotificationRequest } from "@/types/notifications.types";
import { ArrowLeft, Bell, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NotificationEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateNotification();
	const { data, isLoading, error } = useGetNotificationById(id || "");

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	useEffect(() => {
		if (data) {
			setTitle(data.title || "");
			setContent(data.content || "");
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Bildirim verileri yüklenirken hata oluştu");
			navigate("/notification");
		}
	}, [error, navigate]);

	const isSubmitting = updateMutation.isPending;
	const isFormValid = title.trim() !== "" && content.trim() !== "";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !isFormValid) return;

		try {
			const request: NotificationRequest = {
				title: title.trim(),
				content: content.trim(),
			};
			await updateMutation.mutateAsync({
				id,
				request,
			});
			navigate("/notification");
		} catch {
			// handled in mutation
		}
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
							{Array.from({ length: 2 }).map((_, index) => (
								<div key={index} className="space-y-3">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
							<div className="space-y-3">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-32 w-full rounded-xl" />
							</div>
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
			<div className="max-w-3xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/notification")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1 flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
							<Bell className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
								Bildirimi Düzenle
							</h1>
							<p className="text-sm sm:text-base text-muted-foreground mt-1.5">
								Bildirim bilgilerini güncelle (ID: {id})
							</p>
						</div>
					</div>
				</div>

				{/* Form */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					<form onSubmit={handleSubmit}>
						<CardHeader className="pb-6 pt-8 px-4 sm:px-8">
							<CardTitle className="text-xl sm:text-2xl font-semibold mb-2">
								Bildirim Detayları
							</CardTitle>
							<CardDescription className="text-sm sm:text-base">
								Bu bildirimi değiştirmek için aşağıdaki alanları güncelleyin
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-8 px-4 sm:px-8 pb-8">
							{/* Title */}
							<div className="space-y-3">
								<Label
									htmlFor="title"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Başlık</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="title"
									placeholder="örn., Önemli Duyuru"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Content */}
							<div className="space-y-3">
								<Label
									htmlFor="content"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>İçerik</span>
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="content"
									placeholder="Bildirim içeriğini girin..."
									value={content}
									onChange={(e) => setContent(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[200px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-4 px-4 sm:px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/notification")}
								disabled={isSubmitting}
								className="h-11 px-6 font-medium border-2 hover:bg-muted/80 transition-all duration-200 w-full sm:w-auto"
							>
								İptal
							</Button>
							<Button
								type="submit"
								disabled={!isFormValid || isSubmitting}
								className="h-11 px-6 sm:px-8 font-medium bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Güncelleniyor...
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										<span className="hidden sm:inline">Bildirimi Güncelle</span>
										<span className="sm:hidden">Güncelle</span>
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

