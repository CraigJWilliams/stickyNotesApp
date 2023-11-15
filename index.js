// check local storage to see if there are any notes, if there are, run generatenotes function
// add new note when button is pressed, give it an id
// once new note text area is entered, save it to local storage
// when note is updated, update local storage
// when delete button is pressed, delete the note with thay particular id

const container = document.querySelector('.sticky-notes-container')
const addBtn = document.querySelector('.add-button')
let savedNotes = []

const createNote = (content = '') => {
    // create new sticky note
    const newStickyNote = document.createElement('div')
    newStickyNote.className = 'sticky-note'
    // create new textarea
    const newTextArea = document.createElement('textarea')
    newTextArea.className = 'user-input'
    newTextArea.value = content
    newTextArea.placeholder = 'Enter Your Note...'
    // create new delete btn
    const newDeleteBtn = document.createElement('button')
    newDeleteBtn.className = 'delete-btn'
    newDeleteBtn.innerHTML = '<span class="material-icons md-18">delete</span>Delete'
    // append textarea and delete btn to sticky note
    newStickyNote.appendChild(newTextArea)
    newStickyNote.appendChild(newDeleteBtn)
    // append whole note to container
    container.appendChild(newStickyNote)
    // give the note an id
    const noteId = createUniqueId()
    newStickyNote.dataset.noteId = noteId
    // push new element to array
    savedNotes.push({
        content: newTextArea.value,
        id: noteId,
    })
}

// save notes to local storage
const saveNotes = (e) => {
    // get the id of the note that's updated
    const changedNoteId = parseInt(e.target.parentElement.dataset.noteId)
    // update the note content
    const changedNote = savedNotes.find(note => note.id == changedNoteId)
    if (changedNote) {
        changedNote.content = e.target.value
        console.log(changedNote.content)
    }
    console.log(savedNotes)

}

// delete note when button is pressed
const deleteNote = (e) => {
    // show delete modal
    const modal = document.querySelector('.delete-modal-container')
    modal.style.transform = 'scale(1)'
    // get the id of the note to delete
    const noteToDelete = parseInt(e.target.parentElement.dataset.noteId)
    modal.addEventListener('click', modalListener)
    function modalListener(e) {
        // if back button is pressed, hide modal and remove event listener
        if (e.target && e.target.classList.contains('back-btn')) {
            modal.style.transform = 'scale(0)'
            modal.removeEventListener('click', modalListener)
            // if delete button is pressed, delete the note and remove from container
        } else if (e.target && e.target.classList.contains('modal-delete-btn')) {
            console.log(savedNotes)
            savedNotes = savedNotes.filter(note => note.id !== noteToDelete)
            console.log(savedNotes)
            const noteToDeleteEl = document.querySelector(`[data-note-id="${noteToDelete}"]`)
            if (noteToDeleteEl) {
                container.removeChild(noteToDeleteEl)
            }
            // hide modal and remove event listener
            modal.style.transform = 'scale(0)'
            modal.removeEventListener('click', modalListener)
        }
    }
}

const createUniqueId = () => {
    // Return 1 if array is empty
    if (savedNotes.length === 0) {
        return 1
        // find the highest id and increment by 1
    } else {
        const lastNote = savedNotes.findLast(note => note.id !== undefined);
        return lastNote.id + 1;
    }
}


// create note when button is clicked
addBtn.addEventListener('click', () => createNote())

// if textarea is changed, update save notes
container.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('user-input')) {
        saveNotes(e)
    }
})
// if delete button is pressed:
container.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('delete-btn')) {
        deleteNote(e)
    }
})



