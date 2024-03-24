"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";

import { Chapter, Course } from "@prisma/client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { CourseChapterList } from "./course-chapter-list";

type CourseChapterFormProps = {
	initialData: Course & { chapters: Chapter[] };
	courseId: string;
};

const formSchema = z.object({
	title: z.string().min(1),
});

export const CourseChapterForm = ({ initialData, courseId }: CourseChapterFormProps) => {
	const [isCreating, setIsCreating] = useState(false);

	const [isUpdating, setIsUpdating] = useState(false);

	const router = useRouter();

	const { toast } = useToast();

	const toggleCreating = () => {
		setIsCreating((current) => !current);
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/chapters`, values);

			toast({
				title: "Chapter created",
				description: "The course chapter has been successfully created.",
				duration: 5000,
				className: "success-toast",
			});

			toggleCreating();

			router.refresh();
		} catch {
			toast({
				title: "Something went wrong",
				description: "An unknown error has occurred.",
				duration: 5000,
				className: "error-toast",
			});
		}
	};

	const onReorder = async (updateData: { id: string; position: number }[]) => {
		try {
			setIsUpdating(true);

			await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
				list: updateData,
			});

			toast({
				title: "Chapters reordered",
				description: "The course chapters have been successfully reordered.",
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
			setIsUpdating(false);
		}
	};

	const onEdit = (id: string) => {
		router.push(`/instructor/courses/${courseId}/chapters/${id}`);
	};

	return (
		<div className="relative mt-6 rounded-md border bg-slate-100 p-4">
			{isUpdating && (
				<div className="rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center bg-slate-500/20">
					<Loader2 className="h-6 w-6 animate-spin text-sky-700" />
				</div>
			)}

			<div className="flex items-center justify-between font-medium">
				Course chapters
				<Button onClick={toggleCreating} variant="ghost">
					{isCreating ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add a chapter
						</>
					)}
				</Button>
			</div>

			{isCreating && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Introduction to the course'"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button disabled={!isValid || isSubmitting} type="submit">
							Create
						</Button>
					</form>
				</Form>
			)}

			{!isCreating && (
				<div
					className={cn(
						"mt-2 text-sm",
						!initialData.chapters.length && "italic text-slate-500",
					)}
				>
					{!initialData.chapters.length && "No chapters"}
					<CourseChapterList
						onEdit={onEdit}
						onReorder={onReorder}
						items={initialData.chapters || []}
					/>
				</div>
			)}

			{!isCreating && (
				<p className="mt-4 text-xs text-muted-foreground">
					Drag and drop to reorder the chapters.
				</p>
			)}
		</div>
	);
};
