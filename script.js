const body = document.body;
const darkToggle = document.getElementById('dark-mode-toggle');

// State management
const state = {
  tables: [
    { name: 'ראשי', columns: ['נושא', 'פרטים'], rows: [] }
  ],
  active: 0,
  infos: [],
  contacts: []
};

// Elements
const tabsList = document.getElementById('main-table-tabs-list');
const tableNameInput = document.getElementById('main-table-name');
const tableHeaders = document.getElementById('main-table-headers');
const tableBody = document.getElementById('main-table-body');

// Modals
function getModal(id) { return document.getElementById(id); }
const modals = {
  info: getModal('info-modal'),
  contacts: getModal('contacts-modal'),
  history: getModal('history-modal'),
  newTable: getModal('new-table-modal'),
  editColumns: getModal('edit-columns-modal')
};

function openModal(name) {
  modals[name].style.display = 'flex';
}

function closeModal(name) {
  modals[name].style.display = 'none';
}

// Dark mode toggle
if (darkToggle) {
  darkToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode', darkToggle.checked);
  });
}

// Render Tabs
function renderTabs() {
  tabsList.innerHTML = '';
  state.tables.forEach((t, idx) => {
    const btn = document.createElement('button');
    btn.textContent = t.name;
    btn.className = 'table-tab' + (idx === state.active ? ' active' : '');
    btn.addEventListener('click', () => {
      state.active = idx;
      renderTabs();
      renderTable();
    });
    tabsList.appendChild(btn);
  });
}

// Render Active Table
function renderTable() {
  const table = state.tables[state.active];
  tableNameInput.value = table.name;
  tableHeaders.innerHTML = '';
  const row = document.createElement('tr');
  table.columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    row.appendChild(th);
  });
  const thDel = document.createElement('th');
  thDel.textContent = '';
  row.appendChild(thDel);
  tableHeaders.appendChild(row);
  tableBody.innerHTML = '';
  table.rows.forEach((r, rIdx) => {
    const tr = document.createElement('tr');
    r.forEach((cell, cIdx) => {
      const td = document.createElement('td');
      td.contentEditable = true;
      td.textContent = cell;
      td.addEventListener('input', () => {
        state.tables[state.active].rows[rIdx][cIdx] = td.textContent;
      });
      tr.appendChild(td);
    });
    const tdDel = document.createElement('td');
    tdDel.className = 'delete-row';
    tdDel.innerHTML = '<i class="fas fa-trash"></i>';
    tdDel.addEventListener('click', () => {
      state.tables[state.active].rows.splice(rIdx,1);
      renderTable();
    });
    tr.appendChild(tdDel);
    tableBody.appendChild(tr);
  });
}

// Add Row
document.getElementById('main-add-row').addEventListener('click', () => {
  const table = state.tables[state.active];
  const newRow = table.columns.map(() => '');
  table.rows.push(newRow);
  renderTable();
});

// Edit Columns modal
const columnsList = document.getElementById('columns-list');
function renderColumnsEditor() {
  columnsList.innerHTML = '';
  const cols = state.tables[state.active].columns;
  cols.forEach((c, idx) => {
    const input = document.createElement('input');
    input.className = 'input-field';
    input.value = c;
    input.addEventListener('input', () => {
      cols[idx] = input.value;
    });
    columnsList.appendChild(input);
  });
}

// Open modals
document.getElementById('info-btn').addEventListener('click', () => openModal('info'));
document.getElementById('contacts-btn').addEventListener('click', () => openModal('contacts'));
document.getElementById('history-btn').addEventListener('click', () => openModal('history'));
document.getElementById('add-new-main-table').addEventListener('click', () => openModal('newTable'));
document.getElementById('main-edit-columns').addEventListener('click', () => {renderColumnsEditor(); openModal('editColumns');});

// Close modals buttons
['close-info-modal','close-contacts-modal','close-history-modal','close-new-table-modal','close-edit-columns-modal'].forEach(id=>{
  document.getElementById(id).addEventListener('click', () => {
    Object.keys(modals).forEach(m => closeModal(m));
  });
});

document.getElementById('cancel-info').addEventListener('click', () => closeModal('info'));
document.getElementById('cancel-create-table').addEventListener('click', () => closeModal('newTable'));
document.getElementById('cancel-edit-columns').addEventListener('click', () => closeModal('editColumns'));

document.getElementById('save-columns').addEventListener('click', () => {
  renderTable();
  closeModal('editColumns');
});

document.getElementById('create-table').addEventListener('click', () => {
  const name = document.getElementById('new-table-name').value.trim();
  if(name) {
    state.tables.push({ name, columns: ['נושא','פרטים'], rows: [] });
    state.active = state.tables.length -1;
    renderTabs();
    renderTable();
  }
  closeModal('newTable');
});

tableNameInput.addEventListener('input', () => {
  state.tables[state.active].name = tableNameInput.value;
  renderTabs();
});

// Contacts
const contactsBody = document.getElementById('contacts-table-body');
document.getElementById('add-contact').addEventListener('click', () => {
  const name = document.getElementById('contact-name').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  if(name && phone) {
    state.contacts.push({name, phone});
    renderContacts();
    document.getElementById('contact-name').value='';
    document.getElementById('contact-phone').value='';
  }
});

function renderContacts() {
  contactsBody.innerHTML = '';
  state.contacts.forEach((c, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.name}</td><td>${c.phone}</td>`;
    const td = document.createElement('td');
    td.className = 'delete-row';
    td.innerHTML = '<i class="fas fa-trash"></i>';
    td.addEventListener('click', () => { state.contacts.splice(idx,1); renderContacts(); });
    tr.appendChild(td);
    contactsBody.appendChild(tr);
  });
}

// Initial render
renderTabs();
renderTable();
