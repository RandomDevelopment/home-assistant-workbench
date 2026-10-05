# Public release preparation

Status: **preparation in progress; not uploaded, submitted, approved, or published in the public plugin directory**.

The chosen publisher is **Random Development** (business verification not yet checked), targeting **all available countries**, with **no payments or purchases**. The full source is now public at [RandomDevelopment/home-assistant-workbench](https://github.com/RandomDevelopment/home-assistant-workbench). Repository ownership has moved to RandomDevelopment. This does not change the hosted Site’s private audience or publish the plugin in the ChatGPT directory.

## Prepared

- A plain-language listing, three starter prompts, and release notes in `plugin.json`.
- Five positive and three negative review cases in the required metadata locations. All are **Not run in the submission portal**; the fixtures and reviewer account still need to be created.
- A square PNG icon, 1254 × 1254 pixels, under 5 MiB, in `assets/logo.png`.
- The canonical existing MCP URL, copied from the hosting service, in `mcp.json`.
- [Demo recording instructions](walkthrough.md) and [policy drafts](policies/). They are drafts, not published legal pages or a completed recording.
- Local implementation checks: 96 D1/security checks and TypeScript checking passed after feedback expiry and deletion were added. These checks do not replace portal review cases.

## Next preparation items

1. Review the policy drafts and resolve the listed business decisions, then publish actual website, support, privacy, and terms pages. Verify all four are accessible without private sign-in and identify Random Development and Workbench. Add their real HTTPS URLs to `extensions.com.openai.interface`; they are deliberately absent now.
2. Create a dedicated sample Home Assistant setup and reviewer account. Use secure portal credential fields only. Never use the maintainer’s real household, tokens, account ID, or private device history as public evidence.
3. Record and host the real walkthrough, verify playback, and add `review.demo_recording_url`. No recording has been made yet.
4. Resolve the submission path for the **existing Sites-owned App**. Plugin Creator’s export endpoint returned: “This is an app-backed plugin and cannot be edited with Plugin Creator.” Do not use an account-upload wrapper to create a duplicate private plugin. The metadata here is a preparation copy, not an ownership migration.
5. Verify developer identity, organization/project permissions, domain verification, authentication, scans, and the exact saved app/version in the supported portal. Run all eight cases there and record evidence.
6. Have the authorized publisher complete legal/policy attestations. Submit for review after these requirements pass; publish the approved release as a separate step.

## Packaging status

This directory is **not a submission-ready ZIP**. It intentionally omits four unverified listing URLs and the demo URL. Category must be chosen from the actual target dashboard. MCP discovery and auth for a public reviewer must be verified for the exact canonical App. Do not replace its existing binding or audience merely to produce an archive.

## Feedback retention

Reports become unavailable and are purged on the next feedback operation after 90 days from submission. Replies/status changes do not extend retention. Users can delete their own report and its reply sooner. A maintainer-only `purge_expired_feedback` tool returns only aggregate counts for daily housekeeping. An unattended connection must be verified before enabling the daily schedule; do not claim an inactive database is automatically cleaned while that schedule is pending.

## Sources

- [OpenAI submission guide](https://developers.openai.com/plugins/deploy/submission)
- [Hosting a plugin with ChatGPT Sites](https://help.openai.com/en/articles/20001547-hosting-a-plugin-with-chatgpt-sites)
- [Plugin directory usage](https://learn.chatgpt.com/docs/plugins)
