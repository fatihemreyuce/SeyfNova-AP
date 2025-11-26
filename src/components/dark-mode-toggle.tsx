import { useEffect, useState } from "react";
import { Sun, Moon, Star } from "lucide-react";

interface DarkModeToggleProps {
	className?: string;
}

export default function DarkModeToggle({ className }: DarkModeToggleProps) {
	const [isDark, setIsDark] = useState(() => {
		const stored = localStorage.getItem("theme");
		return stored === "dark";
	});
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// migrate legacy darkMode flag if present
		const legacyDark = localStorage.getItem("darkMode");
		const stored = localStorage.getItem("theme");
		let initialTheme = stored || "light";
		if (!stored && legacyDark) {
			try {
				const legacy = JSON.parse(legacyDark) as boolean;
				initialTheme = legacy ? "dark" : "light";
				localStorage.setItem("theme", initialTheme);
				localStorage.removeItem("darkMode");
			} catch {
				// Ignore parsing errors
			}
		}
		setIsDark(initialTheme === "dark");
	}, []);

	useEffect(() => {
		if (!mounted) return;
		const rootElement = document.documentElement;
		rootElement.classList.remove("dark");
		if (isDark) {
			rootElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			localStorage.setItem("theme", "light");
		}
	}, [isDark, mounted]);

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	if (!mounted) {
		return (
			<div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
		);
	}

	return (
		<button
			onClick={toggleTheme}
			className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
				isDark 
					? "bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40" 
					: "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-md"
			} ${className || ""}`}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
		>
			{/* Icon Container with smooth transition */}
			<div className="relative h-5 w-5">
				{/* Sun Icon */}
				<Sun 
					className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
						isDark 
							? "rotate-90 scale-0 opacity-0" 
							: "rotate-0 scale-100 opacity-100"
					}`}
				/>
				
				{/* Moon Icon */}
				<Moon 
					className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
						isDark 
							? "rotate-0 scale-100 opacity-100" 
							: "-rotate-90 scale-0 opacity-0"
					}`}
				/>
			</div>

			{/* Glow effect for dark mode */}
			{isDark && (
				<div className="absolute inset-0 rounded-lg bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			)}

			{/* Star effect on hover */}
			<Star 
				className={`absolute -top-1 -right-1 h-3 w-3 text-primary fill-primary transition-all duration-300 ${
					isDark 
						? "opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12" 
						: "opacity-0"
				}`}
			/>
		</button>
	);
}
