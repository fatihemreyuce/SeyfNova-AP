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
import { useGetSettingsById } from "@/hooks/use-settings";
import { normalizeImageUrl } from "@/utils/image-url";
import { ArrowLeft, Settings, Loader2, Pencil, Image as ImageIcon, Mail, Phone, MapPin, Instagram, Linkedin, FileText, Cookie, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SettingsDetailPage() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, error } = useGetSettingsById(Number(id));

	useEffect(() => {
		if (error) {
			toast.error("Ayar verileri yüklenirken hata oluştu");
			navigate("/settings");
		}
	}, [error, navigate]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
					<p className="text-muted-foreground text-lg">Ayar detayları yükleniyor...</p>
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
							<Settings className="h-8 w-8 text-destructive" />
						</div>
						<p className="text-lg font-semibold text-foreground">Ayar bulunamadı</p>
						<p className="text-sm text-muted-foreground">
							Aradığınız ayar mevcut değil veya kaldırılmış.
						</p>
						<Button
							onClick={() => navigate("/settings")}
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
			<div className="max-w-4xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => navigate("/settings")}
							className="h-10 w-10 rounded-full hover:bg-muted/80 transition-all duration-200 hover:scale-105"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
								<Settings className="h-6 w-6 text-primary" />
							</div>
							<div>
								<h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
									Ayar Detayları
								</h1>
								<p className="text-muted-foreground mt-1.5 text-base">
									Site ayarlarını görüntüle (ID: {id})
								</p>
							</div>
						</div>
					</div>
					<Button
						onClick={() => navigate(`/settings/edit/${id}`)}
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
							Site Ayarları
						</CardTitle>
						<CardDescription className="text-base">
							Site ayarları hakkında detaylı bilgi
						</CardDescription>
					</CardHeader>
					<CardContent className="px-8 pb-8 space-y-8">
						{/* Site Logo */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<ImageIcon className="h-4 w-4" />
								<span>Site Logosu</span>
							</Label>
							{normalizeImageUrl(data.siteLogoUrl) ? (
								<div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
									<div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border/50 bg-white p-2">
										<img
											src={normalizeImageUrl(data.siteLogoUrl)}
											alt="Site Logo"
											className="w-full h-full object-contain"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium">Site Logosu</p>
										<p className="text-xs text-muted-foreground">Mevcut site logosu</p>
									</div>
								</div>
							) : (
								<div className="flex items-center justify-center h-32 rounded-lg border border-border/50 bg-muted/50">
									<div className="text-center space-y-2">
										<ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
										<p className="text-sm text-muted-foreground">Logo mevcut değil</p>
									</div>
								</div>
							)}
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Contact Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Phone Number */}
							<div className="space-y-3">
								<Label className="text-base font-medium flex items-center gap-2">
									<Phone className="h-4 w-4" />
									<span>Telefon Numarası</span>
								</Label>
								<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
									<p className="text-lg font-semibold text-foreground">
										{data.phoneNumber || "Yok"}
									</p>
								</div>
							</div>

							{/* Email */}
							<div className="space-y-3">
								<Label className="text-base font-medium flex items-center gap-2">
									<Mail className="h-4 w-4" />
									<span>E-posta</span>
								</Label>
								<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
									<p className="text-lg font-semibold text-foreground">
										{data.email || "Yok"}
									</p>
								</div>
							</div>
						</div>

						{/* Address */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								<span>Adres</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-base text-foreground whitespace-pre-line">
									{data.address || "Yok"}
								</p>
							</div>
						</div>

						{/* Social Media */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Instagram URL */}
							<div className="space-y-3">
								<Label className="text-base font-medium flex items-center gap-2">
									<Instagram className="h-4 w-4" />
									<span>Instagram Bağlantısı</span>
								</Label>
								<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
									{data.instagramUrl ? (
										<a
											href={data.instagramUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline break-all"
										>
											{data.instagramUrl}
										</a>
									) : (
										<p className="text-base text-muted-foreground">Yok</p>
									)}
								</div>
							</div>

							{/* LinkedIn URL */}
							<div className="space-y-3">
								<Label className="text-base font-medium flex items-center gap-2">
									<Linkedin className="h-4 w-4" />
									<span>LinkedIn Bağlantısı</span>
								</Label>
								<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
									{data.linkedinUrl ? (
										<a
											href={data.linkedinUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline break-all"
										>
											{data.linkedinUrl}
										</a>
									) : (
										<p className="text-base text-muted-foreground">Yok</p>
									)}
								</div>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Privacy Text */}
						{data.pvivacyText && (
							<>
								<div className="space-y-3">
									<Label className="text-base font-medium flex items-center gap-2">
										<FileText className="h-4 w-4" />
										<span>Gizlilik Metni</span>
									</Label>
									<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
										<p className="text-base text-foreground whitespace-pre-line">
											{data.pvivacyText}
										</p>
									</div>
								</div>
								<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
							</>
						)}

						{/* Privacy Policy */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<Shield className="h-4 w-4" />
								<span>Gizlilik Politikası</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-base text-foreground whitespace-pre-line">
									{data.privacyPolicy || "Yok"}
								</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Contact Form Text */}
						{data.contactFromText && (
							<>
								<div className="space-y-3">
									<Label className="text-base font-medium flex items-center gap-2">
										<FileText className="h-4 w-4" />
										<span>İletişim Formu Metni</span>
									</Label>
									<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
										<p className="text-base text-foreground whitespace-pre-line">
											{data.contactFromText}
										</p>
									</div>
								</div>
								<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
							</>
						)}

						{/* Cookie Policy */}
						<div className="space-y-3">
							<Label className="text-base font-medium flex items-center gap-2">
								<Cookie className="h-4 w-4" />
								<span>Çerez Politikası</span>
							</Label>
							<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
								<p className="text-base text-foreground whitespace-pre-line">
									{data.cookiePolicy || "Yok"}
								</p>
							</div>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

						{/* Metadata */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<Label className="text-base font-medium">Oluşturulma Tarihi</Label>
								<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
									<p className="text-sm text-foreground">
										{data.createdAt ? new Date(data.createdAt).toLocaleString("tr-TR") : "Yok"}
									</p>
								</div>
							</div>
							<div className="space-y-3">
								<Label className="text-base font-medium">Güncellenme Tarihi</Label>
								<div className="p-4 rounded-xl bg-muted/50 border border-border/50">
									<p className="text-sm text-foreground">
										{data.updatedAt ? new Date(data.updatedAt).toLocaleString("tr-TR") : "Yok"}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

