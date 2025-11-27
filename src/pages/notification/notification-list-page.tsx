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
import { useNotifications, useDeleteNotification, useSendNotification } from "@/hooks/use-notifications";
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
	const [isPaginationModalOpen, setIsPaginationModalOpen] = useState(false);
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
			await sendMutation.mutateAsync({
				title: sendingNotification.title,
				content: sendingNotification.content,
			});
			setIsSendDialogOpen(false);
			setSendingNotification(null);
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
							Notifications
						</h1>
						<p className="text-muted-foreground mt-1">
							Manage notifications and announcements
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate("/notification/create")}
					className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
				>
					<Plus className="h-4 w-4 mr-2" />
					Create New
				</Button>
			</div>

			{/* Search & Filters */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search notifications..."
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
					<SelectTrigger className="w-[220px] gap-2">
						<ArrowUpDown className="h-4 w-4" />
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="id,asc">ID: Low to High</SelectItem>
						<SelectItem value="id,desc">ID: High to Low</SelectItem>
						<SelectItem value="title,asc">Title: A-Z</SelectItem>
						<SelectItem value="title,desc">Title: Z-A</SelectItem>
					</SelectContent>
				</Select>
				<Button
					variant="outline"
					onClick={() => setIsPaginationModalOpen(true)}
					className="gap-2"
				>
					<Settings className="h-4 w-4" />
					Pagination
				</Button>
			</div>

			{/* Table */}
			{isLoading ? (
				<div className="border rounded-lg bg-card shadow-sm">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Title</TableHead>
								<TableHead>Content</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell colSpan={4} className="text-center py-8">
									<div className="flex items-center justify-center gap-2 text-muted-foreground">
										<Loader2 className="h-4 w-4 animate-spin" />
										Loading...
									</div>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
			) : data?.content && data.content.length > 0 ? (
				<div className="border rounded-lg bg-card shadow-sm">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Title</TableHead>
								<TableHead>Content</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.content.map((item) => (
								<TableRow key={item.id}>
									<TableCell className="font-medium">{item.id}</TableCell>
									<TableCell className="max-w-[250px]">
										<div className="flex items-start gap-2">
											<Bell className="h-4 w-4 mt-1 text-primary/70" />
											<div className="font-medium line-clamp-2">
												{item.title}
											</div>
										</div>
									</TableCell>
									<TableCell className="max-w-[400px]">
										<div className="text-sm text-muted-foreground line-clamp-2">
											{item.content}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => navigate(`/notification/${item.id}`)}
												className="h-8 w-8 hover:bg-primary/10"
												title="View Details"
											>
												<Eye className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleSendClick(item)}
												className="h-8 w-8 hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400"
												title="Send Notification"
											>
												<Send className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => navigate(`/notification/edit/${item.id}`)}
												className="h-8 w-8 hover:bg-primary/10"
												title="Edit"
											>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleDeleteClick(item)}
												className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
												title="Delete"
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
			) : (
				<div className="border rounded-lg bg-card shadow-sm">
					<Empty className="min-h-[400px] border-0">
						<EmptyMedia variant="icon">
							<Bell className="h-12 w-12 text-muted-foreground/50" />
						</EmptyMedia>
						<EmptyHeader>
							<EmptyTitle>No notifications found</EmptyTitle>
							<EmptyDescription>
								{search
									? "No results match your search criteria. Try adjusting your search terms."
									: "Get started by creating a new notification."}
							</EmptyDescription>
						</EmptyHeader>
						{!search && (
							<Button
								onClick={() => navigate("/notification/create")}
								className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25"
							>
								<Plus className="h-4 w-4 mr-2" />
								Create Notification
							</Button>
						)}
					</Empty>
				</div>
			)}

			{/* Pagination */}
			{data && data.totalPages > 0 && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						Showing {data.content.length > 0 ? page * size + 1 : 0} to{" "}
						{Math.min((page + 1) * size, data.totalElements)} of{" "}
						{data.totalElements} results
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
							Page {page + 1} of {data.totalPages}
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
				title="Delete Notification"
				description="This action cannot be undone. This will permanently delete the notification."
				itemName={deletingItemName}
				confirmText="Delete"
				cancelText="Cancel"
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
						<DialogTitle>Send Notification</DialogTitle>
						<DialogDescription>
							Are you sure you want to send this notification? It will be sent to all users.
							{sendingNotification && (
								<div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
									<p className="font-medium text-sm mb-1">{sendingNotification.title}</p>
									<p className="text-xs text-muted-foreground line-clamp-2">
										{sendingNotification.content}
									</p>
								</div>
							)}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsSendDialogOpen(false)}
							disabled={sendMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSend}
							disabled={sendMutation.isPending}
							className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
						>
							{sendMutation.isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Sending...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Send
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

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

