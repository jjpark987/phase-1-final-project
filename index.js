const exerciseObj = {
    bodyparts: ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"],
    equipments: ["assisted", "band", "barbell", "body weight", "bosu ball", "cable", "dumbbell", "elliptical machine", "ez barbell", "hammer", "kettlebell", "leverage machine", "medicine ball", "olympic barbell", "resistance band", "roller", "rope", "skierg machine", "sled machine", "smith machine", "stability ball", "stationary bike", "stepmill machine", "tire", "trap bar", "upper body ergometer", "weighted", "wheel roller"],
    targets: ["abductors", "abs", "adductors", "biceps", "calves", "cardiovascular system", "delts", "forearms", "glutes", "hamstrings", "lats", "levator scapulae", "pectorals", "quads", "serratus anterior", "spine", "traps", "triceps", "upper back"]
}
const bodypartDropdown = document.querySelector('#bodypart-dropdown')
const equipmentDropdown = document.querySelector('#equipment-dropdown')
let currentBodypart
let currentEquipment = 'none'
const searchButton = document.querySelector('#search-button')
const favoriteList = document.querySelector('#favorited-list')
const exerciseList = document.querySelector('#exercise-list')

// Set up bodyparts and equipments dropdown menu
for(const bodypart of exerciseObj.bodyparts) {
    bodypartDropdown.append(setDropdown(bodypart))
}
setDropdownEvent(bodypartDropdown)

for(const equipment of exerciseObj.equipments) {
    equipmentDropdown.append(setDropdown(equipment))
}
setDropdownEvent(equipmentDropdown)

// Define functions that create the dropdown options and sets current bodypart and equipment
function setDropdown(item) {
    const option = document.createElement('option')
    option.value = item
    option.textContent = item.charAt(0).toUpperCase() + item.slice(1)
    return option
}

function setDropdownEvent(item) {
    item.addEventListener('change', event => {
        if(item === bodypartDropdown) {
            currentBodypart = event.target.value
        } else {
            currentEquipment = event.target.value
        }
    })
}

// Add an event listener to the search button to fetch exercises
searchButton.addEventListener('click', () => {
    fetchExercises()
})

// Define a function that adds every potential exercise to the DOM
function fetchExercises() {
    fetch('http://localhost:3000/exercises')
    .then(response => response.json())
    .then(data => {
        favoriteList.textContent = ''
        exerciseList.textContent = ''
        for(const exercise of data) {
// Uncomment if we are persisting the favorited exercises
            // if(exercise.favorite) {
                if(currentEquipment === 'none') {
                    if(currentBodypart === exercise.bodyPart) {
                        favoriteList.append(createExerciseDiv(exercise))
                    }
                } else {
                    if(currentEquipment === exercise.equipment) {
                        if(currentBodypart === exercise.bodyPart) {
                            favoriteList.append(createExerciseDiv(exercise))
                        }
                    }
                }
            // } else {
            //     if(currentEquipment === 'none') {
            //         if(currentBodypart === exercise.bodyPart) {
            //             exerciseList.append(createExerciseDiv(exercise))
            //         }
            //     } else {
            //         if(currentEquipment === exercise.equipment) {
            //             if(currentBodypart === exercise.bodyPart) {
            //                 exerciseList.append(createExerciseDiv(exercise))
            //             }
            //         }
            //     }
            // }   
        }
    })
    .catch(error => console.log(error, '50'))
}

// Define a function that creates a div for each exercise from API
function createExerciseDiv(exercise) {
    const exerciseDiv = document.createElement('div')
    exerciseDiv.className = 'exercise'

// Create a star to favorite an exercise
    const star = document.createElement('div')
    if(exercise.favorite) {
        star.textContent = '★'
    } else {
        star.textContent = '☆'
    }
    star.addEventListener('click', () => {
        if(star.textContent === '☆') {
            star.textContent = '★'

// Uncomment if we are persisting the favorited exercises
            // fetch(`http://localhost:3000/exercises/${exercise.id}`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         favorite: true
            //     })
            // })
            // .then(response => response.json())
            // .then(data => console.log(data))
            // .catch(error => console.log(error, '101'))

            // fetchExercises()
        } else {
            star.textContent = '☆'

// Uncomment if we are persisting the favorited exercises
            // fetch(`http://localhost:3000/exercises/${exercise.id}`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         favorite: false
            //     })
            // })
            // .then(response => response.json())
            // .then(data => console.log(data))
            // .catch(error => console.log(error, '119'))

            // fetchExercises()
        }
    })

// Create the name and details button
    const name = document.createElement('h3')
    name.textContent = exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)
    
    const detailsButton = document.createElement('button')
    detailsButton.textContent = 'See Details'
    detailsButton.addEventListener('click', () => {
        if(detailsDiv.hidden) {
            detailsDiv.hidden = false
        } else {
            detailsDiv.hidden = true
        }
    })

// Create the details div
    const detailsDiv = document.createElement('div')
    detailsDiv.id ="exercise-details"
    detailsDiv.hidden = true

    const image = document.createElement('img')
    image.src = exercise.gifUrl
    image.alt = 'Exercise GIF'
    
    const target = document.createElement('h5')
    target.textContent = 'Targets: ' + exercise.target.charAt(0).toUpperCase() + exercise.target.slice(1)
    
    const notesList = document.createElement('ul')
    notesList.id = 'notes-list'
// Render any persisted notes
    if(exercise.notes) {
        exercise.notes.forEach(note => {
            notesList.append(createNoteDiv(exercise, note))
        })
    }

    const notesForm = document.createElement('form')
    notesForm.id = 'notes-form'
    notesForm.addEventListener('submit', event => {
        event.preventDefault()

        notesList.append(createNoteDiv(exercise, event.target[0].value))

        fetch(`http://localhost:3000/exercises/${exercise.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    notes: [
                        // PATCH THE NOTE INTO AN ARRAY
                        event.target[0].value
                    ]
                })
            })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error, '182'))

        notesForm.reset()
    })
    
    const notesInput = document.createElement('textarea')
    notesInput.placeholder = 'Notes'

    const notesSubmit = document.createElement('button')
    notesSubmit.textContent = 'Save Note'

    notesForm.append(notesInput, notesSubmit)
    detailsDiv.append(image, target, notesList, notesForm)
    exerciseDiv.append(star, name, detailsButton, detailsDiv)
    return exerciseDiv
}

// Define a function that creates the notes div and delete button
function createNoteDiv(currentExercise, currentNote) {
    const newNote = document.createElement('li')
    newNote.textContent = currentNote

    const notesDelete = document.createElement('button')
    notesDelete.textContent = 'Delete Note'
    notesDelete.addEventListener('click', () => {
        newNote.remove()
        notesDelete.remove()

        fetch(`http://localhost:3000/exercises/${currentExercise.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                // UPDATE SERVER WHEN NOTE IS DELETED
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error, '182'))
    })
    newNote.append(notesDelete)
    return newNote
}