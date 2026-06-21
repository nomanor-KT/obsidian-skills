#!/usr/bin/env python3
"""Bulk import skill directories into local `ImportedSkills/` and register them.

Behavior:
- Copies each skill directory from a source skills directory to `ImportedSkills/` (skip `output`).
- Ensures each skill has a `.skill_id` file (generates UUID if missing).
- Writes/updates `imported_skills_registry.json` with entries: name, path, skill_id, source.
"""
from pathlib import Path
import shutil
import argparse
import json
import uuid


def ensure_skill_id(dest_dir: Path) -> str:
    sid = dest_dir / '.skill_id'
    if sid.exists():
        return sid.read_text(encoding='utf-8').strip()
    val = str(uuid.uuid4())
    sid.write_text(val, encoding='utf-8')
    return val


def import_skills(src_dir: Path, dest_root: Path, force: bool = False) -> list[dict]:
    dest_root.mkdir(parents=True, exist_ok=True)
    registry = []
    for child in sorted(src_dir.iterdir()):
        if not child.is_dir():
            continue
        if child.name == 'output':
            continue
        dest = dest_root / child.name
        if dest.exists():
            if force:
                shutil.rmtree(dest)
            else:
                # skip existing
                skill_id = (dest / '.skill_id').read_text(encoding='utf-8').strip() if (dest / '.skill_id').exists() else None
                registry.append({'name': child.name, 'path': str(dest), 'skill_id': skill_id, 'source': str(child)})
                continue
        shutil.copytree(child, dest)
        skill_id = ensure_skill_id(dest)
        registry.append({'name': child.name, 'path': str(dest), 'skill_id': skill_id, 'source': str(child)})
    return registry


def load_registry(path: Path) -> list:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding='utf-8'))
        except Exception:
            return []
    return []


def save_registry(path: Path, entries: list):
    path.write_text(json.dumps(entries, indent=2, ensure_ascii=False), encoding='utf-8')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--src', required=True, help='Source skills directory')
    parser.add_argument('--dest', default='ImportedSkills', help='Destination root for imported skills')
    parser.add_argument('--force', action='store_true', help='Overwrite existing imported skills')
    args = parser.parse_args()

    src = Path(args.src)
    dest_root = Path(args.dest)
    if not src.exists():
        print(f"Source directory not found: {src}")
        raise SystemExit(2)

    registry_path = Path('imported_skills_registry.json')
    existing = load_registry(registry_path)

    new_entries = import_skills(src, dest_root, force=args.force)

    # merge by name, prefer existing entries preserved unless overwritten
    by_name = {e['name']: e for e in existing}
    for e in new_entries:
        by_name[e['name']] = e

    merged = list(by_name.values())
    save_registry(registry_path, merged)
    print(f"Imported {len(new_entries)} skill(s). Registry: {registry_path}")


if __name__ == '__main__':
    main()
