"use client";

import { Category } from "@prisma/client";
import {
	FcBusiness,
	FcCollaboration,
	FcMoneyTransfer,
	FcMultipleDevices,
	FcPositiveDynamic,
	FcProcess,
	FcSalesPerformance,
} from "react-icons/fc";
import { IconType } from "react-icons";

import { CategoryItem } from "./category-item";

type CategoriesProps = {
	items: Category[];
};

const iconMap: Record<Category["name"], IconType> = {
	Business: FcBusiness,
	"Accounting & Finance": FcMoneyTransfer,
	"Computer Science": FcMultipleDevices,
	Productivity: FcPositiveDynamic,
	"Personal Development": FcProcess,
	Marketing: FcSalesPerformance,
	"Teaching & Academics": FcCollaboration,
};

export const Categories = ({ items }: CategoriesProps) => {
	return (
		<div className="flex items-center gap-x-2 overflow-x-auto pb-2">
			{items.map((item) => (
				<CategoryItem
					key={item.id}
					label={item.name}
					icon={iconMap[item.name]}
					value={item.id}
				/>
			))}
		</div>
	);
};
