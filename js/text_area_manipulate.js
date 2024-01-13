function selectAll() {
    var textarea = document.querySelector('textarea');
    textarea.select();
}

function copyText() {
    var textarea = document.querySelector('textarea');
    textarea.select();
    document.execCommand('copy');
}

function clearText() {
    var textarea = document.querySelector('textarea');
    textarea.value = '';
}

function searchText(url) {
    var query = document.getElementById('main-textarea').value;
    window.open(url + encodeURIComponent(query), '_blank');
}