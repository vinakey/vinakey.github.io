const userPreferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const savedTheme = localStorage.getItem('theme') || userPreferredTheme;

const pickerOptions = { 
    onEmojiSelect: function(emoji) {
        document.getElementById('main-textarea').value += emoji.native;
    },
    
    theme: savedTheme,
    // emojiButtonSize: 24,
    // emojiSize: 16,
    perLine: 8,
}
const picker = new EmojiMart.Picker(pickerOptions)

// Append picker to modal content
document.getElementById('modal-content').appendChild(picker)

// Toggle modal when button is clicked
document.getElementById('emoji-selector').addEventListener('click', function() {
    const modal = document.getElementById('emoji-modal');
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
})
// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('emoji-modal');
    if (!modal.contains(event.target) && event.target.id !== 'emoji-selector' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
})
