export type DesktopApp = {
    id: string;
    label: string;
    icon: string;
    defaultWidth: number;
    defaultHeight: number;
};


export const desktopApps: DesktopApp[] = [
	{ id: "projects", label: "My Projects", icon: "📁", defaultWidth: 400, defaultHeight: 300 },
	{ id: "about", label: "About Me", icon: "📄", defaultWidth: 1200, defaultHeight: 800 },
	{ id: "resume", label: "Resume", icon: "📋", defaultWidth: 600, defaultHeight: 950 },
	{ id: "contact", label: "Contact", icon: "✉️", defaultWidth: 400, defaultHeight: 300 },
	{ id: "certifications", label: "Certs", icon: "🏆", defaultWidth: 800, defaultHeight: 800 },
	{ id: "recycle-bin", label: "Recycle Bin", icon: "🗑️", defaultWidth: 400, defaultHeight: 300 },
];