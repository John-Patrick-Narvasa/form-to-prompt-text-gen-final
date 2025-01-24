document.getElementById('inputType').addEventListener('change', function() {
    const inputType = this.value;
    const optionsInput = document.getElementById('optionsInput');
    optionsInput.style.display = (inputType === 'checkbox' || inputType === 'radio') ? 'block' : 'none';
});

let currentEditingWrapper = null; // To keep track of the currently editing input

// Function to show warning messages
function showWarning(message) {
    const warningElement = document.getElementById('warningMessage');
    warningElement.innerText = message;
    warningElement.style.display = 'block';
}

// Function to hide warning messages
function hideWarning() {
    const warningElement = document.getElementById('warningMessage');
    warningElement.innerText = '';
    warningElement.style.display = 'none';
}

// Update button text and Deselect button visibility based on editing state
function updateUI(isEditing) {
    const addInputButton = document.getElementById('addInput');
    const deselectButton = document.getElementById('deselectInput');
    
    addInputButton.innerText = isEditing ? 'Change Input' : 'Add Input';
    deselectButton.style.display = isEditing ? 'inline-block' : 'none'; // Show or hide Deselect button
}

// Deselect function to reset the form
function deselectInput() {
    currentEditingWrapper = null; // Clear the current editing state
    updateUI(false); // Reset button text and hide Deselect button
    document.getElementById('descriptionInput').value = ''; // Clear description
    document.getElementById('inputType').value = 'text'; // Reset to default type
    document.getElementById('optionsInput').value = ''; // Clear options
    document.getElementById('optionsInput').style.display = 'none'; // Hide options input
}

// Add Deselect button functionality
document.getElementById('deselectInput').addEventListener('click', function() {
    deselectInput(); // Call deselect function
});

document.getElementById('addInput').addEventListener('click', function() {
    const inputType = document.getElementById('inputType').value;
    const description = document.getElementById('descriptionInput').value;
    const title = document.getElementById('formTitle').value;

    // Validation checks for title and description
    if (!title) {
        showWarning("Please enter a title for the form.");
        return;
    }
    if (!description) {
        showWarning("Please enter a description for the input.");
        return;
    }

    // Additional validation for checkbox/radio options
    if ((inputType === 'checkbox' || inputType === 'radio') && !document.getElementById('optionsInput').value.trim()) {
        showWarning("Please enter options for checkbox or radio input.");
        return;
    }

    hideWarning(); // Hide warning if validations pass

    const options = document.getElementById('optionsInput').value.split(',').map(option => option.trim());
    const dynamicForm = document.getElementById('dynamicForm');

    if (currentEditingWrapper) {
        // If editing an existing input, check for changes
        const inputs = currentEditingWrapper.querySelectorAll('input, textarea');
        const descElement = currentEditingWrapper.querySelector('.description');

        const currentDescription = descElement.innerText;
        const inputChanged = Array.from(inputs).some(input => input.type !== inputType);

        // Check if either description or input type has changed
        if (currentDescription === description && !inputChanged) {
            showWarning("Please change either the description or the input type to update.");
            return;
        }

        // Update the input type and description
        inputs.forEach(input => {
            input.type = inputType; // Change the input type
            input.placeholder = `${inputType.charAt(0).toUpperCase() + inputType.slice(1)} Input`;
        });
        descElement.innerText = description; // Update the description

        // Reset currentEditingWrapper
        deselectInput();
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
                wrapper.appendChild(descElement);
                wrapper.appendChild(input);
                wrapper.appendChild(label);
                wrapper.appendChild(deleteButton);
                dynamicForm.appendChild(wrapper);
            });
        } else {
            inputElement = document.createElement('input');
            inputElement.type = inputType;
            inputElement.placeholder = `${inputType.charAt(0).toUpperCase() + inputType.slice(1)} Input`;

            const descElement = document.createElement('span');
            descElement.className = 'description';
            descElement.innerText = description; // No "Description:" prefix

            const deleteButton = createDeleteButton(wrapper);
            wrapper.appendChild(descElement);
            wrapper.appendChild(inputElement);
            wrapper.appendChild(deleteButton);
            dynamicForm.appendChild(wrapper);
        }
    }

    // Clear input fields after adding or changing
    document.getElementById('descriptionInput').value = '';
    document.getElementById('inputType').value = 'text'; // Reset to default
    document.getElementById('optionsInput').value = ''; // Clear options
    document.getElementById('optionsInput').style.display = 'none';
});

// Function to create a delete button
function createDeleteButton(wrapper) {
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function() {
        wrapper.parentNode.removeChild(wrapper);
        deselectInput(); // Reset editing state and button text
    });
    return deleteButton;
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
    updateUI(true); // Change button to Change Input and show Deselect button
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
        showWarning("Please enter a title for the form.");
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
    hideWarning(); // Hide warning on successful save
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
                wrapper.className = 'input-wrapper';

                wrapper.appendChild(descElement);
                wrapper.appendChild(inputEl);
                wrapper.appendChild(label);
                wrapper.appendChild(deleteButton);
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
        wrapper.appendChild(descElement);
        wrapper.appendChild(inputElement);
        wrapper.appendChild(deleteButton);
        
        // Add edit functionality
        addEditListener(wrapper);

        dynamicForm.appendChild(wrapper);
    });
    document.getElementById('formTitle').value = form.title;
}

