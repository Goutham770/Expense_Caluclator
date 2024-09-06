// Get elements
const form = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const typeInput = document.getElementById('type');
const entriesTableBody = document.getElementById('entries-table-body');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const netBalance = document.getElementById('net-balance');
const filterRadios = document.querySelectorAll('input[name="filter"]');

// Data storage
let entries = JSON.parse(localStorage.getItem('entries')) || [];

//  update local storage
function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Function to render entries in the table
function renderEntries() {
    entriesTableBody.innerHTML = '';
    let filteredEntries = entries;

    //  filter based on radio buttons
    const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
    if (selectedFilter !== 'all') {
        filteredEntries = entries.filter(entry => entry.type === selectedFilter);
    }

    // table rows
    filteredEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.className = 'text-center text-lg';

        row.innerHTML = `
            <td class="py-3 px-4">${entry.date}</td>
            <td class="py-3 px-4">${entry.description}</td>
            <td class="py-3 px-4 ${entry.type === 'income' ? 'text-yellow-500' : 'text-red-500'}">${entry.type}</td>
            <td class="py-3 px-4 ${entry.type === 'income' ? 'text-yellow-500' : 'text-red-500'}">$${parseFloat(entry.amount).toFixed(2)}</td>
            <td class="py-3 px-4">
                <button onclick="editEntry(${index})" class="text-blue-500 mr-2">Edit</button>
                <button onclick="deleteEntry(${index})" class="text-red-500">Delete</button>
            </td>
        `;
        entriesTableBody.appendChild(row);
    });

    updateSummary(); // Update the income, expense, and balance summary
}

// Function to update summary
function updateSummary() {
    const incomeTotal = entries
        .filter(entry => entry.type === 'income')
        .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const expenseTotal = entries
        .filter(entry => entry.type === 'expense')
        .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
    const balance = incomeTotal - expenseTotal;

    totalIncome.textContent = `$${incomeTotal.toFixed(2)}`;
    totalExpense.textContent = `$${expenseTotal.toFixed(2)}`;
    netBalance.textContent = `$${balance.toFixed(2)}`;
}

// Function to add a new entry
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const newEntry = {
        description: descriptionInput.value,
        amount: amountInput.value,
        date: dateInput.value,
        type: typeInput.value
    };

    entries.push(newEntry);
    updateLocalStorage();
    renderEntries();

    // Clear input fields
    descriptionInput.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

// Function to edit an entry
function editEntry(index) {
    const entry = entries[index];

    // Populate the form with the existing values
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    dateInput.value = entry.date;
    typeInput.value = entry.type;

    // Remove the entry from the list so it can be re-added after editing
    entries.splice(index, 1);
    updateLocalStorage();
    renderEntries();
}

// Function to delete an entry
function deleteEntry(index) {
    entries.splice(index, 1);
    updateLocalStorage();
    renderEntries();
}

// Event listener for filter change
filterRadios.forEach(radio => {
    radio.addEventListener('change', renderEntries);
});

// Initial render to show saved entries
renderEntries();
