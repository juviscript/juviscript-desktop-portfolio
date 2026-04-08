import { spawnSync } from "node:child_process";

const repo = process.env.GITHUB_REPO ?? "juviscript/juviscript-desktop-portfolio";
const projectUrl =
  process.env.GITHUB_PROJECT_URL ??
  "https://github.com/users/juviscript/projects/3/views/1";
const dryRun = process.argv.includes("--dry-run");

const issueDefinitions = [
  {
    title: "[Foundation] Model desktop apps and window content as structured data",
    body: `## Goal
Create a single source of truth for desktop apps, projects, resume data, certifications, and contact links so the portfolio stays easy to update.

## Why this matters
The requirements call out easy updates as a core goal. Hardcoded window copy will get painful fast.

## Scope
- Move desktop app metadata into a typed data module.
- Define a reusable shape for projects, certifications, and resume links.
- Make desktop windows render from that data instead of branching on hardcoded ids.

## Acceptance criteria
- Desktop icons are generated from structured data.
- Window titles and core content are driven by the same source of truth.
- Adding a project mostly means updating data, not control flow.
- The main content shapes are typed.

## Learning focus
- \`ref\`
- \`defineProps\`
- \`v-for\`
- parent state vs child rendering`,
  },
  {
    title: "[MVP] Make the boot sequence skippable and polish the loading flow",
    body: `## Goal
Turn the current boot sequence into a polished intro that feels intentional and can be skipped.

## Scope
- Add a skip action that works with mouse and keyboard.
- Clean up timer logic so the component does not leak intervals or timeouts.
- Replace placeholder logo content with a branded loading screen.

## Acceptance criteria
- The user can skip the boot sequence at any time.
- Timers are cleaned up when the component unmounts.
- The transition from boot screen to desktop feels smooth.
- The boot sequence still loads quickly.

## Learning focus
- \`onMounted\`
- \`onUnmounted\`
- event handlers
- state-driven conditional rendering`,
  },
  {
    title: "[MVP] Finish desktop icon interactions and window lifecycle",
    body: `## Goal
Make the desktop feel like a real UI instead of a static mockup.

## Scope
- Fix icon prop wiring so each icon shows the correct label and icon.
- Add open, focus, close, minimize, and maximize behavior.
- Track active window order and z-index.
- Give each window a real title based on the opened app.

## Acceptance criteria
- Double-clicking an icon opens the correct window.
- Multiple windows can be opened, focused, and closed reliably.
- Dragging works without the window jumping unexpectedly.
- Window controls change actual state instead of logging to the console.

## Learning focus
- props and emits
- shared state in a parent component
- array updates with \`ref\`
- managing UI state by id`,
  },
  {
    title: "[MVP] Build the Projects explorer window with 3-4 case studies",
    body: `## Goal
Showcase at least three projects in a way that feels like a retro file explorer but still reads well.

## Scope
- Add structured project data with name, summary, tech, links, and screenshots if available.
- Design a projects window that can list projects and show details.
- Include at least three completed case studies.

## Acceptance criteria
- The Projects window contains at least three real portfolio projects.
- Each project includes a short description and relevant links.
- The layout works on desktop and small screens.
- The content is easy to update later.

## Learning focus
- rendering lists
- conditional detail panels
- splitting a feature into smaller components`,
  },
  {
    title: "[MVP] Create the About Me window",
    body: `## Goal
Add an About Me section that communicates personality and strengths without feeling generic.

## Scope
- Write concise portfolio copy for background, strengths, and interests.
- Build an About window layout that fits the retro desktop style.
- Include a personal angle that supports the "fun and memorable" goal.

## Acceptance criteria
- The About window has polished, non-placeholder content.
- The copy reads well on desktop and mobile.
- The section matches the visual language of the rest of the portfolio.

## Learning focus
- composing UI from sections
- moving static copy out of templates when it grows
- balancing content and layout`,
  },
  {
    title: "[MVP] Build the Resume and Certifications windows",
    body: `## Goal
Make resume access and certifications feel like first-class parts of the desktop.

## Scope
- Add a Resume window with a clear download action.
- Add a Certifications window with structured certificate data.
- Decide whether resume and certifications live in one window or two related windows.

## Acceptance criteria
- Resume download works.
- Certifications are displayed in a readable format.
- The data can be updated without rewriting component logic.
- The UI still feels cohesive with the rest of the desktop.

## Learning focus
- asset linking in Vite
- rendering structured content
- separating content concerns from presentation`,
  },
  {
    title: "[MVP] Implement a functional Contact window and form",
    body: `## Goal
Ship a real contact path instead of placeholder text.

## Scope
- Pick a delivery method such as Formspree, Netlify Forms, EmailJS, or a lightweight backend.
- Build the form UI with validation and submission states.
- Add success and error feedback.

## Acceptance criteria
- The contact form submits successfully in production.
- Required fields are validated before submission.
- The user sees clear pending, success, and error states.
- Contact links are accessible without relying only on the form.

## Learning focus
- \`v-model\`
- form state
- async actions
- handling success and failure in the UI`,
  },
  {
    title: "[MVP] Add sound effects with user controls",
    body: `## Goal
Add sound without making the site annoying or inaccessible.

## Scope
- Add lightweight UI sounds for a few key interactions.
- Provide a mute toggle.
- Respect autoplay limitations and reduced-motion or reduced-distraction concerns where possible.

## Acceptance criteria
- Sounds only play after a user interaction.
- The user can mute sounds easily.
- Audio files are lightweight.
- Sound enhances the experience instead of blocking it.

## Learning focus
- browser media restrictions
- event-driven side effects
- progressive enhancement`,
  },
  {
    title: "[MVP] Design a mobile-friendly portfolio experience",
    body: `## Goal
Translate the desktop concept to smaller screens without forcing a bad fake-desktop experience on mobile.

## Scope
- Decide whether mobile keeps the desktop metaphor or switches to a simplified stacked layout.
- Add responsive rules for windows, icons, and taskbar interactions.
- Test touch interactions for opening and dragging behavior.

## Acceptance criteria
- The portfolio is usable on common phone widths.
- Core content is still accessible without awkward overflow.
- Touch interactions feel intentional.
- The design still feels on-brand.

## Learning focus
- responsive CSS
- touch-first interaction tradeoffs
- choosing different layouts for different devices`,
  },
  {
    title: "[Quality] Add keyboard accessibility and focus management",
    body: `## Goal
Meet the accessibility requirement in a way that improves the app rather than being tacked on at the end.

## Scope
- Make icons, windows, buttons, and form controls keyboard reachable.
- Add visible focus states.
- Ensure dialogs or windows have sensible focus behavior.

## Acceptance criteria
- Keyboard users can open and close key UI elements.
- Focus indicators are visible and consistent.
- Important controls have accessible names.
- Basic screen reader semantics are in place.

## Learning focus
- semantic HTML
- keyboard event handling
- focus management
- accessibility as a design constraint`,
  },
  {
    title: "[Quality] Improve performance, browser support, and SEO baseline",
    body: `## Goal
Cover the technical constraints before the project gets too large.

## Scope
- Review asset size and loading behavior.
- Test on Chrome, Firefox, and Safari.
- Add a basic SEO baseline with title, description, and social metadata.
- Check whether the first meaningful view loads quickly.

## Acceptance criteria
- The app builds cleanly.
- The initial experience feels fast.
- Core interactions work in Chrome, Firefox, and Safari.
- Basic metadata is present for search and sharing.

## Learning focus
- Vite build output
- lightweight performance checks
- metadata in a frontend app`,
  },
  {
    title: "[Post-MVP] Build a Start menu and taskbar app state",
    body: `## Goal
Make the taskbar feel alive by connecting it to open windows and app launching.

## Scope
- Add a Start menu interaction.
- Mirror open windows in the taskbar.
- Allow taskbar actions such as focus or minimize.

## Acceptance criteria
- The Start menu opens and closes predictably.
- Open apps appear in the taskbar.
- Taskbar buttons reflect window state.

## Learning focus
- shared state across sibling components
- event flows
- UI state synchronization`,
  },
  {
    title: "[Post-MVP] Add social links that can open in-app or externally",
    body: `## Goal
Support the playful "open in portfolio first, then open in browser" idea from the backlog.

## Scope
- Decide which socials make sense to embed or preview.
- Create a small in-app browser or preview pattern where practical.
- Add a clear path to open the real external URL.

## Acceptance criteria
- At least one social link can be previewed inside the portfolio.
- External navigation is obvious.
- Security and usability tradeoffs are documented before implementation.

## Learning focus
- iframe limitations
- external links
- designing around browser security constraints`,
  },
  {
    title: "[Post-MVP] Save themes and wallpaper preferences in local storage",
    body: `## Goal
Let users personalize the desktop and keep their choices between visits.

## Scope
- Define a small theme system with wallpaper or color presets.
- Save and restore preferences with local storage.
- Add UI for selecting a theme.

## Acceptance criteria
- Theme selection persists after refresh.
- The default theme is still attractive.
- Theme changes do not break readability or accessibility.

## Learning focus
- local storage
- app initialization from saved state
- CSS variables`,
  },
  {
    title: "[Post-MVP] Add easter eggs and a fun Recycle Bin experience",
    body: `## Goal
Add personality without turning the portfolio into noise.

## Scope
- Fill the Recycle Bin with a few funny items.
- Add one or two hidden interactions such as a corgi cameo or silly files.
- Keep the jokes lightweight and brand-safe.

## Acceptance criteria
- The Recycle Bin contains intentional content.
- At least one easter egg is discoverable but not intrusive.
- The extra polish does not distract from core portfolio content.

## Learning focus
- progressive enhancement
- content design
- keeping novelty scoped`,
  },
  {
    title: "[Post-MVP] Build a tech stack visualization window",
    body: `## Goal
Present skills in a more memorable way than a flat bullet list.

## Scope
- Choose a visual approach such as grouped icons, a map, or an interactive chart.
- Build the visualization inside its own window.
- Keep it lightweight and readable.

## Acceptance criteria
- The visualization communicates strengths clearly.
- The layout is legible on desktop and acceptable on mobile.
- The feature supports your overall visual theme.

## Learning focus
- data visualization tradeoffs
- component composition
- balancing style and readability`,
  },
  {
    title: "[Post-MVP] Add a Windows Media Player style visualizer",
    body: `## Goal
Ship one showpiece feature that feels fun and technically interesting.

## Scope
- Decide whether the visualizer is audio-reactive or simulated.
- Build a contained visualizer experience that fits the desktop UI.
- Keep bundle size and performance in check.

## Acceptance criteria
- The visualizer runs smoothly on a modern desktop browser.
- The feature is isolated enough that it does not destabilize the rest of the app.
- The result looks intentional, not like a placeholder demo.

## Learning focus
- animation loops
- canvas or CSS animation
- performance tradeoffs for decorative features`,
  },
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function runGh(args) {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      fail("Required command 'gh' was not found on PATH.");
    }

    fail(result.error.message);
  }

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    output: [result.stdout.trim(), result.stderr.trim()].filter(Boolean).join("\n"),
  };
}

