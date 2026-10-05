# Development and deployment

[Back to README](../README.md)

## Project structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Connection manager and installation selection. |
| `components/getting-started.tsx` | Guided tasks and copyable chat prompts. |
| `components/feedback.tsx` | User feedback and maintainer inbox. |
| `app/api/` | Authenticated browser APIs with same-origin writes. |
| `app/mcp/route.ts` | MCP initialization, tool discovery, and authenticated calls. |
| `lib/ha/` | HA connections, version research, safety checks, and feedback. |
| `db/schema.ts`, `drizzle/` | D1 schema and immutable generated migrations. |
| `tests/security.mjs` | Worker/D1 security and behavior checks. |

## Local checks

Use Node >=22.13 and the package-manager version in `package.json`.

```bash
git clone https://github.com/RandomDevelopment/home-assistant-workbench.git
cd home-assistant-workbench
corepack pnpm install --frozen-lockfile
node node_modules/typescript/bin/tsc --noEmit
node tests/security.mjs
```

The D1/Miniflare suite covers multiple installations, tenant boundaries, encrypted credential binding, single-use actions, URL/DNS controls, redaction, feedback isolation, maintainer authorization, idempotent submission retries and submission limits. It does not establish connectivity to a real Home Assistant installation.

Generate schema changes with `pnpm db:generate`; commit the new migration and metadata together. Never edit an already deployed migration or create tables opportunistically in request handlers.

## Deploy your own copy through Sites

Use Plugin Creator + Sites in an account/workspace that supports them. The README’s setup prompt describes the workflow.

1. Create a **new** private Site from this source. Replace `.openai/hosting.json` with the new project identity while preserving the logical D1 binding `DB` and MCP capability. The checked-in project ID belongs to the maintainer’s deployment.
2. Configure a new `CREDENTIAL_KEY` (base64 32-byte random AES key) as a runtime secret and `APP_ORIGIN` as the exact new canonical Site origin.
3. Configure `FEEDBACK_MAINTAINER_ID` as the maintainer’s verified **Site-scoped user ID** from the trusted hosting identity. An account ID, email, or arbitrary form field is not equivalent. Until configured, submitting personal feedback works but reviewing the full inbox is denied.
4. Use the normal Sites source/build/archive/save/deploy workflow so D1 migrations apply to the matching version. Preserve private access.
5. Install the Site-provisioned plugin and verify a read-only tool after connecting. Do not register a duplicate app or bypass authentication.

No HA tokens or GitHub tokens belong in source. Encryption-key rotation without migrating ciphertext requires HA reconnection. No GitHub token is required by the research or feedback implementation; public research API calls may be rate limited.

## Hosting boundary matters

`app/chatgpt-auth.ts` reads identity headers supplied by authenticated Sites hosting. Never expose this Worker directly on an arbitrary host that accepts caller-controlled copies of those headers. Porting hosting requires a real authentication gateway, verified identities, and equivalent per-user authorization. Do not substitute permissive CORS, public bypasses, or fabricated identity headers.

## References

- [Home Assistant authentication](https://developers.home-assistant.io/docs/auth_api/)
- [REST API](https://developers.home-assistant.io/docs/api/rest/)
- [WebSocket API](https://developers.home-assistant.io/docs/api/websocket/)
- [HACS data sources](https://www.hacs.dev/docs/faq/data_sources/)
- [OpenAI plugin guidance](https://learn.chatgpt.com/docs/plugins)

## GitHub hosting versus the backend

Use GitHub to maintain, review, and distribute the source. GitHub Pages can host the public project guide and finalized support/privacy/terms pages because it serves static HTML, CSS, and JavaScript. It cannot run this MCP server, the credential encryption service, or D1 persistence.

The current backend remains on ChatGPT Sites and uses its trusted sign-in identity. A future standalone Cloudflare Workers/D1 deployment could use GitHub Actions for deployment, but it must first implement and verify its own authentication/OAuth boundary. Do not deploy the current worker to arbitrary hosting and trust client-supplied identity headers. Public directory submission of the existing Sites-owned App is a separate ownership/authentication requirement.

References: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Cloudflare Workers with GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/), [D1](https://developers.cloudflare.com/d1/get-started/).
