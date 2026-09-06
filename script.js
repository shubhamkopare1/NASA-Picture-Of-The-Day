const API_KEY = "xILPn9hluCFD2pxbQkomweousk9UiNwsc1oiWaWy";

const form = document.getElementById("search-form");

const searchInput = document.getElementById("search-input");

const currentImageContainer =
    document.getElementById("current-image-container");

const searchHistory =
    document.getElementById("search-history");




async function getCurrentImageOfTheDay() {

    const currentDate =
        new Date().toISOString().split("T")[0];

    try {

        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?date=${currentDate}&api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("NASA API request failed");
        }

        const data = await response.json();

        displayImage(data);

    } catch (error) {

        currentImageContainer.innerHTML = `
            <p class="error">
                Unable to load today's NASA image.
            </p>
        `;

        console.error(error);
    }
}




async function getImageOfTheDay(date) {

    try {

        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("NASA API request failed");
        }

        const data = await response.json();

        displayImage(data);

        saveSearch(date);

        addSearchToHistory();

    } catch (error) {

        currentImageContainer.innerHTML = `
            <p class="error">
                Unable to fetch NASA image for ${date}.
            </p>
        `;

        console.error(error);
    }
}




function saveSearch(date) {

    let searches =
        JSON.parse(localStorage.getItem("searches")) || [];

    if (!searches.includes(date)) {

        searches.push(date);

    }

    localStorage.setItem(
        "searches",
        JSON.stringify(searches)
    );
}



function addSearchToHistory() {

    const searches =
        JSON.parse(localStorage.getItem("searches")) || [];

    searchHistory.innerHTML = "";

    searches.forEach(function (date) {

        const li = document.createElement("li");

        li.textContent = date;

        li.addEventListener("click", function () {

            getImageOfTheDay(date);

        });

        searchHistory.appendChild(li);

    });
}



function displayImage(data) {

    currentImageContainer.innerHTML = "";



    const title = document.createElement("h2");

    title.textContent = data.title;

    currentImageContainer.appendChild(title);



    const date = document.createElement("h3");

    date.textContent = data.date;

    currentImageContainer.appendChild(date);



    if (data.media_type === "image") {

        const image =
            document.createElement("img");

        image.src = data.url;

        image.alt = data.title;

        currentImageContainer.appendChild(image);

    }



    else if (data.media_type === "video") {

        const iframe =
            document.createElement("iframe");

        iframe.src = data.url;

        iframe.width = "100%";

        iframe.height = "500";

        iframe.allowFullscreen = true;

        currentImageContainer.appendChild(iframe);
    }



    const explanationTitle =
        document.createElement("h3");

    explanationTitle.textContent = "Explanation";

    currentImageContainer.appendChild(
        explanationTitle
    );



    const explanation =
        document.createElement("p");

    explanation.textContent =
        data.explanation;

    currentImageContainer.appendChild(
        explanation
    );
}




form.addEventListener("submit", function (event) {

    event.preventDefault();

    const selectedDate =
        searchInput.value;

    if (selectedDate) {

        getImageOfTheDay(selectedDate);

    }

});



getCurrentImageOfTheDay();

addSearchToHistory();