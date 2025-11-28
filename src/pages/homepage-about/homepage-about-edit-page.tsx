import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateHomePageAbout, useGetHomePageAboutById } from "@/hooks/use-homapage-about";
import type { HomePageAboutRequest } from "@/types/homepage.about.types";
import { ArrowLeft, Save, Sparkles, FileText, Check, Info } from "lucide-react";
import { toast } from "sonner";

export default function HomepageAboutEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateHomePageAbout();
	const { data, isLoading, error } = useGetHomePageAboutById(Number(id));

	const [formData, setFormData] = useState<HomePageAboutRequest>({
		leftTitle: "",
		leftDescription: "",
		rightTitle: "",
		rightDescription: "",
	});

	useEffect(() => {
		if (data) {
			setFormData({
				leftTitle: data.leftTitle || "",
				leftDescription: data.leftDescription || "",
				rightTitle: data.rightTitle || "",
				rightDescription: data.rightDescription || "",
			});
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Failed to load homepage about data");
			navigate("/homepage-about");
		}
	}, [error, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		try {
			await updateMutation.mutateAsync({
				id: Number(id),
				request: formData,
			});
			navigate("/homepage-about");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/homepage-about");
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
				<div className="max-w-5xl mx-auto space-y-8">
					<div className="flex items-center gap-4">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="flex items-center gap-3">
							<Skeleton className="h-12 w-12 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-8 w-56" />
								<Skeleton className="h-4 w-64" />
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
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{Array.from({ length: 4 }).map((_, index) => (
									<div key={index} className="space-y-3">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-24 w-full rounded-xl" />
									</div>
								))}
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

	if (!data) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
				<Card className="max-w-md border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
					<CardContent className="pt-6 text-center space-y-4">
						<div className="p-4 rounded-full bg-destructive/10 w-fit mx-auto">
							<Info className="h-8 w-8 text-destructive" />
						</div>
						<p className="text-lg font-semibold text-foreground">Ana sayfa hakkında bulunamadı</p>
						<p className="text-sm text-muted-foreground">Aradığınız ana sayfa hakkında girişi mevcut değil veya kaldırılmış.</p>
						<Button 
							onClick={handleCancel} 
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

	const isSubmitting = updateMutation.isPending;
	const isFormValid = 
		formData.leftTitle.trim() && 
		formData.leftDescription.trim() && 
		formData.rightTitle.trim() && 
		formData.rightDescription.trim();

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={handleCancel}
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
									Ana Sayfa Hakkında Düzenle
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Ana sayfa hakkında içeriğini güncelle (ID: {id})
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
									<FileText className="h-6 w-6 text-primary" />
								</div>
								<div className="flex-1">
									<CardTitle className="text-2xl font-semibold mb-2">
										Ana Sayfa Hakkında Bilgileri
									</CardTitle>
									<CardDescription className="text-base">
										Bu ana sayfa hakkında girişini değiştirmek için aşağıdaki detayları güncelleyin
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						
						<CardContent className="px-8 pb-8">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{/* Left Side */}
								<div className="space-y-6">
									<div className="pb-4 border-b border-border/50">
										<h3 className="text-lg font-semibold text-foreground/90 mb-1">Sol Bölüm</h3>
										<p className="text-sm text-muted-foreground">Sol taraf için içerik</p>
									</div>
									
									<div className="space-y-3">
										<Label htmlFor="leftTitle" className="text-base font-medium flex items-center gap-2">
											<span>Sol Başlık</span>
											<span className="text-destructive">*</span>
										</Label>
										<Input
											id="leftTitle"
											value={formData.leftTitle}
											onChange={(e) =>
												setFormData({ ...formData, leftTitle: e.target.value })
											}
											placeholder="Sol başlığı girin"
											required
											disabled={isSubmitting}
											className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
										/>
									</div>
									
									<div className="space-y-3">
										<Label htmlFor="leftDescription" className="text-base font-medium flex items-center gap-2">
											<span>Sol Açıklama</span>
											<span className="text-destructive">*</span>
										</Label>
										<Textarea
											id="leftDescription"
											value={formData.leftDescription}
											onChange={(e) =>
												setFormData({
													...formData,
													leftDescription: e.target.value,
												})
											}
											placeholder="Sol açıklamayı girin"
											rows={6}
											required
											disabled={isSubmitting}
											className="resize-none text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
										/>
									</div>
								</div>

								{/* Right Side */}
								<div className="space-y-6">
									<div className="pb-4 border-b border-border/50">
										<h3 className="text-lg font-semibold text-foreground/90 mb-1">Sağ Bölüm</h3>
										<p className="text-sm text-muted-foreground">Sağ taraf için içerik</p>
									</div>
									
									<div className="space-y-3">
										<Label htmlFor="rightTitle" className="text-base font-medium flex items-center gap-2">
											<span>Sağ Başlık</span>
											<span className="text-destructive">*</span>
										</Label>
										<Input
											id="rightTitle"
											value={formData.rightTitle}
											onChange={(e) =>
												setFormData({ ...formData, rightTitle: e.target.value })
											}
											placeholder="Sağ başlığı girin"
											required
											disabled={isSubmitting}
											className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
										/>
									</div>
									
									<div className="space-y-3">
										<Label htmlFor="rightDescription" className="text-base font-medium flex items-center gap-2">
											<span>Sağ Açıklama</span>
											<span className="text-destructive">*</span>
										</Label>
										<Textarea
											id="rightDescription"
											value={formData.rightDescription}
											onChange={(e) =>
												setFormData({
													...formData,
													rightDescription: e.target.value,
												})
											}
											placeholder="Sağ açıklamayı girin"
											rows={6}
											required
											disabled={isSubmitting}
											className="resize-none text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
										/>
									</div>
								</div>
							</div>
						</CardContent>
						
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
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
										Ana Sayfa Hakkında Güncelle
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

