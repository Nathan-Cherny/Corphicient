"""In-memory store for download progress, keyed by a job id the frontend chooses.

The yt-dlp progress hook writes into this store (via send_progress_to_frontend)
and the SSE view in views.py reads from it. State lives in this process only,
so it works with a single Django process (runserver, one gunicorn worker). If
you ever run several workers, swap this for Redis or the database.
"""

import threading
import time

# How long a finished/failed job is kept around before it is cleaned up.
_KEEP_SECONDS = 300

_lock = threading.Lock()
_jobs = {}


def update(job_id, **fields):
    """Create or update a job's state. Always stamps the last-update time."""
    if not job_id:
        return
    with _lock:
        state = _jobs.setdefault(job_id, {"status": "pending", "progress": 0})
        state.update(fields)
        state["_updated"] = time.time()
        _cleanup_locked()


def get(job_id):
    """Return a copy of the job's public state, or None if the job is unknown."""
    with _lock:
        state = _jobs.get(job_id)
        if state is None:
            return None
        return {k: v for k, v in state.items() if not k.startswith("_")}


def _cleanup_locked():
    now = time.time()
    stale = [
        job_id
        for job_id, state in _jobs.items()
        if state["status"] in ("done", "error")
        and now - state["_updated"] > _KEEP_SECONDS
    ]
    for job_id in stale:
        del _jobs[job_id]
