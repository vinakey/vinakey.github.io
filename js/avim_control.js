// Get all the radio buttons
const radioButtons = document.querySelectorAll(
    '.btn-group .avim-control-btn input[type="radio"]',
);

function highlightRows() {
    var method = document.querySelector('input[name="AVIMMethod"]:checked').id;
    var rows = document.querySelectorAll('tr[class^="row"]');
    for (var i = 0; i < rows.length; i++) {
        rows[i].classList.remove("is-primary");
    }
    if (method === "avim_auto") {
        document.querySelectorAll(".row1, .row2").forEach(function(row) {
            row.classList.add("is-primary");
        });
    } else if (method === "avim_telex") {
        document.querySelectorAll(".row1").forEach(function(row) {
            row.classList.add("is-primary");
        });
    } else if (method === "avim_vni") {
        document.querySelectorAll(".row2").forEach(function(row) {
            row.classList.add("is-primary");
        });
    } else if (method === "avim_viqr") {
        document.querySelectorAll(".row3").forEach(function(element) {
            element.classList.add("is-primary");
        });
    }
}

// Add a change event listener to each radio button
radioButtons.forEach((radioButton) => {
    radioButton.addEventListener("change", function() {
        // Remove the 'active' class from all buttons
        const buttons = document.querySelectorAll(".btn-group .avim-control-btn");
        buttons.forEach((btn) => btn.classList.remove("is-dark"));

        // Add the 'active' class to the parent button of the changed radio button
        this.parentElement.classList.add("is-dark");
        highlightRows();
    });
});

// Manually trigger the change event for the checked radio button
const checkedRadioButton = document.querySelector(
    '.btn-group .avim-control-btn input[type="radio"]:checked',
);
if (checkedRadioButton) {
    checkedRadioButton.dispatchEvent(new Event("change"));
}
