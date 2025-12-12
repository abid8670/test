// WARNING: This is for demonstration purposes only and is not secure.
// Do not use hardcoded credentials in a production environment.
// User credentials (for demonstration purposes)
const users = {
    user: 'password',
    admin: 'adminpass'
};

document.addEventListener('DOMContentLoaded', () => {
    // Login functionality
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;
            const role = loginForm.role.value;

            if (users[username] === password && ((role === 'user' && username === 'user') || (role === 'admin' && username === 'admin'))) {
                localStorage.setItem('loggedInUser', username);
                localStorage.setItem('userRole', role);
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username, password, or role');
            }
        });
    }

    // Dashboard functionality
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userRole = localStorage.getItem('userRole');

    if (window.location.pathname.endsWith('dashboard.html') && !loggedInUser) {
        window.location.href = 'index.html'; // Redirect to login if not logged in
    }

    if (loggedInUser) {
        const addCandidateForm = document.getElementById('addCandidateForm');
        const candidateTable = document.getElementById('candidateTable');

        if (userRole === 'user') {
            if (addCandidateForm) { // Check if the element exists
                addCandidateForm.style.display = 'none'; // Hide form for regular users
            }
        }

        function getCandidates() {
            const storedCandidates = localStorage.getItem('candidates');
            if (storedCandidates) {
                return JSON.parse(storedCandidates);
            } else {
                // Default data if nothing is stored
                return [
                    { name: 'Alice', cv: 'link_to_cv_1', status: 'Pending' },
                    { name: 'Bob', cv: 'link_to_cv_2', status: 'Interviewing' }
                ];
            }
        }

        function saveCandidates() {
            localStorage.setItem('candidates', JSON.stringify(candidates));
        }

        let candidates = getCandidates();

        function renderTable() {
            const tbody = candidateTable.querySelector('tbody');
            tbody.innerHTML = '';
            candidates.forEach((candidate, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${candidate.name}</td>
                    <td><a href="${candidate.cv}" target="_blank">View CV</a></td>
                    <td>${candidate.status}</td>
                    <td>
                        ${userRole === 'admin' ? `
                            <select data-index="${index}">
                                <option value="Pending" ${candidate.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Interviewing" ${candidate.status === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
                                <option value="Selected" ${candidate.status === 'Selected' ? 'selected' : ''}>Selected</option>
                                <option value="Rejected" ${candidate.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            </select>
                        ` : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        if (candidateTable) {
            candidateTable.addEventListener('change', (e) => {
                if (e.target.tagName === 'SELECT') {
                    const index = e.target.dataset.index;
                    const newStatus = e.target.value;
                    candidates[index].status = newStatus;
                    saveCandidates();
                    renderTable();
                }
            });
        }

        const newCandidateForm = document.getElementById('newCandidate');
        if (newCandidateForm) {
            newCandidateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = newCandidateForm.name.value;
                const cv = newCandidateForm.cv.value;
                candidates.push({ name, cv, status: 'Pending' });
                saveCandidates();
                renderTable();
                newCandidateForm.reset();
            });
        }

        if (candidateTable) {
            renderTable();
        }
    }
});