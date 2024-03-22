import { NavigationBarRoutes } from "@/components/navigation-bar-routes";
import { MobileSidebar } from "@/app/(dashboard)/_components/mobile-sidebar";

export const NavigationBar = () => {
	return (
		<div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
			<MobileSidebar />

			<NavigationBarRoutes />
		</div>
	);
};
