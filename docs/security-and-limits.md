# Security and current limits

## Boundaries

- A reachable public HTTPS hostname on port 443 is required. This hosted version does not connect directly to LAN IPs, `.local` names, or a private VPN. No network exposure is configured on users' instances.
- Home Assistant permissions remain authoritative. Supervisor/OS/add-on access depends on installation type and HA user permissions; unsupported requests produce explicit capability errors.
- There is no general filesystem, SSH, YAML file writer, or HACS installer. Configuration work can be researched and drafted; applying unsupported file operations requires a separately authorized local integration.
- Component repository/version mappings are user-provided and labelled accordingly. Live manifests and update entities can help verify them; they do not guarantee complete discovery of every HACS frontend repository.
- History requires 1–10 exact entity IDs; logbook requires one currently readable entity. Both require offset-aware timestamps and a range of at most seven days, with up to 200 records per page, a one-megabyte upstream body limit, and at most 5,000 upstream records. Larger requests fail with guidance to narrow the range. History attributes are omitted; logbook context/user IDs are not returned.
- Empty history is missing evidence. Recorder exclusions, purge retention, and complete recording coverage are unknown unless verified separately. Initial states and attribute updates are not room transitions. Historical tool results are returned to ChatGPT but are not stored in Workbench snapshots or attached to feedback.
- Public GitHub API reads use no GitHub credential and may be rate limited. Up to 250 releases are scanned for an installed release; truncation is disclosed. Custom GitHub repositories must be registered for the selected installation.
- Documentation fetches do not follow redirects. Use canonical URLs, such as https://www.hacs.dev/docs/, resolving legacy redirects through search.
- The initial publication and plugin are private. Sharing requires appropriate access to both the Site and its provisioned plugin. Sharing does not combine users' installation data.
- Full verification against a real Home Assistant installation requires the owner to connect it; no real credentials were supplied during implementation.

## Security and operations

Sites provides authenticated, Site-scoped user identity at its trusted boundary. Data-bearing requests require that identity; discovery carries no private data. All D1 installation/component/draft/state queries enforce owner and installation scope. Browser writes require same-origin requests. OAuth callbacks consume a ten-minute, user-bound state and an HttpOnly Secure browser nonce. Tokens are encrypted with AES-256-GCM with owner and installation as authenticated associated data. Encryption key and application origin are managed runtime settings, never committed to source. Changing the encryption key without migrating ciphertext will require reconnection.

URLs reject userinfo, local/reserved names, literal IPs, non-HTTPS schemes and nonstandard ports. Outbound instance/documentation requests validate A/AAAA records against public-address rules, reject redirects, and use timeouts. Cloud runtime egress protections must remain in place: DNS checks by themselves cannot pin a hostname to the resolver answer. User URLs must never be routed through an unprotected arbitrary private-network proxy. Credential-bearing requests are restricted to the selected installation origin.

Common token/password/key fields and JWT/Bearer strings are redacted from model-visible data. Redaction is best-effort: logs and entity content can still contain household information. Request logs must not capture tokens, authorization headers, OAuth codes, or response bodies. Disconnect deletes local credentials, snapshots and pending drafts/states and requests revocation for OAuth refresh tokens. Users must revoke long-lived tokens in their HA profile themselves; failed remote revocation is reported.