// Sample pre-made form template
const sampleTemplate = {
    title: "Sample Form",
    inputs: [
        { type: "text", placeholder: "Enter your name", description: "Name" },
        { type: "email", placeholder: "Enter your email", description: "Email" },
        { type: "checkbox", placeholder: "Option 1, Option 2", description: "Select options" },
        { type: "textarea", placeholder: "Your message here", description: "Message" }
    ]
};

const quizTemplate = {
    title: "Quiz Template",
    inputs: [
        { type: "text", placeholder: "Enter the topic", description: "Topic" },
        { type: "text", placeholder: "Enter specific coverages", description: "Specific Coverages" },
        {
            type: "select", 
            placeholder: "Select difficulty", 
            options: ["Easy", "Medium", "Hard", "Confusing?"], 
            description: "Difficulty"
        },
        { type: "number", placeholder: "Enter number of items (10-50)", description: "Number of Items (10-50)" },
        {
            type: "checkbox", 
            placeholder: "Select test styles", 
            options: [
                "Multiple Choice", "Matching Type", "Fill in the Blanks", "Short Answer", "True or False",
                "Problem Solving", "Daily Life Situations", "Conversion",
                "Code Simulation", "Code Reading", "Program Enhancement and Debugging", "Exercise/App or Program Building"
            ],
            description: "Test Style/s"
        },
        {
            type: "textarea", 
            placeholder: "With edge cases, random programs codes that are challenging to read (poorly written code)", 
            description: "Conditions"
        },
        {
            type: "textarea", 
            placeholder: "Optional paste (desired output)", 
            description: "Desired Output (optional)"
        },
        { type: "number", placeholder: "Enter time limit in minutes", description: "Time Limit (in minutes)" }
    ]
};
const programmingExerciseTemplate = {
    title: "Programming Exercise Template",
    inputs: [
        { type: "text", placeholder: "Enter the topic", description: "Topic" },
        { type: "text", placeholder: "Enter specific coverages", description: "Specific Coverages" },
        {
            type: "select", 
            placeholder: "Select difficulty", 
            options: ["Easy", "Medium", "Hard", "Confusing?"], 
            description: "Difficulty"
        },
        { type: "number", placeholder: "Enter number of items (10-50)", description: "Number of Items (10-50)" },
        {
            type: "checkbox", 
            placeholder: "Select test styles", 
            options: [
                "Multiple Choice", "Matching Type", "Fill in the Blanks", "Short Answer", "True or False",
                "Problem Solving", "Daily Life Situations", "Conversion",
                "Code Simulation", "Code Reading", "Program Enhancement and Debugging", "Exercise/App or Program Building"
            ],
            description: "Test Style/s"
        },
        {
            type: "textarea", 
            placeholder: "With edge cases, random programs codes that are challenging to read (poorly written code)", 
            description: "Conditions"
        },
        {
            type: "textarea", 
            placeholder: "Optional paste (desired output)", 
            description: "Desired Output (optional)"
        },
        { type: "number", placeholder: "Enter time limit in minutes", description: "Time Limit (in minutes)" }
    ]
};

function saveTemplates() {
    const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];
    
    // Save quiz template if it doesn't exist
    if (!savedForms.find(form => form.title === quizTemplate.title)) {
        savedForms.push(quizTemplate);
    }

    // Save programming exercise template if it doesn't exist
    if (!savedForms.find(form => form.title === programmingExerciseTemplate.title)) {
        savedForms.push(programmingExerciseTemplate);
    }

    localStorage.setItem('savedForms', JSON.stringify(savedForms));
}


function loadTemplate(title) {
    const template = title === "Quiz Template" ? quizTemplate : programmingExerciseTemplate;
    const dynamicForm = document.getElementById('dynamicForm');
    dynamicForm.innerHTML = '';
    
    template.inputs.forEach(input => {
        let inputElement;
        if (input.type === 'textarea') {
            inputElement = document.createElement('textarea');
            inputElement.placeholder = input.placeholder;
        } else if (input.type === 'select') {
            inputElement = document.createElement('select');
            input.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.innerText = option;
                inputElement.appendChild(opt);
            });
        } else if (input.type === 'checkbox') {
            const wrapper = document.createElement('div');
            input.options.forEach(option => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(option));
                wrapper.appendChild(label);
            });
            dynamicForm.appendChild(wrapper);
            return; // Skip other elements for this input type
        } else {
            inputElement = document.createElement('input');
            inputElement.type = input.type;
            inputElement.placeholder = input.placeholder;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'input-wrapper';

        const descElement = document.createElement('span');
        descElement.className = 'description';
        descElement.innerText = input.description;

        wrapper.appendChild(descElement);
        wrapper.appendChild(inputElement);
        dynamicForm.appendChild(wrapper);
    });

    document.getElementById('formTitle').value = template.title;
}


function addTemplateButtons() {
    const quizButton = document.createElement('button');
    quizButton.innerText = 'Load Quiz Template';
    quizButton.addEventListener('click', () => loadTemplate("Quiz Template"));
    
    const programmingButton = document.createElement('button');
    programmingButton.innerText = 'Load Programming Exercise Template';
    programmingButton.addEventListener('click', () => loadTemplate("Programming Exercise Template"));

    document.getElementById('templateContainer').appendChild(quizButton);
    document.getElementById('templateContainer').appendChild(programmingButton);
}


window.onload = function() {
    saveTemplates(); 
    displaySavedForms(); 
    addTemplateButtons(); 
};
