
const fileInput = document.querySelector('#myFileInput');
const preloader = document.querySelector('#preloader');

function startImageRecognition() {
    // Simulate image recognition (you can replace this with actual logic)
    document.getElementById("results-container").classList.remove("hidden");
}

fileInput.addEventListener('change', () => {
    // Show the preloader animation when a file is selected
    preloader.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Hide scrollbars
    document.body.style.height = '100vh'; // Set body height to viewport height

    setTimeout(() => {
    // Hide the preloader after 1 second
    preloader.style.display = 'none';
    document.body.style.overflow = 'auto'; // Show scrollbars
    document.body.style.height = 'auto'; // Reset body height
    preloader.style.display = 'none'; // Hide the preloader

    // Scroll to the targetDiv
    const targetDiv = document.getElementById('recognition');
    if (targetDiv) {
        targetDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        });
    }
    }, 3000);
});
// Hide the preloader once the page is loaded
window.onload = function () {
    document.querySelector('.recognition').classList.add('recognition');
    preloader.style.display = 'none';
};

// Optional: Wait for the page to load before running the animation
window.addEventListener('load', () => {
// Get the header element
const header = document.querySelector('.typing-header');
// Get the text content of the header
const text = header.textContent;
// Remove the text content from the header
header.textContent = '';
// Loop through each character in the text and add it to the header with a delay
for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
    header.textContent += text.charAt(i);
    }, i * 100);
}
});

//Machine Learning model.
const URL = "https://teachablemachine.withgoogle.com/models/isVUVdBdN/";

const labelDefinitions = {
"Black Measles": "Ang<span> Black Measles </span>ay isang fungal na sakit na nakaka-apekto sa mga puno ng ubas, na nagdudulot ng maliit na itim na spots sa mga dahon, tangkay, at prutas. Ito ay sanhi ng fungus na Phomopsis viticola. Ang sakit na ito ay maaaring magpahina sa halaman, magbawas ng produksyon at kalidad ng prutas, at posibleng magpatay ng puno sa mga matinding kaso. Ang fungus ay naiiwan sa mga namatay na bahagi ng halaman at kumakalat sa pamamagitan ng ulan at hangin.",
"Leaf Blight": "Ang leaf blight ay isang fungal na sakit na nakaka-apekto sa mga puno ng ubas, na nagdudulot ng mga di-regular na brown spots sa mga dahon. Ito ay sanhi ng fungus na Guignardia bidwellii. Ang sakit na ito ay maaaring magpahina sa halaman, magbawas ng produksyon at kalidad ng prutas, at posibleng magpatay ng puno sa mga matinding kaso. Ang fungus ay naiiwan sa mga namatay na bahagi ng halaman at kumakalat sa pamamagitan ng ulan at hangin.",
"Healthy": "Ang Ubas ay malusog.",
"Black Rot": "Ang black rot ay isang fungal na sakit na nakaka-apekto sa mga puno ng ubas, na nagdudulot ng mga maitim na spots sa mga dahon, tangkay, at prutas. Ito ay sanhi ng fungus na Guignardia bidwellii. Ang sakit na ito ay maaaring magpahina sa halaman, magbawas ng produksyon at kalidad ng prutas, at posibleng magpatay ng puno sa mga matinding kaso. Ang fungus ay naiiwan sa mga namatay na bahagi ng halaman at kumakalat sa pamamagitan ng ulan at hangin.",
"Unknown": "Paumanhin po, ngunit hindi namin nagawang makilala ng aming modelo sa pagkilala ng larawan ang anumang sakit o dahon sa larawang ibinigay ninyo. Maaaring ito ay dahil ang larawan ay hindi ng isang dahon o sakit, o hindi ito sakop ng aming dataset. Mangyaring subukan ang ibang larawan o kumunsulta sa isang propesyonal para sa karagdagang tulong."

};


let model, maxPredictions;

async function init() {
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

model = await tmImage.load(modelURL, metadataURL);
maxPredictions = model.getTotalClasses();
}

function predict() {
const image = document.getElementById("image-input");

// Wait for init() function to complete before predicting
init().then(() => {
    model.predict(image, maxPredictions).then((predictions) => {
    const prediction = predictions[0];
    const className = getClassLabel(prediction.classIndex);
    const classDefinition = getClassDefinition(className);
    showResult(image, className, classDefinition);
    });
});
}
function getClassLabel(index) {
switch (index) {
    case 0:
    return "Black Measles";
    case 1:
    return "Leaf Blight";
    case 2:
    return "Black Rot";
    case 3:
    return "Healthy";
    case 4:
    return "Unknown";
}
}

