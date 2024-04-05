"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

import { useConfettiStore } from "@/lib/hooks/use-confetti-store";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type CourseProgressButtonProps = {
	chapterId: string;
	courseId: string;
	isCompleted?: boolean;
	nextChapterId?: string;
};

export const CourseProgressButton = ({
	chapterId,
	courseId,
	isCompleted,
	nextChapterId,
}: CourseProgressButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const confetti = useConfettiStore();

	const { toast } = useToast();

	const onClick = async () => {
		try {
			setIsLoading(true);

			await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
				isCompleted: !isCompleted,
			});

			if (!isCompleted && !nextChapterId) {
				confetti.onOpen();
			}

			if (!isCompleted && nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
			}

			toast({
				title: "Progress updated",
				description: "Your course progress has been updated successfully.",
				duration: 5000,
				className: "success-toast",
			});

			router.refresh();
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

	const Icon = isCompleted ? XCircle : CheckCircle;

	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			type="button"
			variant={isCompleted ? "outline" : "success"}
			className="w-full md:w-auto"
		>
			{isCompleted ? "Not completed" : "Mark as complete"}
			<Icon className="ml-2 h-4 w-4" />
		</Button>
	);
};
