import certificationIcon from "../assets/desktop-icons/certification-icon.png";
import contactIcon from "../assets/desktop-icons/mail-icon.png";
import projectsIcon from "../assets/desktop-icons/projects-icon.png";
import recycleBinIcon from "../assets/desktop-icons/recycle-bin-icon.png";
import resumeIcon from "../assets/desktop-icons/folder-icon.png";
import userIcon from "../assets/desktop-icons/user-female-icon.png";

export type DesktopApp = {
	id: string;
	label: string;
	icon: string;
	defaultWidth: number;
	defaultHeight: number;
};

export const desktopApps: DesktopApp[] = [
	{ id: "projects", label: "Projects", icon: projectsIcon, defaultWidth: 1000, defaultHeight: 800 },
	{ id: "about", label: "About Me", icon: userIcon, defaultWidth: 1200, defaultHeight: 800 },
	{ id: "resume", label: "Resume", icon: resumeIcon, defaultWidth: 1200, defaultHeight: 900 },
	{ id: "contact", label: "Contact", icon: contactIcon, defaultWidth: 860, defaultHeight: 680 },
	{ id: "certifications", label: "Certs", icon: certificationIcon, defaultWidth: 1000, defaultHeight: 800  },
	{ id: "recycle-bin", label: "Recycle Bin", icon: recycleBinIcon, defaultWidth: 400, defaultHeight: 300 },
];
