class NoteList extends HTMLElement {
    static observedAttributes = ["type"];
  
    _notesData = [];
  
    constructor() {
      super();
      this._type = this.getAttribute("type");
    }
  
    connectedCallback() {
      this.getNotes();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this[`_${name}`] = newValue;
    }
  
    render() {
      this.innerHTML = "";
      if (this._notesData.length <= 0) {
        this.innerHTML = `<h1>Ups..Data kosong...🤦‍♀️</h1>`;
      } else {
        const noteItemElements = this.generateNoteItemElements(this._notesData);
        this.append(...noteItemElements);
      }
    }
  
    async getNotes() {
      try {
        this.renderLoading();
        const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseContent = await response.json();
        this._notesData = await responseContent.data;
        this.render();
      } catch (error) {
        console.error(`Error getting notes data: ${error}`);
        window.alert(`Error getting notes data: ${error}`);
      }
    }
  
    async getArchivedNotes() {
      try {
        this.renderLoading();
        const response = await fetch("https://notes-api.dicoding.dev/v2/notes/archived");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseContent = await response.json();
        this._notesData = await responseContent.data;
        this.render();
      } catch (error) {
        console.error(`Error getting archived notes data: ${error}`);
        window.alert(`Error getting archived notes data: ${error}`);
      }
    }
  
    async getNote(id) {
      try {
        const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseContent = await response.json();
        return responseContent.data;
      } catch (error) {
        console.error(`Error getting note data: ${error}`);
        window.alert(`Error getting note data: ${error}`);
      }
    }
  
    async addNote(newNote) {
      try {
        this.renderLoading();
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        };
        const response = await fetch("https://notes-api.dicoding.dev/v2/notes", option);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (this._type === "non-archived") {
          const responseContent = await response.json();
          this._notesData.push(await responseContent.data);
        }
        this.render();
      } catch (error) {
        console.error(`Error uploading new data: ${error}`);
        window.alert(`Error uploading new data: ${error}`);
      }
    }
  
    async deleteNote(id) {
      try {
        this.renderLoading();
        const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this._notesData = this._notesData.filter((note) => note.id !== id);
      } catch (error) {
        console.error(`Error deleting data: ${error}`);
        window.alert(`Error deleting data: ${error}`);
      }
      this.render();
    }
  
    async archiveNote(id) {
      try {
        this.renderLoading();
        const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/archive`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this._notesData = this._notesData.filter((note) => note.id !== id);
      } catch (error) {
        console.error(`Error archiving data: ${error}`);
        window.alert(`Error archiving data: ${error}`);
      }
      this.render();
    }
  
    async unarchiveNote(id) {
      try {
        this.renderLoading();
        const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/unarchive`, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        this._notesData = this._notesData.filter((note) => note.id !== id);
      } catch (error) {
        console.error(`Error unarchiving data: ${error}`);
        window.alert(`Error unarchiving data: ${error}`);
      }
      this.render();
    }
  
    renderLoading() {
      this.innerHTML = `<h1 class="loading"></h1>`;
    }
  
    generateNoteItemElements() {
      return this._notesData.map((note) => {
        const noteItem = document.createElement("note-item");
        noteItem.setNote(note);
        noteItem.setAttribute("type", `${this._type}`);
        setTimeout(() => {
          noteItem.classList.add("appended");
        }, 100);
        return noteItem;
      });
    }
  }
  
  customElements.define("note-list", NoteList);
  