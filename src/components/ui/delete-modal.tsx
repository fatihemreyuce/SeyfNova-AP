import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteModalProps {
	open: boolean;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	itemName: string; // Silinecek öğenin adı
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
}

export function DeleteModal({
	open,
	title = "Delete Item",
	description = "Are you sure you want to delete this item? This action cannot be undone.",
	confirmText = "Delete",
	cancelText = "Cancel",
	itemName,
	onConfirm,
	onCancel,
	loading = false,
}: DeleteModalProps) {
	const [typedName, setTypedName] = useState("");

	useEffect(() => {
		if (!open) {
			setTypedName("");
		}
	}, [open]);

	const handleConfirm = () => {
		if (typedName.trim() === itemName.trim()) {
			onConfirm();
		}
	};

	const isMatch = typedName.trim() === itemName.trim();
	const isDisabled = loading || !isMatch;

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && !loading && onCancel()}>
			<DialogContent className="sm:max-w-[425px] border-destructive/20">
				<DialogHeader className="pb-4">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/5">
							<AlertTriangle className="h-6 w-6 text-destructive" />
						</div>
						<div className="flex-1 space-y-1.5 pt-1">
							<DialogTitle className="text-xl font-semibold leading-tight">
								{title}
							</DialogTitle>
							<DialogDescription className="text-base leading-relaxed text-muted-foreground">
								{description}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<div className="space-y-3 py-4">
					<div className="space-y-2">
						<Label htmlFor="confirm-name" className="text-sm font-medium">
							Type <span className="font-mono text-destructive font-semibold">"{itemName}"</span> to confirm deletion
						</Label>
						<Input
							id="confirm-name"
							placeholder={itemName}
							value={typedName}
							onChange={(e) => setTypedName(e.target.value)}
							disabled={loading}
							className={`h-11 transition-all duration-200 ${
								isMatch && typedName.trim()
									? "border-green-500 focus-visible:ring-green-500"
									: typedName.trim()
									? "border-destructive focus-visible:ring-destructive"
									: ""
							}`}
							autoFocus
						/>
						{typedName.trim() && !isMatch && (
							<p className="text-xs text-destructive flex items-center gap-1">
								<AlertTriangle className="h-3 w-3" />
								The text you entered does not match. Please type "{itemName}" to confirm.
							</p>
						)}
						{isMatch && (
							<p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
								✓ Text matches. You can proceed with deletion.
							</p>
						)}
					</div>
				</div>
				<DialogFooter className="gap-2 sm:gap-2 pt-4 border-t">
					<Button
						variant="outline"
						onClick={onCancel}
						disabled={loading}
						className="min-w-[100px]"
					>
						{cancelText}
					</Button>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={isDisabled}
						className="min-w-[100px] bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive/80 shadow-lg shadow-destructive/25 hover:shadow-destructive/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							confirmText
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

