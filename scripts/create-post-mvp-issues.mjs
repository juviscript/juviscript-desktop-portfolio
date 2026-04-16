import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);

function readArg(flag, fallback = "") {
	const index = args.indexOf(flag);
	if (index === -1 || index === args.length - 1) {
		return fallback;
	}

	return args[index + 1];
}

const repo = readArg("--repo", "juviscript/juviscript-desktop-portfolio");
const dryRun = args.includes("--dry-run");

const issues = [
	{
		title: "[Post-MVP] Build a reusable widget system for desktop and mobile",
		body: `## Summary
Create a shared widget system that can support both desktop and mobile workspace surfaces.

## Scope
- Add a reusable widget shell/component API
- Support placement in both desktop and mobile workspaces
- Define shared sizing, header, and theme tokens
- Keep widget state portable across shells where appropriate

## Notes
This should be the foundation for future widgets like Nollie and the music player rather than a one-off implementation.`,
	},
	{
		title: "[Post-MVP] Add Nollie the corgi as a mascot/help widget",
		body: `## Summary
Create a branded mascot widget based on Nollie that can provide helpful contextual tips and personality.

## Scope
- Create a mascot widget based on Nollie
- Rotate helpful contextual tips and small status messages
- Support desktop and mobile presentation variants
- Keep the mascot optional and dismissible

## Notes
This should plug into the shared widget system instead of becoming a one-off UI element.`,
	},
	{
		title: "[Post-MVP] Build a custom jsOS music player widget/app",
		body: `## Summary
Design and build a custom music player experience that matches the jsOS visual language.

## Scope
- Design a custom player UI consistent with jsOS
- Support widget-sized and full-app layouts
- Add transport controls, progress, and track metadata
- Leave audio source strategy configurable for later

## Notes
Avoid dropping in a generic embedded player skin. The value here is a branded, original UI.`,
	},
	{
		title: "[Post-MVP] Polish mobile app launch and switcher animations",
		body: `## Summary
Refine the mobile interaction model so app launch and switching feel closer to a native mobile OS.

## Scope
- Animate app launch from tapped icon into the full-screen app view
- Refine the app switcher to feel closer to native mobile OS behavior
- Improve gesture thresholds and transitions
- Keep browser constraints in mind

## Notes
This is polish work and should stay outside the MVP boundary.`,
	},
	{
		title: "[Post-MVP] Add persistent workspace personalization",
		body: `## Summary
Persist lightweight workspace preferences so the experience feels more personal across visits.

## Scope
- Save widget visibility and placement
- Save mobile and desktop shell preferences where relevant
- Persist wallpaper, theme, and other lightweight UI choices
- Use local storage first

## Notes
Keep the first pass simple. This does not need a backend unless a later feature truly requires one.`,
	},
];

function runGh(argsList) {
	return execFileSync("gh", argsList, {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	}).trim();
}

function issueExists(title) {
	const output = runGh([
		"issue",
		"list",
		"--repo",
		repo,
		"--state",
		"all",
		"--search",
		`"${title}" in:title`,
		"--limit",
		"1",
		"--json",
		"title",
	]);

	const issues = JSON.parse(output);
	return issues.some(issue => issue.title === title);
}

console.log(`Creating post-MVP issues in ${repo}${dryRun ? " (dry run)" : ""}...`);

for (const issue of issues) {
	if (issueExists(issue.title)) {
		console.log(`Skipping existing issue: ${issue.title}`);
		continue;
	}

	if (dryRun) {
		console.log(`Would create: ${issue.title}`);
		continue;
	}

	runGh([
		"issue",
		"create",
		"--repo",
		repo,
		"--title",
		issue.title,
		"--body",
		issue.body,
	]);

	console.log(`Created: ${issue.title}`);
}

console.log("Done.");
