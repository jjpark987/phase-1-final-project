const exerciseObj = {
    bodyparts: ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"],
    equipments: ["assisted", "band", "barbell", "body weight", "bosu ball", "cable", "dumbbell", "elliptical machine", "ez barbell", "hammer", "kettlebell", "leverage machine", "medicine ball", "olympic barbell", "resistance band", "roller", "rope", "skierg machine", "sled machine", "smith machine", "stability ball", "stationary bike", "stepmill machine", "tire", "trap bar", "upper body ergometer", "weighted", "wheel roller"]
}
const bodypartDropdown = document.querySelector('#bodypart-dropdown')
const equipmentDropdown = document.querySelector('#equipment-dropdown')
let currentBodypart
let currentEquipment = 'none'
const searchButton = document.querySelector('#search-button')
const toggleButton = document.querySelector('#toggle-favorites')
const favoriteList = document.querySelector('#favorite-list')
const exerciseList = document.querySelector('#exercise-list')
let favoriteExercises = []
let allExercises = []

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
    fetch('http://localhost:3000/exercises')
    .then(response => response.json())
    .then(data => {
        favoriteList.textContent = ''
        exerciseList.textContent = ''
        favoriteExercises = []
        allExercises = []
        for(const exercise of data) {
            if(exercise.favorite) {
                if(currentEquipment === 'none' && currentBodypart === exercise.bodyPart) {
                    favoriteExercises.push(exercise)
                    allExercises.push(exercise)
                    favoriteList.append(createExerciseDiv(exercise))
                } else {
                    if(currentEquipment === exercise.equipment && currentBodypart === exercise.bodyPart) {
                        favoriteExercises.push(exercise)
                        allExercises.push(exercise)
                        favoriteList.append(createExerciseDiv(exercise))
                    }
                }
            } else {
                if(currentEquipment === 'none' && currentBodypart === exercise.bodyPart) {
                    allExercises.push(exercise)
                    exerciseList.append(createExerciseDiv(exercise))
                } else {
                    if(currentEquipment === exercise.equipment && currentBodypart === exercise.bodyPart) {
                        allExercises.push(exercise)
                        exerciseList.append(createExerciseDiv(exercise))
                    }
                }
            }
        }
    })
    .catch(error => console.log(error))
})

// Define a function that returns a div for an exercise object
function createExerciseDiv(exercise) {
    const exerciseDiv = document.createElement('div')
    exerciseDiv.className = 'exercise'

    // Create the star
    const star = document.createElement('div')
    if(exercise.favorite || favoriteExercises.indexOf(exercise) !== -1) {
        star.textContent = '★'
    } if(favoriteExercises.indexOf(exercise) === -1) {
        star.textContent = '☆'
    }
    star.addEventListener('click', () => {
        if(favoriteExercises.indexOf(exercise) === -1) {
            fetch(`http://localhost:3000/exercises/${exercise.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                favorite: true
            })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))

            favoriteExercises.push(exercise)
            renderFavorites()
        } else {
            fetch(`http://localhost:3000/exercises/${exercise.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                favorite: false
            })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))

            favoriteExercises = favoriteExercises.filter(item => {
                return item !== exercise
            })
            renderFavorites()
        }
    })

    // Create the name and details button
    const name = document.createElement('h3')
    name.textContent = exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)
    
    const detailsButton = document.createElement('button')
    detailsButton.textContent = 'Details'
    detailsButton.addEventListener('click', () => {
        if(detailsDiv.className === 'exercise-details details-hidden') {
            detailsDiv.classList.remove('details-hidden')
        } else {
            detailsDiv.classList.add('exercise-details', 'details-hidden')
        }
    })

    // Create the details div
    const detailsDiv = document.createElement('div')
    detailsDiv.classList.add('exercise-details', 'details-hidden')

    const image = document.createElement('img')
    image.src = exercise.gifUrl
    image.alt = 'Exercise GIF'
    image.width = '300'
    
    const target = document.createElement('h4')
    target.textContent = 'Targets: ' + exercise.target.charAt(0).toUpperCase() + exercise.target.slice(1)
    
    // Create the note container and form
    const noteContainer = document.createElement('div')
    noteContainer.className = 'note-container'

    const newNote = document.createElement('p')
    if(exercise.note) {
        newNote.textContent = exercise.note
        noteContainer.append(newNote, createDeleteButton.call(exercise, newNote))
    }
    
    const noteInput = document.createElement('textarea')
    noteInput.placeholder = 'Notes'
    noteInput.cols = '25'
    noteInput.required = true

    const noteSubmit = document.createElement('button')
    noteSubmit.textContent = 'Save'

    const noteForm = document.createElement('form')
    noteForm.className = 'note-form'
    noteForm.addEventListener('submit', event => {
        event.preventDefault()
        
        fetch(`http://localhost:3000/exercises/${exercise.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                note: event.target[0].value
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))

        exercise.note = event.target[0].value
        if(favoriteExercises.indexOf(exercise) !== -1) {
            favoriteExercises.splice(favoriteExercises.indexOf(exercise), 1, exercise)
        }

        noteContainer.textContent = ''
        newNote.textContent = event.target[0].value
        noteContainer.append(newNote, createDeleteButton.call(exercise, newNote))
        noteForm.reset()
    })

    // Append all the elements
    noteForm.append(noteInput, noteSubmit)
    detailsDiv.append(image, target, noteForm, noteContainer)
    exerciseDiv.append(star, name, detailsButton, detailsDiv)
    return exerciseDiv
}

// Define a function that renders the favorited exercises first
function renderFavorites() {
    favoriteList.textContent = ''
    exerciseList.textContent = ''
    favoriteExercises.sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
    for(const exercise of favoriteExercises) {
        if(currentEquipment === 'none' && currentBodypart === exercise.bodyPart) {
            favoriteList.append(createExerciseDiv(exercise))
        } else {
            if(currentEquipment === exercise.equipment && currentBodypart === exercise.bodyPart) {
                favoriteList.append(createExerciseDiv(exercise))
            }
        }
    }
    for(const exercise of allExercises) {
        if(favoriteExercises.indexOf(exercise) === -1) {
            if(currentEquipment === 'none' && currentBodypart === exercise.bodyPart) {
                exerciseList.append(createExerciseDiv(exercise))
            } else {
                if(currentEquipment === exercise.equipment && currentBodypart === exercise.bodyPart) {
                    exerciseList.append(createExerciseDiv(exercise))
                }
            }
        }
    }
}

// Define a function that returns the note and delete button
function createDeleteButton(note) {
    const noteDelete = document.createElement('button')
    noteDelete.textContent = 'Delete'
    noteDelete.addEventListener('click', () => {
        fetch(`http://localhost:3000/exercises/${this.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                note: ''
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
        
        this.note = ''
        if(favoriteExercises.indexOf(this) !== -1) {
            favoriteExercises.splice(favoriteExercises.indexOf(this), 1, this)
        }
        note.remove()
        noteDelete.remove()
    })
    return noteDelete
}