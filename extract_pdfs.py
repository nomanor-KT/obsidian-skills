import fitz
import os

pdf_files = [
    "eLaborat bez DO.pdf",
    "Fee-for-DG-Misdeclaration-and-Monitoring-Service-for-Selected-Battery-DG-Shipments.pdf",
    "Instrukcja_AMS_ISF_MANIFEST_MM.pdf",
    "Instrukcja_AMS_ISF_MANIFEST_MM_v1.1.pdf",
    "Instrukcja_AMS_ISF_MANIFEST_MM_v2.0.pdf",
    "Instrukcja_AMS_ISF_MANIFEST_MM_v2.1.pdf"
]
base_path = "Obsidian/Karol-KB/RAW"

for filename in pdf_files:
    path = os.path.join(base_path, filename)
    print(f"--- File: {filename} ---")
    try:
        doc = fitz.open(path)
        print(f"Metadata: {doc.metadata}")
        num_pages = min(2, len(doc))
        for i in range(num_pages):
            page = doc.load_page(i)
            print(f"Page {i+1} Text:\n{page.get_text()[:1000]}")
        doc.close()
    except Exception as e:
        print(f"Error reading {filename}: {e}")
    print("\n")
