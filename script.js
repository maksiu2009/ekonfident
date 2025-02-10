// Dane przechowywane w localStorage
let profiles = JSON.parse(localStorage.getItem('profiles')) || [];

// Funkcje pokazujące/ukrywające sekcje
function showAddPoints() {
    document.getElementById('add-points').classList.remove('hidden');
    document.getElementById('options').classList.add('hidden');
    updateProfileSelect();
}

function hideAddPoints() {
    document.getElementById('add-points').classList.add('hidden');
    document.getElementById('options').classList.remove('hidden');
}

function showCreateProfile() {
    document.getElementById('create-profile').classList.remove('hidden');
    document.getElementById('options').classList.add('hidden');
}

function hideCreateProfile() {
    document.getElementById('create-profile').classList.add('hidden');
    document.getElementById('options').classList.remove('hidden');
}

// Aktualizacja listy profili w select
function updateProfileSelect() {
    const select = document.getElementById('profile-select');
    select.innerHTML = ''; // Wyczyść poprzednią listę

    // Dodaj opcję domyślną
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "Wybierz profil...";
    select.appendChild(defaultOption);

    // Dodaj opcje dla każdego profilu
    profiles.forEach((profile, index) => {
        const option = document.createElement('option');
        option.value = index; // Ustawienie wartości na indeks profilu
        option.textContent = `${profile.name} (${profile.age} lat)`; // Wyświetlanie imienia, wieku
        select.appendChild(option);
    });
}


// Zapis danych do localStorage
function saveProfiles() {
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

// Dodawanie nowego profilu
document.getElementById('create-profile-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const photo = document.getElementById('photo').value;

    const newProfile = {
        name: name,
        age: age,
        photo: photo,
        points: 0,
        history: []  // Historia zmian punktów
    };

    profiles.push(newProfile);
    saveProfiles();
    updateProfileSelect();
    renderProfiles();
    hideCreateProfile();
    alert('Profil dodany!');
});

// Dodawanie punktów
document.getElementById('add-points-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const profileIndex = document.getElementById('profile-select').value;
    const points = parseInt(document.getElementById('points').value);

    if (profileIndex === null || profileIndex === "") {
        alert("Proszę wybrać profil.");
        return;
    }

    if (isNaN(points) || points <= 0) {
        alert("Wprowadź poprawną liczbę punktów.");
        return;
    }

    // Dodanie punktów do wybranego profilu
    profiles[profileIndex].points += points;

    // Zapisanie profili do localStorage
    saveProfiles();

    // Renderowanie zaktualizowanej listy profili
    renderProfiles();

    // Ukrycie formularza
    hideAddPoints();

    // Wyświetlenie komunikatu
    alert(`Dodano ${points} punkty do profilu ${profiles[profileIndex].name}`);
});


// Edycja profilu
function editProfile(index) {
    const newName = prompt("Nowe imię i nazwisko:", profiles[index].name);
    const newAge = prompt("Nowy wiek:", profiles[index].age);
    const newPhoto = prompt("Nowy URL zdjęcia:", profiles[index].photo);
    if (newName && newAge) {
        profiles[index].name = newName;
        profiles[index].age = newAge;
        profiles[index].photo = newPhoto;
        saveProfiles();
        renderProfiles();
    }
}

// Usuwanie profilu
function deleteProfile(index) {
    if (confirm("Czy na pewno chcesz usunąć ten profil?")) {
        profiles.splice(index, 1);
        saveProfiles();
        renderProfiles();
        updateProfileSelect();
    }
}

// Filtrowanie profili
function filterProfiles() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredProfiles = profiles.filter(profile => profile.name.toLowerCase().includes(searchTerm));
    renderProfiles(filteredProfiles);
}

// Sortowanie profili
function sortProfilesByPoints() {
    profiles.sort((a, b) => b.points - a.points);  // Sortowanie według punktów
    renderProfiles();
}

function sortProfilesByAge() {
    profiles.sort((a, b) => a.age - b.age);  // Sortowanie według wieku
    renderProfiles();
}

// Eksport do CSV
function exportToCSV() {
    let csv = 'Imię i nazwisko,Wiek,Punkty\n';
    profiles.forEach(profile => {
        csv += `${profile.name},${profile.age},${profile.points}\n`;
    });
    
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'profiles.csv';
    hiddenElement.click();
}

