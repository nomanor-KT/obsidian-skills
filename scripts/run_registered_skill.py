#!/usr/bin/env python3
"""Run a skill registered in imported_skills_registry.json by name.

Usage:
  python scripts/run_registered_skill.py --name pdf-checklist-generator

This script looks up `imported_skills_registry.json`, finds the skill entry,
and invokes `scripts/skill_loader.py` pointing to the `ImportedSkills` folder.
"""
from pathlib import Path
import argparse
import json
import subprocess
import sys


def load_registry(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Registry not found: {path}")
    return json.loads(path.read_text(encoding='utf-8'))


def find_entry(registry, name):
    for e in registry:
        if e.get('name') == name:
            return e
    # case-insensitive fallback
    for e in registry:
        if e.get('name', '').lower() == name.lower():
            return e
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--name', required=False, help='Skill name to run')
    parser.add_argument('--list', action='store_true', help='List registered skills')
    parser.add_argument('--registry', default='imported_skills_registry.json')
    parser.add_argument('--python', default=None, help='Python executable to use')
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    registry_path = repo_root / args.registry
    # fallback locations
    if not registry_path.exists():
        alt = repo_root / 'OpenSpace-temp' / args.registry
        if alt.exists():
            registry_path = alt
    registry = load_registry(registry_path)

    if args.list:
        for e in registry:
            print(e.get('name'), '->', e.get('path'))
        return

    if not args.name:
        parser.error('Provide --name or --list')

    entry = find_entry(registry, args.name)
    if not entry:
        print(f"Skill not found in registry: {args.name}")
        raise SystemExit(2)

    # Determine ImportedSkills parent folder
    skill_path = Path(entry['path'])
    imported_root = skill_path.parent

    loader_path = repo_root / 'scripts' / 'skill_loader.py'
    python_exe = args.python if args.python else sys.executable
    cmd = [python_exe, str(loader_path), '--skills-dir', str(imported_root), '--skill', entry['name']]
    print('Running:', ' '.join(cmd))
    proc = subprocess.run(cmd)
    raise SystemExit(proc.returncode)


if __name__ == '__main__':
    main()
