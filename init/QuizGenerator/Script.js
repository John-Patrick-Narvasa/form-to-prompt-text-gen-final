document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

function generatePrompt() {
    const form = document.getElementById('promptForm');
    const topic = form.topic.textContent;
    const coverages = form.coverages.textContent;
    const difficulty = form.difficulty.textContent;
    const items = form.items.textContent;
    const testStyles = Array.from(form.testStyles).filter(el => el.checked).map(el => el.textContent).join(', ');
    const conditions = form.conditions.textContent;
    const desired_output = form.output.textContent;

    if (testStyles.split(', ').length < 2) {
        alert('Please select at least two test styles.');
        return;
    }

    const output = `
Hello, I want you to follow the subject7, coverage, and prompt mentioned below:

Topic: ${topic}
Coverages: ${coverages}
Difficulty: ${difficulty}
Number of Items: ${items}

Test type/s: ${testStyles}

Conditions: ${conditions}

Desired Output: ${desired_output}
 

*If output too big for you to finish it, I will say to continue it*
*Put the answers at the very bottom*
    `.trim();

    document.getElementById('output').value = output;
}

// function copyOutput() {
//     const outputText = document.getElementById('output').textContent;
//     const errorMessage = document.getElementById('errorMessage');
//     errorMessage.textContent = '';

//     if (outputText) {
//         navigator.clipboard.writeText(outputText).then(() => {
//             alert('Output copied to clipboard!');
//         }).catch(err => {
//             console.error('Failed to copy: ', err);
//         });
//     } else {
//         errorMessage.textContent = 'Nothing to copy!';
//     }
// }


function copyOutput() {
    // Get the text field
    var copyText = document.getElementById("output");
  
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
  
    // Alert the copied text
    alert("Copied the text: " + copyText.value);
  }

  function setTimer() {
    const startingMinutes = form.timeLimit.value;
    let time = startingMinutes * 60;

    const countdownEl = document.getElementById('timer');

    setInterval(updateCountdown, 1000); 

    function updateCountdown () {
        const minutes = Math.floor(time/60);
        let seconds = time % 60;
        let milliseconds = time % 1000;

        seconds = seconds < 10 ? `0${seconds}` : seconds;   

        countdownEl.innerHTML = `${minutes}: ${seconds}`;
        time--;
        time = time < 0 ? 0 : time; 
        }
  }

