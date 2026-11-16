"""Loads the daylog tags from `daylog/tags.py`.

`tags.py` is gitignored (see backend/.gitignore), so each checkout defines its own tags. Copy
`tags.example.py` to `tags.py` to get started. A missing or broken file just means no tags.
"""


def get_tags():
    try:
        from .tags import FEELING
    except ImportError:
        return []

    cleaned = []
    for tag in FEELING:
        tag = str(tag).strip()
        if tag and tag not in cleaned:
            cleaned.append(tag)
    return cleaned