// Funkcja do przełączania trybu ciemnego
function toggleDarkMode() {
    const body = document.body;
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const profilesListItems = document.querySelectorAll('#profiles-list li');
    const buttons = document.querySelectorAll('button');
    
    body.classList.toggle('dark-mode');
    header.classList.toggle('dark-mode');
    footer.classList.toggle('dark-mode');
    profilesListItems.forEach(item => item.classList.toggle('dark-mode'));
    buttons.forEach(button => button.classList.toggle('dark-mode'));

    // Zapisywanie ustawienia trybu ciemnego w localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Sprawdzanie zapisanego ustawienia trybu ciemnego przy ładowaniu strony
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        toggleDarkMode();  // Włącz tryb ciemny, jeśli zapisane w localStorage
    }

    // Dodanie obsługi kliknięcia w przycisk do zmiany trybu
    document.getElementById('toggle-theme').addEventListener('click', toggleDarkMode);
});


// Renderowanie listy profili
function renderProfiles() {
    const profilesList = document.getElementById('profiles-list');
    profilesList.innerHTML = '';  // Wyczyść poprzednią listę profili

    profiles.forEach((profile, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${profile.name}</strong> (${profile.age} lat)<br>
            Punkty: ${profile.points}<br>
            ${profile.photo ? `<img src="${profile.photo}" alt="Zdjęcie" width="50" height="50">` : ''}<br>
            <button onclick="editProfile(${index})">✏️ Edytuj</button>
            <button onclick="deleteProfile(${index})">🗑️ Usuń</button>
        `;
        profilesList.appendChild(li);
    });
}

// Wyświetlanie historii punktów
function viewHistory(index) {
    const history = profiles[index].history.map(entry => `<li>${entry.points} punktów w dniu ${entry.date}</li>`).join('');
    alert(`Historia punktów dla ${profiles[index].name}:\n${history}`);
}

// Inicjalizacja strony
document.addEventListener('DOMContentLoaded', function () {
    initializeSampleProfiles(); // Dodaj przykładowe profile, jeśli nie ma żadnych
    renderProfiles(); // Renderuj profile
    updateProfileSelect(); // Zaktualizuj listę profili w formularzach
    renderReports(); // Renderuj donosy
    updateReportProfileSelect(); // Zaktualizuj listę profili w formularzu donosów
});
// Renderowanie listy profili z nowym stylem kart
function renderProfiles() {
    const profilesList = document.getElementById('profiles-list');
    profilesList.innerHTML = '';  // Wyczyść poprzednią listę profili

    profiles.forEach((profile, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="text-align: center;">
                <!-- Wyświetlenie zdjęcia, jeśli jest dostępne -->
                ${profile.photo ? `<img src="${profile.photo}" alt="Zdjęcie">` : `<img src="https://via.placeholder.com/80" alt="Zdjęcie">`} 
                <strong>${profile.name}</strong>
                <p>Wiek: ${profile.age} lat</p>
                <p>Punkty: ${profile.points}</p>
                <div>
                    <button onclick="editProfile(${index})">✏️ Edytuj</button>
                    <button onclick="deleteProfile(${index})">🗑️ Usuń</button>
                </div>
            </div>
        `;
        profilesList.appendChild(li);
    });
}
document.getElementById('start-button').addEventListener('click', function () {
    document.getElementById('welcome-screen').style.display = 'none'; // Ukrycie strony powitalnej
    document.getElementById('main-content').style.display = 'block';  // Pokazanie głównej zawartości
});

// Funkcja pokazująca sekcję donosów
function showAddReport() {
    document.getElementById('donosy').classList.remove('hidden');
    document.getElementById('options').classList.add('hidden');
    updateReportProfileSelect(); // Zaktualizowanie listy profili do wyboru w formularzu donosów
}

// Funkcja ukrywająca sekcję donosów
function hideAddReport() {
    document.getElementById('donosy').classList.add('hidden');
    document.getElementById('options').classList.remove('hidden');
}

