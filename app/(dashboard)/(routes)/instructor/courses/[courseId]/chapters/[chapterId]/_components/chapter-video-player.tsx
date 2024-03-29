"use client";

import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

type ChapterVideoPlayerProps = {
	id: string;
	src: string;
	width: number;
	height: number;
};

export const ChapterVideoPlayer = ({
	id,
	src,
	width,
	height,
}: ChapterVideoPlayerProps) => {
	return <CldVideoPlayer id={id} src={src} width={width} height={height} />;
};
