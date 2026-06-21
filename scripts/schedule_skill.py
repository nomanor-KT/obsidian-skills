#!/usr/bin/env python3
"""Schedule a registered skill using Windows Task Scheduler (schtasks).

This script builds the `schtasks` command to run `scripts/run_registered_skill.py`
under the user account. By default it prints the command (dry-run). Pass
`--confirm` to actually create the scheduled task.

Examples:
  # Show command for daily run at 09:00
  python scripts/schedule_skill.py --name pdf-checklist-generator --schedule DAILY --time 09:00

  # Create task (confirm)
  python scripts/schedule_skill.py --name pdf-checklist-generator --schedule DAILY --time 09:00 --confirm

  # Delete the task
  python scripts/schedule_skill.py --name pdf-checklist-generator --delete --confirm
"""
from pathlib import Path
import argparse
import sys
import shlex
import subprocess


def build_schtasks_command(task_name: str, python_exe: str, script_path: str, skill_name: str, schedule: str, time: str, force: bool) -> list[str]:
    # Build the /TR command (the action) — quote paths
    tr = f'"{python_exe}" "{script_path}" --name "{skill_name}"'
    cmd = ["schtasks", "/Create", "/TN", task_name, "/TR", tr, "/SC", schedule]
    if time:
        cmd += ["/ST", time]
    if force:
        cmd += ["/F"]
    return cmd


def build_delete_command(task_name: str) -> list[str]:
    return ["schtasks", "/Delete", "/TN", task_name, "/F"]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--name', required=True, help='Registered skill name')
    parser.add_argument('--task-name', default=None, help='Task Scheduler task name (defaults to KarolOS_Skill_<name>)')
    parser.add_argument('--schedule', choices=['DAILY','HOURLY','ONCE','MINUTE','WEEKLY','MONTHLY'], default='DAILY')
    parser.add_argument('--time', default='09:00', help='Start time HH:MM (24h) for DAILY/ONCE schedule')
    parser.add_argument('--force', action='store_true', help='Force overwrite existing task')
    parser.add_argument('--confirm', action='store_true', help='Actually run schtasks (otherwise dry-run)')
    parser.add_argument('--delete', action='store_true', help='Delete the named task instead of creating')
    parser.add_argument('--python', default=None, help='Python executable to run (defaults to current interpreter)')
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    registry_path = repo_root / 'imported_skills_registry.json'
    if not registry_path.exists():
        # fallback to OpenSpace-temp location
        alt = repo_root / 'OpenSpace-temp' / 'imported_skills_registry.json'
        if alt.exists():
            registry_path = alt

    if not registry_path.exists():
        print('Registry not found (imported_skills_registry.json). Run bulk importer first.')
        raise SystemExit(2)

    # task name
    task_name = args.task_name if args.task_name else f'KarolOS_Skill_{args.name}'

    python_exe = args.python if args.python else sys.executable
    script_path = repo_root / 'scripts' / 'run_registered_skill.py'

    if args.delete:
        cmd = build_delete_command(task_name)
        print('Delete command:')
        print(' '.join(map(shlex.quote, cmd)))
        if args.confirm:
            subprocess.run(cmd)
        return

    cmd = build_schtasks_command(task_name, python_exe, str(script_path), args.name, args.schedule, args.time, args.force)
    print('schtasks command:')
    print(' '.join(map(shlex.quote, cmd)))
    if not args.confirm:
        print('\nDry-run. Re-run with --confirm to create the scheduled task.')
        return

    # Execute
    ret = subprocess.run(cmd)
    raise SystemExit(ret.returncode)


if __name__ == '__main__':
    main()
