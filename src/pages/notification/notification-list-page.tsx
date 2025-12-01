import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useNotifications, useDeleteNotification, useSendNotification } from "@/hooks/use-notifications";
import {
	Plus,
	Pencil,
	Trash2,
	Eye,
	Search,
	ArrowLeft,
	ArrowUpDown,
	Bell,
	Loader2,
	Send,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function NotificationListPage() {
	const navigate = useNavigate();

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [sort, setSort] = useState("id,desc");

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [deletingItemName, setDeletingItemName] = useState<string>("");
	const [sendingNotification, setSendingNotification] = useState<{ id: string; title: string; content: string } | null>(null);

	const { data, isLoading } = useNotifications(page, size, sort);
	const deleteMutation = useDeleteNotification();
	const sendMutation = useSendNotification();

	const handleDeleteClick = (item: any) => {
		setDeletingId(String(item.id));
		setDeletingItemName(item.title || `Notification #${item.id}`);
		setIsDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!deletingId) return;
		try {
			await deleteMutation.mutateAsync(deletingId);
			setIsDeleteDialogOpen(false);
			setDeletingId(null);
			setDeletingItemName("");
		} catch {
			// handled in mutation
		}
	};

	const handleSendClick = (item: any) => {
		setSendingNotification({
			id: String(item.id),
			title: item.title,
			content: item.content,
		});
		setIsSendDialogOpen(true);
	};

	const handleSend = async () => {
		if (!sendingNotification) return;
		try {
			await sendMutation.mutateAsync(sendingNotification.id);
			setIsSendDialogOpen(false);
			setSendingNotification(null);
		} catch {
			// handled in mutation
		}
	};

	// Pagination helper function - "Önceki 1 2 3 ... Sonraki" formatı
	const getPageNumbers = (currentPage: number, totalPages: number) => {
		const pages: (number | string)[] = [];
		const current = currentPage + 1; // Convert to 1-based for display

		if (totalPages <= 1) {
			pages.push(1);
		} else if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (current <= 3) {
				for (let i = 1; i <= 3; i++) {
					pages.push(i);
				}
				pages.push("ellipsis");
				pages.push(totalPages);
			} else if (current >= totalPages - 2) {
				pages.push(1);
				pages.push("ellipsis");
				for (let i = totalPages - 2; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push("ellipsis");
				for (let i = current - 1; i <= current + 1; i++) {
					pages.push(i);
				}
				pages.push("ellipsis");
				pages.push(totalPages);
			}
		}

		return pages;
	};

	// Pagination mantığı:
	// - Backend 0-based index kullanıyor (page=0, page=1, ...)
	// - UI 1-based gösteriyor (Sayfa 1, Sayfa 2, ...)
	// - totalPages = Math.ceil(totalElements / size)
	// - Örnek: 11 veri, size=10 → totalPages=2, page=0 (1. sayfa), page=1 (2. sayfa)
	
	const totalElements = data?.totalElements || 0;
	const contentLength = data?.content?.length || 0;
	
	// Eğer backend totalElements=0 gönderiyorsa ama sayfada veri varsa:
	// - Sayfada tam size kadar veri varsa (örneğin 10/10), muhtemelen daha fazla sayfa var
	// - Bu durumda totalPages'i (page + 1) + 1 olarak hesapla (en az bir sayfa daha var)
	// - Ya da backend'den gelen totalPages değerini kullan
	let totalPages = 1;
	
	if (totalElements > 0) {
		// Backend doğru totalElements gönderiyor
		totalPages = Math.ceil(totalElements / size);
	} else if (contentLength > 0) {
		// Backend totalElements=0 gönderiyor ama sayfada veri var
		if (contentLength === size) {
			// Sayfa dolu, muhtemelen daha fazla sayfa var
			// Backend'den gelen totalPages'i kullan, yoksa (page + 1) + 1
			totalPages = data?.totalPages || (page + 1) + 1;
		} else {
			// Sayfa dolu değil, bu son sayfa
			totalPages = page + 1;
		}
	}
	
	// hasNextPage: Eğer toplam sayfa > 1 ve şu anki sayfa < son sayfa ise true
	const hasNextPage = totalPages > 1 && page < totalPages - 1;
	const hasPreviousPage = page > 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
						<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
							Bildirimler
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							Bildirimleri ve duyuruları yönetin
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate("/notification/create")}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 w-full sm:w-auto"
				>
					<Plus className="h-4 w-4 sm:mr-2" />
					<span className="hidden sm:inline">Yeni Oluştur</span>
					<span className="sm:hidden">Yeni</span>
				</Button>
			</div>

			{/* Search & Filters */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Bildirimlerde ara..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(0);
						}}
						className="pl-10"
					/>
				</div>
				<Select
					value={sort}
					onValueChange={(value) => {
						setSort(value);
						setPage(0);
					}}
				>
					<SelectTrigger className="w-full sm:w-[220px] gap-2">
						<ArrowUpDown className="h-4 w-4" />
						<SelectValue placeholder="Sırala" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="id,asc">ID: Düşükten Yükseğe</SelectItem>
						<SelectItem value="id,desc">ID: Yüksekten Düşüğe</SelectItem>
						<SelectItem value="title,asc">Başlık: A-Z</SelectItem>
						<SelectItem value="title,desc">Başlık: Z-A</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			{isLoading ? (
				<div className="border rounded-lg bg-card shadow-sm overflow-x-auto -mx-4 sm:mx-0">
					<div className="min-w-full inline-block align-middle">
						<Table className="min-w-[600px]">
							<TableHeader>
								<TableRow>
									<TableHead className="hidden md:table-cell">ID</TableHead>
									<TableHead>Başlık</TableHead>
									<TableHead className="hidden md:table-cell">İçerik</TableHead>
									<TableHead className="text-right">İşlemler</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from({ length: 5 }).map((_, index) => (
									<TableRow key={index}>
										<TableCell className="hidden md:table-cell">
											<Skeleton className="h-4 w-12" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-48" />
										</TableCell>
										<TableCell className="hidden md:table-cell">
											<Skeleton className="h-4 w-64" />
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<Skeleton className="h-8 w-8 rounded" />
												<Skeleton className="h-8 w-8 rounded" />
												<Skeleton className="h-8 w-8 rounded" />
												<Skeleton className="h-8 w-8 rounded" />
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			) : data?.content && data.content.length > 0 ? (
				<div className="border rounded-lg bg-card shadow-sm overflow-x-auto -mx-4 sm:mx-0">
					<div className="min-w-full inline-block align-middle">
						<Table className="min-w-[600px]">
							<TableHeader>
								<TableRow>
									<TableHead className="hidden md:table-cell">ID</TableHead>
									<TableHead>Başlık</TableHead>
									<TableHead className="hidden md:table-cell">İçerik</TableHead>
									<TableHead className="text-right">İşlemler</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.content.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="hidden md:table-cell font-medium">{item.id}</TableCell>
										<TableCell className="max-w-[200px] sm:max-w-[250px]">
											<div className="flex items-start gap-2">
												<Bell className="h-4 w-4 mt-1 text-primary/70 flex-shrink-0" />
												<div className="font-medium line-clamp-2 text-sm sm:text-base">
													{item.title}
												</div>
											</div>
										</TableCell>
										<TableCell className="hidden md:table-cell max-w-[300px]">
											<div className="text-sm text-muted-foreground line-clamp-2">
												{item.content}
											</div>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-1 sm:gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => navigate(`/notification/${item.id}`)}
													className="h-8 w-8 hover:bg-primary/10"
													title="Detayları Görüntüle"
												>
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleSendClick(item)}
													className="h-8 w-8 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400"
													title="Bildirim Gönder"
												>
													<Send className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => navigate(`/notification/edit/${item.id}`)}
													className="h-8 w-8 hover:bg-primary/10"
													title="Düzenle"
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteClick(item)}
													className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
													title="Sil"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			) : (
				<div className="border rounded-lg bg-card shadow-sm">
					<Empty className="min-h-[400px] border-0">
						<EmptyMedia variant="icon">
							<Bell className="h-12 w-12 text-muted-foreground/50" />
						</EmptyMedia>
						<EmptyHeader>
							<EmptyTitle>Bildirim bulunamadı</EmptyTitle>
							<EmptyDescription>
								{search
									? "Arama kriterlerinize uygun sonuç bulunamadı. Arama terimlerinizi değiştirmeyi deneyin."
									: "Yeni bir bildirim oluşturarak başlayın."}
							</EmptyDescription>
						</EmptyHeader>
						{!search && (
							<Button
								onClick={() => navigate("/notification/create")}
								className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								<Plus className="h-4 w-4 mr-2" />
								Bildirim Oluştur
							</Button>
						)}
					</Empty>
				</div>
			)}

			{/* Pagination - Sağ köşede */}
			{data && totalPages > 0 && (
				<div className="flex justify-end">
					<Pagination className="justify-end">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										if (hasPreviousPage) setPage(page - 1);
									}}
									className={!hasPreviousPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
								/>
							</PaginationItem>
							{getPageNumbers(page, totalPages).map((pageNum, index) => (
								<PaginationItem key={index}>
									{pageNum === "ellipsis" ? (
										<PaginationEllipsis />
									) : (
										<PaginationLink
											href="#"
											onClick={(e) => {
												e.preventDefault();
												setPage((pageNum as number) - 1);
											}}
											isActive={page + 1 === pageNum}
											className="cursor-pointer"
										>
											{pageNum}
										</PaginationLink>
									)}
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									href="#"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										if (hasNextPage) {
											setPage(page + 1);
										}
									}}
									className={!hasNextPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}

			{/* Delete Modal */}
			<DeleteModal
				open={isDeleteDialogOpen}
				title="Bildirimi Sil"
				description="Bu işlem geri alınamaz. Bu bildirim kalıcı olarak silinecektir."
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

			{/* Send Notification Dialog */}
			<Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Bildirim Gönder</DialogTitle>
						<DialogDescription>
							Bu bildirimi göndermek istediğinizden emin misiniz? Tüm kullanıcılara gönderilecektir.
						</DialogDescription>
						{sendingNotification && (
							<div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
								<p className="font-medium text-sm mb-1">{sendingNotification.title}</p>
								<p className="text-xs text-muted-foreground line-clamp-2">
									{sendingNotification.content}
								</p>
							</div>
						)}
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsSendDialogOpen(false)}
							disabled={sendMutation.isPending}
						>
							İptal
						</Button>
						<Button
							onClick={handleSend}
							disabled={sendMutation.isPending}
							className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
						>
							{sendMutation.isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Gönderiliyor...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Gönder
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

		</div>
	);
}