function parseProjectContext(url) {
  const match = url.match(
    /^https:\/\/github\.com\/(?:users|orgs)\/([^/]+)\/projects\/(\d+)\/views\/\d+$/,
  );

  if (!match) {
    fail(
      "Project URL must look like https://github.com/users/<owner>/projects/<number>/views/<view>.",
    );
  }

  return {
    owner: match[1],
    number: Number(match[2]),
  };
}

function assertUsableAuthToken() {
  const result = runGh(["auth", "token", "--hostname", "github.com"]);

  if (result.exitCode !== 0 || !result.stdout) {
    fail(`GitHub CLI does not have a usable token for github.com.

\`gh auth status\` can still look logged in when the account metadata exists but the token cannot actually be retrieved for API calls.

Try:
  gh auth logout -h github.com -u juviscript
  gh auth login -h github.com
  gh auth refresh -h github.com -s project

Then verify with:
  gh auth token --hostname github.com
  gh issue list --repo ${repo} --state all --limit 1 --json number,title,url`);
  }
}

function assertRepoAccess() {
  const result = runGh([
    "issue",
    "list",
    "--repo",
    repo,
    "--state",
    "all",
    "--limit",
    "1",
    "--json",
    "number",
  ]);

  if (result.exitCode !== 0) {
    fail(`GitHub CLI could not access repo '${repo}'.\n${result.output}`);
  }
}

