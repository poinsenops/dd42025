document.addEventListener('DOMContentLoaded', function () {
    const existingTeamData = localStorage.getItem('teamData');
    if (existingTeamData) {
        window.location.href = './public/questions.html';
        return;
    }

    const form = document.getElementById('teamForm');
    if (!form) {
        console.error('Form with id "teamForm" not found.');
        return;
    }

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
