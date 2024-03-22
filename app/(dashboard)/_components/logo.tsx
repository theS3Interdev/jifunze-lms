import Image from "next/image";

export const Logo = () => {
	return (
		<div className="flex items-center">
			<Image height={32} width={32} alt="Jifunze Logo" src="/logo.svg" />

			<p className="pt-1 text-3xl font-semibold">Jifunze</p>
		</div>
	);
};
