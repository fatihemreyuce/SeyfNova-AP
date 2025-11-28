import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOfficalPage, useDeleteOfficalPage } from "@/hooks/use-official-page";
import { ArrowLeft, Edit, FileText, Loader2, Award, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { normalizeImageUrl } from "@/utils/image-url";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { DeleteModal } from "@/components/ui/delete-modal";

export default function OfficialPageDetailPage() {
	const navigate = useNavigate();
	const { data, isLoading, error } = useOfficalPage();
	const deleteMutation = useDeleteOfficalPage();

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [deletingItemName, setDeletingItemName] = useState<string>("");

	useEffect(() => {
		if (error) {
			toast.error("Resmi sayfa verileri yüklenirken hata oluştu");
		}
	}, [error]);

	const handleDeleteClick = (id: number, name: string) => {
		setDeletingId(id);
		setDeletingItemName(name);
		setIsDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!deletingId) return;
		try {
			await deleteMutation.mutateAsync(deletingId);
			setIsDeleteDialogOpen(false);
			setDeletingId(null);
			setDeletingItemName("");
		} catch (error) {
			// Error handled by mutation
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
					<p className="text-muted-foreground">Resmi sayfa verileri yükleniyor...</p>
				</div>
			</div>
		);
	}

	// API'den Page<OfficalPageResponse> veya direkt OfficalPageResponse dönebilir
	const officialPage = data?.content?.[0] || (data as any);

	if (!officialPage || !officialPage.id) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/")}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Resmi Sayfa
						</h1>
						<p className="text-muted-foreground mt-1">
							Resmi sayfa bilgilerini görüntüle ve düzenle
						</p>
					</div>
				</div>
				<Card className="shadow-lg border-border/50">
					<Empty className="min-h-[400px] border-0">
						<EmptyMedia variant="icon">
							<FileText className="h-12 w-12 text-muted-foreground/50" />
						</EmptyMedia>
						<EmptyHeader>
							<EmptyTitle>Resmi sayfa bulunamadı</EmptyTitle>
							<EmptyDescription>
								Henüz bir resmi sayfa oluşturulmamış. Düzenle sayfasından oluşturabilirsiniz.
							</EmptyDescription>
						</EmptyHeader>
						<Button
							onClick={() => navigate("/official-page/edit")}
							className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
						>
							<Edit className="h-4 w-4 mr-2" />
							Resmi Sayfa Oluştur
						</Button>
					</Empty>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/")}
						className="h-9 w-9"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Resmi Sayfa
						</h1>
						<p className="text-muted-foreground mt-1">
							Resmi sayfa bilgilerini görüntüle ve düzenle
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate("/official-page/edit")}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
				>
					<Edit className="h-4 w-4 mr-2" />
					Düzenle
				</Button>
			</div>

			{/* Description Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<FileText className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">Açıklama</CardTitle>
							<CardDescription>
								Resmi sayfa açıklaması
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="text-base whitespace-pre-wrap bg-muted/50 rounded-lg p-4 border border-border/50">
						{officialPage.description || "Açıklama bulunmuyor"}
					</div>
				</CardContent>
			</Card>

			{/* Documents Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<FileText className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">Dokümanlar</CardTitle>
							<CardDescription>
								Resmi sayfa dokümanları
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					{(() => {
						// API'den documents (çoğul) veya document (tekil) gelebilir
						// Hem Page formatını hem de direkt array formatını destekle
						const documents = Array.isArray(officialPage.documents) 
							? officialPage.documents 
							: Array.isArray(officialPage.document)
							? officialPage.document
							: officialPage.documents?.content || officialPage.document?.content || [];
						
						return documents.length > 0 ? (
						<div className="border rounded-lg">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID</TableHead>
										<TableHead>İsim</TableHead>
										<TableHead>Dosya</TableHead>
										<TableHead className="text-right">İşlemler</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{documents.map((doc: any) => (
										<TableRow key={doc.id}>
											<TableCell className="font-medium">{doc.id}</TableCell>
											<TableCell>{doc.name}</TableCell>
											<TableCell>
												{doc.asset ? (
													<a
														href={normalizeImageUrl(doc.asset) || doc.asset}
														target="_blank"
														rel="noopener noreferrer"
														className="text-primary hover:underline"
													>
														Dosyayı Görüntüle
													</a>
												) : (
													<span className="text-muted-foreground">Dosya yok</span>
												)}
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteClick(doc.id, doc.name)}
													className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
													title="Sil"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<Empty className="min-h-[200px] border-0">
							<EmptyMedia variant="icon">
								<FileText className="h-8 w-8 text-muted-foreground/50" />
							</EmptyMedia>
							<EmptyHeader>
								<EmptyTitle>Doküman bulunamadı</EmptyTitle>
								<EmptyDescription>
									Henüz doküman eklenmemiş
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					);
					})()}
				</CardContent>
			</Card>

			{/* Qualifications Card */}
			<Card className="shadow-lg border-border/50">
				<CardHeader className="border-b border-border/50">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
							<Award className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<CardTitle className="text-xl">Nitelikler</CardTitle>
							<CardDescription>
								Resmi sayfa nitelikleri
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-6">
					{(() => {
						// API'den qualityPolitics veya qualification gelebilir
						// Hem Page formatını hem de direkt array formatını destekle
						const qualifications = Array.isArray(officialPage.qualityPolitics) 
							? officialPage.qualityPolitics 
							: Array.isArray(officialPage.qualification)
							? officialPage.qualification
							: officialPage.qualityPolitics?.content || officialPage.qualification?.content || [];
						
						return qualifications.length > 0 ? (
						<div className="border rounded-lg">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sıra</TableHead>
										<TableHead>Metin</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{qualifications.map((qual: any, index: number) => (
										<TableRow key={index}>
											<TableCell className="font-medium">{qual.orderNumber}</TableCell>
											<TableCell>{qual.text}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<Empty className="min-h-[200px] border-0">
							<EmptyMedia variant="icon">
								<Award className="h-8 w-8 text-muted-foreground/50" />
							</EmptyMedia>
							<EmptyHeader>
								<EmptyTitle>Nitelik bulunamadı</EmptyTitle>
								<EmptyDescription>
									Henüz nitelik eklenmemiş
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					);
					})()}
				</CardContent>
			</Card>

			{/* Delete Confirmation Modal */}
			<DeleteModal
				open={isDeleteDialogOpen}
				title="Dokümanı Sil"
				description="Bu işlem geri alınamaz. Bu doküman kalıcı olarak silinecektir."
				itemName={deletingItemName}
				confirmText="Sil"
				cancelText="İptal"
				onConfirm={handleDelete}
				onCancel={() => {
					setIsDeleteDialogOpen(false);
					setDeletingId(null);
					setDeletingItemName("");
				}}
				loading={deleteMutation.isPending}
			/>
		</div>
	);
}

