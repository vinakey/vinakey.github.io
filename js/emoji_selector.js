const pickerOptions = { 
    onEmojiSelect: function(emoji) {
        document.getElementById('main-textarea').value += emoji.native;
    }
}
const picker = new EmojiMart.Picker(pickerOptions)

// Append picker to modal content
document.getElementById('modal-content').appendChild(picker)

// Toggle modal when button is clicked
document.getElementById('emoji-selector').addEventListener('click', function() {
    const modal = document.getElementById('emoji-modal');
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
})