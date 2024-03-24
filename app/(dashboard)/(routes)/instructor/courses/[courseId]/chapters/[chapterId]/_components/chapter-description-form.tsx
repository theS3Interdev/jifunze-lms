"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import { Chapter } from "@prisma/client";
import { cn } from "@/lib/utils";

import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

type ChapterDescriptionFormProps = {
	initialData: Chapter;
	courseId: string;
	chapterId: string;
};

const formSchema = z.object({
	description: z
		.string()
		.min(2, {
			message: "What is the chapter description?",
		})
		.max(250, {
			message: "The chapter description should not be more than 250 characters.",
		}),
});

export const ChapterDescriptionForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterDescriptionFormProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const router = useRouter();

	const { toast } = useToast();

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			description: initialData?.description || "",
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

			toast({
				title: "Chapter updated",
				description: "The chapter description has been successfully updated.",
				duration: 5000,
				className: "success-toast",
			});

			toggleEdit();

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

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Chapter description
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit description
						</>
					)}
				</Button>
			</div>

			{!isEditing && (
				<div
					className={cn(
						"mt-2 text-sm",
						!initialData.description && "italic text-slate-500",
					)}
				>
					{!initialData.description && "No description"}

					{initialData.description && <Preview value={initialData.description} />}
				</div>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Editor {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center gap-x-2">
							<Button disabled={!isValid || isSubmitting} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};
