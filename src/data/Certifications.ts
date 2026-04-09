import AWSIcon from "../assets/aws-cloud-practitioner-icon.png";
import CompTIAIcon from "../assets/comptia-project-plus-icon.png";
import ITILIcon from "../assets/people-cert-itil-4-icon.png";
import AWSCertificate from "../assets/Certification - AWS - AWS Certified Cloud Practitioner - Juvi Panaguiton.pdf";
import CompTIACertificate from "../assets/Certification - CompTIA - Project+ - Juvi Panaguiton.pdf";
import ITILCertificate from "../assets/Certification - PeopleCert - ITIL 4 - Juvi Panaguiton.pdf";

export type Certification = {
	id: string;
	icon: string;
	title: string;
	issuer: string;
	issueDate: string;
	category: string;
	credentialId?: string;
	filePath: string;
    displayUrl: string;
	verifyUrl?: string;
};

export const certifications: Certification[] = [
	{
		id: "aws-certified-cloud-practitioner",
		icon: AWSIcon,
		title: "AWS Certified Cloud Practitioner",
		issuer: "Amazon Web Services (AWS)",
		issueDate: "10-08-2025",
		category: "Cloud Computing",
		credentialId: "4f8b5e3edfc04777886b39e6641f2b2c",
		filePath: AWSCertificate,
        displayUrl: "https://juviscript.dev/credentials/aws-certified-cloud-practitioner",
		verifyUrl: "https://cp.certmetrics.com/amazon/en/public/verify/credential/4f8b5e3edfc04777886b39e6641f2b2c",
	},
	{
		id: "comptia-project-plus",
		icon: CompTIAIcon,
		title: "CompTIA Project+",
		issuer: "CompTIA",
		issueDate: "11-05-2025",
		category: "Project Management",
		credentialId: "d2bd7b5fe0764e5c9632d55593c6c13b",
		filePath: CompTIACertificate,
        displayUrl: "https://juviscript.dev/credentials/comptia-project-plus",
		verifyUrl: "https://cp.certmetrics.com/CompTIA/en/public/verify/credential/d2bd7b5fe0764e5c9632d55593c6c13b",
	},
	{
		id: "peoplecert-itil-4-foundation",
		icon: ITILIcon,
		title: "PeopleCert ITIL 4 Foundation",
		issuer: "PeopleCert",
		issueDate: "11-19-2025",
		category: "IT Service Management",
		filePath: ITILCertificate,
		displayUrl: "https://juviscript.dev/credentials/peoplecert-itil-4-foundation",
		credentialId: "GR671833820JP",
	},
];
