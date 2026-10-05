# Isolated reviewer demonstration

**Prepared, not deployed or acceptance-tested.** This environment has not been
started here: Docker is unavailable in the authoring environment. YAML parsing
and Python syntax checks do not prove Home Assistant accepts the configuration.
Do not describe it as a completed reviewer account or demo recording.

Use a dedicated Linux Docker Engine host. These two Home Assistant Container
installations have separate data directories, loopback-only ports, sample helpers,
a virtual lamp, and no mounted household configuration, USB or D-Bus devices.
They intentionally have no Supervisor/add-ons. Both use Core 2026.9.4; comparing
them should truthfully report equal versions, not fabricate a difference.

From this directory, initialize fresh data folders, then start the containers:

```sh
mkdir demo-home demo-workshop
cp configuration.yaml demo-home/configuration.yaml
cp configuration.yaml demo-workshop/configuration.yaml
docker compose up -d
```

Complete Home Assistant onboarding separately on the host at ports 18123 and
18124, creating demo-only accounts. Keep passwords/tokens out of Git, chat,
recordings, and command-line arguments. No credentials are supplied in this kit.
Do not reuse household configuration or credentials.

Workbench requires public HTTPS on port 443 for each installation. Hosting and
TLS/reverse-proxy configuration remain to be provided and verified on the chosen
host. These loopback URLs are **not** usable from the hosted plugin. Home
Assistant's trusted-proxy settings must match the actual reverse proxy; this kit
does not guess them or open the servers to the Internet.

Connect the two verified HTTPS origins as **Demo Home** and **Demo Workshop** in
the reviewer account. Confirm separate installation IDs. Check that the template
light resolves to `light.demo_lamp` and the sensor resolves to
`sensor.workbench_demo_phone_room`; if HA assigns different IDs, use its actual
IDs in the cases. Keep changes disabled on Demo Workshop and enable prepared
changes only for the Demo Home virtual lamp case.

For history preparation, create a demo-only token in the demo HA profile and run:

```sh
python3 seed-history.py https://YOUR-DEMO-HOME-ORIGIN
```

Replace the uppercase origin with the actual verified URL; it is a placeholder,
not a published endpoint. The script checks the demo instance name, prompts for
the token without displaying it, refuses redirects, and creates real recorded
sample transitions. Use its printed offset-aware interval for history/logbook
queries. Query the excluded input select separately and explain missing evidence;
do not infer no movement from an empty result. Re-run seeding before recording
or review because recorder retains three days in this demo configuration.

For documentation research, track the built-in `sun` integration against
`home-assistant/core` at `2026.9.4`, after confirming it is installed. Do not claim
this demo includes HACS or custom integrations. Record the actual compatibility
evidence and any limitations.

Run the eight submission cases and record actual results, then follow
[the recording plan](../../docs/submission/walkthrough.md). The saved recording
must be played back and hosted where reviewers can access it. Secure portal
fields hold reviewer credentials. This kit alone completes none of those steps.

References checked October 5, 2026 UTC:

- [Official Container installation](https://www.home-assistant.io/installation/linux/)
- [Template entities](https://www.home-assistant.io/integrations/template/)
- [Input select](https://www.home-assistant.io/integrations/input_select/)
- [REST API](https://developers.home-assistant.io/docs/api/rest/)
