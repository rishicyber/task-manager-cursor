// app.js - Task Manager logic will go here

// Data persistence with localStorage
const STORAGE_KEY = 'taskManagerData';

// Save data to localStorage
function saveData() {
  const data = {
    columns: {}
  };
  
  // Get all columns
  const columns = document.querySelectorAll('.column');
  columns.forEach(column => {
    const columnId = column.id;
    const cards = [];
    
    // Get all cards in this column
    const cardElements = column.querySelectorAll('.card');
    cardElements.forEach(card => {
      cards.push({
        heading: card.querySelector('.card-heading').textContent,
        description: card.querySelector('.card-desc').textContent
      });
    });
    
    data.columns[columnId] = cards;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Load data from localStorage
function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) return;
  
  try {
    const data = JSON.parse(savedData);
    
    // Load cards for each column
    Object.keys(data.columns).forEach(columnId => {
      const column = document.getElementById(columnId);
      if (column) {
        const cardList = column.querySelector('.card-list');
        const cards = data.columns[columnId];
        
        cards.forEach(cardData => {
          const card = createCard(cardData.heading, cardData.description);
          cardList.appendChild(card);
        });
      }
    });
  } catch (error) {
    console.error('Error loading saved data:', error);
  }
}

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  
  searchInput.addEventListener('input', performSearch);
  clearSearchBtn.addEventListener('click', clearSearch);
}

function performSearch() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  const clearSearchBtn = document.getElementById('clear-search');
  const allCards = document.querySelectorAll('.card');
  
  if (searchTerm === '') {
    // Show all cards and remove highlighting
    allCards.forEach(card => {
      card.classList.remove('hidden', 'highlighted');
    });
    clearSearchBtn.classList.remove('visible');
    return;
  }
  
  // Show clear button
  clearSearchBtn.classList.add('visible');
  
  allCards.forEach(card => {
    const heading = card.querySelector('.card-heading').textContent.toLowerCase();
    const description = card.querySelector('.card-desc').textContent.toLowerCase();
    
    if (heading.includes(searchTerm) || description.includes(searchTerm)) {
      // Show and highlight matching cards
      card.classList.remove('hidden');
      card.classList.add('highlighted');
    } else {
      // Hide non-matching cards
      card.classList.add('hidden');
      card.classList.remove('highlighted');
    }
  });
}

function clearSearch() {
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const allCards = document.querySelectorAll('.card');
  
  // Clear search input
  searchInput.value = '';
  
  // Show all cards and remove highlighting
  allCards.forEach(card => {
    card.classList.remove('hidden', 'highlighted');
  });
  
  // Hide clear button
  clearSearchBtn.classList.remove('visible');
  
  // Focus back on search input
  searchInput.focus();
}

// Helper to create a new card element
function createCard(heading = 'New Task', description = 'Task details...') {
  const card = document.createElement('div');
  card.className = 'card';
  card.draggable = true; // Make card draggable

  // Card heading (editable in future)
  const headingElement = document.createElement('div');
  headingElement.className = 'card-heading';
  headingElement.textContent = heading;
  card.appendChild(headingElement);

  // Card description (editable in future)
  const descElement = document.createElement('div');
  descElement.className = 'card-desc';
  descElement.textContent = description;
  card.appendChild(descElement);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'delete';
  delBtn.textContent = '✕';
  delBtn.onclick = (e) => {
    e.stopPropagation(); // Prevent card click event
    showDeleteConfirmation(card);
  };
  card.appendChild(delBtn);

  // Add click event to make card editable
  card.addEventListener('click', () => {
    showCardEditor(card);
  });

  // Add drag event listeners
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  return card;
}

// Function to show card editor for new cards
function showNewCardEditor(targetColumn) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';
  
  // Create editor container
  const editor = document.createElement('div');
  editor.className = 'card-editor';
  
  // Create form
  const form = document.createElement('form');
  form.innerHTML = `
    <h3>Create New Card</h3>
    <label>Title:</label>
    <input type="text" id="edit-heading" placeholder="Enter task title..." required>
    <label>Description:</label>
    <textarea id="edit-desc" placeholder="Enter task description..."></textarea>
    <div class="editor-buttons">
      <button type="submit">Create Card</button>
      <button type="button" class="cancel-btn">Cancel</button>
    </div>
  `;
  
  editor.appendChild(form);
  overlay.appendChild(editor);
  document.body.appendChild(overlay);
  
  // Focus on heading input
  const headingInput = document.getElementById('edit-heading');
  headingInput.focus();
  
  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newHeading = document.getElementById('edit-heading').value.trim();
    const newDesc = document.getElementById('edit-desc').value.trim();
    
    if (newHeading) {
      // Create and add the new card
      const card = createCard(newHeading, newDesc || 'No description');
      const cardList = targetColumn.querySelector('.card-list');
      cardList.appendChild(card);
      
      // Save data after adding new card
      saveData();
      
      // Remove overlay
      overlay.remove();
    }
  });
  
  // Handle Ctrl+Enter to submit
  form.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      form.requestSubmit();
    }
  });
  
  // Handle cancel
  document.querySelector('.cancel-btn').addEventListener('click', () => {
    overlay.remove();
  });
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}

