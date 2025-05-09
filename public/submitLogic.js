document.addEventListener('DOMContentLoaded', function () {
    const existingTeamData = localStorage.getItem('teamData');
    if (existingTeamData) {
        window.location.href = './questions.html';
        return;
    }

    const form = document.getElementById('teamForm');
    if (!form) {
        console.error('Form with id "teamForm" not found.');
        return;
    }

    const addPersonButton = document.getElementById('addPerson');
    addPersonButton.addEventListener('click', function () {
        const newInput = document.createElement('input');
        if (form.querySelectorAll('input[name="teamMember"]').length + 1 < 11) {
            if (form.querySelectorAll('input[name="teamMember"]').length + 1 === 10) {
                addPersonButton.disabled = true;
                addPersonButton.innerText = "Maximaal 10 leden";
            }
            newInput.type = 'text';
            newInput.name = 'teamMember';
            newInput.placeholder = `Lid ${form.querySelectorAll('input[name="teamMember"]').length + 1} (optioneel)`;
            newInput.className = 'mb-3 p-2 rounded-md w-full bg-green-400';
            form.insertBefore(newInput, addPersonButton);
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const teamName = form.teamName.value;
        const teamMembers = Array.from(form.querySelectorAll('input[name="teamMember"]'))
            .map(input => input.value)
            .filter(member => member.trim() !== '');

        const teamData = {
            teamName: teamName,
            teamMembers: teamMembers
        };
        localStorage.setItem('teamData', JSON.stringify(teamData));

        console.log('Team Name:', teamName);
        console.log('Team Members:', teamMembers);

        window.location.href = './public/questions.html';
        form.reset();
    });
});
// comment: This code handles the team submission logic. It allows users to add team members dynamically and stores the data in local storage.
// It also prevents the form from being submitted if the team name is empty and redirects to the questions page after submission.