function getClassDefinition(label) {
return labelDefinitions[label] || "No definition found.";
}

function showResult(image, className, classDefinition) {
const imageContainer = document.getElementById("image-container");
imageContainer.innerHTML = `<img src="${image.src}" alt="Input image">`;

const labelContainer = document.getElementById("label-container");
labelContainer.innerHTML = `Disease Identified: ${className}`;

const definitionContainer = document.getElementById("definition-container");
definitionContainer.innerHTML = `${classDefinition}`;

const treatmentContainer = document.getElementById("treatment-container");
treatmentContainer.innerHTML = ""; // clear the container before showing new results

const causeContainer = document.getElementById("cause-container");
causeContainer.innerHTML = ""; // clear the container before showing new results


if (className === "Unknown") {
    causeContainer.innerHTML = "Unknown";
} else if (className === "BLACK MEASLES") {
    treatmentContainer.innerHTML = "Possibleng Lunas:<br>Ang pagtatanggal ng mga namatay na bahagi ng halaman at pagsunod sa mga tamang pagsasaka at kulturang pamamahala ng mga halaman ay makakatulong upang maiwasan ang pagkalat ng sakit. Maaari ring gamitin ang mga fungicides upang kontrolin ang fungus, ngunit nag-iiba ang bisa nito depende sa yugto ng sakit at kung gaano kagrabe ang impeksyon.";
} else if (className === "Leaf Blight") {
    treatmentContainer.innerHTML = "Possibleng Lunas:<br>Ang pagtatanggal ng mga namatay na bahagi ng halaman at pagsunod sa tamang pagsasaka at kulturang pamamahala ng mga halaman ay makakatulong upang maiwasan ang pagkalat ng sakit. Maaari ring gamitin ang mga fungicides upang kontrolin ang fungus, ngunit nag-iiba ang bisa nito depende sa yugto ng sakit at kung gaano kagrabe ang impeksyon.";
} else if (className === "Black Rot") {
    treatmentContainer.innerHTML = "Posibleng Lunas:<br>Ang pagtatanggal ng mga namatay na bahagi ng halaman at pagsunod sa mga tamang pagsasaka at kulturang pamamahala ng mga halaman ay makakatulong upang maiwasan ang pagkalat ng sakit. Maaari ring gamitin ang mga fungicides upang kontrolin ang fungus, ngunit nag-iiba ang bisa nito depende sa yugto ng sakit at kung gaano kagrabe ang impeksyon.";
} else if (className === "Healthy") {
    treatmentContainer.innerHTML = "Patuloy na alagaan ang ubas.";
} else {
    treatmentContainer.innerHTML = "No treatment information available.";
}


if (className === "Unknown") {
    causeContainer.innerHTML = "";
} else if (className === "Black Measles") {
    causeContainer.innerHTML = "Sanhi:<br><br>Ang Black Measles ay sanhi ng fungus na Guignardia bidwellii.<br><br>Ang Guignardia bidwellii ay isang uri ng fungus o kabute na sanhi ng sakit sa ubas";
} else if (className === "Leaf Blight") {
    causeContainer.innerHTML = "Sanhi:<br><br>Ang Leaf Blight ay sanhi ng fungus na Cercospora.";
} else if (className === "Black Rot") {
    causeContainer.innerHTML = "Sanhi:<br><br>Ang Black Rot ay sanhi ng fungus na Guignardia bidwellii.";
} else if (className === "Healthy") {
    causeContainer.innerHTML = "Ang healthy leaf resulta ng tamang pag-aalaga sa kalusugan ng halaman at pagpapakain ng mga tamang nutrients.";
} else {
    labelContainer.innerHTML = "Error";
    const definitionContainer = document.getElementById("definition-container");
    definitionContainer.innerHTML = "No definition found.";
    const treatmentContainer = document.getElementById("treatment-container");
    treatmentContainer.innerHTML = "";
}
}

function onFileChange(event) {
const file = event.target.files[0];
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = function () {
    const image = new Image();
    image.src = reader.result;
    image.onload = async function () {
    await init(); // <-- call init() here
    predict(image);
    };
};
}
async function predict(image) {
const prediction = await model.predict(image);
let highestPrediction = 0;
let highestPredictionIndex = 0;
for (let i = 0; i < maxPredictions; i++) {
    const classPrediction = prediction[i].probability.toFixed(2);
    if (classPrediction > highestPrediction) {
    highestPrediction = classPrediction;
    highestPredictionIndex = i;
    }
}
const className = getClassLabel(highestPredictionIndex);
const classDefinition = getClassDefinition(className);
showResult(image, className, classDefinition);
}
