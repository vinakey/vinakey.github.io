function toggleTables(checkbox) {
    var tables = document.querySelectorAll(".instruction");
    for (var i = 0; i < tables.length; i++) {
        tables[i].style.display = checkbox.checked ? "block" : "none";
    }
    localStorage.setItem("toggleTablesCheckbox", checkbox.checked);
}

// window.onload = function() {
var checkbox = document.getElementById("toggleTablesCheckbox");
var checked = localStorage.getItem("toggleTablesCheckbox");
if (checked === null) {
    checkbox.checked = true;
    toggleTables(checkbox);
} else if (checked === "true") {
    checkbox.checked = true;
    toggleTables(checkbox);
} else {
    checkbox.checked = false;
    toggleTables(checkbox);
}
// };