function getExistingIssueMap() {
  const result = runGh([
    "issue",
    "list",
    "--repo",
    repo,
    "--state",
    "all",
    "--limit",
    "200",
    "--json",
    "number,title,url",
  ]);

  if (result.exitCode !== 0) {
    fail(`Unable to list issues for ${repo}.\n${result.output}`);
  }

  if (!result.stdout) {
    return new Map();
  }

  const issues = JSON.parse(result.stdout);
  return new Map(issues.map((issue) => [issue.title, issue]));
}

function createIssue(definition) {
  const result = runGh([
    "issue",
    "create",
    "--repo",
    repo,
    "--title",
    definition.title,
    "--body",
    definition.body,
  ]);

  if (result.exitCode !== 0) {
    fail(`Unable to create issue '${definition.title}'.\n${result.output}`);
  }

  return result.stdout;
}

function addIssueToProject(project, issueUrl) {
  const result = runGh([
    "project",
    "item-add",
    String(project.number),
    "--owner",
    project.owner,
    "--url",
    issueUrl,
  ]);

  if (result.exitCode !== 0) {
    if (result.output.toLowerCase().includes("already exists")) {
      return "already-on-project";
    }

    fail(`Unable to add ${issueUrl} to project ${project.owner}/${project.number}.\n${result.output}`);
  }

  return "added-to-project";
}

function main() {
  const project = parseProjectContext(projectUrl);

  if (dryRun) {
    console.log(`Dry run for ${repo}`);
    console.log(`Project board: ${projectUrl}`);
    console.log("");
    issueDefinitions.forEach((issue) => console.log(`- ${issue.title}`));
    return;
  }

  assertUsableAuthToken();
  assertRepoAccess();

  const existingIssues = getExistingIssueMap();
  const results = [];

  for (const issue of issueDefinitions) {
    let issueUrl;
    let issueStatus;

    if (existingIssues.has(issue.title)) {
      issueUrl = existingIssues.get(issue.title).url;
      issueStatus = "already-exists";
    } else {
      issueUrl = createIssue(issue);
      issueStatus = "created";
    }

    const projectStatus = addIssueToProject(project, issueUrl);
    results.push({
      title: issue.title,
      issueStatus,
      projectStatus,
      url: issueUrl,
    });
  }

  console.log("");
  console.log(`Seed complete for ${repo}`);
  console.log(`Project board: ${projectUrl}`);
  console.log("");

  for (const result of results) {
    console.log(`[${result.issueStatus} | ${result.projectStatus}] ${result.title}`);
    console.log(`  ${result.url}`);
  }
}

main();
