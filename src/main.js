import './styles/main.css';
import './styles/notes.css';

import './components/Cdialog.js';
import './components/my-note-form.js';
import './components/my-note-item.js';
import './components/my-note-list.js';

document.addEventListener("DOMContentLoaded", () => {
    const formToggler = document.querySelector('.form-toggler');
    const noteForm = document.querySelector('note-form');

    formToggler.addEventListener("click", () => {
        noteForm.clearNoteData();
        noteForm.displayForm("add");
    });

    const SelectorNoteType = document.querySelector('#notes-type-selector');
    const listNote = document.querySelector('note-list');

    SelectorNoteType.addEventListener('change', async () => {
        if (SelectorNoteType.value === 'non-archived') {
            listNote.setAttribute('type', 'non-archived');
            await listNote.getNotes();
        } else if (SelectorNoteType.value === 'archived') {
            listNote.setAttribute('type', 'archived');
            await listNote.getArchivedNotes();
        }
    });
});
