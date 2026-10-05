# Public release preparation

Status: **preparation in progress; not uploaded, submitted, approved, or published in the public plugin directory**.

The confirmed legal publisher is **Random Development LLC**, with business verification not yet checked, targeting **all available countries**, with **no payments or purchases**. The full source is now public at [RandomDevelopment/home-assistant-workbench](https://github.com/RandomDevelopment/home-assistant-workbench). Repository ownership has moved to RandomDevelopment. This does not change the hosted Site’s private audience or publish the plugin in the ChatGPT directory.

## Prepared

- A plain-language listing, three starter prompts, and release notes in `plugin.json`.
- Five positive and three negative review cases in the required metadata locations. All are **Not run in the submission portal**; the fixtures and reviewer account still need to be created.
- A square PNG icon, 1254 × 1254 pixels, under 5 MiB, in `assets/logo.png`.
- The canonical existing MCP URL, copied from the hosting service, in `mcp.json`.
- [Demo recording instructions](walkthrough.md) and [policy drafts](policies/). They are drafts, not published legal pages or a completed recording.
- Public support uses GitHub issues, as selected by the publisher; `docs/support.md` explains public reports and private in-plugin feedback. The publisher confirmed `services@randomdevelopment.biz` for private security/data-deletion requests; response commitments and the remaining policy decisions are not finalized.
- Local implementation checks: 96 D1/security checks, 67 history/logbook checks, and TypeScript checking passed. History tests exercise the authenticated REST client with sample responses, including permissions, room transitions, attribute-only updates, pagination, missing data, and response limits. They do not establish compatibility with every installation or replace portal review cases. GitHub issue #1 was closed after live acceptance. On October 5, 2026 UTC, the refreshed installed plugin passed live Sun-entity history/logbook checks: paginated and complete bounded reads, exact-state lookup, transition classification, and agreement between history and logbook. No private installation identifiers or raw household results are published.

## Next preparation items

1. Review the policy drafts and resolve the listed business decisions, then publish actual website, support, privacy, and terms pages. Verify all four are accessible without private sign-in and identify Random Development and Workbench. The public repository and support guide are recorded in `websiteURL` and `supportURL`. Finalize and verify the effective privacy and terms pages before adding their URLs to `extensions.com.openai.interface`.
2. Create a dedicated sample Home Assistant setup and reviewer account. Use secure portal credential fields only. Never use the maintainer’s real household, tokens, account ID, or private device history as public evidence.
3. Record and host the real walkthrough, verify playback, and add `review.demo_recording_url`. No recording has been made yet.
4. Resolve the submission path for the **existing Sites-owned App**. Plugin Creator’s export endpoint returned: “This is an app-backed plugin and cannot be edited with Plugin Creator.” Do not use an account-upload wrapper to create a duplicate private plugin. The metadata here is a preparation copy, not an ownership migration.
5. Verify developer identity, organization/project permissions, domain verification, authentication, scans, and the exact saved app/version in the supported portal. Run all eight cases there and record evidence.
6. Have the authorized publisher complete legal/policy attestations. Submit for review after these requirements pass; publish the approved release as a separate step.

## Packaging status

This directory is **not a submission-ready ZIP**. The public repository and support guide populate the website/support URLs. It still intentionally omits effective privacy/terms URLs and the demo URL. Category must be chosen from the actual target dashboard. MCP discovery and auth for a public reviewer must be verified for the exact canonical App. Do not replace its existing binding or audience merely to produce an archive.

## Feedback retention

Reports become unavailable and are purged on the next feedback operation after 90 days from submission. Replies/status changes do not extend retention. Users can delete their own report and its reply sooner. A maintainer-only `purge_expired_feedback` tool returns only aggregate counts for daily housekeeping. The installed maintainer-only tool was called successfully on October 5, 2026 UTC and returned zero expired rows. A daily cleanup schedule is now enabled at 3:15 a.m. America/Chicago; its first scheduled run has not yet been verified. A failed or disconnected scheduled connection must be reported, never bypassed.

## Sources

- [OpenAI submission guide](https://developers.openai.com/plugins/deploy/submission)
- [Hosting a plugin with ChatGPT Sites](https://help.openai.com/en/articles/20001547-hosting-a-plugin-with-chatgpt-sites)
- [Plugin directory usage](https://learn.chatgpt.com/docs/plugins)

## Remaining live verification

- Full Home Assistant OAuth login after the redirect fix: not yet retested.
- Fresh-account deployment recipe: not yet tested.
- Dedicated reviewer fixtures and eight portal cases: not run.
- First daily scheduled feedback purge: not yet run.
