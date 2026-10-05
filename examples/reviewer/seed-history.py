"""Create real recorder observations in a dedicated demo HA, never a real home."""
import argparse
import getpass
import json
import time
from datetime import datetime, timezone
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise RuntimeError("Redirect refused; check the exact demo URL.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", help="Demo HA HTTPS URL, or loopback HTTP URL")
    args = parser.parse_args()
    parsed = urlsplit(args.url)
    if parsed.username or parsed.password or parsed.query or parsed.fragment:
        parser.error("Use a base URL without credentials, query, or fragment.")
    if parsed.scheme != "https" and not (
        parsed.scheme == "http" and parsed.hostname in {"localhost", "127.0.0.1", "::1"}
    ):
        parser.error("Use HTTPS except for a loopback demo server.")
    if input("Type DEMO to confirm this is an isolated sample installation: ") != "DEMO":
        parser.error("Demo confirmation missing.")
    token = getpass.getpass("Demo-only Home Assistant token (hidden): ")
    if not token:
        parser.error("A demo token is required.")
    opener = build_opener(NoRedirect())

    def call(path, data=None):
        request = Request(args.url.rstrip("/") + "/api/" + path,
                          data=None if data is None else json.dumps(data).encode(),
                          headers={"Authorization": "Bearer " + token,
                                   "Content-Type": "application/json"})
        with opener.open(request, timeout=20) as response:
            return json.loads(response.read(1_000_000))

    config = call("config")
    if config.get("location_name") != "Workbench Demo":
        raise RuntimeError("This does not identify itself as the isolated Workbench Demo.")
    for entity in ["input_select.workbench_demo_room", "input_number.workbench_demo_revision"]:
        call("states/" + entity)
    start = datetime.now(timezone.utc).isoformat()
    for room in ["bedroom", "upstairs", "basement", "upstairs"]:
        call("services/input_select/select_option", {"entity_id": "input_select.workbench_demo_room", "option": room})
        time.sleep(2)
    # Leave the room unchanged and update one attribute to exercise classification.
    value = float(call("states/input_number.workbench_demo_revision")["state"])
    call("services/input_number/set_value", {"entity_id": "input_number.workbench_demo_revision", "value": (value + 1) % 101})
    time.sleep(2)
    call("services/input_select/select_option", {"entity_id": "input_select.workbench_demo_room", "option": "bedroom"})
    time.sleep(5)  # Allow recorder commit before the bounded query.
    end = datetime.now(timezone.utc).isoformat()
    print(json.dumps({"start_time": start, "end_time": end,
                      "entity_id": "sensor.workbench_demo_phone_room",
                      "expected": "Recorded sample room changes and one attribute update. Verify actual results."}, indent=2))


if __name__ == "__main__":
    main()
