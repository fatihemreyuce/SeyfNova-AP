import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateHomePageAbout } from "@/hooks/use-homapage-about";
import type { HomePageAboutRequest } from "@/types/homepage.about.types";
import { ArrowLeft, Save, Sparkles, FileText, Loader2, Check } from "lucide-react";

export default function HomepageAboutCreatePage() {
	const navigate = useNavigate();
	const createMutation = useCreateHomePageAbout();

	const [formData, setFormData] = useState<HomePageAboutRequest>({
		leftTitle: "",
		leftDescription: "",
		rightTitle: "",
		rightDescription: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createMutation.mutateAsync(formData);
			navigate("/homepage-about");
		} catch (error) {
			// Error handled by mutation
		}
	};

	const handleCancel = () => {
		navigate("/homepage-about");
	};

	const isLoading = createMutation.isPending;
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
									Ana Sayfa Hakkında Oluştur
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Bilgilerinizi sergilemek için yeni ana sayfa hakkında içeriği ekleyin
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
										Yeni bir ana sayfa hakkında girişi oluşturmak için aşağıdaki detayları doldurun
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
											disabled={isLoading}
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
											disabled={isLoading}
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
											disabled={isLoading}
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
											disabled={isLoading}
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
										Ana Sayfa Hakkında Oluştur
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

