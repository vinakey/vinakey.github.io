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