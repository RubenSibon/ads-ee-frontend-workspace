# Amsterdam Design System (ADS) and Engineering Enablement (EE) frontend Workspace

Workspace for Amsterdam Design System (ADS) and frontend-focused Engineering Enablement (EE) projects.

## Workspace file

Use this multi-root workspace definition:

- `ads-ee-frontend.code-workspace`

## Goal

Enable ADS and EE frontend developers to manage, maintain, and evolve the projects that teams use or consult for consumer-facing applications and websites, both public and internal.

## What this workspace contains

- A multi-root workspace definition that references ADS and EE frontend repositories by local folder name.
- A curated list of repositories that teams use as implementation and reference sources.
- Shared workspace-level policies for IDE setup, MCP, and formatting ownership.

Repository folder names referenced by the workspace file (you clone these yourself):

- `design-system`
- `amsterdam-agent-skills`
- `design-system-prototypes`
- `development-standards`
- `ee-ads-rhf`
- `ee-docs`
- `ee-react-form-demos`
- `ee-react-map-demos`
- `ee-react-template`

## Repository bootstrap

If you want to recreate this workspace on a new machine, clone the repositories listed above from the Amsterdam GitHub organisation:

Clone all at once (HTTPS):

```sh
for repo in design-system amsterdam-agent-skills design-system-prototypes development-standards ee-ads-rhf ee-docs ee-react-form-demos ee-react-map-demos ee-react-template; do
  git clone "https://github.com/Amsterdam/${repo}.git"
done
```

Clone all at once (SSH):

```sh
for repo in design-system amsterdam-agent-skills design-system-prototypes development-standards ee-ads-rhf ee-docs ee-react-form-demos ee-react-map-demos ee-react-template; do
  git clone "git@github.com:Amsterdam/${repo}.git"
done
```

## Working model

- Project-level formatting is repository-owned.
- Workspace-level behavior is cross-IDE and minimal.
- Development standards are leading for engineering decisions.

## Workspace policies

### Formatting ownership

- Each repository owns its own Prettier configuration.
- Workspace-root Prettier style overrides are not used.
- Cross-IDE baseline text behavior is shared through `.editorconfig`.

### Development standards precedence

- Frontend browser capability checks follow `development-standards` guidance.
- Frontend lint configurations should enforce:
  - `eslint-plugin-baseline-js`
  - `stylelint-plugin-use-baseline`

### Gitignore strategy

- Default principle: OS-specific, IDE-specific, and user-specific patterns belong in each developer's [global gitignore](https://docs.github.com/en/get-started/git-basics/ignoring-files#configuring-ignored-files-for-all-repositories-on-your-computer).
- Workspace exception: this repository intentionally tracks IDE configuration directories.
- Repository `.gitignore` contains negation rules (`!`) so globally ignored IDE paths are still tracked in this workspace.
- Cloned project repositories in this folder are ignored by the workspace-manifest repository to keep them independent.

Suggested global patterns outside this workspace:

- `.idea/`
- `.vscode/`
- `.zed/`
- `.DS_Store`
- `Thumbs.db`
- `*.swp`

Set global gitignore once:

```bash
git config --global core.excludesfile ~/.gitignore_global
```

References:

- GitHub Docs: [Configuring ignored files for all repositories on your computer](https://docs.github.com/en/get-started/git-basics/ignoring-files#configuring-ignored-files-for-all-repositories-on-your-computer)
- Gitignore Generator: [windows, macos, linux, webstorm, phpstorm, pycharm, visualstudiocode, vim](https://www.toptal.com/developers/gitignore/api/windows,macos,linux,webstorm,phpstorm,pycharm,visualstudiocode,vim)

Verify which ignore rule wins for a path:

```bash
git check-ignore -v .vscode/settings.json
git check-ignore -v .idea/workspace.xml
git check-ignore -v .zed/settings.json
```

Note: if a path is not ignored, `git check-ignore` prints nothing and exits with status `1`.

## Required shared files

The following files are intentionally versioned:

- `.mcp.json`
- `.vscode/mcp.json`
- `.zed/settings.json`
- `.editorconfig`

This workspace may also track additional IDE files under `.vscode/`, `.zed/`, and `.idea/` by explicit policy.

### MCP dual-file policy

- The workspace maintains two equivalent MCP files:
  - `.mcp.json` (canonical portable source)
  - `.vscode/mcp.json` (VS Code native workspace location)

Rationale:

- VS Code uses `.vscode/mcp.json` as its documented workspace MCP location.
- Agent Host and cross-tool workflows can read portable workspace MCP configuration from `.mcp.json`.

## Contribution expectations

- Keep workspace policy changes documented in this README.
- Include MCP sync-check evidence in pull requests when MCP files change.
