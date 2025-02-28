document.addEventListener("DOMContentLoaded", async function () {
  await new Promise((resolve) => setTimeout(resolve, 500));
  await typeLine("line1", "Hello, my name is Dante Paradis");
  await typeLine("line2", "Welcome to my website!");
  await typeLine(
    "line3",
    `Here are some of my links: <a href='https://github.com/dantep77' target='_blank'><strong>github</strong></a>, <a href='https://linked.com/in/dantep77' target='_blank'><strong>linkedin</strong></a>, <a href='mailto:dtparadi@ncsu.edu' target='_blank'><strong>email</strong></a>`
  );
  await typeLine(
    "line4",
    "Available commands: <strong>help, projects, about, skills, contact, clear</strong>"
  );
  commandLine();
});

async function typeLine(id, text, i = 0) {
  return new Promise((resolve) => {
    function typeNext() {
      if (i <= text.length) {
        if (text.substring(i, i + 1) == "<") {
          i = text.indexOf(">", i + 1);
          console.log(i);
        }
        const element = document.getElementById(id);
        element.innerHTML =
          "C:\\Users\\danteparadis.com> " + text.substring(0, i);
        element.style.cssText = `
          white-space: pre-wrap;
          word-wrap: break-word;
        `;
        i++;
        setTimeout(typeNext, 35);
      } else {
        setTimeout(resolve, 200);
      }
    }
    typeNext();
  });
}

async function processCommand(command, commandLine) {
  const responses = {
    help: `<span class="text-green-400">Available commands:</span>
    • <span class="text-yellow-400">help</span> - Show this help message
    • <span class="text-yellow-400">projects</span> - View my projects
    • <span class="text-yellow-400">about</span> - Learn about me
    • <span class="text-yellow-400">skills</span> - See my technical skills
    • <span class="text-yellow-400">contact</span> - Get my contact information
    • <span class="text-yellow-400">clear</span> - Clear the terminal`,

    about: `I'm Dante Paradis, a software developer passionate about creating innovative solutions. 
    I'm currently studying Computer Science at North Carolina State University.
    I'm looking for internships in software development and machine learning.`,

    skills: `<span class="text-green-400">Technical Skills:</span>
    • <span class="text-blue-400">Languages:</span> Java, Python, JavaScript
    • <span class="text-blue-400">Web Technologies:</span> HTML, CSS, Tailwind CSS
    • <span class="text-blue-400">Tools:</span> AWS, Git, Eclipse, VSCode, JUnit, Microsoft Power Platform
    • <span class="text-blue-400">Database:</span> SQL, Pandas`,

    projects: `<span class="text-green-400">Notable Projects:</span>
    1. <span class="text-blue-400">AI Movie Review Sentiment Analysis</span>
       • Built with Python and Streamlit
       • Trained on thousands of IMDB movie reviews
       • Uses Natural Language Processing for sentiment prediction
       • <span class="text-yellow-400">Try it here: <a href='https://movie-review-sentiments.streamlit.app/' target='_blank'><strong>Movie Review Sentiment Demo</strong></a></span>
    
    2. <span class="text-blue-400">NASA Image Search</span> - A web service that searches NASA's image API
       • Built with Flask and Railway for backend
       • HTML, JS, & CSS for frontend
       • <span class="text-yellow-400">Try it here: <a href='https://dantep77.github.io/NASA-Media/' target='_blank'><strong>NASA Image Search Demo</strong></a></span>
    
    3. <span class="text-blue-400">Personal Linux Server</span>
       • Created and configured Debian 12 server from scratch
       • Runs Jellyfin for media streaming
       • Implemented TailScale for secure VPN access
    
    4. <span class="text-blue-400">Personal Website</span> - A terminal-style portfolio
       • Built with HTML, JavaScript, and Tailwind CSS
       • Features a terminal-style interface with custom commands
       • Responsive design with mobile support
       • <span class="text-yellow-400">You're looking at it right now!</span>
    
    5. <span class="text-blue-400">Wolfpack Scheduler</span>
       • Java-based course scheduling platform
       • Implements object-oriented design patterns
       • Features JUnit testing suite
       • Developed during CSC216 coursework at NC State
    `,

    contact: `<span class="text-green-400">Get in touch:</span>
    • <span class="text-blue-400">Email:</span> <a href='mailto:dtparadi@ncsu.edu' target='_blank'><strong>dtparadi@ncsu.edu</strong></a>
    • <span class="text-blue-400">LinkedIn:</span> <a href='https://linkedin.com/in/dantep77' target='_blank'><strong>linkedin.com/in/dantep77</strong></a>
    • <span class="text-blue-400">GitHub:</span> <a href='https://github.com/dantep77' target='_blank'><strong>github.com/dantep77</strong></a>`,

    clear: "CLEAR",
  };

  if (command === "clear") {
    while (commandLine.firstChild) {
      commandLine.removeChild(commandLine.firstChild);
    }
    createNewInputLine(commandLine);
    return;
  }

  if (!responses[command]) {
    const outputLine = document.createElement("div");
    outputLine.innerHTML = `'${command}' is not recognized as a valid command. Type 'help' for available commands.`;
    outputLine.style.marginBottom = "1em";
    commandLine.appendChild(outputLine);
    createNewInputLine(commandLine);
    return;
  }

  const responseLine = document.createElement("div");
  responseLine.innerHTML = responses[command].replace(/\n/g, "<br>");
  responseLine.style.marginBottom = "1em";
  commandLine.appendChild(responseLine);
  createNewInputLine(commandLine);
}

function createNewInputLine(commandLine) {
  let inputLine = document.createElement("div");
  let promptText = document.createElement("span");
  let input = document.createElement("textarea");

  input.setAttribute("data-gramm", "false");
  input.setAttribute("data-gramm_editor", "false");

  // Set up the container
  inputLine.style.cssText = `
    display: flex;
    width: 100%;
  `;

  // Style the prompt text
  promptText.innerHTML = "C:\\Users\\danteparadis.com>";
  promptText.style.cssText = `
    white-space: pre;
    color: white;
    display: inline-block;
    width: fit-content;
  `;

  // Style the input
  input.classList.add("focus:outline-0");
  input.style.cssText = `
    flex: 1;
    resize: none;
    background: transparent;
    border: none;
    color: white;
    font-family: monospace;
    padding: 0;
    margin: 0;
  `;

  // Handle input changes
  input.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // Handle keydown
  input.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const command = this.value.trim().toLowerCase();
      const commandOutput = document.createElement("div");
      commandOutput.innerHTML = `C:\\Users\\danteparadis.com>${command}`;
      commandOutput.style.marginBottom = "1em";
      commandLine.appendChild(commandOutput);
      inputLine.remove();
      await processCommand(command, commandLine);
    }
  });

  // Assemble the input line
  inputLine.appendChild(promptText);
  inputLine.appendChild(input);
  commandLine.appendChild(inputLine);
  input.focus();
}

function commandLine() {
  const commandLine = document.getElementById("commandLine");
  createNewInputLine(commandLine);
}

document.addEventListener("click", function () {
  const lastInput = document.querySelector("textarea:last-of-type");
  if (lastInput) {
    lastInput.focus();
  }
});
