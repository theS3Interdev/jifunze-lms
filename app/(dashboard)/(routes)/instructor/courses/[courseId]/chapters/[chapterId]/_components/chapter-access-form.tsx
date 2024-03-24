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

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

type ChapterAccessFormProps = {
	initialData: Chapter;
	courseId: string;
	chapterId: string;
};

const formSchema = z.object({
	isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterAccessFormProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const router = useRouter();

	const { toast } = useToast();

	const toggleEdit = () => setIsEditing((current) => !current);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			isFree: !!initialData.isFree,
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

			toast({
				title: "Chapter updated",
				description: "The chapter access has been updated successfully.",
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
				Chapter access
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit access
						</>
					)}
				</Button>
			</div>

			{!isEditing && (
				<p className={cn("mt-2 text-sm", !initialData.isFree && "text-slate-500")}>
					{initialData.isFree ? (
						<>This chapter is free for preview.</>
					) : (
						<>This chapter is not free for preview.</>
					)}
				</p>
			)}

			{isEditing && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
						<FormField
							control={form.control}
							name="isFree"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormDescription>
											Check this box if you want to make this chapter free for preview.
										</FormDescription>
									</div>
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
