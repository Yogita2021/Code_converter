let editor;
const baseApi = "http://localhost:3000";
// const baseApi = "https://code-editor-9osk.onrender.com";
const onGotAmdLoader = () => {
  // Load the Monaco Editor library
  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
    },
  });
  require(["vs/editor/editor.main"], () => {
    // Monaco Editor is now available
    editor = monaco.editor.create(document.getElementById("editor-container"), {
      value: 'console.log("Hello, I am code converter");',
      language: "javascript",
      theme: "vs-dark",
    });
  });
};

// Load AMD loader if necessary
if (typeof require === "undefined") {
  const loaderScript = document.createElement("script");
  loaderScript.type = "text/javascript";
  loaderScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs/loader.min.js";
  loaderScript.addEventListener("load", onGotAmdLoader);
  document.body.appendChild(loaderScript);
} else {
  onGotAmdLoader();
}

// Button click event handlers
document.getElementById("convert-btn").addEventListener("click", () => {
  const language = document.getElementById("language-selector").value;
  const code = editor.getValue();
  console.log({
    language,
    code,
  });
  fetch(`${baseApi}/convert`, {
    method: "post",
    body: JSON.stringify({ language, code }),
    headers: { "Content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(
        "output-container"
      ).innerText = `Converted ${language} code:\n${data.response}`;
    })
    .catch((error) => {
      console.log(error.message);
    });
  // Implement your conversion logic here
  // For demonstration purposes, we'll just display the converted code in the output div
  //   document.getElementById('output-container').innerText = `Converted ${language} code:\n${code}`;
});

document.getElementById("debug-btn").addEventListener("click", () => {
  // Implement your debug logic here
  const code = editor.getValue();
  console.log(code);
  fetch(`${baseApi}/debug`, {
    method: "post",
    body: JSON.stringify({ code }),
    headers: { "Content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(
        "output-container"
      ).innerText = `${data.response}`;
    })
    .catch((error) => {
      console.log(error.message);
    });
  document.getElementById("output-container").innerText = "Debugging...";
});

document.getElementById("quality-check-btn").addEventListener("click", () => {
  // Implement your quality check logic here
  const code = editor.getValue();
  fetch(`${baseApi}/qualityCheck`, {
    method: "post",
    body: JSON.stringify({ code }),
    headers: { "Content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(
        "output-container"
      ).innerText = `${data.response}`;
    })
    .catch((error) => {
      console.log(error.message);
    });
  document.getElementById("output-container").innerText = "Checking quality...";
});
let btn = document.getElementById("clearbtn");
btn.addEventListener("click", () => {
  window.location.reload();
});
