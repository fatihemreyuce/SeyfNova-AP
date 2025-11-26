import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { useLoginState } from "@/hooks/use-login-state";
import { LayoutDashboard, LogOut, FileText, BarChart3, Briefcase, Image as ImageIcon, Handshake, FolderTree, Award } from "lucide-react";

interface NavItem {
	to: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	end?: boolean;
}

const navigationItems: NavItem[] = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		end: true,
	},
	{
		to: "/homepage-about",
		label: "Homepage About",
		icon: FileText,
		end: false,
	},
	{
		to: "/service-stats",
		label: "Service Stats",
		icon: BarChart3,
		end: false,
	},
	{
		to: "/service",
		label: "Services",
		icon: Briefcase,
		end: false,
	},
	{
		to: "/service-category",
		label: "Service Categories",
		icon: FolderTree,
		end: false,
	},
	{
		to: "/slider",
		label: "Sliders",
		icon: ImageIcon,
		end: false,
	},
	{
		to: "/partner",
		label: "Partners",
		icon: Handshake,
		end: false,
	},
	{
		to: "/reference",
		label: "References",
		icon: Award,
		end: false,
	},
];

export default function Sidebar() {
	const { logout, isActionable, isLoading } = useLoginState();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch {
			// noop
		}
	};

	return (
		<aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-lg">
			{/* Decorative gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
			
			{/* Header */}
			<div className="relative flex h-16 items-center justify-between px-6 border-b border-border/50 bg-background/50">
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
						<span className="text-sm font-bold text-primary-foreground">SN</span>
					</div>
					<span className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
						Seyf Nova
					</span>
				</div>
				<DarkModeToggle />
			</div>

			{/* Navigation */}
			<nav className="relative flex flex-col gap-1 p-4 mt-2">
				{navigationItems.map((item) => {
					const Icon = item.icon;
					return (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								`group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
									isActive
										? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
										: "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground hover:translate-x-1"
								}`
							}
						>
							{({ isActive }) => (
								<>
									{/* Active indicator */}
									{isActive && (
										<div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary-foreground/50" />
									)}
									<Icon className={`h-4 w-4 transition-transform duration-300 ${
										isActive ? "scale-110" : "group-hover:scale-110"
									}`} />
									<span className="relative z-10">{item.label}</span>
									
									{/* Hover glow effect */}
									{!isActive && (
										<div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
									)}
								</>
							)}
						</NavLink>
					);
				})}
			</nav>

			{/* Footer with logout */}
			<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
				<Button
					variant="ghost"
					onClick={handleLogout}
					disabled={!isActionable || isLoading}
					className="group w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 hover:translate-x-1"
					aria-busy={isLoading}
				>
					<LogOut className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
					<span>{isLoading ? "Logging out..." : "Logout"}</span>
				</Button>
			</div>
		</aside>
	);
}