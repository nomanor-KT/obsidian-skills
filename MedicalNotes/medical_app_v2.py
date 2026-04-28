"""
Medical Notes - Profesjonalna Aplikacja Desktopowa
Wersja: 2.0 | Offline | Lokalne przechowywanie danych | Załączniki
"""

import customtkinter as ctk
import json
import os
import shutil
from datetime import datetime
from pathlib import Path
import tkinter.messagebox as msgbox
from tkinter import filedialog
import sys
import subprocess
import platform

# Konfiguracja wyglądu aplikacji
ctk.set_appearance_mode("light")
ctk.set_default_color_theme("blue")

class MedicalNotesApp:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("Medical Notes - Dokumentacja Pacjentów")
        self.root.geometry("1400x900")
        
        # Ścieżka do folderu z danymi (w katalogu aplikacji)
        self.data_folder = Path(__file__).parent / "patient_data"
        self.data_folder.mkdir(exist_ok=True)
        
        # Folder na załączniki
        self.attachments_folder = self.data_folder / "attachments"
        self.attachments_folder.mkdir(exist_ok=True)
        
        self.patients_file = self.data_folder / "patients.json"
        self.patients = self.load_patients()
        self.current_patient = None
        
        self.setup_ui()
        self.refresh_patient_list()
        
    def load_patients(self):
        """Wczytaj dane pacjentów z pliku JSON"""
        if self.patients_file.exists():
            try:
                with open(self.patients_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                return {}
        return {}
    
    def save_patients(self):
        """Zapisz dane pacjentów do pliku JSON (AUTOMATYCZNIE)"""
        with open(self.patients_file, 'w', encoding='utf-8') as f:
            json.dump(self.patients, f, ensure_ascii=False, indent=2)
    
    def get_patient_attachments_folder(self, patient_id):
        """Pobierz folder załączników dla konkretnego pacjenta"""
        folder = self.attachments_folder / patient_id
        folder.mkdir(exist_ok=True)
        return folder
    
    def get_section_attachments_folder(self, patient_id, section):
        """Pobierz folder załączników dla konkretnej sekcji"""
        section_map = {
            "Wywiad": "interview",
            "Wyniki Badań": "results",
            "Diagnoza": "diagnosis"
        }
        folder = self.get_patient_attachments_folder(patient_id) / section_map[section]
        folder.mkdir(exist_ok=True)
        return folder
    
    def add_attachment(self, section):
        """Dodaj załącznik do sekcji"""
        if not self.current_patient:
            msgbox.showwarning("Uwaga", "Najpierw wybierz pacjenta!")
            return
        
        # Wybierz plik
        filetypes = [
            ("Wszystkie pliki", "*.*"),
            ("Dokumenty Word", "*.doc;*.docx"),
            ("PDF", "*.pdf"),
            ("Obrazy", "*.jpg;*.jpeg;*.png;*.bmp"),
            ("Pliki tekstowe", "*.txt")
        ]
        
        filepath = filedialog.askopenfilename(
            title=f"Wybierz plik do sekcji: {section}",
            filetypes=filetypes
        )
        
        if not filepath:
            return
        
        # Skopiuj plik do folderu załączników
        source_file = Path(filepath)
        dest_folder = self.get_section_attachments_folder(self.current_patient, section)
        
        # Unikalna nazwa pliku (z timestampem)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        dest_file = dest_folder / f"{timestamp}_{source_file.name}"
        
        try:
            shutil.copy2(source_file, dest_file)
            
            # Dodaj informację o załączniku do danych pacjenta
            section_key = {
                "Wywiad": "interview_attachments",
                "Wyniki Badań": "results_attachments",
                "Diagnoza": "diagnosis_attachments"
            }[section]
            
            if section_key not in self.patients[self.current_patient]:
                self.patients[self.current_patient][section_key] = []
            
            self.patients[self.current_patient][section_key].append({
                "filename": source_file.name,
                "stored_as": dest_file.name,
                "added": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "size": os.path.getsize(dest_file)
            })
            
            self.save_patients()
            self.select_patient(self.current_patient)  # Odśwież widok
            
            msgbox.showinfo("Sukces", f"✅ Dodano załącznik:\n{source_file.name}")
            
        except Exception as e:
            msgbox.showerror("Błąd", f"Nie udało się dodać pliku:\n{str(e)}")
    
    def open_attachment(self, patient_id, section, stored_filename):
        """Otwórz załącznik w domyślnym programie"""
        dest_folder = self.get_section_attachments_folder(patient_id, section)
        filepath = dest_folder / stored_filename
        
        if not filepath.exists():
            msgbox.showerror("Błąd", "Plik nie istnieje!")
            return
        
        try:
            # Otwórz plik w domyślnym programie
            if platform.system() == 'Windows':
                os.startfile(filepath)
            elif platform.system() == 'Darwin':  # macOS
                subprocess.run(['open', filepath])
            else:  # Linux
                subprocess.run(['xdg-open', filepath])
        except Exception as e:
            msgbox.showerror("Błąd", f"Nie udało się otworzyć pliku:\n{str(e)}")
    
    def delete_attachment(self, patient_id, section, stored_filename, original_filename):
        """Usuń załącznik"""
        if not msgbox.askyesno("Potwierdzenie", f"Czy na pewno chcesz usunąć plik:\n{original_filename}?"):
            return
        
        dest_folder = self.get_section_attachments_folder(patient_id, section)
        filepath = dest_folder / stored_filename
        
        try:
            # Usuń plik fizycznie
            if filepath.exists():
                filepath.unlink()
            
            # Usuń z danych pacjenta
            section_key = {
                "Wywiad": "interview_attachments",
                "Wyniki Badań": "results_attachments",
                "Diagnoza": "diagnosis_attachments"
            }[section]
            
            attachments = self.patients[patient_id].get(section_key, [])
            self.patients[patient_id][section_key] = [
                att for att in attachments if att['stored_as'] != stored_filename
            ]
            
            self.save_patients()
            self.select_patient(patient_id)  # Odśwież widok
            
            msgbox.showinfo("Sukces", "✅ Załącznik został usunięty!")
            
        except Exception as e:
            msgbox.showerror("Błąd", f"Nie udało się usunąć pliku:\n{str(e)}")
    
    def setup_ui(self):
        """Tworzenie interfejsu użytkownika"""
        
        # Panel górny - tytuł i wyszukiwarka
        top_frame = ctk.CTkFrame(self.root, fg_color="#1a5490", height=80)
        top_frame.pack(fill="x", padx=0, pady=0)
        
        title = ctk.CTkLabel(
            top_frame, 
            text="🏥 Medical Notes", 
            font=ctk.CTkFont(size=28, weight="bold"),
            text_color="white"
        )
        title.pack(side="left", padx=30, pady=20)
        
        # Globalna wyszukiwarka
        search_frame = ctk.CTkFrame(top_frame, fg_color="transparent")
        search_frame.pack(side="right", padx=30, pady=20)
        
        ctk.CTkLabel(
            search_frame, 
            text="🔍 Wyszukiwarka:", 
            font=ctk.CTkFont(size=14),
            text_color="white"
        ).pack(side="left", padx=(0, 10))
        
        self.search_entry = ctk.CTkEntry(
            search_frame, 
            width=300, 
            placeholder_text="Szukaj w dokumentacji...",
            height=35
        )
        self.search_entry.pack(side="left", padx=(0, 10))
        
        ctk.CTkButton(
            search_frame, 
            text="Szukaj", 
            command=self.global_search,
            width=100,
            height=35,
            fg_color="#2d7dd2"
        ).pack(side="left")
        
        # Główny kontener (3 kolumny)
        main_container = ctk.CTkFrame(self.root, fg_color="#f0f4f8")
        main_container.pack(fill="both", expand=True, padx=0, pady=0)
        
        # === LEWA KOLUMNA - Lista pacjentów ===
        left_panel = ctk.CTkFrame(main_container, width=320, fg_color="white")
        left_panel.pack(side="left", fill="y", padx=(20, 10), pady=20)
        left_panel.pack_propagate(False)
        
        ctk.CTkLabel(
            left_panel, 
            text="📋 Pacjenci", 
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#1a5490"
        ).pack(pady=(15, 10))
        
        ctk.CTkButton(
            left_panel, 
            text="➕ Dodaj Pacjenta", 
            command=self.add_patient_dialog,
            fg_color="#28a745",
            hover_color="#218838",
            height=40,
            font=ctk.CTkFont(size=14, weight="bold")
        ).pack(pady=10, padx=15, fill="x")
        
        # Scrollowalna lista pacjentów
        self.patient_list_frame = ctk.CTkScrollableFrame(
            left_panel, 
            fg_color="#f8f9fa",
            width=280
        )
        self.patient_list_frame.pack(fill="both", expand=True, padx=15, pady=(0, 15))
        
        # === ŚRODKOWA KOLUMNA - Dokumentacja ===
        middle_panel = ctk.CTkFrame(main_container, fg_color="white")
        middle_panel.pack(side="left", fill="both", expand=True, padx=10, pady=20)
        
        # Nagłówek pacjenta
        self.patient_header = ctk.CTkLabel(
            middle_panel, 
            text="Wybierz pacjenta z listy", 
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color="#1a5490"
        )
        self.patient_header.pack(pady=(20, 10))
        
        # Przyciski akcji
        action_frame = ctk.CTkFrame(middle_panel, fg_color="transparent")
        action_frame.pack(pady=10)
        
        self.edit_btn = ctk.CTkButton(
            action_frame, 
            text="✏️ Edytuj Dane", 
            command=self.edit_patient_dialog,
            fg_color="#ffc107",
            hover_color="#e0a800",
            text_color="black",
            width=140,
            state="disabled"
        )
        self.edit_btn.pack(side="left", padx=5)
        
        self.delete_btn = ctk.CTkButton(
            action_frame, 
            text="🗑️ Usuń", 
            command=self.delete_patient,
            fg_color="#dc3545",
            hover_color="#c82333",
            width=100,
            state="disabled"
        )
        self.delete_btn.pack(side="left", padx=5)
        
        self.export_btn = ctk.CTkButton(
            action_frame, 
            text="📄 Eksport do TXT", 
            command=self.export_to_txt,
            fg_color="#17a2b8",
            hover_color="#138496",
            width=150,
            state="disabled"
        )
        self.export_btn.pack(side="left", padx=5)
        
        # Scrollowalna ramka na dokumentację
        self.doc_scroll = ctk.CTkScrollableFrame(
            middle_panel, 
            fg_color="#f8f9fa"
        )
        self.doc_scroll.pack(fill="both", expand=True, padx=20, pady=(10, 20))
        
        # === PRAWA KOLUMNA - Edytor dokumentacji ===
        right_panel = ctk.CTkFrame(main_container, width=400, fg_color="white")
        right_panel.pack(side="right", fill="y", padx=(10, 20), pady=20)
        right_panel.pack_propagate(False)
        
        ctk.CTkLabel(
            right_panel, 
            text="📝 Edycja Dokumentacji", 
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="#1a5490"
        ).pack(pady=(15, 10))
        
        # Sekcje edycji
        sections = ["Wywiad", "Wyniki Badań", "Diagnoza"]
        self.text_widgets = {}
        self.attachment_buttons = {}
        
        for section in sections:
            frame = ctk.CTkFrame(right_panel, fg_color="#f8f9fa")
            frame.pack(fill="x", padx=15, pady=10)
            
            # Nagłówek sekcji z przyciskiem dodawania załącznika
            header_frame = ctk.CTkFrame(frame, fg_color="transparent")
            header_frame.pack(fill="x", padx=10, pady=(10, 5))
            
            ctk.CTkLabel(
                header_frame, 
                text=section, 
                font=ctk.CTkFont(size=14, weight="bold"),
                text_color="#495057"
            ).pack(side="left")
            
            # Przycisk dodawania załącznika
            attach_btn = ctk.CTkButton(
                header_frame,
                text="📎 Dodaj plik",
                command=lambda s=section: self.add_attachment(s),
                width=100,
                height=25,
                fg_color="#6c757d",
                hover_color="#5a6268",
                font=ctk.CTkFont(size=11),
                state="disabled"
            )
            attach_btn.pack(side="right")
            self.attachment_buttons[section] = attach_btn
            
            text = ctk.CTkTextbox(frame, height=120, wrap="word")
            text.pack(fill="both", padx=10, pady=(0, 10))
            text.configure(state="disabled")
            self.text_widgets[section] = text
        
        # Przycisk zapisu
        self.save_doc_btn = ctk.CTkButton(
            right_panel, 
            text="💾 Zapisz Dokumentację", 
            command=self.save_documentation,
            fg_color="#28a745",
            hover_color="#218838",
            height=45,
            font=ctk.CTkFont(size=15, weight="bold"),
            state="disabled"
        )
        self.save_doc_btn.pack(pady=20, padx=15, fill="x")
    
    def refresh_patient_list(self):
        """Odśwież listę pacjentów"""
        # Wyczyść aktualną listę
        for widget in self.patient_list_frame.winfo_children():
            widget.destroy()
        
        # Sortuj pacjentów alfabetycznie
        sorted_patients = sorted(self.patients.items(), key=lambda x: x[1]['name'])
        
        for patient_id, patient_data in sorted_patients:
            btn = ctk.CTkButton(
                self.patient_list_frame,
                text=f"👤 {patient_data['name']}\n   {patient_data.get('birth_date', 'Brak daty')}",
                command=lambda pid=patient_id: self.select_patient(pid),
                fg_color="#e9ecef",
                hover_color="#dee2e6",
                text_color="#212529",
                anchor="w",
                height=60,
                font=ctk.CTkFont(size=13)
            )
            btn.pack(fill="x", pady=5)
    
    def select_patient(self, patient_id):
        """Wybierz pacjenta i wyświetl dokumentację"""
        self.current_patient = patient_id
        patient = self.patients[patient_id]
        
        # Aktualizuj nagłówek
        self.patient_header.configure(
            text=f"👤 {patient['name']} | {patient.get('birth_date', '')}"
        )
        
        # Włącz przyciski
        self.edit_btn.configure(state="normal")
        self.delete_btn.configure(state="normal")
        self.export_btn.configure(state="normal")
        self.save_doc_btn.configure(state="normal")
        
        for btn in self.attachment_buttons.values():
            btn.configure(state="normal")
        
        # Wyświetl dokumentację
        self.display_documentation(patient)
        
        # Załaduj do edytora
        self.load_to_editor(patient)
    
    def display_documentation(self, patient):
        """Wyświetl dokumentację w środkowej kolumnie"""
        # Wyczyść
        for widget in self.doc_scroll.winfo_children():
            widget.destroy()
        
        # Informacje podstawowe
        info_frame = ctk.CTkFrame(self.doc_scroll, fg_color="white")
        info_frame.pack(fill="x", pady=10, padx=10)
        
        info_text = f"""
📌 PESEL: {patient.get('pesel', 'Brak')}
📧 Email: {patient.get('email', 'Brak')}
📞 Telefon: {patient.get('phone', 'Brak')}
        """.strip()
        
        ctk.CTkLabel(
            info_frame, 
            text=info_text, 
            font=ctk.CTkFont(size=13),
            justify="left"
        ).pack(anchor="w", padx=15, pady=10)
        
        # Sekcje dokumentacji z załącznikami
        sections = {
            "Wywiad": {
                "icon": "📋",
                "content": patient.get('interview', ''),
                "attachments": patient.get('interview_attachments', [])
            },
            "Wyniki Badań": {
                "icon": "🔬",
                "content": patient.get('results', ''),
                "attachments": patient.get('results_attachments', [])
            },
            "Diagnoza": {
                "icon": "💊",
                "content": patient.get('diagnosis', ''),
                "attachments": patient.get('diagnosis_attachments', [])
            }
        }
        
        for section_name, section_data in sections.items():
            frame = ctk.CTkFrame(self.doc_scroll, fg_color="white")
            frame.pack(fill="x", pady=10, padx=10)
            
            ctk.CTkLabel(
                frame, 
                text=f"{section_data['icon']} {section_name.upper()}", 
                font=ctk.CTkFont(size=16, weight="bold"),
                text_color="#1a5490"
            ).pack(anchor="w", padx=15, pady=(10, 5))
            
            # Treść tekstowa
            text_box = ctk.CTkTextbox(frame, height=120, wrap="word")
            text_box.pack(fill="both", padx=15, pady=(0, 10))
            text_box.insert("1.0", section_data['content'] if section_data['content'] else "Brak danych")
            text_box.configure(state="disabled")
            
            # Załączniki
            if section_data['attachments']:
                attach_frame = ctk.CTkFrame(frame, fg_color="#e9ecef")
                attach_frame.pack(fill="x", padx=15, pady=(0, 10))
                
                ctk.CTkLabel(
                    attach_frame,
                    text="📎 Załączniki:",
                    font=ctk.CTkFont(size=12, weight="bold"),
                    text_color="#495057"
                ).pack(anchor="w", padx=10, pady=(8, 5))
                
                for attachment in section_data['attachments']:
                    att_row = ctk.CTkFrame(attach_frame, fg_color="white")
                    att_row.pack(fill="x", padx=10, pady=3)
                    
                    # Nazwa i rozmiar pliku
                    size_mb = attachment['size'] / (1024 * 1024)
                    size_str = f"{size_mb:.2f} MB" if size_mb >= 0.01 else f"{attachment['size'] / 1024:.1f} KB"
                    
                    ctk.CTkLabel(
                        att_row,
                        text=f"📄 {attachment['filename']} ({size_str})",
                        font=ctk.CTkFont(size=11),
                        anchor="w"
                    ).pack(side="left", padx=5, fill="x", expand=True)
                    
                    # Przycisk otwórz
                    ctk.CTkButton(
                        att_row,
                        text="Otwórz",
                        command=lambda s=section_name, f=attachment['stored_as']: self.open_attachment(self.current_patient, s, f),
                        width=70,
                        height=25,
                        fg_color="#17a2b8",
                        hover_color="#138496",
                        font=ctk.CTkFont(size=10)
                    ).pack(side="right", padx=2)
                    
                    # Przycisk usuń
                    ctk.CTkButton(
                        att_row,
                        text="Usuń",
                        command=lambda s=section_name, sf=attachment['stored_as'], of=attachment['filename']: self.delete_attachment(self.current_patient, s, sf, of),
                        width=60,
                        height=25,
                        fg_color="#dc3545",
                        hover_color="#c82333",
                        font=ctk.CTkFont(size=10)
                    ).pack(side="right", padx=2)
                
                ctk.CTkLabel(
                    attach_frame,
                    text="",
                    height=5
                ).pack()
    
    def load_to_editor(self, patient):
        """Załaduj dane do edytora"""
        mapping = {
            "Wywiad": patient.get('interview', ''),
            "Wyniki Badań": patient.get('results', ''),
            "Diagnoza": patient.get('diagnosis', '')
        }
        
        for section, content in mapping.items():
            widget = self.text_widgets[section]
            widget.configure(state="normal")
            widget.delete("1.0", "end")
            widget.insert("1.0", content)
    
    def save_documentation(self):
        """Zapisz dokumentację pacjenta"""
        if not self.current_patient:
            return
        
        patient = self.patients[self.current_patient]
        
        patient['interview'] = self.text_widgets["Wywiad"].get("1.0", "end-1c")
        patient['results'] = self.text_widgets["Wyniki Badań"].get("1.0", "end-1c")
        patient['diagnosis'] = self.text_widgets["Diagnoza"].get("1.0", "end-1c")
        patient['last_modified'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        self.save_patients()
        self.display_documentation(patient)
        
        msgbox.showinfo("Sukces", "✅ Dokumentacja została zapisana!")
    
    def add_patient_dialog(self):
        """Okno dialogowe dodawania pacjenta"""
        dialog = ctk.CTkToplevel(self.root)
        dialog.title("Dodaj Nowego Pacjenta")
        dialog.geometry("500x450")
        dialog.grab_set()
        
        ctk.CTkLabel(
            dialog, 
            text="➕ Nowy Pacjent", 
            font=ctk.CTkFont(size=20, weight="bold")
        ).pack(pady=20)
        
        fields = {}
        field_names = [
            ("Imię i Nazwisko*", "name"),
            ("Data Urodzenia", "birth_date"),
            ("PESEL", "pesel"),
            ("Email", "email"),
            ("Telefon", "phone")
        ]
        
        for label, key in field_names:
            frame = ctk.CTkFrame(dialog, fg_color="transparent")
            frame.pack(fill="x", padx=40, pady=8)
            
            ctk.CTkLabel(frame, text=label, width=150, anchor="w").pack(side="left")
            entry = ctk.CTkEntry(frame, width=250)
            entry.pack(side="right")
            fields[key] = entry
        
        def save_new_patient():
            name = fields['name'].get().strip()
            if not name:
                msgbox.showerror("Błąd", "Imię i nazwisko jest wymagane!")
                return
            
            patient_id = datetime.now().strftime("%Y%m%d%H%M%S")
            
            self.patients[patient_id] = {
                'name': name,
                'birth_date': fields['birth_date'].get().strip(),
                'pesel': fields['pesel'].get().strip(),
                'email': fields['email'].get().strip(),
                'phone': fields['phone'].get().strip(),
                'interview': '',
                'results': '',
                'diagnosis': '',
                'interview_attachments': [],
                'results_attachments': [],
                'diagnosis_attachments': [],
                'created': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'last_modified': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            self.save_patients()
            self.refresh_patient_list()
            dialog.destroy()
            msgbox.showinfo("Sukces", f"✅ Pacjent {name} został dodany!")
        
        ctk.CTkButton(
            dialog, 
            text="💾 Zapisz", 
            command=save_new_patient,
            fg_color="#28a745",
            height=40,
            font=ctk.CTkFont(size=14, weight="bold")
        ).pack(pady=30)
    
    def edit_patient_dialog(self):
        """Okno edycji danych pacjenta"""
        if not self.current_patient:
            return
        
        patient = self.patients[self.current_patient]
        
        dialog = ctk.CTkToplevel(self.root)
        dialog.title("Edytuj Dane Pacjenta")
        dialog.geometry("500x450")
        dialog.grab_set()
        
        ctk.CTkLabel(
            dialog, 
            text="✏️ Edycja Danych", 
            font=ctk.CTkFont(size=20, weight="bold")
        ).pack(pady=20)
        
        fields = {}
        field_names = [
            ("Imię i Nazwisko*", "name"),
            ("Data Urodzenia", "birth_date"),
            ("PESEL", "pesel"),
            ("Email", "email"),
            ("Telefon", "phone")
        ]
        
        for label, key in field_names:
            frame = ctk.CTkFrame(dialog, fg_color="transparent")
            frame.pack(fill="x", padx=40, pady=8)
            
            ctk.CTkLabel(frame, text=label, width=150, anchor="w").pack(side="left")
            entry = ctk.CTkEntry(frame, width=250)
            entry.insert(0, patient.get(key, ''))
            entry.pack(side="right")
            fields[key] = entry
        
        def save_changes():
            name = fields['name'].get().strip()
            if not name:
                msgbox.showerror("Błąd", "Imię i nazwisko jest wymagane!")
                return
            
            patient['name'] = name
            patient['birth_date'] = fields['birth_date'].get().strip()
            patient['pesel'] = fields['pesel'].get().strip()
            patient['email'] = fields['email'].get().strip()
            patient['phone'] = fields['phone'].get().strip()
            patient['last_modified'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            self.save_patients()
            self.refresh_patient_list()
            self.select_patient(self.current_patient)
            dialog.destroy()
            msgbox.showinfo("Sukces", "✅ Dane zostały zaktualizowane!")
        
        ctk.CTkButton(
            dialog, 
            text="💾 Zapisz Zmiany", 
            command=save_changes,
            fg_color="#28a745",
            height=40,
            font=ctk.CTkFont(size=14, weight="bold")
        ).pack(pady=30)
    
    def delete_patient(self):
        """Usuń pacjenta"""
        if not self.current_patient:
            return
        
        patient = self.patients[self.current_patient]
        
        if msgbox.askyesno(
            "Potwierdzenie", 
            f"Czy na pewno chcesz usunąć pacjenta:\n{patient['name']}?\n\nWszystkie załączniki również zostaną usunięte!\n\nTej operacji nie można cofnąć!"
        ):
            # Usuń folder z załącznikami
            attachments_folder = self.get_patient_attachments_folder(self.current_patient)
            if attachments_folder.exists():
                shutil.rmtree(attachments_folder)
            
            del self.patients[self.current_patient]
            self.save_patients()
            self.current_patient = None
            self.refresh_patient_list()
            
            # Wyczyść widok
            self.patient_header.configure(text="Wybierz pacjenta z listy")
            for widget in self.doc_scroll.winfo_children():
                widget.destroy()
            
            # Wyłącz przyciski
            self.edit_btn.configure(state="disabled")
            self.delete_btn.configure(state="disabled")
            self.export_btn.configure(state="disabled")
            self.save_doc_btn.configure(state="disabled")
            
            for btn in self.attachment_buttons.values():
                btn.configure(state="disabled")
            
            msgbox.showinfo("Sukces", "✅ Pacjent został usunięty!")
    
    def global_search(self):
        """Globalne przeszukiwanie wszystkich danych"""
        query = self.search_entry.get().strip().lower()
        
        if not query:
            msgbox.showwarning("Uwaga", "Wpisz frazę do wyszukania!")
            return
        
        results = []
        
        for patient_id, patient in self.patients.items():
            matches = []
            
            # Przeszukuj wszystkie pola
            searchable_fields = {
                'Imię i Nazwisko': patient.get('name', ''),
                'PESEL': patient.get('pesel', ''),
                'Wywiad': patient.get('interview', ''),
                'Wyniki Badań': patient.get('results', ''),
                'Diagnoza': patient.get('diagnosis', '')
            }
            
            # Dodaj nazwy załączników do przeszukiwania
            for att in patient.get('interview_attachments', []):
                searchable_fields[f'Załącznik (Wywiad)'] = att.get('filename', '')
            for att in patient.get('results_attachments', []):
                searchable_fields[f'Załącznik (Wyniki)'] = att.get('filename', '')
            for att in patient.get('diagnosis_attachments', []):
                searchable_fields[f'Załącznik (Diagnoza)'] = att.get('filename', '')
            
            for field_name, content in searchable_fields.items():
                if query in content.lower():
                    matches.append(field_name)
            
            if matches:
                results.append({
                    'id': patient_id,
                    'name': patient['name'],
                    'matches': matches
                })
        
        # Wyświetl wyniki
        self.show_search_results(query, results)
    
    def show_search_results(self, query, results):
        """Wyświetl wyniki wyszukiwania"""
        dialog = ctk.CTkToplevel(self.root)
        dialog.title(f"Wyniki wyszukiwania: '{query}'")
        dialog.geometry("600x500")
        dialog.grab_set()
        
        ctk.CTkLabel(
            dialog, 
            text=f"🔍 Znaleziono: {len(results)} wynik(ów)", 
            font=ctk.CTkFont(size=18, weight="bold")
        ).pack(pady=20)
        
        scroll = ctk.CTkScrollableFrame(dialog)
        scroll.pack(fill="both", expand=True, padx=20, pady=(0, 20))
        
        if not results:
            ctk.CTkLabel(
                scroll, 
                text="Brak wyników dla podanej frazy.",
                font=ctk.CTkFont(size=14),
                text_color="gray"
            ).pack(pady=50)
        else:
            for result in results:
                frame = ctk.CTkFrame(scroll, fg_color="#f8f9fa")
                frame.pack(fill="x", pady=8, padx=5)
                
                ctk.CTkLabel(
                    frame, 
                    text=f"👤 {result['name']}", 
                    font=ctk.CTkFont(size=15, weight="bold")
                ).pack(anchor="w", padx=15, pady=(10, 5))
                
                ctk.CTkLabel(
                    frame, 
                    text=f"Znaleziono w: {', '.join(result['matches'])}", 
                    font=ctk.CTkFont(size=12),
                    text_color="#6c757d"
                ).pack(anchor="w", padx=15, pady=(0, 5))
                
                ctk.CTkButton(
                    frame, 
                    text="Otwórz", 
                    command=lambda pid=result['id']: [self.select_patient(pid), dialog.destroy()],
                    width=100,
                    fg_color="#007bff"
                ).pack(anchor="e", padx=15, pady=(0, 10))
    
    def export_to_txt(self):
        """Eksportuj dane pacjenta do pliku TXT"""
        if not self.current_patient:
            return
        
        patient = self.patients[self.current_patient]
        
        # Wybór lokalizacji zapisu
        filename = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Pliki tekstowe", "*.txt")],
            initialfile=f"{patient['name'].replace(' ', '_')}_dokumentacja.txt"
        )
        
        if not filename:
            return
        
        # Funkcja pomocnicza do listowania załączników
        def format_attachments(attachments, section_name):
            if not attachments:
                return "Brak załączników\n"
            
            result = ""
            for i, att in enumerate(attachments, 1):
                size_mb = att['size'] / (1024 * 1024)
                size_str = f"{size_mb:.2f} MB" if size_mb >= 0.01 else f"{att['size'] / 1024:.1f} KB"
                result += f"  {i}. {att['filename']} ({size_str}) - dodano: {att['added']}\n"
            return result
        
        # Generuj treść
        content = f"""
{'='*80}
                    DOKUMENTACJA MEDYCZNA PACJENTA
{'='*80}

DANE PACJENTA:
--------------
Imię i Nazwisko: {patient['name']}
Data Urodzenia: {patient.get('birth_date', 'Brak')}
PESEL: {patient.get('pesel', 'Brak')}
Email: {patient.get('email', 'Brak')}
Telefon: {patient.get('phone', 'Brak')}

Data utworzenia: {patient.get('created', 'Brak')}
Ostatnia modyfikacja: {patient.get('last_modified', 'Brak')}

{'='*80}

WYWIAD LEKARSKI:
----------------
{patient.get('interview', 'Brak danych')}

Załączniki (Wywiad):
{format_attachments(patient.get('interview_attachments', []), 'Wywiad')}

{'='*80}

WYNIKI BADAŃ:
-------------
{patient.get('results', 'Brak danych')}

Załączniki (Wyniki Badań):
{format_attachments(patient.get('results_attachments', []), 'Wyniki')}

{'='*80}

DIAGNOZA:
---------
{patient.get('diagnosis', 'Brak danych')}

Załączniki (Diagnoza):
{format_attachments(patient.get('diagnosis_attachments', []), 'Diagnoza')}

{'='*80}

UWAGA: Załączone pliki znajdują się w folderze:
{self.get_patient_attachments_folder(self.current_patient)}

{'='*80}

Dokument wygenerowany: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
Aplikacja: Medical Notes v2.0
{'='*80}
        """.strip()
        
        # Zapisz plik
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        msgbox.showinfo("Sukces", f"✅ Eksport zakończony!\n\nPlik zapisano jako:\n{filename}")
    
    def run(self):
        """Uruchom aplikację"""
        self.root.mainloop()


# === URUCHOMIENIE APLIKACJI ===
if __name__ == "__main__":
    try:
        app = MedicalNotesApp()
        app.run()
    except Exception as e:
        msgbox.showerror("Błąd krytyczny", f"Nie udało się uruchomić aplikacji:\n\n{str(e)}\n\nSkontaktuj się z pomocą techniczną.")
        sys.exit(1)