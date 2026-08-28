let introFinished = false;
let skipIntro = false;

function requestSkipIntro() {
  if (!introFinished) skipIntro = true;
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" && !introFinished) {
    e.preventDefault();
    requestSkipIntro();
  }
});

function showMobileBanner() {
  if (window.innerWidth >= 768) return;
  if (localStorage.getItem("mobileBannerDismissed")) return;

  const banner = document.createElement("div");
  banner.style.cssText = `
    position: fixed;
    top: 3.5rem;
    left: 0;
    right: 0;
    z-index: 9998;
    background: #78350f;
    color: white;
    font-family: monospace;
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  `;
  banner.innerHTML = `
    <span>For the best experience, view this site on desktop.</span>
    <button style="background:transparent;border:none;color:white;font-family:monospace;font-size:1rem;cursor:pointer;flex-shrink:0;">&times;</button>
  `;
  banner.querySelector("button").addEventListener("click", () => {
    localStorage.setItem("mobileBannerDismissed", "1");
    banner.remove();
    document.documentElement.style.setProperty("--mobile-banner-height", "0px");
  });
  document.body.appendChild(banner);
  document.documentElement.style.setProperty(
    "--mobile-banner-height",
    banner.offsetHeight + "px"
  );
}

document.addEventListener("DOMContentLoaded", async function () {
  document.addEventListener("click", requestSkipIntro);
  showMobileBanner();

  if (!document.getElementById("commandLine")) {
    introFinished = true;
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 150));
  await typeLine("line1", "Hello, my name is Dante Paradis");
  await typeLine("line2", "Welcome to my website!");
  await typeLine(
    "line3",
    `Here are some of my links: <a href='https://github.com/dantep77' target='_blank'><strong>github</strong></a>, <a href='https://linked.com/in/dantep77' target='_blank'><strong>linkedin</strong></a>, <a href='mailto:dtparadi@ncsu.edu' target='_blank'><strong>email</strong></a>`
  );
  await typeLine(
    "line4",
    "Available commands: <strong>help, about, experience, projects, skills, contact, blog, clear</strong>"
  );
  introFinished = true;
  const commandLineEl = commandLine();
  const initialCommand = window.location.hash.replace("#", "").toLowerCase();
  if (initialCommand) {
    const pendingInputLine = commandLineEl.querySelector("textarea")?.closest("div");
    pendingInputLine?.remove();
    echoCommand(commandLineEl, initialCommand);
    await processCommand(initialCommand, commandLineEl);
  }
});

function echoCommand(commandLine, command) {
  const commandOutput = document.createElement("div");
  commandOutput.textContent = `C:\\Users\\danteparadis.com>${command}`;
  commandOutput.style.marginBottom = "1em";
  commandLine.appendChild(commandOutput);
}

async function typeLine(id, text, i = 0) {
  const element = document.getElementById(id);

  function renderFull() {
    element.innerHTML = "C:\\Users\\danteparadis.com> " + text;
    element.style.cssText = `
      white-space: pre-wrap;
      word-wrap: break-word;
    `;
  }

  if (skipIntro) {
    renderFull();
    return;
  }

  return new Promise((resolve) => {
    function typeNext() {
      if (skipIntro) {
        renderFull();
        resolve();
        return;
      }
      if (i <= text.length) {
        if (text.substring(i, i + 1) == "<") {
          const closeIndex = text.indexOf(">", i + 1);
          i = closeIndex === -1 ? text.length : closeIndex;
        }
        element.innerHTML =
          "C:\\Users\\danteparadis.com> " + text.substring(0, i);
        element.style.cssText = `
          white-space: pre-wrap;
          word-wrap: break-word;
        `;
        i++;
        setTimeout(typeNext, 12);
      } else {
        setTimeout(resolve, 80);
      }
    }
    typeNext();
  });
}

async function handleBlogCommand(commandLine) {
  const responseLine = document.createElement("div");
  responseLine.style.marginBottom = "1em";
  commandLine.appendChild(responseLine);

  try {
    const res = await fetch("blog/posts.json");
    const posts = await res.json();
    posts.sort((a, b) => b.date.localeCompare(a.date));

    if (posts.length === 0) {
      responseLine.textContent = "No blog posts yet.";
    } else {
      const list = posts
        .map(
          (post) =>
            `    • <a href='blog.html?post=${encodeURIComponent(
              post.slug
            )}' target='_blank'><strong>${post.title}</strong></a> <span class="text-yellow-400">(${post.date})</span>`
        )
        .join("<br>");
      responseLine.innerHTML = `<span class="text-green-400">Blog posts:</span><br>${list}`;
    }
  } catch (err) {
    responseLine.textContent = "Couldn't load blog posts right now.";
  }

  history.replaceState(null, "", "#blog");
  createNewInputLine(commandLine);
}

