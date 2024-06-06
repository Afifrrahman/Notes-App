export class NoteForm extends HTMLElement {
    static observedAttributes = ['mode'];

    _Datanote = {
        id: "",
        title: "",
        body: "",
        createdAt: "",
        archived: false,
    };

    constructor() {
        super();

        this._mode = this.getAttribute('mode');
    }

    connectedCallback() {
        this.render();
        this.hideForm();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[`_${name}`] = newValue;
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.appendChild(this.generateForm());

        this.elementsEventHandler();
        setTimeout(() => {
            document.querySelector('note-form form').classList.add('appended');
        }, 100);
    }

    generateForm() {
        const form = document.createElement('form');

        const formBatal = document.createElement('button');
        formBatal.classList.add('form-cancel');
        formBatal.setAttribute('type', 'button');
        formBatal.innerHTML = `<i class="fa-solid fa-xmark"></i>`;

        const FromGroupT = document.createElement('div');
        FromGroupT.classList.add('title-form-group');
        FromGroupT.innerHTML = `
        <input
          type="text"
          id="title-input"
          value="${this._Datanote.title}"
          placeholder="Masukkan Judul"
          autocomplete="off"
          minlength="0"
          maxlength="50"
          ${this.checkDisabled()}
          required
        />
      `;

        const FromBodyG = document.createElement('div');
        FromBodyG.classList.add('body-form-group');
        FromBodyG.innerHTML = `
        <textarea
          name="body-input"
          id="body-input"
          placeholder="masukkan catatan"
          autocomplete="off"
          minlength="0"
          maxlength="250"
          ${this.checkDisabled()}
          required
        >${this._Datanote.body}</textarea>
      `;

        form.appendChild(formBatal);
        form.appendChild(FromGroupT);
        form.appendChild(FromBodyG);

        if (this._mode === 'add') {
            const Nsubmit = document.createElement('button');
            Nsubmit.classList.add('note-add');
            Nsubmit.innerHTML = 'Add';
            form.appendChild(Nsubmit);
        }

        return form;
    }

    displayForm(option) {
        this.setAttribute('mode', option);

        document.querySelector('note-form').style.display = 'flex';
    }

    hideForm() {
        document.querySelector('note-form').style.display = 'none';
    }

    checkDisabled() {
        if (this._mode === 'view') return 'disable';
    }

    addNote() {
        const newNote = {
            title: this.querySelector('#title-input').value,
            body: this.querySelector('#body-input').value,
        };
        const noteListElement = document.querySelector('note-list');
        noteListElement.addNote(newNote);
    }

    setNoteData(note) {
        this._Datanote = note;
    }

    clearNoteData() {
        this._Datanote = {
            id: "",
            title: "",
            body: "",
            createdAt: "",
            archived: false,
        };
    }

    appendWarning(element, message) {
        const warning = document.createElement('p');
        warning.classList.add('warning');
        warning.innerText = message;

        element.insertAdjacentElement('afterend', warning);
    }

    addElementEvent(elementName, eventName, callback) {
        const element = document.querySelector(elementName);
        element.addEventListener(eventName, callback);
    }

    elementsEventHandler() {
        this.addElementEvent('.form-cancel', 'click', this.hideForm);

        this.addElementEvent('note-form form', 'submit', (e) => {
            e.preventDefault();
            this.addNote();
            this.clearNoteData();
            this.hideForm();
        });

        this.addElementEvent("#body-input", "input", (e) => {
            const warning = e.target.nextElementSibling;

            if (e.target.value.length <= 0) {
                if (warning) warning.remove();
                this.appendWarning(e.target, "Tolong isi ini");
            } else if (e.target.value.length >= 250) {
                if (warning) warning.remove();
                this.appendWarning(e.target, "Kamu mencapai batas karakter (250)");
            } else if (warning) {
                warning.remove();
            }
        });
    }
}

customElements.define('note-form', NoteForm);
