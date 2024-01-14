// Get all the radio buttons
const radioButtons = document.querySelectorAll('.btn-group .avim-control-btn input[type="radio"]');

// Add a change event listener to each radio button
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
        // Remove the 'active' class from all buttons
        const buttons = document.querySelectorAll('.btn-group .avim-control-btn');
        buttons.forEach(btn => btn.classList.remove('is-dark'));

        // Add the 'active' class to the parent button of the changed radio button
        this.parentElement.classList.add('is-dark');
    });
});

// Manually trigger the change event for the checked radio button
const checkedRadioButton = document.querySelector('.btn-group .avim-control-btn input[type="radio"]:checked');
if (checkedRadioButton) {
    checkedRadioButton.dispatchEvent(new Event('change'));
}