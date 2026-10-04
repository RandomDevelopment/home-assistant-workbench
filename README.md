# Home Assistant Workbench

A private hosted MCP plugin and connection manager for multiple Home Assistant installations per user. No single-installation default: tools require an explicit installation ID. Each installation keeps its own credentials, access mode, version snapshot, component mappings, and notes.

## Setup

1. Open the connection manager and sign in with ChatGPT.
2. Add a named installation using its reachable HTTPS base URL (for example a Nabu Casa remote URL).
3. Choose **Sign in to Home Assistant** and authorize on that installation, or enter a long-lived access token in the password field. Never enter credentials in chat.
4. Refresh the inventory. Repeat for as many installations as needed.
5. Install the provisioned private plugin. Name the target installation in each request.

Reads are enabled by default. To authorize service changes, enable **Allow prepared changes** in that installation's settings. The plugin validates the requested service against its live services, returns a concrete draft, and executes it once within the user's authorization. Each draft expires after ten minutes and is bound to its owner and installation. An uncertain action result is not retried automatically.

## Tools and research

- List installations and open connection settings.
- Inspect Core, integration manifests, update entities, available Supervisor/OS and add-on information.
- Read paginated entities, registries, services, config entries and a bounded error log; run a configuration check.
- Track each integration, add-on, HACS repository, frontend card, or theme with its actual repository and installed version.
- Compare installed and latest release evidence, including prereleases, release notes, tag comparisons and open/closed issue searches.
- Read version-tagged repository files, issue threads and paginated comments, and official/registered public documentation.
- Prepare and execute an explicitly targeted service action.

MCP initialization instructions require live instance context, version-matched documentation, source citations, and separation between an issue report and a verified cause. All retrieved text is untrusted evidence. HACS itself and repositories installed through HACS have separate versions. Unknown commands/permissions and truncated source coverage are reported. No background update schedule is created.

## Boundaries

- A reachable public HTTPS hostname on port 443 is required. This hosted version does not connect directly to LAN IPs, `.local` names, or a private VPN. No network exposure is configured on users' instances.
- Home Assistant permissions remain authoritative. Supervisor/OS/add-on access depends on installation type and HA user permissions; unsupported requests produce explicit capability errors.
- There is no general filesystem, SSH, YAML file writer, or HACS installer. Configuration work can be researched and drafted; applying unsupported file operations requires a separately authorized local integration.
- Component repository/version mappings are user-provided and labelled accordingly. Live manifests and update entities can help verify them; they do not guarantee complete discovery of every HACS frontend repository.
- Public GitHub API reads use no GitHub credential and may be rate limited. Up to 250 releases are scanned for an installed release; truncation is disclosed. Custom GitHub repositories must be registered for the selected installation.
- Documentation fetches do not follow redirects. Use canonical URLs, such as https://www.hacs.dev/docs/, resolving legacy redirects through search.
- The initial publication and plugin are private. Sharing requires appropriate access to both the Site and its provisioned plugin. Sharing does not combine users' installation data.
- Full verification against a real Home Assistant installation requires the owner to connect it; no real credentials were supplied during implementation.

## Security and operations

Sites provides authenticated, Site-scoped user identity at its trusted boundary. Data-bearing requests require that identity; discovery carries no private data. All D1 installation/component/draft/state queries enforce owner and installation scope. Browser writes require same-origin requests. OAuth callbacks consume a ten-minute, user-bound state and an HttpOnly Secure browser nonce. Tokens are encrypted with AES-256-GCM with owner and installation as authenticated associated data. Encryption key and application origin are managed runtime settings, never committed to source. Changing the encryption key without migrating ciphertext will require reconnection.

URLs reject userinfo, local/reserved names, literal IPs, non-HTTPS schemes and nonstandard ports. Outbound instance/documentation requests validate A/AAAA records against public-address rules, reject redirects, and use timeouts. Cloud runtime egress protections must remain in place: DNS checks by themselves cannot pin a hostname to the resolver answer. User URLs must never be routed through an unprotected arbitrary private-network proxy. Credential-bearing requests are restricted to the selected installation origin.

Common token/password/key fields and JWT/Bearer strings are redacted from model-visible data. Redaction is best-effort: logs and entity content can still contain household information. Request logs must not capture tokens, authorization headers, OAuth codes, or response bodies. Disconnect deletes local credentials, snapshots and pending drafts/states and requests revocation for OAuth refresh tokens. Users must revoke long-lived tokens in their HA profile themselves; failed remote revocation is reported.

## Development and validation

Runtime: Vinext/React on Cloudflare Workers with D1. Schema changes use generated, versioned Drizzle migrations. No runtime table creation.

```bash
node node_modules/typescript/bin/tsc --noEmit
node tests/security.mjs
```

The security suite runs against a real local D1 binding in Miniflare: 12 installations, tenant and instance isolation, encrypted credential identity binding, single-use action consumption, URL/DNS guards, redaction and explicit tool targets. These tests do not establish connectivity to a user's real instance.

Publishing uses the Sites source workflow and its canonical private MCP plugin. Do not create a duplicate app/plugin or use the personal plugin archive editor for the provisioned app.

Official implementation references:

- https://developers.home-assistant.io/docs/auth_api/
- https://developers.home-assistant.io/docs/api/rest/
- https://developers.home-assistant.io/docs/api/websocket/
- https://github.com/home-assistant/core/blob/dev/homeassistant/components/hassio/websocket_api.py
- https://www.hacs.dev/docs/faq/data_sources/

Independent tool; not affiliated with Home Assistant or HACS.
