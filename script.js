import confetti from 'confetti';

document.addEventListener('DOMContentLoaded', () => {
    const completeButton = document.getElementById('complete-button');
    const showtimeSection = document.getElementById('showtime');
    const playOverlay = document.getElementById('play-overlay');
    const hologramBox = document.querySelector('.hologram-box');
    const successSound = createSound('success.mp3');

    completeButton.addEventListener('click', () => {
        // Play sound
        playSound(successSound);

        // Make confetti
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });

        // Scroll to the showtime section
        showtimeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    playOverlay.addEventListener('click', () => {
        playOverlay.classList.add('hidden');
        hologramBox.classList.add('playing');
    });

    // WebAudio API setup for sound effects
    let audioContext;

    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function createSound(url) {
        const sound = {
            url: url,
            buffer: null,
            isLoaded: false
        };

        // Preload the sound
        window.fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                initAudioContext();
                audioContext.decodeAudioData(arrayBuffer, (decodedBuffer) => {
                    sound.buffer = decodedBuffer;
                    sound.isLoaded = true;
                }, (error) => console.error(`decodeAudioData error for ${url}: ${error}`));
            })
            .catch(error => console.error(`fetch error for ${url}: ${error}`));

        return sound;
    }

    function playSound(sound) {
         if (!sound.isLoaded || !audioContext) {
            console.log('Sound not ready or audio context not initialized', sound);
            return;
        }

        // Resume context on user gesture
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const source = audioContext.createBufferSource();
        source.buffer = sound.buffer;
        source.connect(audioContext.destination);
        source.start(0);
    }

    // Initialize Audio context on first user interaction
    document.body.addEventListener('click', initAudioContext, { once: true });
    document.body.addEventListener('touchstart', initAudioContext, { once: true });
});

