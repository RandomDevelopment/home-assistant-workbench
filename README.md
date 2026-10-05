<p align="center"><img src="public/brand/wordmark.png" width="620" alt="Home Assistant Workbench" /></p>

# Ask ChatGPT about your Home Assistant

**Connect your homes, understand what’s installed, troubleshoot with the right documentation, and run actions you authorize.**

Home Assistant Workbench is an independent ChatGPT plugin with a connection manager. It works with one installation or many: Home, Workshop, Vacation House, and more. Each installation keeps separate credentials, notes, versions, and permissions.

[Getting started](#use-it-in-your-own-chatgpt-account) · [Example requests](#what-can-i-ask) · [User guide](docs/user-guide.md) · [Development](docs/development.md) · [Feedback & issues](#feedback)

> **Current availability:** the source is shared through this repository. The maintainer’s [hosted Workbench](https://home-assistant-workbench.nickfost.chatgpt.site) and its plugin currently have private access. A public GitHub repository does not give access to that hosted copy. Deploy your own private copy using the prompt below, or install a copy explicitly shared with you. Public directory submission is being prepared; this is not a publicly listed, one-click ChatGPT plugin yet. See the [publication status](docs/submission/readiness.md).

## What can it do?

| Your task | How Workbench helps |
| --- | --- |
| Understand a home | Reads its Core version, entities, services, registries, and supported capabilities. |
| Troubleshoot an integration | Cross-checks installed versions with documentation, GitHub releases, changelogs, and issues. |
| Manage several installations | Makes you choose a named home; credentials and permissions stay separate. |
| Run a specific action | Validates a live Home Assistant service, prepares the action, then executes within your authorization. |
| Report a problem | Saves feedback with a tracking ID, status, and maintainer replies. No GitHub connection needed. |

**It needs a public HTTPS hostname on port 443**, such as a Nabu Casa remote URL. This hosted implementation cannot reach LAN IPs, `.local` names, or a private VPN. It does not configure network exposure for you.

History/logbook queries are [planned in issue #1](https://github.com/RandomDevelopment/home-assistant-workbench/issues/1). Direct YAML/file editing and installing HACS components or add-ons are not implemented. See [security and limits](docs/security-and-limits.md).

## Use it in your own ChatGPT account

### 1. Create your own private copy

In ChatGPT Work or Codex, install **Plugin Creator**, **Sites**, and a way to access this repository if they are available in your workspace. Select Plugin Creator and paste this prompt:

```text
Create my own private Home Assistant Workbench using the source at
https://github.com/RandomDevelopment/home-assistant-workbench.

Read its README, user guide, development guide, and security notes first.
Use Plugin Creator and Sites to deploy a NEW private Site and its provisioned
MCP plugin in MY account. Keep all existing authentication, per-user isolation,
multiple-installation support, and read-only defaults.

Do not reuse the repository's .openai/hosting.json project_id, the maintainer's
Site URL, plugin ID, runtime secrets, or stored data. Register my own project,
create a new encryption key in runtime secrets, set APP_ORIGIN to my new URL,
and apply the versioned database migrations. Configure the feedback maintainer
using my verified Site-scoped user identity, never a client-supplied identity.

Publish my private copy, show me the plugin installation UI, and verify a
read-only tool after I connect it. Guide me through adding my first installation.
Never ask me to paste Home Assistant credentials into this chat.
If a required plugin or permission is unavailable, explain the exact blocker.
```

This prompt asks ChatGPT to build and deploy a separate copy; it does not install the plugin by itself. Availability and hosting depend on your account and workspace. The implementation uses authenticated Sites hosting; putting it on an arbitrary server without its trusted authentication boundary is not a supported shortcut.

### 2. Install and connect the resulting plugin

Open **Plugins → Personal** and find your copy under **Created by me** (or **Shared with me** for a copy shared with you). Open it and choose **Install** / **Connect** as offered. Then start a new chat. Type **@** and select **Home Assistant Workbench** from the picker. Merely typing its name does not create an installation or grant access.

Open your copy’s connection manager and:

1. Choose **Add installation**. Enter a friendly name and its HTTPS base URL.
2. Choose **Sign in to Home Assistant**, authorize on that installation, and return to Workbench. A long-lived token can be entered in the connection form instead; never paste it into chat.
3. Choose **Refresh inventory** to read versions and supported APIs.
4. Repeat for each additional installation. Use distinct names.

Official guidance: [install and invoke plugins](https://learn.chatgpt.com/docs/plugins) and [build plugins with Plugin Creator](https://learn.chatgpt.com/docs/build-plugins).

### 3. Paste your first request

Replace `Home` with your installation’s name. Select the installed plugin with **@** first, or ask for it explicitly:

```text
Use Home Assistant Workbench. List my installations, then inspect Home.
Summarize its Core version, available capabilities, installed components,
and anything I should check. Do not make changes.
```

## What can I ask?

**Troubleshoot:**

```text
Use Home Assistant Workbench to troubleshoot [symptom] on Home.
Check installed versions, matching documentation, changelogs, and open or
closed GitHub issues. Cite evidence and propose the smallest next step.
Do not make changes.
```

**Compare homes:**

```text
Use Home Assistant Workbench to compare Home and Workshop.
Read both inventories and summarize their Core versions and available updates.
Do not change either installation.
```

**Control lights:** first enable **Allow prepared changes** in that installation’s Settings.

```text
Use Home Assistant Workbench on Home to turn off the basement lights.
Resolve the exact entities, prepare the action, execute it within this
explicit authorization, and verify the result. Ask if the target is ambiguous.
```

**Send feedback without GitHub:**

```text
Use Home Assistant Workbench to submit a feature request:
[describe the task I want to do]. Include no credentials, logs, or private
household history, and show me the tracking ID.
```

[Follow the complete user stories](docs/user-guide.md) for connecting, switching homes, troubleshooting, actions, and feedback.

## Feedback

Open **Feedback** in your connection manager, or ask the installed plugin to submit a report. You receive a tracking ID and can check status and maintainer replies. Feedback stays in that deployed copy’s inbox; it is not automatically sent to this repository. Your copy’s maintainer can link a separately created GitHub issue. Feedback expires 90 days after submission; you can delete your own report and reply sooner. Expired rows are purged on feedback access. Daily background cleanup requires a verified maintainer connection and an enabled schedule.

If you prefer GitHub, [open an issue](https://github.com/RandomDevelopment/home-assistant-workbench/issues/new/choose). Describe your expected result, actual result, and versions. Leave out credentials, private URLs, household history, and sensitive logs. See [CONTRIBUTING.md](CONTRIBUTING.md).

## For developers

React / Vinext on Cloudflare Workers, with D1 persistence and a stateless MCP endpoint.

- [Development & deployment](docs/development.md)
- [Security & limits](docs/security-and-limits.md)
- [Contributing](CONTRIBUTING.md)
- [Logo assets](public/brand/) — generated mark and wordmark; the browser icon is [favicon.svg](public/favicon.svg)

Source entry points: `app/page.tsx` (connection manager), `app/mcp/route.ts` (MCP), `lib/ha/` (Home Assistant and feedback operations), and `db/schema.ts` / `drizzle/` (versioned storage).

Independent project. Not affiliated with Home Assistant, HACS, or OpenAI.

## License

Original Workbench contributions use [the Unlicense](UNLICENSE), allowing reuse without attribution. Bundled third-party material keeps its original terms; see [third-party notices](THIRD_PARTY_NOTICES.md).
