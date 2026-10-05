# Contributing

Thanks for helping make Home Assistant Workbench easier to use.

## Report a bug or request a feature

Use **Feedback** inside your Workbench copy if you prefer not to connect GitHub. That report goes to your copy’s maintainer. For this upstream project, open a GitHub issue with:

- A short description of the task.
- Steps to reproduce, expected behavior, and actual behavior.
- Relevant Core/integration versions and whether the API is supported.
- A minimal redacted example, if needed.

Do not include HA credentials, private instance URLs, household history, or sensitive logs in public issues. Suspected security flaws should be reported privately to the maintainer at services@randomdevelopment.biz, with a minimal description and no live credentials.

## Propose a code change

Read the [development guide](docs/development.md) and [security notes](docs/security-and-limits.md). Keep changes focused. Explain the problem and new behavior, include meaningful validation, and preserve per-user and per-installation boundaries. Add a new generated migration for storage changes.

Run TypeScript and the existing security suite before proposing a change. Do not add tests that only restate the implementation.

## Contribution licensing

Original contributions are accepted under the project’s [Unlicense](UNLICENSE). For substantial original patches, state that you dedicate your copyright interest in the contribution to the public domain. Do not submit code you cannot contribute on those terms. Preserve all notices for third-party material.
