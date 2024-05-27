var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            var avimControl = document.getElementById('AVIMControl');
            if (avimControl) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'js/avim.js';
                document.body.appendChild(script);

                // Stop observing once the element has loaded
                observer.disconnect();
            }
        }
    });
});

// Start observing
observer.observe(document.body, { childList: true, subtree: true });