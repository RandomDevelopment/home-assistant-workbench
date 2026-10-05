# Ask about recorded history

Workbench can read Home Assistant’s recorder history and logbook without making changes. Name the installation and the period you want to check.

```text
Use Home Assistant Workbench on Home to find the last recorded time my phone
was upstairs during the past six hours. Resolve its exact room sensor and
the recorded upstairs state. Use Home’s time zone, show the queried range
and supporting transitions, and explain missing data. Do not use current
timestamps as history or copy household information into feedback or GitHub.
```

For a longer period, query fixed windows of at most seven days. A room sensor’s state must actually describe its room; a device_tracker that only reports home/not_home cannot establish upstairs versus downstairs.

## What the answer means

- **Initial state:** the state recorded at the start boundary. Home Assistant can synthesize its timestamps at that boundary. It does not establish a room-entry time.
- **State change:** a recorded transition. A missing previous state is labelled unknown, rather than inventing the room the phone came from.
- **Attribute update / repeated state:** another record of the same state. It is not a room-to-room movement.
- **Observation:** insufficient evidence to identify a specific transition.

An exact state match reports the latest matching observation and recorded transition **within the queried period**. It does not establish the last occurrence ever or prove uninterrupted presence between records. Sensor states such as unknown/unavailable are not physical rooms. The answer should include Core version, the installation’s time zone, the UTC query boundaries, and relevant evidence.

## Limits and missing evidence

History accepts 1–10 exact entities. Logbook accepts one exact entity and verifies current read permission before querying; a removed entity can have retained history, but Workbench cannot verify its logbook access. Unrelated logbook entity context and user identifiers are omitted. History attributes are not requested.

Use ISO 8601 timestamps with seconds and `Z` or an explicit UTC offset. The end boundary is exclusive; the largest window is seven days. Pages contain at most 200 records. The upstream response is limited to one megabyte and 5,000 records; narrow a larger request. Pagination repeats the same fixed query and does not store a snapshot, so concurrent recorder changes can alter later pages.

Empty results can reflect recorder exclusions, purge retention, permission filtering, missing entities, or gaps in recording. These endpoints do not reveal the installation’s actual recorder retention or filters. Workbench never converts empty results into “the phone did not move.” Check Home Assistant’s History/Activity view and recorder configuration when evidence is missing.

History stays in the requested tool result and ChatGPT conversation; Workbench does not save it to its inventory or feedback database. Do not publish it or attach it to a bug report without explicit authorization.

## API references and verification

- [Official REST API](https://developers.home-assistant.io/docs/api/rest/)
- [Recorder filters and retention](https://www.home-assistant.io/integrations/recorder/)
- [Core 2026.9.4 history endpoint](https://github.com/home-assistant/core/blob/2026.9.4/homeassistant/components/history/__init__.py)
- [Core 2026.9.4 logbook endpoint](https://github.com/home-assistant/core/blob/2026.9.4/homeassistant/components/logbook/rest_api.py)
- [Core 2026.9.4 entity permission check](https://github.com/home-assistant/core/blob/2026.9.4/homeassistant/components/api/__init__.py)

Automated tests use dedicated sample data through the actual authenticated REST client and a mocked Home Assistant transport. They cover room transitions, attribute updates, ordering, pagination, authorization, missing history and bounds. This is not a claim that every Home Assistant version or a live household installation has been tested.