async function processCommand(command, commandLine) {
  const responses = {
    help: `<span class="text-green-400">Available commands:</span>
    • <span class="text-yellow-400">help</span> - Show this help message
    • <span class="text-yellow-400">about</span> - Learn about me
    • <span class="text-yellow-400">experience</span> - See my work experience
    • <span class="text-yellow-400">projects</span> - View my projects
    • <span class="text-yellow-400">skills</span> - See my technical skills
    • <span class="text-yellow-400">contact</span> - Get my contact information
    • <span class="text-yellow-400">blog</span> - Read my blog posts
    • <span class="text-yellow-400">clear</span> - Clear the terminal`,

    about: `I'm Dante Paradis, a Computer Science student at North Carolina State University (AI Concentration, Minor in Mathematical Data Science), graduating December 2027.
    I'm currently a Data Engineer Intern at MetLife, with past experience at ANDRITZ, Applied Research Associates, and Wolfpack Outfitters.
    Type <span class="text-yellow-400">experience</span> for more on my work history.`,

    experience: `<span class="text-green-400">Work Experience:</span>
    1. <span class="text-blue-400">MetLife</span> - Data Engineer Intern <span class="text-yellow-400">(Jun 2026 - Present)</span>
       • Built a Python framework integrating 6 Power BI REST APIs for operational metadata collection
       • Cut API ingestion runtime from hours to minutes using asyncio and aiohttp
       • Developed 12 Informatica ETL workflows and orchestrated them end-to-end in IBM Workload Automation
       • Built an Oracle APEX app giving stakeholders self-service visibility into refresh history

    2. <span class="text-blue-400">ANDRITZ</span> - Business Intelligence Developer Intern <span class="text-yellow-400">(May 2025 - Aug 2025)</span>
       • Automated sales and finance reporting with Power BI, SQL, and Office Scripts, saving 6+ hours/month
       • Rebuilt core Power BI reports with optimized data architecture, improving load performance ~50%
       • Leveraged AI and fuzzy matching to standardize customer data across 200+ integrations

    3. <span class="text-blue-400">Wolfpack Outfitters</span> - Technology Sales Associate <span class="text-yellow-400">(Jan 2025 - Present)</span>
       • Resolved technical issues on customer laptops and advised customers on technology purchases

    4. <span class="text-blue-400">Applied Research Associates</span> - Administrative Intern <span class="text-yellow-400">(Jan 2024 - Aug 2024)</span>
       • Developed internal purchasing workflows in JavaScript for organization-wide adoption
       • Built interactive business metric reports with SharePoint and Power BI
    `,

    skills: `<span class="text-green-400">Technical Skills:</span>
    • <span class="text-blue-400">Languages:</span> Java, C, Python, SQL
    • <span class="text-blue-400">Data Engineering & BI:</span> Power BI, Informatica Cloud, Oracle 19c, Oracle APEX, Maestro, REST APIs, asyncio, aiohttp
    • <span class="text-blue-400">Libraries & Frameworks:</span> Spring Boot, Hibernate, Pandas, Scikit-Learn, NLTK, Streamlit
    • <span class="text-blue-400">Tools:</span> Git, GitHub Actions, Jenkins, Maven, JUnit, Excel, VS Code, Claude Code`,

    projects: `<span class="text-green-400">Notable Projects:</span>
    1. <span class="text-blue-400">AI Sentiment Analysis</span>
       • Built with Python, Scikit-learn, and NLP
       • Trained a model to classify movie reviews as positive or negative using TF-IDF vectorization
       • <span class="text-yellow-400">Try it here: <a href='https://movie-review-sentiments.streamlit.app/' target='_blank'><strong>Movie Review Sentiment Demo</strong></a></span>

    2. <span class="text-blue-400">Music Streaming Trends Dashboard</span> - Python, Pandas, Streamlit
       • Interactive dashboard analyzing global music streaming data by artist, listener age, and country
       • Built data visualizations to uncover regional genre preferences and listener demographics

    3. <span class="text-blue-400">Twenty-One</span> - Java, Maven, JUnit 5, GitHub Actions
       • Full-featured Blackjack engine: betting, splits, double downs, insurance, and surrender
       • Built a basic-strategy coach mode that explains the reasoning behind every suggested move
       • Backed by a 96-test JUnit suite and a GitHub Actions CI pipeline running on every push/PR
       • <span class="text-yellow-400">Code here: <a href='https://github.com/dantep77/Twenty-One' target='_blank'><strong>Twenty-One on GitHub</strong></a></span>

    4. <span class="text-blue-400">Personal Linux Server</span>
       • Created and configured Debian 12 server from scratch
       • Runs Jellyfin for media streaming
       • Implemented TailScale for secure VPN access

    5. <span class="text-blue-400">Personal Website</span> - A terminal-style portfolio
       • Built with HTML, JavaScript, and Tailwind CSS
       • Features a terminal-style interface with custom commands
       • Optimized for desktop, with a lightweight notice for mobile visitors
       • <span class="text-yellow-400">You're looking at it right now!</span>

    6. <span class="text-blue-400">Wolfpack Scheduler</span>
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
    history.replaceState(null, "", window.location.pathname);
    createNewInputLine(commandLine);
    commandLine.parentElement.scrollTop = 0;
    return;
  }

  if (command === "blog") {
    await handleBlogCommand(commandLine);
    return;
  }

  if (!responses[command]) {
    const outputLine = document.createElement("div");
    outputLine.textContent = `'${command}' is not recognized as a valid command. Type 'help' for available commands.`;
    outputLine.style.marginBottom = "1em";
    commandLine.appendChild(outputLine);
    createNewInputLine(commandLine);
    return;
  }

  history.replaceState(null, "", `#${command}`);

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
      echoCommand(commandLine, command);
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
  return commandLine;
}

document.addEventListener("click", function () {
  const lastInput = document.querySelector("textarea:last-of-type");
  if (lastInput) {
    lastInput.focus();
  }
});
