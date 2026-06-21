#!/usr/bin/env python3
"""Generate a sample PDF checklist using ReportLab.

Writes artifact to Artefakty/13 - 06 - 2026 - OpenSpace-Extract/skills/output/checklist.pdf
and prints ARTIFACT_PATH:<absolute_path> for discovery.
"""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os


def main():
    out_dir = Path("Artefakty/13 - 06 - 2026 - OpenSpace-Extract/skills/output")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "checklist.pdf"

    doc = SimpleDocTemplate(str(out_path), pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], alignment=1)
    elements.append(Paragraph("Compliance Checklist", title_style))
    from pathlib import Path
    import argparse


    def generate_reportlab(out_path: Path):
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch

        doc = SimpleDocTemplate(str(out_path), pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], alignment=1)
        elements.append(Paragraph("Compliance Checklist", title_style))
        elements.append(Spacer(1, 0.25 * inch))

        data = [
            ["Criteria", "Status", "Score", "Notes"],
            ["Security Review", "Pass", "10", "All checks passed"],
            ["Code Quality", "Pass", "8", "Minor improvements"],
            ["Documentation", "Pending", "5", "Needs updates"],
        ]

        table = Table(data, colWidths=[3 * inch, 1 * inch, 1 * inch, 2 * inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ]))
        elements.append(table)

        doc.build(elements)


    def generate_fpdf2(out_path: Path):
        from fpdf import FPDF

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(0, 10, "Project Report", ln=True, align='C')

        pdf.set_font("Arial", size=12)
        pdf.ln(10)

        sections = [
            ("Executive Summary", "Project completed successfully."),
            ("Key Findings", "All milestones achieved on time."),
            ("Recommendations", "Continue current practices."),
        ]

        for title, content in sections:
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, title, ln=True)
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 8, content)
            pdf.ln(5)

        pdf.output(str(out_path))


    def main():
        parser = argparse.ArgumentParser(description='Generate PDF checklist/report (simple CLI)')
        parser.add_argument('--output', '-o', help='Output PDF path', default=None)
        parser.add_argument('--template', '-t', choices=['reportlab', 'fpdf2'], default='reportlab', help='Template engine')
        args = parser.parse_args()

        default_dir = Path("Artefakty/13 - 06 - 2026 - OpenSpace-Extract/skills/output")
        default_dir.mkdir(parents=True, exist_ok=True)

        if args.output:
            out_path = Path(args.output)
            out_path.parent.mkdir(parents=True, exist_ok=True)
        else:
            name = 'checklist.pdf' if args.template == 'reportlab' else 'report.pdf'
            out_path = default_dir / name

        if args.template == 'reportlab':
            generate_reportlab(out_path)
        else:
            generate_fpdf2(out_path)

        abs_path = out_path.resolve()
        print(f"ARTIFACT_PATH:{abs_path}")
        try:
            print(f"File exists: {out_path.exists()}")
            print(f"File size: {out_path.stat().st_size} bytes")
        except Exception:
            pass


    if __name__ == '__main__':
        main()
