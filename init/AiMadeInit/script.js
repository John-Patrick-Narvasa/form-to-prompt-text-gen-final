document.getElementById('inputType').addEventListener('change', function() {
    const inputType = this.value;
    const optionsInput = document.getElementById('optionsInput');
    optionsInput.style.display = (inputType === 'checkbox' || inputType === 'radio') ? 'block' : 'none';
});

let currentEditingWrapper = null; // To keep track of the currently editing input

document.getElementById('addInput').addEventListener('click', function() {
    const inputType = document.getElementById('inputType').value;
    const description = document.getElementById('descriptionInput').value;
    const title = document.getElementById('formTitle').value;

    // Validation check for title and description
    if (!title) {
        alert("Please enter a title for the form.");
        return;
    }
    if (!description) {
        alert("Please enter a description for the input.");
        return;
    }

    const options = document.getElementById('optionsInput').value.split(',').map(option => option.trim());
    const dynamicForm = document.getElementById('dynamicForm');

    if (currentEditingWrapper) {
        // If editing an existing input, update its values
        const inputs = currentEditingWrapper.querySelectorAll('input, textarea');
        const descElement = currentEditingWrapper.querySelector('.description');

        // Update the input type and description
        inputs.forEach(input => {
            if (input.type === inputType) {
                input.placeholder = `${inputType.charAt(0).toUpperCase() + inputType.slice(1)} Input`;
            } else {
                input.type = inputType; // Change the input type
            }
        });
        descElement.innerText = description; // Update the description

        // Reset currentEditingWrapper
        currentEditingWrapper = null;
    } else {
        // Adding a new input if not editing
        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';

        let inputElement;
        if (inputType === 'textarea') {
            inputElement = document.createElement('textarea');
            inputElement.placeholder = 'Textarea Input';
        } else if (inputType === 'checkbox' || inputType === 'radio') {
            options.forEach(option => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = inputType;
                input.name = title; // Group radio buttons by form title
                label.innerText = option;

                const descElement = document.createElement('span');
                descElement.className = 'description';
                descElement.innerText = description; // No "Description:" prefix

                const deleteButton = createDeleteButton(wrapper);
                const moveUpButton = createMoveButton(wrapper, 'up');
                const moveDownButton = createMoveButton(wrapper, 'down');

                wrapper.appendChild(descElement);
                wrapper.appendChild(input);
                wrapper.appendChild(label);
                wrapper.appendChild(deleteButton);
                wrapper.appendChild(moveUpButton);
                wrapper.appendChild(moveDownButton);
                dynamicForm.appendChild(wrapper);
                updateMoveButtons(); // Update move button states
            });
        } else {
            inputElement = document.createElement('input');
            inputElement.type = inputType;
            inputElement.placeholder = `${inputType.charAt(0).toUpperCase() + inputType.slice(1)} Input`;

            const descElement = document.createElement('span');
            descElement.className = 'description';
            descElement.innerText = description; // No "Description:" prefix

            const deleteButton = createDeleteButton(wrapper);
            const moveUpButton = createMoveButton(wrapper, 'up');
            const moveDownButton = createMoveButton(wrapper, 'down');

            wrapper.appendChild(descElement);
            wrapper.appendChild(inputElement);
            wrapper.appendChild(deleteButton);
            wrapper.appendChild(moveUpButton);
            wrapper.appendChild(moveDownButton);
            dynamicForm.appendChild(wrapper);
            updateMoveButtons(); // Update move button states
        }
    }

    // Clear input fields after adding
    document.getElementById('descriptionInput').value = '';
    document.getElementById('inputType').value = 'text'; // Reset to default
    document.getElementById('optionsInput').value = ''; // Clear options
    optionsInput.style.display = 'none';
});

// Function to create a delete button
function createDeleteButton(wrapper) {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function() {
        wrapper.parentNode.removeChild(wrapper);
        updateMoveButtons(); // Update move button states after deletion
        currentEditingWrapper = null; // Reset editing state
    });
    return deleteButton;
}

// Function to create move up/down buttons
function createMoveButton(wrapper, direction) {
    const moveButton = document.createElement('button');
    moveButton.innerText = direction === 'up' ? 'Move Up' : 'Move Down';
    moveButton.addEventListener('click', function() {
        const parent = wrapper.parentNode;
        if (direction === 'up' && wrapper.previousElementSibling) {
            parent.insertBefore(wrapper, wrapper.previousElementSibling);
        } else if (direction === 'down' && wrapper.nextElementSibling) {
            parent.insertBefore(wrapper.nextElementSibling, wrapper);
        }
        updateMoveButtons(); // Update button states after moving
    });
    return moveButton;
}

// Function to update the state of move buttons
function updateMoveButtons() {
    const wrappers = document.querySelectorAll('.input-wrapper');
    wrappers.forEach((wrapper, index) => {
        const moveUpButton = wrapper.querySelector('button:contains("Move Up")');
        const moveDownButton = wrapper.querySelector('button:contains("Move Down")');

        moveUpButton.disabled = index === 0; // Disable if at the top
        moveDownButton.disabled = index === wrappers.length - 1; // Disable if at the bottom
    });
}

