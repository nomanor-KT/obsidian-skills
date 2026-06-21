#!/usr/bin/env python3
"""Simple skill loader/adapter.

Usage:
  python scripts/skill_loader.py --skills-dir "Artefakty/.../skills" --skill pdf-checklist-generator

Behavior:
- Finds skill directory by name inside --skills-dir
- Reads `SKILL.md`, extracts the first fenced python code block
- Writes it to a temporary file and executes it with the workspace Python
- Captures stdout and prints any ARTIFACT_PATH lines
"""
from pathlib import Path
import re
import subprocess
import argparse
import tempfile
import sys


PY_BLOCK_RE = re.compile(r"```python\n(.*?)\n```", re.DOTALL)


def find_skill_dir(skills_dir: Path, skill_name: str) -> Path:
    candidate = skills_dir / skill_name
    if candidate.exists() and candidate.is_dir():
        return candidate
    # fallback: case-insensitive search
    for p in skills_dir.iterdir():
        if p.is_dir() and p.name.lower() == skill_name.lower():
            return p
    raise FileNotFoundError(f"Skill '{skill_name}' not found in {skills_dir}")


def extract_first_python_block(skill_md: Path) -> str | None:
    text = skill_md.read_text(encoding='utf-8')
    m = PY_BLOCK_RE.search(text)
    if not m:
        return None
    return m.group(1)


def run_code(code: str, python_exe: str) -> tuple[int, str]:
    with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False, encoding='utf-8') as tf:
        tf.write(code)
        tmp_path = tf.name
    try:
        proc = subprocess.run([python_exe, tmp_path], capture_output=True, text=True, timeout=120)
        out = proc.stdout + '\n' + proc.stderr
        return proc.returncode, out
    finally:
        try:
            Path(tmp_path).unlink()
        except Exception:
            pass


def main():
    parser = argparse.ArgumentParser(description='Run a skill from a skills directory')
    parser.add_argument('--skills-dir', required=True)
    parser.add_argument('--skill', required=True)
    parser.add_argument('--python', default=None, help='Python executable to use (defaults to current interpreter)')
    args = parser.parse_args()

    skills_dir = Path(args.skills_dir)
    skill_dir = find_skill_dir(skills_dir, args.skill)
    skill_md = skill_dir / 'SKILL.md'
    if not skill_md.exists():
        print(f"SKILL.md not found in {skill_dir}")
        raise SystemExit(2)

    code = extract_first_python_block(skill_md)
    if not code:
        print("No python code block found in SKILL.md")
        raise SystemExit(3)

    python_exe = args.python if args.python else sys.executable
    print(f"Executing skill '{args.skill}' using {python_exe}")
    rc, out = run_code(code, python_exe)
    print(out)
    # find ARTIFACT_PATH lines
    for line in out.splitlines():
        if line.startswith('ARTIFACT_PATH:'):
            print(f"FOUND_ARTIFACT:{line[len('ARTIFACT_PATH:'):]}")
    raise SystemExit(rc)


if __name__ == '__main__':
    main()
