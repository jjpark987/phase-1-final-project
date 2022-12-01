const exerciseObj = {
    bodyparts: ["back", "cardio", "chest", "lower arms", "lower legs", "neck", "shoulders", "upper arms", "upper legs", "waist"],
    equipments: ["assisted", "band", "barbell", "body weight", "bosu ball", "cable", "dumbbell", "elliptical machine", "ez barbell", "hammer", "kettlebell", "leverage machine", "medicine ball", "olympic barbell", "resistance band", "roller", "rope", "skierg machine", "sled machine", "smith machine", "stability ball", "stationary bike", "stepmill machine", "tire", "trap bar", "upper body ergometer", "weighted", "wheel roller"],
    targetMuscles: ["abductors", "abs", "adductors", "biceps", "calves", "cardiovascular system", "delts", "forearms", "glutes", "hamstrings", "lats", "levator scapulae", "pectorals", "quads", "serratus anterior", "spine", "traps", "triceps", "upper back"]
}
const bodypartDropdown = document.querySelector('#bodypart-dropdown')
const equipmentDropdown = document.querySelector('#equipment-dropdown')
let currentBodypart
let currentEquipment = "undefined"
const searchButton = document.querySelector('#search-button')
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

function setDropdown(item) {
    const option = document.createElement('option')
    option.value = item
    option.textContent = item
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
        console.log(currentEquipment)
        if(currentEquipment === "undefined") {
            for(const exercise of data) {
                if(exercise.bodyPart === currentBodypart) {
                    const filteredExercise = document.createElement('h4')
                    filteredExercise.textContent = exercise.name
                    exerciseList.append(filteredExercise)
                }
            }
        } else {
            for(const exercise of data) {
                if(exercise.bodyPart === currentBodypart) {
                    if(exercise.equipment === currentEquipment) {
                        const filteredExercise = document.createElement('h4')
                        filteredExercise.textContent = exercise.name
                        exerciseList.append(filteredExercise)
                    }
                }
            }
        }
    })
})