// Function to enable editing an existing input
function enableEditing(wrapper) {
    const inputs = wrapper.querySelectorAll('input, textarea');
    const descElement = wrapper.querySelector('.description');

    // Populate input fields with existing values
    const inputType = inputs[0].type;

    // Set the current values back into the input fields
    document.getElementById('inputType').value = inputType;
    document.getElementById('descriptionInput').value = descElement.innerText;

    // For checkbox/radio, we need to set options
    if (inputType === 'checkbox' || inputType === 'radio') {
        const options = Array.from(wrapper.querySelectorAll('input[type="checkbox"], input[type="radio"]'));
        const optionTexts = options.map((option, index) => {
            return option.nextSibling.textContent.trim();
        }).join(', ');

        document.getElementById('optionsInput').value = optionTexts;
    }

    // Set the current wrapper for editing
    currentEditingWrapper = wrapper;
}

// Add click listener to each new input for editing
function addEditListener(wrapper) {
    wrapper.addEventListener('click', function() {
        enableEditing(wrapper);
    });
}

document.getElementById('saveForm').addEventListener('click', function() {
    const titleInput = document.getElementById('formTitle');
    const title = titleInput.value;
    const dynamicForm = document.getElementById('dynamicForm');
    const inputs = Array.from(dynamicForm.children)
        .map(child => {
            const input = child.querySelector('input, textarea');
            const description = child.querySelector('.description') ? child.querySelector('.description').innerText : '';
            if (input) {
                return { type: input.type || 'textarea', placeholder: input.placeholder, description: description };
            }
            return null;
        })
        .filter(input => input !== null);

    // Validation check for title
    if (!title) {
        alert("Please enter a title for the form.");
        return;
    }

    const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
    
    // Check for existing title
    const existingForm = savedForms.find(form => form.title === title);
    if (existingForm) {
        const overwrite = confirm(`A form with the title "${title}" already exists. Do you want to overwrite it?`);
        if (overwrite) {
            // Overwrite the existing form
            const index = savedForms.indexOf(existingForm);
            savedForms[index] = { title: title, inputs: inputs };
        } else {
            // Automatically rename to "name(1)" format
            let newTitle = title;
            let counter = 1;
            while (savedForms.some(form => form.title === newTitle)) {
                newTitle = `${title}(${counter})`;
                counter++;
            }
            savedForms.push({ title: newTitle, inputs: inputs });
        }
    } else {
        // Save new form
        savedForms.push({ title: title, inputs: inputs });
    }

    localStorage.setItem('savedForms', JSON.stringify(savedForms));
    displaySavedForms();
});

function displaySavedForms() {
    const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
    const savedFormsList = document.getElementById('savedForms');
    savedFormsList.innerHTML = '';

    savedForms.forEach((form, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'saved-form-item';

        const titleSpan = document.createElement('span');
        titleSpan.innerText = form.title;
        listItem.appendChild(titleSpan);

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', function() {
            loadForm(form);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', function() {
            deleteForm(index);
        });

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        savedFormsList.appendChild(listItem);
    });
}

function deleteForm(index) {
    const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
    savedForms.splice(index, 1);
    localStorage.setItem('savedForms', JSON.stringify(savedForms));
    displaySavedForms();
}

function loadForm(form) {
    const dynamicForm = document.getElementById('dynamicForm');
    dynamicForm.innerHTML = '';
    form.inputs.forEach(input => {
        let inputElement;
        if (input.type === 'textarea') {
            inputElement = document.createElement('textarea');
            inputElement.placeholder = 'Textarea Input';
        } else if (input.type === 'checkbox' || input.type === 'radio') {
            const wrapper = document.createElement('div');
            const options = input.placeholder.split(','); // Assuming placeholder has options
            options.forEach(option => {
                const label = document.createElement('label');
                const inputEl = document.createElement('input');
                inputEl.type = input.type;
                inputEl.name = form.title;
                label.innerText = option.trim();

                const descElement = document.createElement('span');
                descElement.className = 'description';
                descElement.innerText = input.description; // No "Description:" prefix

                const deleteButton = createDeleteButton(wrapper);
                const moveUpButton = createMoveButton(wrapper, 'up');
                const moveDownButton = createMoveButton(wrapper, 'down');
                wrapper.className = 'input-wrapper';

                wrapper.appendChild(descElement);
                wrapper.appendChild(inputEl);
                wrapper.appendChild(label);
                wrapper.appendChild(deleteButton);
                wrapper.appendChild(moveUpButton);
                wrapper.appendChild(moveDownButton);
                dynamicForm.appendChild(wrapper);
            });
        } else {
            inputElement = document.createElement('input');
            inputElement.type = input.type;
            inputElement.placeholder = input.placeholder;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';

        const descElement = document.createElement('span');
        descElement.className = 'description';
        descElement.innerText = input.description; // No "Description:" prefix

        const deleteButton = createDeleteButton(wrapper);
        const moveUpButton = createMoveButton(wrapper, 'up');
        const moveDownButton = createMoveButton(wrapper, 'down');
        
        wrapper.appendChild(descElement);
        wrapper.appendChild(inputElement);
        wrapper.appendChild(deleteButton);
        wrapper.appendChild(moveUpButton);
        wrapper.appendChild(moveDownButton);
        
        // Add edit functionality
        addEditListener(wrapper);

        dynamicForm.appendChild(wrapper);
    });
    document.getElementById('formTitle').value = form.title;
    updateMoveButtons(); // Update move buttons after loading form
}

window.onload = displaySavedForms;