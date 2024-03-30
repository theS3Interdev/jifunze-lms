import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { File } from "lucide-react";

import { getChapter } from "@/lib/actions/get-chapter";

import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { CourseVideoPlayer } from "./_components/course-video-player";

const ChapterPage = async ({
	params,
}: {
	params: { courseId: string; chapterId: string };
}) => {
	const { userId } = auth();

	if (!userId) {
		return redirect("/");
	}

	const {
		chapter,
		course,
		cloudinaryData,
		attachments,
		nextChapter,
		userProgress,
		purchase,
	} = await getChapter({
		userId,
		chapterId: params.chapterId,
		courseId: params.courseId,
	});

	if (!chapter || !course) {
		return redirect("/");
	}

	const isLocked = !chapter.isFree && !purchase;

	const completeOnEnd = !!purchase && !userProgress?.isCompleted;

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner variant="success" label="You have already completed this chapter." />
			)}

			{isLocked && (
				<Banner
					variant="warning"
					label="Sorry, but you need to purchase the course to watch this chapter."
				/>
			)}

			<div className="mx-auto flex max-w-4xl flex-col pb-20">
				<div className="p-4">
					<CourseVideoPlayer
						chapterId={params.chapterId}
						courseId={params.courseId}
						nextChapterId={nextChapter?.id}
						playbackId={cloudinaryData?.playbackId!}
						publicId={cloudinaryData?.publicId!}
						isLocked={isLocked}
						completeOnEnd={completeOnEnd}
					/>
				</div>

				<div>
					<div className="flex flex-col items-center justify-between p-4 md:flex-row">
						<h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>

						{purchase ? (
							<CourseProgressButton
								chapterId={params.chapterId}
								courseId={params.courseId}
								nextChapterId={nextChapter?.id}
								isCompleted={!!userProgress?.isCompleted}
							/>
						) : (
							<CourseEnrollButton courseId={params.courseId} price={course.price!} />
						)}
					</div>

					<Separator />

					<div>
						<Preview value={chapter.description!} />
					</div>

					{!!attachments.length && (
						<>
							<Separator />

							<div className="p-4">
								{attachments.map((attachment: any) => (
									<a
										key={attachment.id}
										href={attachment.url}
										target="_blank"
										className="flex w-full items-center rounded-md border bg-sky-200 p-3 text-sky-700 hover:underline"
									>
										<File />
										<p className="line-clamp-1">{attachment.name}</p>
									</a>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterPage;