// Aktualizacja listy profili do wyboru w formularzu donosów
function updateReportProfileSelect() {
    const select = document.getElementById('report-profile-select');
    select.innerHTML = '';
    profiles.forEach((profile, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${profile.name} (${profile.age} lat)`;
        select.appendChild(option);
    });
}

// Dodawanie donosów
document.getElementById('add-report-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const profileIndex = document.getElementById('report-profile-select').value;
    const reportText = document.getElementById('report-text').value;

    const newReport = {
        profile: profiles[profileIndex],
        text: reportText
    };

    // Zapisujemy donosy do localStorage
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.push(newReport);
    localStorage.setItem('reports', JSON.stringify(reports));

    renderReports(); // Renderujemy donosy na stronie
    hideAddReport(); // Ukrywamy formularz donosów
});

function renderReports() {
    const reportsList = document.getElementById('reports-list');
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    reportsList.innerHTML = ''; // Wyczyść listę donosów

    reports.forEach((report, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Donos na: ${report.profile.name}</strong>
            <p>${report.text}</p>
            <button onclick="deleteReport(${index})">🗑️ Usuń donos</button>
        `;
        reportsList.appendChild(li);
    });
}
// Inicjalizacja strony (renderowanie donosów)
renderReports();
// Funkcja sortująca konfidentów według liczby punktów
function sortProfilesByPoints() {
    // Sortowanie profili według punktów (malejąco)
    profiles.sort((a, b) => b.points - a.points);
    saveProfiles(); // Zapisujemy posortowaną listę profili w localStorage
    renderProfiles(); // Renderujemy posortowaną listę na stronie
}

// Funkcja renderująca listę profili
function renderProfiles() {
    const profilesList = document.getElementById('profiles-list');
    profilesList.innerHTML = '';
    profiles.forEach((profile, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${profile.name}</strong> (${profile.age} lat)<br>
            Punkty: ${profile.points}<br>
            ${profile.photo ? `<img src="${profile.photo}" alt="Zdjęcie" width="50" height="50">` : ''}<br>
            <button onclick="editProfile(${index})">✏️ Edytuj</button>
            <button onclick="deleteProfile(${index})">🗑️ Usuń</button>
        `;
        profilesList.appendChild(li);
    });
}
document.getElementById('start-button').addEventListener('click', function () {
    document.getElementById('welcome-screen').classList.add('hidden'); // Ukrywanie strony powitalnej
    document.getElementById('main-content').classList.add('show'); // Pokazywanie głównej zawartości
});

// Inicjalizacja strony
document.addEventListener('DOMContentLoaded', function () {
    // Sprawdź, czy strona powitalna ma być wyświetlana
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleDarkMode();
    }

    // Obsługa przycisku "Zaczynamy"
    document.getElementById('start-button').addEventListener('click', function () {
        document.getElementById('welcome-screen').classList.add('hidden'); // Ukryj stronę powitalną
        document.getElementById('main-content').classList.remove('hidden'); // Pokaż główną zawartość
        initializePage(); // Inicjalizacja strony (renderowanie profili, donosów itp.)
    });
});

function initializePage() {
    renderProfiles();
    updateProfileSelect();
    renderReports();
    updateReportProfileSelect();
}

function deleteReport(index) {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];

    if (confirm("Czy na pewno chcesz usunąć ten donos?")) {
        reports.splice(index, 1); // Usuń donos z listy
        localStorage.setItem('reports', JSON.stringify(reports)); // Zaktualizuj localStorage
        renderReports(); // Ponownie wyrenderuj listę donosów
    }
}

// Funkcja do inicjalizacji przykładowych profili
function initializeSampleProfiles() {
    const sampleProfiles = [
        {
            name: "Jan Kowalski",
            age: 35,
            photo: "https://via.placeholder.com/150",
            points: 100,
            history: []
        },
        {
            name: "Anna Nowak",
            age: 28,
            photo: "https://via.placeholder.com/150",
            points: 75,
            history: []
        },
        {
            name: "Piotr Wiśniewski",
            age: 42,
            photo: "https://via.placeholder.com/150",
            points: 50,
            history: []
        }
    ];

    // Sprawdź, czy w localStorage są już profile
    if (!localStorage.getItem('profiles')) {
        localStorage.setItem('profiles', JSON.stringify(sampleProfiles)); // Zapisz przykładowe profile
    }
}