const audio =
    document.getElementById("audio");

const title =
    document.getElementById("title");

const artist =
    document.getElementById("artist");

const time =
    document.getElementById("time");

const progress =
    document.getElementById("progress");

const volume =
    document.getElementById("volume");

const playlist =
    document.getElementById("playlist");

const fileInput =
    document.getElementById("fileInput");

const autoplay =
    document.getElementById("autoplay");

const playButton =
    document.getElementById("play");

const previousButton =
    document.getElementById("previous");

const nextButton =
    document.getElementById("next");


let songs = [];

let currentIndex = 0;



// Format Time

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const secondsPart =
        Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return minutes + ":" + secondsPart;
}



// Load Song

function loadSong(index, playNow = false) {

    if (songs.length === 0) {
        return;
    }


    currentIndex = index;


    const song =
        songs[currentIndex];


    audio.src = song.url;


    title.textContent =
        song.name.replace(
            /\.[^/.]+$/,
            ""
        );


    artist.textContent =
        "Local Audio File";


    progress.value = 0;


    renderPlaylist();


    if (playNow) {

        audio.play();

    }

}



// Playlist

function renderPlaylist() {

    playlist.innerHTML = "";


    songs.forEach(
        function(song, index) {

            const li =
                document.createElement("li");


            li.textContent =
                song.name;


            if (index === currentIndex) {

                li.classList.add("active");

            }


            li.onclick = function() {

                loadSong(index, true);

            };


            playlist.appendChild(li);

        }
    );

}



// Select Music

fileInput.addEventListener(
    "change",
    function() {

        songs = [];


        for (
            let i = 0;
            i < fileInput.files.length;
            i++
        ) {

            const file =
                fileInput.files[i];


            songs.push({

                name: file.name,

                url: URL.createObjectURL(file)

            });

        }


        if (songs.length > 0) {

            loadSong(0);

        }

    }
);



// Play / Pause

playButton.addEventListener(
    "click",
    function() {

        if (songs.length === 0) {

            alert(
                "Please select a music file first."
            );

            return;

        }


        if (audio.paused) {

            audio.play();

        } else {

            audio.pause();

        }

    }
);



// Previous

previousButton.addEventListener(
    "click",
    function() {

        if (songs.length === 0) {
            return;
        }


        currentIndex--;


        if (currentIndex < 0) {

            currentIndex =
                songs.length - 1;

        }


        loadSong(currentIndex, true);

    }
);



// Next

nextButton.addEventListener(
    "click",
    function() {

        if (songs.length === 0) {
            return;
        }


        currentIndex++;


        if (
            currentIndex >= songs.length
        ) {

            currentIndex = 0;

        }


        loadSong(currentIndex, true);

    }
);



// Play Button Icon

audio.addEventListener(
    "play",
    function() {

        playButton.textContent = "⏸";

    }
);


audio.addEventListener(
    "pause",
    function() {

        playButton.textContent = "▶";

    }
);



// Audio Duration

audio.addEventListener(
    "loadedmetadata",
    function() {

        time.textContent =
            "0:00 / " +
            formatTime(audio.duration);

    }
);



// Progress

audio.addEventListener(
    "timeupdate",
    function() {

        if (audio.duration) {

            progress.value =
                (audio.currentTime /
                audio.duration) * 100;

        }


        time.textContent =
            formatTime(audio.currentTime)
            + " / "
            + formatTime(audio.duration);

    }
);



// Move Progress

progress.addEventListener(
    "input",
    function() {

        if (audio.duration) {

            audio.currentTime =
                (progress.value / 100)
                * audio.duration;

        }

    }
);



// Volume

volume.addEventListener(
    "input",
    function() {

        audio.volume =
            volume.value;

    }
);



// Song Finished

audio.addEventListener(
    "ended",
    function() {

        if (autoplay.checked) {

            currentIndex++;


            if (
                currentIndex >= songs.length
            ) {

                currentIndex = 0;

            }


            loadSong(currentIndex, true);

        }

    }
);