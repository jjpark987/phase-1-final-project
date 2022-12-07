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
let favoriteExercises = []

// Set up bodyparts and equipments dropdown menu
for(const bodypart of exerciseObj.bodyparts) {
    bodypartDropdown.append(setDropdown(bodypart))
}
setDropdownEvent(bodypartDropdown)

for(const equipment of exerciseObj.equipments) {
    equipmentDropdown.append(setDropdown(equipment))
}
setDropdownEvent(equipmentDropdown)

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

// Fetch exercises when search button is clicked
searchButton.addEventListener('click', () => {
    fetch('http://localhost:3000/exercises')
    .then(response => response.json())
    .then(data => {
        exerciseList.textContent = ''
        for(const exercise of data) {
            if(currentEquipment === 'none') {
                exerciseList.append(renderExercise(exercise))
            } else {
                if(currentEquipment === exercise.equipment) {
                    renderExercise(exercise)
                }
            }
        }
    })
})

function renderExercise(exercise) {
    if(currentBodypart === exercise.bodyPart) {
        const exerciseDiv = document.createElement('div')
        exerciseDiv.className = 'exercise'

        const star = document.createElement('div')
        star.textContent = '☆'
        star.addEventListener('click', () => {
            // if(star.textContent === '☆') {
            //     star.textContent = '★'

            //     favoriteExercises.push(exercise)

            //     for(const workout of favoriteExercises) {
            //         renderExercise(workout)
            //     }
            // } else {
            //     star.textContent = '☆'

            //     favoriteExercises = favoriteExercises.filter(workout => {
            //         return workout !== exercise
            //     })

            //     for(const workout of favoriteExercises) {
            //         renderExercise(workout)
            //     }
            // }
        })

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

        const notesForm = document.createElement('form')
        notesForm.id = 'notes-form'
        notesForm.addEventListener('submit', event => {
            event.preventDefault()

            const newNote = document.createElement('li')
            newNote.textContent = event.target[0].value

            const notesDelete = document.createElement('button')
            notesDelete.textContent = 'Delete Note'
            notesDelete.addEventListener('click', () => {
                newNote.remove()
                notesDelete.remove()
            })

            newNote.append(notesDelete)
            notesList.append(newNote)

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
}