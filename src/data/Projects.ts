export type Project = {
	id: string;
	icon: string;
	name: string;
    description: string;
    technologies: string[];
    repositoryUrl?: string;
    gif?: string;
    url?: string;
};

export const projects: Project[] = [
	{
        id: "portfolio-website",
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
        name: "Personal Portfolio Website",
        description: "An interactive personal portfolio to showcase my skills.",
        gif: "https://33.media.tumblr.com/2a97d7413c2d3ab27d634af9292f026c/tumblr_mwyvpqpObK1sgl0ajo1_500.gif",
        repositoryUrl: "https://github.com/yourusername/portfolio-website",
        technologies: ["Vue.js", "TypeScript"]
    },
    {
        id: "taniti",
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
        name: "Taniti",
        description: "A travel planning application for exploring destinations.",
        gif: "https://33.media.tumblr.com/2a97d7413c2d3ab27d634af9292f026c/tumblr_mwyvpqpObK1sgl0ajo1_500.gif",
        url: "https://taniti.juviscript.dev",
        repositoryUrl: "https://github.com/yourusername/taniti",
        technologies: ["PHP", "MySQL", "Bootstrap"]
    },
    {
        id: "kenuvi-bot",
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
        name: "Kenuvi Bot",
        description: "A Discord bot for server management and fun interactions.",
        gif: "https://33.media.tumblr.com/2a97d7413c2d3ab27d634af9292f026c/tumblr_mwyvpqpObK1sgl0ajo1_500.gif",
        repositoryUrl: "https://github.com/yourusername/kenuvi-bot",    
        technologies: ["Python", "Discord.py"],
    }
];
