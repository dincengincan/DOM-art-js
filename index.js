const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const range = document.querySelector(".threshold-range");
const inputContainer = document.querySelector(".container");
const radioOptions = document.querySelectorAll("input[type=radio]");
const scale = document.querySelector("select");
const ctx = canvas.getContext("2d");

let scaleValue = 1;
let rangeValue = 100;
const rows = 40;
const columns = 40;

async function getVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: columns * scaleValue, height: rows * scaleValue },
    audio: false,
  });
  console.log(stream.getVideoTracks()[0].getSettings());
  video.srcObject = stream;
  video.play();
}

function paintToCanvas() {
  range.value = rangeValue;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // canvas.style.height = "480px";
  generateInputs("checkbox");
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
  container.style.lineHeight = "5px";

  for (let i = 0; i < scaleValue * rows; i++) {
    for (let j = 0; j < scaleValue * columns; j++) {
      const input = document.createElement("input");
      input.setAttribute("type", inputType);
      input.style.width = "5px";
      input.style.height = "5px";
      input.style.margin = "1px";

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

function handleScaleChange(e) {
  scaleValue = Number(e.target.value);
  getVideo();
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
scale.addEventListener("change", handleScaleChange);
radioOptions.forEach((option) => {
  option.addEventListener("change", handleOptionChange);
});
