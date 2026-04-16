param(
	[string]$Repo = "juviscript/juviscript-desktop-portfolio"
)

$ErrorActionPreference = "Stop"

$issues = @(
	@{
		Title = "[Post-MVP] Build a reusable widget system for desktop and mobile"
		Body = @"
## Summary
Create a shared widget system that can support both desktop and mobile workspace surfaces.

## Scope
- Add a reusable widget shell/component API
- Support placement in both desktop and mobile workspaces
- Define shared sizing, header, and theme tokens
- Keep widget state portable across shells where appropriate

## Notes
This should be the foundation for future widgets like Nollie and the music player rather than a one-off implementation.
"@
	}
	@{
		Title = "[Post-MVP] Add Nollie the corgi as a mascot/help widget"
		Body = @"
## Summary
Create a branded mascot widget based on Nollie that can provide helpful contextual tips and personality.

## Scope
- Create a mascot widget based on Nollie
- Rotate helpful contextual tips and small status messages
- Support desktop and mobile presentation variants
- Keep the mascot optional and dismissible

## Notes
This should plug into the shared widget system instead of becoming a one-off UI element.
"@
	}
	@{
		Title = "[Post-MVP] Build a custom jsOS music player widget/app"
		Body = @"
## Summary
Design and build a custom music player experience that matches the jsOS visual language.

## Scope
- Design a custom player UI consistent with jsOS
- Support widget-sized and full-app layouts
- Add transport controls, progress, and track metadata
- Leave audio source strategy configurable for later

## Notes
Avoid dropping in a generic embedded player skin. The value here is a branded, original UI.
"@
	}
	@{
		Title = "[Post-MVP] Polish mobile app launch and switcher animations"
		Body = @"
## Summary
Refine the mobile interaction model so app launch and switching feel closer to a native mobile OS.

## Scope
- Animate app launch from tapped icon into the full-screen app view
- Refine the app switcher to feel closer to native mobile OS behavior
- Improve gesture thresholds and transitions
- Keep browser constraints in mind

## Notes
This is polish work and should stay outside the MVP boundary.
"@
	}
	@{
		Title = "[Post-MVP] Add persistent workspace personalization"
		Body = @"
## Summary
Persist lightweight workspace preferences so the experience feels more personal across visits.

## Scope
- Save widget visibility and placement
- Save mobile and desktop shell preferences where relevant
- Persist wallpaper, theme, and other lightweight UI choices
- Use local storage first

## Notes
Keep the first pass simple. This does not need a backend unless a later feature truly requires one.
"@
	}
)

Write-Host "Creating post-MVP issues in $Repo..." -ForegroundColor Cyan

foreach ($issue in $issues) {
	$title = $issue.Title
	$body = $issue.Body

	$existing = gh issue list --repo $Repo --state all --search "`"$title`" in:title" --limit 1 --json title | ConvertFrom-Json

	if ($existing.Count -gt 0 -and $existing[0].title -eq $title) {
		Write-Host "Skipping existing issue: $title" -ForegroundColor Yellow
		continue
	}

	gh issue create --repo $Repo --title $title --body $body | Out-Null
	Write-Host "Created: $title" -ForegroundColor Green
}

Write-Host "Done." -ForegroundColor Cyan
