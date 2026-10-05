# Walk through common tasks

[Back to README](../README.md)

## Connect a first home

**Goal:** Ask ChatGPT about the Home Assistant installation at home.

1. Open your Workbench copy and sign in with ChatGPT.
2. Choose **Add installation**, name it **Home**, and enter its public HTTPS base URL.
3. The new home appears in the sidebar. Its setup progress shows the next step: sign in to Home Assistant.
4. Choose **Sign in to Home Assistant**. Complete authorization on the installation’s own page. Workbench then shows the connection as authorized.
5. Choose **Refresh inventory**. Look at **What this home supports** to see available and unavailable capabilities.
6. Install/connect your provisioned plugin, start a new ChatGPT chat, select it with **@**, and copy the first-request prompt from the home overview.

**Success:** ChatGPT reads this home’s live version and supported capabilities. An unavailable Supervisor API is an explicit limitation, not a failed Core connection.

**If blocked:** check the HTTPS URL, reachable hostname, Home Assistant permissions, and connection error. Use the token form only if appropriate; credentials stay out of chat.

## Add and switch to a workshop

**Goal:** Keep Workshop separate from Home.

1. Add **Workshop** with its own URL and authorization.
2. Select Workshop in the sidebar. Its overview, notes, component list, and access mode belong to Workshop.
3. In chat, say “Inspect Workshop.” The plugin resolves the name to an installation ID.
4. For a comparison, name both homes and request reads only. For a change, name the single intended installation.

**Success:** A Workshop action does not reuse Home’s credentials or change Home. If names are ambiguous, clarify the installation rather than picking the first.

## Investigate an integration problem

**Goal:** Understand a problem before changing versions.

1. Select the affected home and refresh its inventory.
2. Open **Components**. Enter the real upstream repository and installed version from Home Assistant/HACS; add documentation if relevant.
3. Choose **Check releases & issues** to collect release and issue evidence.
4. Ask ChatGPT about the concrete symptom. It should match documentation and repository source to installed and target versions, check issue status and maintainer comments, and cite sources.
5. Review the proposed next step. A matching issue is evidence, not proof that it caused your problem.

**Success:** You get a version-aware explanation, known unknowns, and a small next action. “No issues found” does not establish compatibility.

## Turn off the basement lights

**Goal:** Make one authorized change on Home.

1. Select Home → **Settings** → **Allow prepared changes**, then save.
2. In chat, explicitly request turning off the basement lights on Home.
3. The plugin resolves live entities and services. Ambiguity must be clarified.
4. It prepares a validated, installation-bound action, executes within your authorization, and checks the resulting entity states.

**Success:** The correct entities are off. A draft expires after ten minutes and can run only once. If the result is uncertain, inspect before retrying. The plugin cannot override your Home Assistant permissions.

## Send a feature request

**Goal:** Ask for history queries without connecting GitHub.

1. Open **Feedback**. You do not need a connected Home Assistant installation.
2. Choose **Feature request**, add a title and details, and optionally include an owned installation’s ID and known Core version.
3. Choose **Submit feedback**. Save the tracking ID shown in the success message.
4. Under **Your feedback**, read its status and the maintainer’s reply.

**Success:** Your report is in your copy’s feedback inbox. Other users cannot read it. Only that copy’s configured maintainer can review the whole inbox. The maintainer may create and link a GitHub issue separately; feedback is not automatically posted publicly.

## What is still outside scope?

- Historical recorder/logbook queries: planned in upstream issue #1.
- Direct YAML/file changes, SSH, or installing integrations/add-ons: unsupported.
- LAN-only addresses: not reachable by this hosted implementation.

[Security and capability details](security-and-limits.md)
