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
import { useServiceCategories, useDeleteServiceCategory } from "@/hooks/use-service-category";
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
	FolderTree,
	Loader2,
} from "lucide-react";

export default function ServiceCategoryListPage() {
	const navigate = useNavigate();

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);
	const [size, setSize] = useState(10);
	const [sort, setSort] = useState("id,desc");

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isPaginationModalOpen, setIsPaginationModalOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);
	const [deletingItemName, setDeletingItemName] = useState<string>("");

	const { data, isLoading } = useServiceCategories(search, page, size, sort);
	const deleteMutation = useDeleteServiceCategory();

	const handleDeleteClick = (item: any) => {
		setDeletingId(item.id);
		setDeletingItemName(item.name || `Service Category #${item.id}`);
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

	const handlePaginationApply = (newPage: number, newSize: number) => {
		setPage(newPage - 1);
		setSize(newSize);
		setIsPaginationModalOpen(false);
	};

	const handlePreviousPage = () => {
		if (page > 0) setPage(page - 1);
	};

	const handleNextPage = () => {
		if (data && page < data.totalPages - 1) setPage(page + 1);
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
							Hizmet Kategorileri
						</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							Hizmet kategorilerini yönetin
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate("/service-category/create")}
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
						placeholder="Kategorilerde ara..."
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
						<SelectItem value="name,asc">İsim: A-Z</SelectItem>
						<SelectItem value="name,desc">İsim: Z-A</SelectItem>
						<SelectItem value="orderIndex,asc">Sıra: Düşükten Yükseğe</SelectItem>
						<SelectItem value="orderIndex,desc">Sıra: Yüksekten Düşüğe</SelectItem>
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
						<Table className="min-w-[600px]">
							<TableHeader>
								<TableRow>
									<TableHead className="hidden md:table-cell">ID</TableHead>
									<TableHead>İsim</TableHead>
									<TableHead className="hidden md:table-cell">Açıklama</TableHead>
									<TableHead className="hidden sm:table-cell">Sıra</TableHead>
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
										<TableCell className="hidden sm:table-cell">
											<Skeleton className="h-4 w-8" />
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
						<Table className="min-w-[600px]">
							<TableHeader>
								<TableRow>
									<TableHead className="hidden md:table-cell">ID</TableHead>
									<TableHead>İsim</TableHead>
									<TableHead className="hidden md:table-cell">Açıklama</TableHead>
									<TableHead className="hidden sm:table-cell">Sıra</TableHead>
									<TableHead className="text-right">İşlemler</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.content.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="hidden md:table-cell font-medium">{item.id}</TableCell>
										<TableCell className="max-w-[200px] sm:max-w-[300px]">
											<div className="flex items-start gap-2">
												<FolderTree className="h-4 w-4 mt-1 text-primary/70 flex-shrink-0" />
												<div className="font-medium line-clamp-2 text-sm sm:text-base">
													{item.name}
												</div>
											</div>
										</TableCell>
										<TableCell className="hidden md:table-cell max-w-[300px]">
											<div className="text-sm text-muted-foreground line-clamp-2">
												{item.description}
											</div>
										</TableCell>
										<TableCell className="hidden sm:table-cell">{item.orderIndex}</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-1 sm:gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => navigate(`/service-category/${item.id}`)}
													className="h-8 w-8 hover:bg-primary/10"
													title="Detayları Görüntüle"
												>
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => navigate(`/service-category/edit/${item.id}`)}
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
							<FolderTree className="h-12 w-12 text-muted-foreground/50" />
						</EmptyMedia>
						<EmptyHeader>
							<EmptyTitle>Hizmet kategorisi bulunamadı</EmptyTitle>
							<EmptyDescription>
								{search
									? "Arama kriterlerinize uygun sonuç bulunamadı. Arama terimlerinizi değiştirmeyi deneyin."
									: "Yeni bir hizmet kategorisi oluşturarak başlayın."}
							</EmptyDescription>
						</EmptyHeader>
						{!search && (
							<Button
								onClick={() => navigate("/service-category/create")}
								className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								<Plus className="h-4 w-4 mr-2" />
								Hizmet Kategorisi Oluştur
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

			{/* Delete Modal */}
			<DeleteModal
				open={isDeleteDialogOpen}
				title="Hizmet Kategorisini Sil"
				description="Bu işlem geri alınamaz. Bu hizmet kategorisi kalıcı olarak silinecektir."
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

