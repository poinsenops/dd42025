function fetchLocations() {
    return fetch('../src/locations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Locations data:', data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching locations.json:', error);
            throw error;
        });
}

function getCurrentLocationFromLocalStorage() {
    return localStorage.getItem('currentLocation');
}

function updateMapLocation(locationName) {
    const locations = fetchLocations();
    locations.then(data => {
        const locationData = data.locations[locationName];
        if (locationData && locationData.embededMap) {
            // console.log('Location embed map URL:', locationData.embededMap);
            document.getElementById('iframe').src = locationData.embededMap;
        } else {
            console.error('Location not found or embed map URL missing for:', locationName);
        }
    });
}
if (getCurrentLocationFromLocalStorage()) {	
    const currentLocation = getCurrentLocationFromLocalStorage();
    console.log('Current location from local storage:', currentLocation);
    updateMapLocation(currentLocation);
    displayQuestions(currentLocation);
}
else {
updateMapLocation('Muntinglaan 3');
displayQuestions('Muntinglaan 3');
}

function fetchQuestions() {
    return fetch('../src/questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('Questions data:', data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching questions.json:', error);
            throw error;
        });
}

// console.log(fetchQuestions().then(data => console.log(data.questions["Muntinglaan 3"])));;
let count = parseInt(localStorage.getItem('count')) || 0;
localStorage.setItem('count', count);

function displayQuestions(questionLocation) {
    const questionsContainer = document.getElementById('questionsContainer');
    const question = fetchQuestions();
    question.then(data => {
        const questions = data.questions[questionLocation];
        count = parseInt(localStorage.getItem('count')) || 0;
        if (questions && count < 5) {
            questionsContainer.innerHTML = `
                <h2 class="text-2xl pt-4 text-white text-center">${questions.question}</h2>
                <p class="text-white my-2">${questions.location}</p>
                <div class="flex flex-col items-center justify-center my-4 gap-4 w-full">
                    <button class="py-3 px-1 bg-[#3CE49E] w-full rounded-2xl shadow-2xl" onclick="displayTask('A');">${questions.options.A.answer}</button>
                    <button class="py-3 px-1 bg-[#3CE49E] w-full rounded-2xl shadow-2xl" onclick="displayTask('B');">${questions.options.B.answer}</button>
                    <button class="py-3 px-1 bg-[#3CE49E] w-full rounded-2xl shadow-2xl" onclick="displayTask('C');">${questions.options.C.answer}</button>
                    <button class="py-3 px-1 bg-[#3CE49E] w-full rounded-2xl shadow-2xl" onclick="displayTask('D');">${questions.options.D.answer}</button>
                </div>
            `; // Clear previous questions
            
            localStorage.setItem('currentLocation', questionLocation);
        } else if (questions && count >= 5) {
            questionsContainer.innerHTML = `
                <h2 class="text-2xl text-white text-center">Ga nu naar de laatste plek het forum daar staat een docent te wachten</h2>
                <!-- <h2>${data.questions.Forum.photoTask}</h2> -->
                <button class="py-3 px-1 bg-[#3CE49E] w-full rounded-2xl shadow-2xl" onclick="localStorage.clear(); displayQuestions('Muntinglaan 3'); updateMapLocation('Muntinglaan 3'); window.location.href = './../';">Finish task this resets the count</button>`;
                updateMapLocation('Forum');
        } else {
            console.error('No questions found for location:', questionLocation);
        }
    });
}

function displayTask(answer) {
    const currentLocation = getCurrentLocationFromLocalStorage();
    

    const Questions = fetchQuestions();
    Questions.then(data => {
        const questions = data.questions;
        if (currentLocation === 'Muntinglaan 3') {
            displayQuestions(`${questions[currentLocation].options[answer].locationSend}`);
            updateMapLocation(`${questions[currentLocation].options[answer].locationSend}`);
            return
        }
        if (questions) {
            const questionsContainer = document.getElementById('questionsContainer');
            questionsContainer.innerHTML = ``;
            questionsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center my-4 gap-4 w-full">
                <h2 class="text-2xl pt-4 text-white text-center">${questions[currentLocation].photoTask}</h2>
            <button class="py-3 px-1 bg-[#3CE49E] w-full rounded-2xl shadow-2xl" onclick="displayQuestions('${questions[currentLocation].options[answer].locationSend}'); updateMapLocation('${questions[currentLocation].options[answer].locationSend}')">Finish task</button>
            </div>`;
            count++;
            localStorage.setItem('count', count);
        } else {
            console.error('No questions found for location:', answer.locationSend);
        }
    });
}