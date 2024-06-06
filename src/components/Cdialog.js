export class ConfirmDialog extends HTMLElement {
    static observedAttributes = ['option', 'target'];
  
    constructor() {
      super();
  
      this._option = this.getAttribute('option');
      this._target = this.getAttribute('target');
    }
  
    connectedCallback() {
      this.render();
      this.hideConfirmDialog();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this[`_${name}`] = newValue;
  
      this.render();
    }
  
    render() {
      this.innerHTML = '';
  
      const confirmContainer = document.createElement('div');
      confirmContainer.classList.add('confirm-container');
  
      const confirmMessage = document.createElement("h1");
      confirmMessage.classList.add("confirm-message");
      confirmMessage.innerText = `Yakin untuk ${this._option} catatan ini?`;
  
      const confirmButtonsContainer = document.createElement("div");
      confirmButtonsContainer.classList.add("confirm-buttons-container");
  
      const confirmYes = document.createElement("button");
      confirmYes.innerText = "Yes";
      const confirmNo = document.createElement("button");
      confirmNo.innerText = "No";
  
      confirmYes.addEventListener('click', () => {
        const noteListElement = document.querySelector('note-list');
        if (this._option === 'archive') noteListElement.archiveNote(this._target);
        if (this._option === "unarchive") noteListElement.unarchiveNote(this._target);
        if (this._option === "delete") noteListElement.deleteNote(this._target);
  
        this.hideConfirmDialog();
      });
  
      confirmNo.addEventListener('click', this.hideConfirmDialog.bind(this));
  
      confirmButtonsContainer.appendChild(confirmYes);
      confirmButtonsContainer.appendChild(confirmNo);
  
      confirmContainer.appendChild(confirmMessage);
      confirmContainer.appendChild(confirmButtonsContainer);
  
      this.appendChild(confirmContainer);
  
      setTimeout(() => {
        confirmContainer.classList.add('appended');
      }, 100);
    }
  
    displayConfirmDialog(option) {
      this.setAttribute('option', option);
      this.style.display = 'flex';
    }
  
    hideConfirmDialog() {
      this.style.display = 'none';
    }
  }
  
  customElements.define('confirm-dialog', ConfirmDialog);
  