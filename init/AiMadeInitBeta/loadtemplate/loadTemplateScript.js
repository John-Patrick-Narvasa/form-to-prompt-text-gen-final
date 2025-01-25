document.addEventListener('DOMContentLoaded', () => {
    // Load the template from local storage
    const templateOutput = document.getElementById('templateOutput');
    const savedForms = JSON.parse(localStorage.getItem('savedForms')) || [];

    // Assuming you want to load the latest saved quiz template
    const quizTemplate = savedForms.find(form => form.title === "Quiz Template");

    if (quizTemplate) {
        const templateText = `
Topic: ${quizTemplate.inputs[0].value || "N/A"}
Coverages: ${quizTemplate.inputs[1].value || "N/A"}
Difficulty: ${quizTemplate.inputs[2].value || "N/A"}
Number of Items: ${quizTemplate.inputs[3].value || "N/A"}
Test Styles: ${quizTemplate.inputs[4].options.filter(option => option.checked).map(option => option.value).join(', ') || "N/A"}
Conditions: ${quizTemplate.inputs[5].value || "N/A"}
Desired Output: ${quizTemplate.inputs[6].value || "N/A"}
Time Limit: ${quizTemplate.inputs[7].value || "N/A"}
        `.trim();
        templateOutput.textContent = templateText;
    } else {
        templateOutput.textContent = "No template found.";
    }
});