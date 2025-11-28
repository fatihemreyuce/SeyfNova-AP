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
import { PaginationModal } from "@/components/ui/pagination-modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useHomePageAbout,
	useDeleteHomePageAbout,
} from "@/hooks/use-homapage-about";
import {
	Plus,
	Pencil,
	Trash2,
	Eye,
	Search,
	ChevronLeft,
	ChevronRight,
	Settings,
	ArrowLeft,
	ArrowUpDown,
	FileText,
} from "lucide-react";

export default function HomepageAboutListPage() {
	const navigate = useNavigate();
	
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [sort, setSort] = useState("id,desc");
	
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isPaginationModalOpen, setIsPaginationModalOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [deletingItemName, setDeletingItemName] = useState<string>("");

	const { data, isLoading } = useHomePageAbout(search, page, size, sort);
	const deleteMutation = useDeleteHomePageAbout();

	const handleDeleteClick = (item: any) => {
		setDeletingId(item.id);
		setDeletingItemName(item.leftTitle || item.rightTitle || `Item #${item.id}`);
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

	const handlePaginationApply = (newPage: number, newSize: number) => {
		setPage(newPage - 1); // Backend 0-based, UI 1-based
		setSize(newSize);
		setIsPaginationModalOpen(false);
	};

	const handlePreviousPage = () => {
		if (page > 0) {
			setPage(page - 1);
		}
	};

	const handleNextPage = () => {
		if (data && page < data.totalPages - 1) {
			setPage(page + 1);
		}
	};

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
							Ana Sayfa Hakkında
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							Ana sayfa hakkında içeriğini yönetin
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate("/homepage-about/create")}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 w-full sm:w-auto"
				>
					<Plus className="h-4 w-4 sm:mr-2" />
					<span className="hidden sm:inline">Yeni Oluştur</span>
					<span className="sm:hidden">Yeni</span>
				</Button>
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Ara..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(0); // Reset to first page on search
						}}
						className="pl-10"
					/>
				</div>
				<Select
					value={sort}
					onValueChange={(value) => {
						setSort(value);
						setPage(0); // Reset to first page on sort change
					}}
				>
					<SelectTrigger className="w-full sm:w-[180px] gap-2">
						<ArrowUpDown className="h-4 w-4" />
						<SelectValue placeholder="Sırala" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="id,asc">ID: Düşükten Yükseğe</SelectItem>
						<SelectItem value="id,desc">ID: Yüksekten Düşüğe</SelectItem>
						<SelectItem value="leftTitle,asc">Sol Başlık: A-Z</SelectItem>
						<SelectItem value="leftTitle,desc">Sol Başlık: Z-A</SelectItem>
						<SelectItem value="rightTitle,asc">Sağ Başlık: A-Z</SelectItem>
						<SelectItem value="rightTitle,desc">Sağ Başlık: Z-A</SelectItem>
					</SelectContent>
				</Select>
				<Button
					variant="outline"
					onClick={() => setIsPaginationModalOpen(true)}
					className="gap-2 w-full sm:w-auto"
				>
					<Settings className="h-4 w-4" />
					<span className="hidden sm:inline">Sayfalama</span>
					<span className="sm:hidden">Sayfa</span>
				</Button>
			</div>

			{/* Table */}
			{isLoading ? (
				<div className="border rounded-lg bg-card shadow-sm overflow-x-auto -mx-4 sm:mx-0">
					<div className="min-w-full inline-block align-middle">
						<Table className="min-w-[800px]">
							<TableHeader>
								<TableRow>
									<TableHead className="hidden md:table-cell">ID</TableHead>
									<TableHead>Sol Başlık</TableHead>
									<TableHead className="hidden md:table-cell">Sol Açıklama</TableHead>
									<TableHead className="hidden lg:table-cell">Sağ Başlık</TableHead>
									<TableHead className="hidden lg:table-cell">Sağ Açıklama</TableHead>
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
											<Skeleton className="h-4 w-32" />
										</TableCell>
										<TableCell className="hidden md:table-cell">
											<Skeleton className="h-4 w-48" />
										</TableCell>
										<TableCell className="hidden lg:table-cell">
											<Skeleton className="h-4 w-32" />
										</TableCell>
										<TableCell className="hidden lg:table-cell">
											<Skeleton className="h-4 w-48" />
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
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
						<Table className="min-w-[800px]">
							<TableHeader>
								<TableRow>
									<TableHead className="hidden md:table-cell">ID</TableHead>
									<TableHead>Sol Başlık</TableHead>
									<TableHead className="hidden md:table-cell">Sol Açıklama</TableHead>
									<TableHead className="hidden lg:table-cell">Sağ Başlık</TableHead>
									<TableHead className="hidden lg:table-cell">Sağ Açıklama</TableHead>
									<TableHead className="text-right">İşlemler</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.content.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="hidden md:table-cell font-medium">{item.id}</TableCell>
										<TableCell className="max-w-[150px] sm:max-w-[200px] truncate text-sm sm:text-base">
											{item.leftTitle}
										</TableCell>
										<TableCell className="hidden md:table-cell max-w-[150px] truncate text-sm text-muted-foreground">
											{item.leftDescription}
										</TableCell>
										<TableCell className="hidden lg:table-cell max-w-[150px] truncate text-sm sm:text-base">
											{item.rightTitle}
										</TableCell>
										<TableCell className="hidden lg:table-cell max-w-[150px] truncate text-sm text-muted-foreground">
											{item.rightDescription}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-1 sm:gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => navigate(`/homepage-about/${item.id}`)}
													className="h-8 w-8 hover:bg-primary/10"
													title="Detayları Görüntüle"
												>
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => navigate(`/homepage-about/edit/${item.id}`)}
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
							<FileText className="h-12 w-12 text-muted-foreground/50" />
						</EmptyMedia>
						<EmptyHeader>
							<EmptyTitle>Ana sayfa hakkında bulunamadı</EmptyTitle>
							<EmptyDescription>
								{search
									? "Arama kriterlerinize uygun sonuç bulunamadı. Arama terimlerinizi değiştirmeyi deneyin."
									: "Yeni bir ana sayfa hakkında içeriği oluşturarak başlayın."}
							</EmptyDescription>
						</EmptyHeader>
						{!search && (
							<Button
								onClick={() => navigate("/homepage-about/create")}
								className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								<Plus className="h-4 w-4 mr-2" />
								Ana Sayfa Hakkında Oluştur
							</Button>
						)}
					</Empty>
				</div>
			)}

			{/* Pagination */}
			{data && data.totalPages > 0 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						{data.content.length > 0 ? page * size + 1 : 0} - {" "}
						{Math.min((page + 1) * size, data.totalElements)} / {" "}
						{data.totalElements} sonuç
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={handlePreviousPage}
							disabled={page === 0}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="text-sm font-medium">
							Sayfa {page + 1} / {data.totalPages}
						</span>
						<Button
							variant="outline"
							size="icon"
							onClick={handleNextPage}
							disabled={page >= data.totalPages - 1}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			<DeleteModal
				open={isDeleteDialogOpen}
				title="Ana Sayfa Hakkında'yı Sil"
				description="Bu işlem geri alınamaz. Bu ana sayfa hakkında içeriği kalıcı olarak silinecektir."
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

			{/* Pagination Modal */}
			<PaginationModal
				open={isPaginationModalOpen}
				page={page + 1}
				size={size}
				onApply={handlePaginationApply}
				onCancel={() => setIsPaginationModalOpen(false)}
			/>
		</div>
	);
}

