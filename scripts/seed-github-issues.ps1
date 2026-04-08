[CmdletBinding()]
param(
    [string]$Repo = "juviscript/juviscript-desktop-portfolio",
    [string]$ProjectUrl = "https://github.com/users/juviscript/projects/3/views/1",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

function Assert-Command {
    param([string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found on PATH."
    }
}

function Invoke-Gh {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Arguments
    )

    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"

    try {
        $output = & gh @Arguments 2>&1
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousPreference
    }

    [pscustomobject]@{
        ExitCode = $exitCode
        Output   = ($output | Out-String).Trim()
    }
}

function Get-ProjectContext {
    param([string]$Url)

    $match = [regex]::Match($Url, '^https://github\.com/(?:users|orgs)/([^/]+)/projects/(\d+)/views/\d+$')
    if (-not $match.Success) {
        throw "Project URL must look like https://github.com/users/<owner>/projects/<number>/views/<view>."
    }

    [pscustomobject]@{
        Owner  = $match.Groups[1].Value
        Number = [int]$match.Groups[2].Value
    }
}

function Assert-UsableAuthToken {
    $result = Invoke-Gh auth token --hostname github.com
    if ($result.ExitCode -ne 0 -or [string]::IsNullOrWhiteSpace($result.Output)) {
        throw @"
GitHub CLI does not have a usable token for github.com.

`gh auth status` can still look logged in when the account metadata exists but the token cannot actually be retrieved for API calls.

Try:
  gh auth logout -h github.com -u juviscript
  gh auth login -h github.com
  gh auth refresh -h github.com -s project

Then verify with:
  gh auth token --hostname github.com
  gh issue list --repo $Repo --state all --limit 1 --json number,title,url
"@
    }
}

function Assert-RepoAccess {
    param([string]$RepoName)

    $result = Invoke-Gh issue list --repo $RepoName --state all --limit 1 --json number
    if ($result.ExitCode -ne 0) {
        throw "GitHub CLI could not access repo '$RepoName'. Run 'gh auth login' if needed, then rerun this script.`n$($result.Output)"
    }
}

function Assert-ProjectAccess {
    param(
        [string]$Owner,
        [int]$Number
    )

    $result = Invoke-Gh project view $Number --owner $Owner --format json
    if ($result.ExitCode -ne 0) {
        throw "GitHub CLI could not access project '$Owner/$Number'. Run 'gh auth refresh -s project' after logging in, then rerun this script.`n$($result.Output)"
    }
}

function Get-ExistingIssueMap {
    param([string]$RepoName)

    $result = Invoke-Gh issue list --repo $RepoName --state all --limit 200 --json number,title,url
    if ($result.ExitCode -ne 0) {
        throw "Unable to list issues for $RepoName.`n$($result.Output)"
    }

    if ([string]::IsNullOrWhiteSpace($result.Output)) {
        $issues = @()
    }
    else {
        $issues = $result.Output | ConvertFrom-Json
    }

    $map = @{}
    foreach ($issue in $issues) {
        $map[$issue.title] = $issue
    }

    return $map
}

function New-Issue {
    param(
        [string]$RepoName,
        [pscustomobject]$Definition
    )

    $result = Invoke-Gh issue create --repo $RepoName --title $Definition.Title --body $Definition.Body
    if ($result.ExitCode -ne 0) {
        throw "Unable to create issue '$($Definition.Title)'.`n$($result.Output)"
    }

    return $result.Output
}

function Add-IssueToProject {
    param(
        [string]$Owner,
        [int]$Number,
        [string]$IssueUrl
    )

    $result = Invoke-Gh project item-add $Number --owner $Owner --url $IssueUrl
    if ($result.ExitCode -ne 0) {
        if ($result.Output -match "already exists") {
            return "already-on-project"
        }

        throw "Unable to add $IssueUrl to project $Owner/$Number.`n$($result.Output)"
    }

    return "added-to-project"
}

$issueDefinitions = @(
    [pscustomobject]@{
        Title = "[Foundation] Model desktop apps and window content as structured data"
        Body  = @'
## Goal
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
- `ref`
- `defineProps`
- `v-for`
- parent state vs child rendering
'@
    },
    [pscustomobject]@{
        Title = "[MVP] Make the boot sequence skippable and polish the loading flow"
        Body  = @'
## Goal
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
- `onMounted`
- `onUnmounted`
- event handlers
- state-driven conditional rendering
'@
    },
    [pscustomobject]@{
        Title = "[MVP] Finish desktop icon interactions and window lifecycle"
        Body  = @'
## Goal
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
- array updates with `ref`
- managing UI state by id
'@
    },
    [pscustomobject]@{
        Title = "[MVP] Build the Projects explorer window with 3-4 case studies"
        Body  = @'
## Goal
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
- splitting a feature into smaller components
'@
    },
    [pscustomobject]@{
        Title = "[MVP] Create the About Me window"
        Body  = @'
## Goal
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
- balancing content and layout
'@
    },
    [pscustomobject]@{
        Title = "[MVP] Build the Resume and Certifications windows"
        Body  = @'
## Goal
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
- separating content concerns from presentation
'@
    },
    [pscustomobject]@{
        Title = "[MVP] Implement a functional Contact window and form"
        Body  = @'
## Goal
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
- `v-model`
- form state
- async actions
- handling success and failure in the UI
'@
    },
    [pscustomobject]@{
        Title = "[MVP] Add sound effects with user controls"
        Body  = @'
## Goal
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
- progressive enhancement
'@
    },
    [pscustomobject]@{
        Title = "[MVP] Design a mobile-friendly portfolio experience"
        Body  = @'
## Goal
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
- choosing different layouts for different devices
'@
    },
    [pscustomobject]@{
        Title = "[Quality] Add keyboard accessibility and focus management"
        Body  = @'
## Goal
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
- accessibility as a design constraint
'@
    },
    [pscustomobject]@{
        Title = "[Quality] Improve performance, browser support, and SEO baseline"
        Body  = @'
## Goal
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
- metadata in a frontend app
'@
    },
    [pscustomobject]@{
        Title = "[Post-MVP] Build a Start menu and taskbar app state"
        Body  = @'
## Goal
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
- UI state synchronization
'@
    },
    [pscustomobject]@{
        Title = "[Post-MVP] Add social links that can open in-app or externally"
        Body  = @'
## Goal
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
- designing around browser security constraints
'@
    },
    [pscustomobject]@{
        Title = "[Post-MVP] Save themes and wallpaper preferences in local storage"
        Body  = @'
## Goal
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
- CSS variables
'@
    },
    [pscustomobject]@{
        Title = "[Post-MVP] Add easter eggs and a fun Recycle Bin experience"
        Body  = @'
## Goal
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
- keeping novelty scoped
'@
    },
    [pscustomobject]@{
        Title = "[Post-MVP] Build a tech stack visualization window"
        Body  = @'
## Goal
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
- balancing style and readability
'@
    },
    [pscustomobject]@{
        Title = "[Post-MVP] Add a Windows Media Player style visualizer"
        Body  = @'
## Goal
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
- performance tradeoffs for decorative features
'@
    }
)

Assert-Command "gh"
$project = Get-ProjectContext -Url $ProjectUrl

if ($DryRun) {
    Write-Host "Dry run for $Repo"
    Write-Host "Project board: $ProjectUrl"
    Write-Host ""
    foreach ($issue in $issueDefinitions) {
        Write-Host "- $($issue.Title)"
    }
    exit 0
}

Assert-UsableAuthToken
Assert-RepoAccess -RepoName $Repo
Assert-ProjectAccess -Owner $project.Owner -Number $project.Number

$existingIssues = Get-ExistingIssueMap -RepoName $Repo
$results = @()

foreach ($issue in $issueDefinitions) {
    if ($existingIssues.ContainsKey($issue.Title)) {
        $existing = $existingIssues[$issue.Title]
        $issueUrl = $existing.url
        $issueStatus = "already-exists"
    }
    else {
        $issueUrl = New-Issue -RepoName $Repo -Definition $issue
        $issueStatus = "created"
    }

    $projectStatus = Add-IssueToProject -Owner $project.Owner -Number $project.Number -IssueUrl $issueUrl

    $results += [pscustomobject]@{
        Title         = $issue.Title
        IssueStatus   = $issueStatus
        ProjectStatus = $projectStatus
        Url           = $issueUrl
    }
}

Write-Host ""
Write-Host "Seed complete for $Repo"
Write-Host "Project board: $ProjectUrl"
Write-Host ""
$results | Format-Table -AutoSize