// Custom delete confirmation modal
function showDeleteConfirmation(card) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Create confirmation modal
  const modal = document.createElement('div');
  modal.className = 'delete-modal';
  
  modal.innerHTML = `
    <div class="modal-header">
      <h3>Delete Card</h3>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete this card?</p>
      <p class="card-preview">"${card.querySelector('.card-heading').textContent}"</p>
    </div>
    <div class="modal-buttons">
      <button class="cancel-btn">Cancel</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Handle cancel
  modal.querySelector('.cancel-btn').addEventListener('click', () => {
    overlay.remove();
  });
  
  // Handle delete
  modal.querySelector('.delete-btn').addEventListener('click', () => {
    card.remove();
    saveData(); // Save after deletion
    overlay.remove();
  });
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}

// Drag and drop functionality
function handleDragStart(e) {
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

// Initialize drag and drop for all columns
function initializeDragAndDrop() {
  const columns = document.querySelectorAll('.column');
  
  columns.forEach(column => {
    const cardList = column.querySelector('.card-list');
    
    // Make card list a drop zone
    cardList.addEventListener('dragover', handleDragOver);
    cardList.addEventListener('drop', handleDrop);
    cardList.addEventListener('dragenter', handleDragEnter);
    cardList.addEventListener('dragleave', handleDragLeave);
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
  e.preventDefault();
  e.target.closest('.card-list').classList.add('drag-over');
}

function handleDragLeave(e) {
  e.target.closest('.card-list').classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  const cardList = e.target.closest('.card-list');
  cardList.classList.remove('drag-over');
  
  // Get the dragged card
  const draggedCard = document.querySelector('.dragging');
  if (draggedCard) {
    // Get the drop target (another card or the card list)
    const dropTarget = e.target.closest('.card') || cardList;
    
    // If dropping on another card, insert before it
    if (dropTarget !== cardList) {
      const rect = dropTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      
      if (e.clientY < midY) {
        // Insert before the target card
        dropTarget.parentNode.insertBefore(draggedCard, dropTarget);
      } else {
        // Insert after the target card
        dropTarget.parentNode.insertBefore(draggedCard, dropTarget.nextSibling);
      }
    } else {
      // Dropping on empty space, append to the end
      cardList.appendChild(draggedCard);
    }
    
    // Save data after moving card
    saveData();
  }
}

// Function to show card editor in center
function showCardEditor(card) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';
  
  // Create editor container
  const editor = document.createElement('div');
  editor.className = 'card-editor';
  
  // Get current content
  const currentHeading = card.querySelector('.card-heading').textContent;
  const currentDesc = card.querySelector('.card-desc').textContent;
  
  // Create form
  const form = document.createElement('form');
  form.innerHTML = `
    <h3>Edit Card</h3>
    <label>Title:</label>
    <input type="text" id="edit-heading" value="${currentHeading}">
    <label>Description:</label>
    <textarea id="edit-desc">${currentDesc}</textarea>
    <div class="editor-buttons">
      <button type="submit">Save</button>
      <button type="button" class="cancel-btn">Cancel</button>
    </div>
  `;
  
  editor.appendChild(form);
  overlay.appendChild(editor);
  document.body.appendChild(overlay);
  
  // Focus on heading input
  const headingInput = document.getElementById('edit-heading');
  headingInput.focus();
  headingInput.select();
  
  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newHeading = document.getElementById('edit-heading').value;
    const newDesc = document.getElementById('edit-desc').value;
    
    // Update card content
    card.querySelector('.card-heading').textContent = newHeading;
    card.querySelector('.card-desc').textContent = newDesc;
    
    // Save data after editing
    saveData();
    
    // Remove overlay
    overlay.remove();
  });
  
  // Handle Ctrl+Enter to submit
  form.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      form.requestSubmit();
    }
  });
  
  // Handle cancel
  document.querySelector('.cancel-btn').addEventListener('click', () => {
    overlay.remove();
  });
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });
}

// Add event listeners to all add-card buttons
const addCardButtons = document.querySelectorAll('.add-card');
addCardButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Find the column that was clicked
    const column = btn.closest('.column');
    // Open the new card editor instead of creating a card immediately
    showNewCardEditor(column);
  });
});

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Load saved data first
  loadData();
  
  // Then initialize other features
  initializeDragAndDrop();
  initializeSearch();
});