import veneccio from "../assets/music/Veneccio.mp3"

export type MusicTrack = {
	id: string;
	title: string;
	artist: string;
	src: string;
};

// Add uploaded audio files here after placing them in `src/assets/music/`.
// Example:
// import firstTrack from "../assets/music/my-first-track.mp3";
//
// export const musicTracks: MusicTrack[] = [
// 	{
// 		id: "my-first-track",
// 		title: "My First Track",
// 		artist: "JuviScript",
// 		src: firstTrack,
// 	},
// ];

export const musicTracks: MusicTrack[] = [
	{
		id: "veneccio",
		title: "Veneccio",
		artist: "Dark Cloud 2 BBM",
		src: veneccio,
	},
];
