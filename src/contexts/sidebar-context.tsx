import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
	isOpen: boolean;
	toggleSidebar: () => void;
	setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(() => {
		const saved = localStorage.getItem("sidebar-open");
		return saved !== null ? saved === "true" : true;
	});

	useEffect(() => {
		localStorage.setItem("sidebar-open", String(isOpen));
	}, [isOpen]);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<SidebarContext.Provider value={{ isOpen, toggleSidebar, setIsOpen }}>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (context === undefined) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
}

