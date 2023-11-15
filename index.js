const container = document.querySelector('.sticky-notes-container')
const addBtn = document.querySelector('.add-button')
let savedNotes = []
// get stickynotes from local storage and display if there are any
window.addEventListener('load', () => {
    const stickyNotes = localStorage.getItem('stickyNotes')
    if (stickyNotes) {
        savedNotes = JSON.parse(stickyNotes)
        savedNotes.forEach(note => createNote(note.content, note.id))
    }
})
// create a new note if button is clicked or on window load
const createNote = (content = '', id = null) => {
    // create new sticky note div
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
    newStickyNote.dataset.id = id
    // if the note doesnt exist, push new element to array
    if (id === null) {
        // create a new id
        id = createUniqueId()
        newStickyNote.dataset.id = id
        savedNotes.push({ content, id })
        localStorage.setItem('stickyNotes', JSON.stringify(savedNotes))
    } else {
        newStickyNote.dataset.id = id
    }
}

// save notes to local storage
const saveNotes = (e) => {
    // get the id of the note that's updated
    const changedNoteId = parseInt(e.target.parentElement.dataset.id)
    // update the note content
    const changedNote = savedNotes.find(note => note.id == changedNoteId)
    if (changedNote) {
        changedNote.content = e.target.value
    }
    // save notes
    localStorage.setItem('stickyNotes', JSON.stringify(savedNotes))
}

// delete note when button is pressed
const deleteNote = (e) => {
    console.log('deleted')
    // show delete modal
    const modal = document.querySelector('.delete-modal-container')
    modal.style.transform = 'scale(1)'
    // get the id of the note to delete
    const noteToDelete = parseInt(e.target.parentElement.dataset.id)
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
            const noteToDeleteEl = document.querySelector(`[data-id="${noteToDelete}"]`)
            if (noteToDeleteEl) {
                localStorage.setItem('stickyNotes', JSON.stringify(savedNotes))
                console.log('removed')
                container.removeChild(noteToDeleteEl)
            }
            // hide modal and remove event listener
            modal.style.transform = 'scale(0)'
            modal.removeEventListener('click', modalListener)
        }
    }
}
// find the highest id, increment by 1 and return
const createUniqueId = () => {
    return savedNotes.reduce((highestId, note) => Math.max(highestId, note.id), 0) + 1
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