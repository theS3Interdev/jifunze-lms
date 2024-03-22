"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormLabel,
	FormMessage,
	FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
	title: z.string().min(1, {
		message: "What will you teach in this course?",
	}),
});

const CreateCoursePage = () => {
	const { toast } = useToast();

	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await axios.post("/api/courses", values);

			router.push(`/instructor/courses/${response.data.id}`);

			toast({
				title: "Course created",
				description: "The course was created successfully.",
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
		}
	};

	return (
		<div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
			<div>
				<h1 className="text-2xl">Give your course a name</h1>

				<p className="text-sm text-slate-600">
					What would you like to name your course? Don&apos;t worry, you can always
					change this later.
				</p>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course title</FormLabel>

									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="e.g. 'Advanced web development'"
											{...field}
										/>
									</FormControl>

									<FormDescription>What will you teach in this course?</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center gap-x-2">
							<Button type="button" variant={"ghost"} asChild>
								<Link href="/">Cancel</Link>
							</Button>

							<Button type="submit" disabled={!isValid || isSubmitting}>
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default CreateCoursePage;
