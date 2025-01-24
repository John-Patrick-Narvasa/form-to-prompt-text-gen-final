// js/ui.js
const UI = (() => {
    const updateUI = (isEditing) => {
        const addInputButton = document.getElementById('addInput');
        const deselectButton = document.getElementById('deselectInput');

        addInputButton.innerText = isEditing ? 'Change Input' : 'Add Input';
        deselectButton.style.display = isEditing ? 'inline-block' : 'none';
    };

    const clearInputFields = () => {
        document.getElementById('descriptionInput').value = '';
        document.getElementById('inputType').value = 'text';
        document.getElementById('optionsInput').value = '';
        document.getElementById('optionsInput').style.display = 'none';
    };

    // More UI functions...

    return { updateUI, clearInputFields };
})();