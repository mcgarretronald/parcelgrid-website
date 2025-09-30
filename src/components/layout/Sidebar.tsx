import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Logo } from "../ui/micros/logo";

// Navigation item types
interface NavSubitem {
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  subitems?: NavSubitem[];
}

const navItems: NavItem[] = [
	// Navigation items will be added here
];

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}



const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen = false, onCloseMobileMenu }) => {
	const [expandedItems, setExpandedItems] = useState<string[]>(['Vendor Analytics', 'Parcels']);

	const toggleExpanded = (itemLabel: string) => {
		setExpandedItems(prev =>
			prev.includes(itemLabel)
				? prev.filter(item => item !== itemLabel)
				: [...prev, itemLabel]
		);
	};

	const renderNavItem = (item: NavItem, isMobile = false) => {
		const hasSubitems = item.subitems && item.subitems.length > 0;
		const isExpanded = expandedItems.includes(item.label);

		if (hasSubitems) {
			return (
				<div key={item.label}>
					<button
						onClick={() => toggleExpanded(item.label)}
						className="flex items-center justify-between w-full px-4 py-2 rounded-md text-sm font-medium transition-colors text-sidebar-foreground hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
					>
						<div className="flex items-center gap-3">
							<item.icon className="w-5 h-5" />
							{item.label}
						</div>
						{isExpanded ? (
							<ChevronDown className="w-4 h-4" />
						) : (
							<ChevronRight className="w-4 h-4" />
						)}
					</button>
					{isExpanded && item.subitems && (
						<div className="ml-6 mt-2 space-y-1">
							{item.subitems.map((subitem) => (
								<NavLink
									key={subitem.label}
									to={subitem.path}
									className={({ isActive }) =>
										`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
											isActive
												? "bg-[#E9FF15] text-[#00473E] dark:text-[#00473E]"
												: "text-sidebar-foreground hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
										}`
									}
									onClick={isMobile ? onCloseMobileMenu : undefined}
								>
									<subitem.icon className="w-4 h-4" />
									{subitem.label}
								</NavLink>
							))}
						</div>
					)}
				</div>
			);
		} else {
			return (
				<NavLink
					key={item.label}
					to={item.path!}
					className={({ isActive }) =>
						`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
							isActive
								? "bg-[#E9FF15] text-[#00473E] dark:text-[#00473E]"
								: "text-sidebar-foreground hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
						}`
					}
					onClick={isMobile ? onCloseMobileMenu : undefined}
				>
					<item.icon className="w-5 h-5" />
					{item.label}
				</NavLink>
			);
		}
	};

	return (
		<>
			{/* Mobile Sidebar Only */}
			{isMobileMenuOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black/50 z-40 md:hidden"
						onClick={onCloseMobileMenu}
						aria-label="Close sidebar backdrop"
					/>
					<aside className="fixed top-0 left-0 w-72 h-full bg-sidebar text-sidebar-foreground flex flex-col z-50 md:hidden shadow-lg animate-in slide-in-from-left-4">
						{/* Header with close button - Fixed at top */}
						<div className="p-6 flex items-center justify-between border-b border-border">
							<Logo size="md" showText />
							<button
								onClick={onCloseMobileMenu}
								className="text-2xl text-muted-foreground hover:text-foreground focus:outline-none"
								aria-label="Close sidebar"
							>
								<X className="w-6 h-6" />
							</button>
						</div>
						{/* Navigation Section - Scrollable */}
						<div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
							<nav className="flex flex-col space-y-2 px-4 py-4">
								{navItems.map((item) => renderNavItem(item, true))}
							</nav>
						</div>
					</aside>
				</>
			)}
		</>
	);
};

export default Sidebar;