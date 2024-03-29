"use client";

import { useState } from "react";
import axios from "axios";

import { formatPrice } from "@/lib/format";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type CourseEnrollButtonProps = {
	price: number;
	courseId: string;
};

export const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const { toast } = useToast();

	const onClick = async () => {
		try {
			setIsLoading(true);

			const response = await axios.post(`/api/courses/${courseId}/checkout`);

			window.location.assign(response.data.url);
		} catch {
			toast({
				title: "Something went wrong",
				description: "An unknown error has occurred.",
				duration: 5000,
				className: "error-toast",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			size="sm"
			className="w-full md:w-auto"
		>
			Enroll for {formatPrice(price)}
		</Button>
	);
};
