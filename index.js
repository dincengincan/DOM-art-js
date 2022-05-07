const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const range = document.querySelector(".threshold-range");
const inputContainer = document.querySelector(".container");
const radioOptions = document.querySelectorAll("input[type=radio]");
const ctx = canvas.getContext("2d");

const scale = 1;
const rows = 30 * scale;
const columns = 40 * scale;

let rangeValue = 100;

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: { width: columns, height: rows }, audio: false })
    .then((localMediaStream) => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((e) => console.error(e));
}

function paintToCanvas() {
  range.value = rangeValue;
  generateInputs("checkbox");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // canvas.style.height = "480px";
  renderInputs("checkbox");
}

function extractBooleanValue(pixels) {
  let pixelsToBoolean = [];
  for (let i = 0; i < pixels.data.length; i += 4) {
    const avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;

    const newValue = avg < rangeValue;
    pixelsToBoolean.push(newValue);
  }
  return pixelsToBoolean;
}

function renderInputs(inputType) {
  return setInterval(() => {
    ctx.drawImage(video, 0, 0);

    // manipulate pixels
    // pixelsData = blackAndWhiteFilter(pixelsData);

    // put manipulated pixels
    // ctx.putImageData(pixelsData, 0, 0);

    // take out the pixels
    let pixelsData = ctx.getImageData(
      0,
      0,
      video.videoWidth,
      video.videoHeight
    );

    const booleanValues = extractBooleanValue(pixelsData);

    document
      .querySelectorAll(`.container input[type="${inputType}"]`)
      .forEach((input, key) => {
        input.checked = booleanValues[key];
      });
  }, 100);
}

function generateInputs(inputType) {
  let container = document.querySelector(".inputContainer");
  if (container) {
    container.remove();
  }
  container = document.createElement("div");
  container.classList.add("inputContainer");

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const input = document.createElement("input");
      input.setAttribute("type", inputType);

      container.appendChild(input);
    }
    const breakElement = document.createElement("br");
    container.appendChild(breakElement);
  }
  inputContainer.appendChild(container);
}

function handleRangeChange(e) {
  rangeValue = e.target.value;
}

function handleOptionChange(e) {
  const value = e.target.value;
  generateInputs(value);
  renderInputs(value);
}

// function blackAndWhiteFilter(pixels) {
//   for (let i = 0; i < pixels.data.length; i += 4) {
//     const avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;

//     const newValue = avg > rangeValue ? 250 : 0;

//     pixels.data[i] = newValue;
//     pixels.data[i + 1] = newValue;
//     pixels.data[i + 2] = newValue;
//   }
//   return pixels;
// }

getVideo();
video.addEventListener("canplay", paintToCanvas);
range.addEventListener("change", handleRangeChange);
radioOptions.forEach((option) => {
  option.addEventListener("change", handleOptionChange);
});
