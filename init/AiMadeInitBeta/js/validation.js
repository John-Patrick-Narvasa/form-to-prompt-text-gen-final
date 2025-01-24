// js/validation.js
const Validation = (() => {
    const showWarning = (message) => {
        const warningElement = document.getElementById('warningMessage');
        warningElement.innerText = message;
        warningElement.style.display = 'block';
    };

    const hideWarning = () => {
        const warningElement = document.getElementById('warningMessage');
        warningElement.innerText = '';
        warningElement.style.display = 'none';
    };

    const validateTitle = (title) => {
        if (!title) {
            showWarning("Please enter a title for the form.");
            return false;
        }
        return true;
    };

    // More validation functions...

    return { showWarning, hideWarning, validateTitle };
})();