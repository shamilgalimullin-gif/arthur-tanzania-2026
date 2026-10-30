#!/usr/bin/env python3
"""Build standalone YourSafari site for static hosting (Beget, etc.).

Run: python3 universal/build-yoursafari.py
Produces: yoursafari-site.zip, containing index.html at the archive root.

This only reads the personal GitHub Pages site's static shared assets;
it NEVER copies the personal root index.html, diaries, itinerary, or tips.
"""
from __future__ import annotations
import json
import re
import shutil
import zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
UNI = REPO / "universal"
DEST = REPO / "_site_yoursafari"
ARCHIVE = REPO / "yoursafari-site.zip"

SHARED = [
    "favicon.svg", "app-icon.jpg", "serengeti.jpg", "styles.css",
    "safari-extensions-v6.css", "safari-daily-v7.css",
    "safari-encounters-v8.css", "safari-simplified-v9.css",
    "safari-dates-v10.css", "safari-story-v11.css",
    "safari-story-visible-v12.css", "safari-story-full-list-v15.css",
    "safari-story-v17.css",
]
APP = [
    "index.html", "manifest.webmanifest", "sw.js",
    "app-v4.js", "universal-init.js", "features-v3.js",
    "features-v3.css", "park-wildlife-v4.js", "park-wildlife-v4.css",
]

def localize(data: str) -> str:
    """Rewrite project-page-only paths for an independent domain root."""
    return (data
        .replace("/arthur-tanzania-2026/universal/", "/")
        .replace("/arthur-tanzania-2026/", "/")
        .replace('href="../', 'href="/')
        .replace('src="../', 'src="/'))

def build() -> None:
    if DEST.exists():
        shutil.rmtree(DEST)
    DEST.mkdir(parents=True)
    for directory in ("assets", "animals"):
        source = REPO / directory
        if not source.is_dir():
            raise RuntimeError(f"Missing shared assets: {source}")
        shutil.copytree(source, DEST / directory)

    for name in SHARED:
        source = REPO / name
        if not source.is_file():
            raise RuntimeError(f"Missing shared file: {name}")
        data = source.read_bytes()
        # Rewrite only UTF-8 CSS. Binary images are copied without changes.
        if name.endswith(".css"):
            data = localize(data.decode("utf-8")).encode("utf-8")
        (DEST / name).write_bytes(data)

    for name in APP:
        source = UNI / name
        if not source.is_file():
            raise RuntimeError(f"Missing app file: {name}")
        data = localize(source.read_text(encoding="utf-8"))
        if name == "index.html":
            data = data.replace(
                "<title>Моё сафари — универсальный дневник путешествия</title>",
                "<title>YourSafari — дневник сафари и фотоальбом</title>",
            )
            data = data.replace("Моё сафари — дневник наблюдений за животными Африки", "YourSafari — дневник сафари, встречи с животными и фотоальбомы")
            if 'src="./app-v4.js"' not in data:
                raise RuntimeError("Wrong universal app entry point: expected app-v4.js")
        elif name == "manifest.webmanifest":
            manifest = json.loads(data)
            manifest.update({
                "name": "YourSafari — мой дневник сафари",
                "short_name": "YourSafari",
                "description": "Сохраняйте встречи с дикими животными и создавайте фотоальбом сафари",
                "start_url": "/", "scope": "/",
            })
            for icon in manifest.get("icons", []):
                icon["src"] = "/app-icon.jpg"
            data = json.dumps(manifest, indent=2, ensure_ascii=False)
        elif name == "sw.js":
            data = data.replace("safari-universal-core-v4", "yoursafari-core-v1")
            data = data.replace("safari-universal-media-v1", "yoursafari-media-v1")
            # Existing worker cleanup matches universal-prefixed caches, so
            # make the family consistent to clean our future root-scoped caches.
            data = data.replace('k.startsWith("safari-universal-")', 'k.startsWith("yoursafari-")')
        elif name == "app-v4.js":
            # Separate only the origin/paths: data stays local to the user.
            if "/arthur-tanzania-2026/" in data:
                raise RuntimeError("Found old GitHub Pages paths in app")
        (DEST / name).write_text(data, encoding="utf-8")

    # The beta site is intentionally not searchable before photography/license audit.
    (DEST / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")

    required = [
        "index.html", "sw.js", "manifest.webmanifest", "app-v4.js",
        "park-wildlife-v4.js", "animals", "assets", "styles.css",
    ]
    if any(not (DEST / p).exists() for p in required):
        raise RuntimeError("Build incomplete: missing required files")
    if "/arthur-tanzania-2026/" in (DEST / "sw.js").read_text(encoding="utf-8"):
        raise RuntimeError("Service worker still points to personal page")

    if ARCHIVE.exists():
        ARCHIVE.unlink()
    with zipfile.ZipFile(ARCHIVE, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=7) as z:
        for p in sorted(DEST.rglob("*")):
            if p.is_file():
                z.write(p, p.relative_to(DEST).as_posix())

    with zipfile.ZipFile(ARCHIVE) as z:
        assert "index.html" in z.namelist() and "animals/lion.jpg" in z.namelist()
        print(f"YourSafari READY: {len(z.namelist())} files, {ARCHIVE.stat().st_size/1024/1024:.1f} MiB")
        print("Upload this ZIP and unpack directly INSIDE yourdomain.ru/public_html")
        print("Contains universal safari ONLY; original personal index is not included.")

if __name__ == "__main__":
    build()
