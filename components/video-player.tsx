"use client";

import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

type VideoPlayerProps = {
	id: string;
	width: number;
	height: number;
	publicId: string;
};

export const VideoPlayer = ({ id, width, height, publicId }: VideoPlayerProps) => {
	return <CldVideoPlayer id={id} width={width} height={height} src={publicId} />;
};
