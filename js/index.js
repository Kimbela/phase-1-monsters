const apiUrl = 'http://localhost:3000/monsters';
const monsterList = document.getElementById('monster-list');
const createMonsterForm = document.getElementById('create-monster-form');
const loadMoreButton = document.getElementById('load-more');
let page = 1;

// Function to render a single monster item
function renderMonster(monster) {
  const li = document.createElement('li');
  li.innerHTML = `
    <h3>${monster.name}</h3>
    <p>Age: ${monster.age}</p>
    <p>Description: ${monster.description}</p>
  `;
  monsterList.appendChild(li);
}

// Function to load monsters from the API
async function loadMonsters() {
  try {
    const response = await fetch(`${apiUrl}?_limit=50&_page=${page}`);
    const monsters = await response.json();
    monsters.forEach(renderMonster);
    page++;
  } catch (error) {
    console.error('Error loading monsters:', error);
  }
}

// Function to handle the form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const ageInput = document.getElementById('age');
  const descriptionInput = document.getElementById('description');

  const monster = {
    name: nameInput.value,
    age: parseFloat(ageInput.value),
    description: descriptionInput.value,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(monster),
    });

    if (response.ok) {
      // Clear form inputs
      nameInput.value = '';
      ageInput.value = '';
      descriptionInput.value = '';

      // Add the newly created monster to the list
      const newMonster = await response.json();
      renderMonster(newMonster);
    } else {
      console.error('Failed to create monster:', response.status);
    }
  } catch (error) {
    console.error('Error creating monster:', error);
  }
}

// Function to handle the "Load More" button click
loadMoreButton.addEventListener('click', loadMonsters);

// Attach form submit event listener
createMonsterForm.addEventListener('submit', handleFormSubmit);

// Load the initial monsters
loadMonsters();