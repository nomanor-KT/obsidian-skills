#!/usr/bin/env python3
"""Integration test: run `skill_loader.py` for a skill and copy found artifact to Artefakty output."""
from pathlib import Path
import subprocess
import sys
import re
import shutil


REPO_ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = REPO_ROOT / "Artefakty/13 - 06 - 2026 - OpenSpace-Extract/skills"
SKILL_NAME = "pdf-checklist-generator"
OUTPUT_DIR = Path("Artefakty/13 - 06 - 2026 - OpenSpace-Extract/skills/output")


def run_loader(python_exe: str) -> str:
    loader_path = Path(__file__).resolve().parent / 'skill_loader.py'
    cmd = [python_exe, str(loader_path), "--skills-dir", str(SKILLS_DIR), "--skill", SKILL_NAME]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    print(proc.stdout)
    print(proc.stderr, file=sys.stderr)
    return proc.stdout + "\n" + proc.stderr


def find_artifact_from_output(output: str) -> list[str]:
    matches = []
    for line in output.splitlines():
        line = line.strip()
        if line.startswith('FOUND_ARTIFACT:'):
            matches.append(line[len('FOUND_ARTIFACT:'):])
    return matches


def locate_file(name: str) -> Path | None:
    # If absolute path and exists, return it
    p = Path(name)
    if p.exists():
        return p
    # else search for basename in workspace
    basename = Path(name).name
    for f in Path('.').rglob(basename):
        return f
    return None


def main():
    python_exe = sys.executable
    print(f"Using python: {python_exe}")

    out = run_loader(python_exe)
    artifacts = find_artifact_from_output(out)
    if not artifacts:
        print("No artifacts reported by loader.")
        raise SystemExit(2)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for art in artifacts:
        located = locate_file(art)
        if not located:
            print(f"Artifact {art} not found in workspace")
            continue
        dest = OUTPUT_DIR / located.name
        shutil.copy2(located, dest)
        print(f"COPIED_ARTIFACT:{dest.resolve()}")


if __name__ == '__main__':
    main()
