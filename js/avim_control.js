document.addEventListener('DOMContentLoaded', () => {
    // Load saved selection from localStorage
    const savedMethod = localStorage.getItem('AVIMMethod');
    const savedCkspell = localStorage.getItem('avim_ckspell');
    const savedDaucu = localStorage.getItem('avim_daucu');

    if (savedMethod) {
        document.querySelector(`input[name="AVIMMethod"][value="${savedMethod}"]`).checked = true;
    }
    if (savedCkspell) {
        document.querySelector('#avim_ckspell').checked = savedCkspell === 'true';
    }
    if (savedDaucu) {
        document.querySelector('#avim_daucu').checked = savedDaucu === 'true';
    }

    document.querySelector('#avim-form').addEventListener('change', (event) => {
        if (event.target.name === 'AVIMMethod') {
            AVIMObj.setMethod(event.target.value);
            // Save selection to localStorage
            localStorage.setItem('AVIMMethod', event.target.value);
        } else if (event.target.id === 'avim_ckspell' || event.target.id === 'avim_daucu') {
            AVIMObj[event.target.id === 'avim_ckspell' ? 'setSpell' : 'setDauCu'](event.target.checked);
            localStorage.setItem(event.target.id, event.target.checked);
        }
    });

    document.querySelector('#hide-avim').addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('#avim-form').style.display = 'none';
    });
});