import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateSettings, useGetSettingsById } from "@/hooks/use-settings";
import type { SettingsRequest } from "@/types/settings.types";
import { normalizeImageUrl } from "@/utils/image-url";
import { ArrowLeft, Settings, Save, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsEditPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const updateMutation = useUpdateSettings();
	const { data, isLoading, error } = useGetSettingsById(Number(id));

	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [instagramUrl, setInstagramUrl] = useState("");
	const [linkedinUrl, setLinkedinUrl] = useState("");
	const [address, setAddress] = useState("");
	const [pvivacyText, setPvivacyText] = useState("");
	const [privacyPolicy, setPrivacyPolicy] = useState("");
	const [contactFromText, setContactFromText] = useState("");
	const [cookiePolicy, setCookiePolicy] = useState("");

	useEffect(() => {
		if (data) {
			setPhoneNumber(data.phoneNumber || "");
			setEmail(data.email || "");
			setInstagramUrl(data.instagramUrl || "");
			setLinkedinUrl(data.linkedinUrl || "");
			setAddress(data.address || "");
			setPvivacyText(data.pvivacyText || "");
			setPrivacyPolicy(data.privacyPolicy || "");
			setContactFromText(data.contactFromText || "");
			setCookiePolicy(data.cookiePolicy || "");
			if (data.siteLogoUrl) {
				const url = normalizeImageUrl(data.siteLogoUrl);
				if (url) {
					setImagePreview(url);
				}
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			toast.error("Ayar verileri yüklenirken hata oluştu");
			navigate("/settings");
		}
	}, [error, navigate]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		setImage(null);
		if (data?.siteLogoUrl) {
			const url = normalizeImageUrl(data.siteLogoUrl);
			if (url) {
				setImagePreview(url);
			}
		} else {
			setImagePreview(null);
		}
	};

	const isSubmitting = updateMutation.isPending;
	const isFormValid =
		phoneNumber.trim() !== "" &&
		email.trim() !== "" &&
		address.trim() !== "" &&
		privacyPolicy.trim() !== "" &&
		cookiePolicy.trim() !== "";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !isFormValid) return;

		try {
			const request: SettingsRequest = {
				phoneNumber: phoneNumber.trim(),
				email: email.trim(),
				instagramUrl: instagramUrl.trim(),
				linkedinUrl: linkedinUrl.trim(),
				address: address.trim(),
				pvivacyText: pvivacyText.trim(),
				privacyPolicy: privacyPolicy.trim(),
				contactFromText: contactFromText.trim(),
				cookiePolicy: cookiePolicy.trim(),
				...(image && { siteLogo: image }),
			};
			await updateMutation.mutateAsync({
				id: Number(id),
				request,
			});
			navigate("/settings");
		} catch {
			// handled in mutation
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
				<div className="max-w-4xl mx-auto space-y-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="flex items-center gap-3">
							<Skeleton className="h-12 w-12 rounded-lg" />
							<div className="space-y-2">
								<Skeleton className="h-8 w-32" />
								<Skeleton className="h-4 w-40" />
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
							<div className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-40 w-full max-w-xs rounded-lg" />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								{Array.from({ length: 10 }).map((_, index) => (
									<div key={index} className="space-y-3">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-10 w-full" />
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
			<div className="max-w-4xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/settings")}
						className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div className="flex-1 flex items-center gap-3">
						<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
							<Settings className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
								Ayarı Düzenle
							</h1>
							<p className="text-muted-foreground mt-1.5 text-base">
								Site ayarlarını güncelle (ID: {id})
							</p>
						</div>
					</div>
				</div>

				{/* Form */}
				<Card className="border-2 border-border/60 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
					<div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
					<form onSubmit={handleSubmit}>
						<CardHeader className="pb-6 pt-8 px-8">
							<CardTitle className="text-2xl font-semibold mb-2">
								Ayar Detayları
							</CardTitle>
							<CardDescription className="text-base">
								Site ayarlarını değiştirmek için aşağıdaki alanları güncelleyin
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-8 px-8 pb-8">
							{/* Site Logo */}
							<div className="space-y-3">
								<Label
									htmlFor="siteLogo"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Site Logosu</span>
								</Label>
								{data?.siteLogoUrl && !image && (
									<div className="mb-3 p-4 rounded-lg border border-border/50 bg-muted/30">
										<div className="flex items-center gap-3">
											<div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border/50">
												<img
													src={normalizeImageUrl(data.siteLogoUrl)}
													alt="Current Logo"
													className="w-full h-full object-contain bg-muted/50"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium">Mevcut logo</p>
												<p className="text-xs text-muted-foreground">Değiştirmek için aşağıya tıklayın</p>
											</div>
										</div>
									</div>
								)}
								{!image && !data?.siteLogoUrl ? (
									<div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
										<input
											type="file"
											id="siteLogo"
											accept="image/*"
											onChange={handleImageChange}
											className="hidden"
											disabled={isSubmitting}
										/>
										<label
											htmlFor="siteLogo"
											className="cursor-pointer flex flex-col items-center gap-3"
										>
											<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
												<Upload className="h-6 w-6 text-primary" />
											</div>
											<div>
												<p className="text-sm font-medium">Logo yüklemek için tıklayın</p>
												<p className="text-xs text-muted-foreground mt-1">
													PNG, JPG, GIF en fazla 10MB
												</p>
											</div>
										</label>
									</div>
								) : (
									<div className="relative">
										<div className="relative w-full max-w-xs h-48 rounded-lg overflow-hidden border border-border/50">
											<img
												src={imagePreview || undefined}
												alt="Logo Preview"
												className="w-full h-full object-contain bg-muted/50"
											/>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												onClick={handleRemoveImage}
												className="absolute top-2 right-2 h-8 w-8"
												disabled={isSubmitting}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
										<input
											type="file"
											id="siteLogo"
											accept="image/*"
											onChange={handleImageChange}
											className="hidden"
											disabled={isSubmitting}
										/>
										<Button
											type="button"
											variant="outline"
											onClick={() => document.getElementById("siteLogo")?.click()}
											className="mt-2 w-full max-w-xs"
											disabled={isSubmitting}
										>
											<Upload className="h-4 w-4 mr-2" />
											Logoyu Değiştir
										</Button>
									</div>
								)}
							</div>

							{/* Phone Number */}
							<div className="space-y-3">
								<Label
									htmlFor="phoneNumber"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Telefon Numarası</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="phoneNumber"
									placeholder="e.g., +90 555 123 4567"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Email */}
							<div className="space-y-3">
								<Label
									htmlFor="email"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>E-posta</span>
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="e.g., info@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Instagram URL */}
							<div className="space-y-3">
								<Label
									htmlFor="instagramUrl"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Instagram Bağlantısı</span>
								</Label>
								<Input
									id="instagramUrl"
									type="url"
									placeholder="e.g., https://instagram.com/username"
									value={instagramUrl}
									onChange={(e) => setInstagramUrl(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* LinkedIn URL */}
							<div className="space-y-3">
								<Label
									htmlFor="linkedinUrl"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>LinkedIn Bağlantısı</span>
								</Label>
								<Input
									id="linkedinUrl"
									type="url"
									placeholder="e.g., https://linkedin.com/company/companyname"
									value={linkedinUrl}
									onChange={(e) => setLinkedinUrl(e.target.value)}
									disabled={isSubmitting}
									className="h-12 text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm"
								/>
							</div>

							{/* Address */}
							<div className="space-y-3">
								<Label
									htmlFor="address"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Adres</span>
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="address"
									placeholder="Tam adresi girin..."
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[100px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>

							{/* Privacy Text */}
							<div className="space-y-3">
								<Label
									htmlFor="pvivacyText"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Gizlilik Metni</span>
								</Label>
								<Textarea
									id="pvivacyText"
									placeholder="Gizlilik metnini girin..."
									value={pvivacyText}
									onChange={(e) => setPvivacyText(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[120px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>

							{/* Privacy Policy */}
							<div className="space-y-3">
								<Label
									htmlFor="privacyPolicy"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Gizlilik Politikası</span>
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="privacyPolicy"
									placeholder="Gizlilik politikası içeriğini girin..."
									value={privacyPolicy}
									onChange={(e) => setPrivacyPolicy(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[150px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>

							{/* Contact Form Text */}
							<div className="space-y-3">
								<Label
									htmlFor="contactFromText"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>İletişim Formu Metni</span>
								</Label>
								<Textarea
									id="contactFromText"
									placeholder="İletişim formu metnini girin..."
									value={contactFromText}
									onChange={(e) => setContactFromText(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[120px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>

							{/* Cookie Policy */}
							<div className="space-y-3">
								<Label
									htmlFor="cookiePolicy"
									className="text-base font-medium flex items-center gap-2"
								>
									<span>Çerez Politikası</span>
									<span className="text-destructive">*</span>
								</Label>
								<Textarea
									id="cookiePolicy"
									placeholder="Çerez politikası içeriğini girin..."
									value={cookiePolicy}
									onChange={(e) => setCookiePolicy(e.target.value)}
									disabled={isSubmitting}
									className="min-h-[150px] text-base border-2 transition-all duration-200 hover:border-primary/50 focus:border-primary shadow-sm resize-y"
								/>
							</div>
						</CardContent>
						<CardFooter className="flex items-center justify-end gap-4 px-8 pb-8 pt-6 bg-muted/30 border-t border-border/50">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/settings")}
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
										<Save className="h-4 w-4 mr-2" />
										Ayarı Güncelle
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

