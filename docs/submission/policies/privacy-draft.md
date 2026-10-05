# Home Assistant Workbench privacy policy — draft

**For publisher review. Not published, not effective, and not a verified privacy-policy URL.** The confirmed publisher is Random Development LLC. Effective date, jurisdiction, platform retention, backup deletion, and the remaining policy decisions still need confirmation before this draft is published.

## Publisher and contact

Random Development LLC

For private security or data-deletion requests: **services@randomdevelopment.biz**. Public support uses [GitHub issues](https://github.com/RandomDevelopment/home-assistant-workbench/issues). The publisher confirmed this legal name for these release materials.

## What Workbench processes

Workbench associates stored records with the trusted account identifier supplied by its ChatGPT-hosted sign-in service. It stores each installation’s chosen name, HTTPS URL, access mode, notes, encrypted Home Assistant authorization tokens, latest version/capability snapshot, and any component repository/version mappings you save. OAuth uses short-lived authorization-state records. Prepared actions are stored with a single-use identifier and a ten-minute execution deadline.

The current inventory snapshot stores Core version, time zone, unit system, components, available integration manifests, Supervisor/add-on information when available, and update entities. Workbench reads entity state, bounded recorder history and logbook evidence, registries, configuration entries, or a bounded error-log excerpt when the requested tool needs them. Returned Home Assistant information can include private household or device information and is sent back into your ChatGPT conversation.

History/logbook results are returned to the requesting ChatGPT conversation and are not saved in Workbench inventory snapshots or automatically attached to feedback. They can include private room/location observations. ChatGPT and Home Assistant maintain their own retention rules.

Feedback stores the text you submit, its tracking ID, status, dates, and maintainer replies. Installation context is optional and includes only that installation’s ID and known Core version. Logs and credentials are not attached automatically. Free text may still contain personal information; do not include secrets, addresses, or household history. Common credential patterns are redacted as a safeguard, not a guarantee.

## Why it is used and where requests go

The app uses these records to connect to your selected installation, provide diagnostics, research compatibility, run actions you authorize, and let the maintainer respond to feedback. It fetches Home Assistant/HACS documentation and relevant GitHub repositories, releases, and issues. Version identifiers and search symptoms can be included in public-source requests; avoid private information in those search terms.

Workbench is hosted through ChatGPT Sites on infrastructure managed by OpenAI and its hosting providers. ChatGPT receives the tool results you request. Your Home Assistant receives the API requests for that installation. GitHub and documentation hosts receive research requests. No advertising SDK, payment flow, or separate analytics integration has been added to Workbench’s source. The hosting platform may maintain access logs, usage analytics, backups, and security records under its own terms and retention arrangements; those details must be confirmed for the public release.

User feedback is visible to the submitter and the configured maintainer. It is not automatically posted to GitHub. The maintainer can link an existing public issue, but copying report details into that issue is a separate disclosure requiring review of the user’s consent and content. **Publisher decision still needed: define whether and how anonymized feedback may be published.**

## Retention and deletion

Installation credentials and saved settings remain until you disconnect or remove the installation. Disconnect clears the stored credentials and latest snapshot, OAuth-state records, and prepared actions for that installation; removal also deletes its component mappings and installation record. OAuth revocation is attempted where supported. Long-lived tokens should also be revoked in the Home Assistant profile.

Feedback expires 90 days after it was submitted. Replies and status changes do not reset that deadline. Users can delete their own report and its reply through Feedback or an explicitly requested deletion in ChatGPT. Expired feedback is purged during the next feedback operation. A daily cleanup task is enabled at 3:15 a.m. America/Chicago. Its authenticated maintainer tool passed a manual setup check; the first scheduled run is not yet verified. Scheduled cleanup depends on the connected task succeeding, so this draft does not guarantee a precise physical-deletion deadline.

Expired OAuth states and action drafts cannot be used after their execution deadline, but physical row cleanup and platform backups have separate retention questions. **Publisher decisions still needed: physical cleanup of unused states/drafts, support-email retention, platform logs/backups, account-wide deletion process, and response timing.** Deleting app records does not delete a ChatGPT conversation, a separate GitHub issue, or records maintained by Home Assistant or infrastructure providers.

## Security and your choices

Credentials are encrypted before database storage and bound to a user and installation. Reads are scoped to the signed-in user. Changes are disabled by default and need the selected installation’s write setting plus the user’s authorization. Do not enter tokens or passwords in chat; use the connection manager. The operator controls hosting and its runtime secrets, so encryption is not a claim that the operator can never access credentials.

You can select which installation to use, keep read-only mode, omit installation context from feedback, disconnect, remove installations, and delete your own feedback. Public support uses GitHub issues. For private security or data-deletion requests, the publisher confirmed **services@randomdevelopment.biz**. Handling and response commitments still need publisher review before this policy is effective.

## Before publication

Confirm purposes and legal bases where required, international processing arrangements, applicable rights/contact procedures, children’s eligibility/attestation, platform retention, and all outstanding retention/sharing decisions. Publisher identity verification in the submission portal is separate from the confirmed publisher name above. Do not publish this unresolved draft as an effective policy.
