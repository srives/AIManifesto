// === AI Manifesto Application ===

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initQuiz('firstquiz', firstSessionQuestions);
  initQuiz('shorter', shorterQuestions);
  initQuiz('larger', largerQuestions);
  initQuiz('plugins', pluginQuestions);
  initQuiz('bonusquiz', bonusQuestions);
});

// === Tab Navigation ===
function goToAnchor(tabId, anchorId) {
  switchTab(tabId);
  setTimeout(() => {
    const el = document.getElementById(anchorId);
    if (!el) return;
    const header = document.querySelector('.site-header');
    const offset = header ? header.getBoundingClientRect().height + 12 : 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, 50);
}

function switchTab(tabId) {
  const btns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  btns.forEach(b => b.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(tabId);
  if (panel) panel.classList.add('active');
}

function initTabs() {
  const drawer = document.getElementById('nav-drawer');
  const hamburger = document.getElementById('hamburger-btn');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
      if (drawer) drawer.classList.remove('open');
    });
  });

  // Glossary back-links — make entire row clickable, not just the arrow
  document.querySelectorAll('.gloss-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      goToAnchor(a.dataset.tab, a.dataset.anchor);
    });
    // Also wire up the whole row
    const row = a.closest('tr');
    if (row) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', e => {
        if (e.target.tagName === 'A' || e.target.tagName === 'CODE') return;
        goToAnchor(a.dataset.tab, a.dataset.anchor);
      });
    }
  });

  if (hamburger && drawer) {
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      drawer.classList.toggle('open');
    });
    document.addEventListener('click', () => drawer.classList.remove('open'));
  }
}

// === Quiz Engine ===
function initQuiz(prefix, questions) {
  const container = document.getElementById(`${prefix}-questions`);
  const scoreEl = document.getElementById(`${prefix}-score`);
  const totalEl = document.getElementById(`${prefix}-total`);
  const progressBar = document.getElementById(`${prefix}-progress`);
  const finalScore = document.getElementById(`${prefix}-final`);
  const finalNum = document.getElementById(`${prefix}-final-score`);
  const resetBtn = document.getElementById(`${prefix}-reset`);

  let answered = 0;
  let correct = 0;
  const total = questions.length;
  totalEl.textContent = total;

  // Render all questions
  questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.index = i;

    const labels = ['a', 'b', 'c', 'd'];
    const choicesHTML = q.choices.map((c, ci) =>
      `<button class="choice-btn" data-ci="${ci}">${labels[ci]}) ${c}</button>`
    ).join('');

    card.innerHTML = `
      <div class="question-num">Question ${i + 1} of ${total}</div>
      <div class="question-text">${q.question}</div>
      <div class="choices">${choicesHTML}</div>
      <div class="explanation">${q.explanation}</div>
    `;
    container.appendChild(card);

    // Wire up choice buttons
    card.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (card.classList.contains('answered-correct') || card.classList.contains('answered-incorrect')) return;
        const ci = parseInt(btn.dataset.ci);
        const isCorrect = ci === q.answer;
        answered++;
        if (isCorrect) {
          correct++;
          btn.classList.add('selected-correct');
          card.classList.add('answered-correct');
        } else {
          btn.classList.add('selected-incorrect');
          card.classList.add('answered-incorrect');
          // Reveal correct answer
          card.querySelectorAll('.choice-btn')[q.answer].classList.add('reveal-correct');
        }
        // Disable all buttons
        card.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
        // Show explanation
        card.querySelector('.explanation').classList.add('visible');
        // Update score
        scoreEl.textContent = correct;
        progressBar.style.width = `${(answered / total) * 100}%`;
        // Show final score
        if (answered === total) {
          finalNum.textContent = `${correct}/${total}`;
          finalScore.classList.add('visible');
        }
      });
    });
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    answered = 0;
    correct = 0;
    scoreEl.textContent = '0';
    progressBar.style.width = '0%';
    finalScore.classList.remove('visible');
    container.querySelectorAll('.question-card').forEach(card => {
      card.classList.remove('answered-correct', 'answered-incorrect');
      card.querySelectorAll('.choice-btn').forEach(b => {
        b.disabled = false;
        b.classList.remove('selected-correct', 'selected-incorrect', 'reveal-correct');
      });
      card.querySelector('.explanation').classList.remove('visible');
    });
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Filter buttons
  document.querySelectorAll(`[data-filter-quiz="${prefix}"]`).forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      document.querySelectorAll(`[data-filter-quiz="${prefix}"]`).forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      container.querySelectorAll('.question-card').forEach(card => {
        if (filter === 'all') { card.style.display = ''; return; }
        const idx = parseInt(card.dataset.index);
        const isAnswered = card.classList.contains('answered-correct') || card.classList.contains('answered-incorrect');
        if (filter === 'unanswered') card.style.display = isAnswered ? 'none' : '';
        else if (filter === 'incorrect') card.style.display = card.classList.contains('answered-incorrect') ? '' : 'none';
      });
    });
  });
}

// =====================================================
// FIRST SESSION QUIZ - 10 scenario-based questions
// =====================================================
const firstSessionQuestions = [
  {
    question: "You just installed Claude Code and want to try it on a real project. What's the best first move?",
    choices: [
      "Create a new empty folder and start there",
      "Navigate to an existing project you know well and run 'claude'",
      "Open Claude.ai in your browser first to plan your approach",
      "Write a CLAUDE.md file before starting"
    ],
    answer: 1,
    explanation: "<strong>Navigate to an existing project and run 'claude'.</strong> Starting with a project you already know gives Claude real code to analyze and gives you immediate, concrete results. An empty folder has nothing for Claude to read — and you don't need to write CLAUDE.md first (that's what /init is for, after Claude understands your project)."
  },
  {
    question: "Scenario: You ask Claude 'Give me an overview of this codebase.' Claude reads several files and responds with a detailed summary. What just happened differently than using Claude.ai in a browser?",
    choices: [
      "Nothing different — both versions can read your files",
      "Claude used the internet to look up your project on GitHub",
      "Claude actually read your local files directly using its built-in tools, without you pasting anything",
      "Claude guessed based on the folder name"
    ],
    answer: 2,
    explanation: "<strong>Claude read your local files directly.</strong> This is the fundamental difference between Claude Code (terminal or Claude Desktop Code tab) and browser Claude.ai. Claude Code has built-in Read, Edit, and Bash tools that give it direct access to your filesystem. You didn't paste anything — Claude found and read the files on its own."
  },
  {
    question: "You want Claude to make a change to your code but you're nervous about it editing the wrong thing. What's the safest approach?",
    choices: [
      "Don't use Claude Code — it's too risky",
      "Ask Claude for a plan first: 'Before you change anything, describe which files you'll touch and why'",
      "Delete your project files as a backup before proceeding",
      "Only use Claude in a new empty folder"
    ],
    answer: 1,
    explanation: "<strong>Ask for a plan before edits.</strong> Claude will describe exactly what it intends to change before touching anything. If the plan looks wrong, you stop it. If it looks right, you proceed. Your files are also in git, so you can always revert. Planning before acting is the single most useful habit with Claude Code."
  },
  {
    question: "You've been working in Claude Code for 45 minutes and the responses seem slower and less focused. What's most likely happening?",
    choices: [
      "Claude is getting tired",
      "Your internet connection is degrading",
      "The context window is filling up with conversation history, reducing working memory",
      "Claude Code needs to be restarted weekly"
    ],
    answer: 2,
    explanation: "<strong>Context window filling up.</strong> Every message, file read, and tool result takes up space in Claude's finite context window. After a long session, there's less room for new information and the model has to work harder. Solution: run <code>/compact</code> to compress history, or start a new session with <code>--continue</code> (which resumes cleanly)."
  },
  {
    question: "You close your terminal mid-task and need to continue tomorrow. What command resumes your last session?",
    choices: [
      "claude --new",
      "claude --continue",
      "claude --restart",
      "claude --load"
    ],
    answer: 1,
    explanation: "<strong>claude --continue</strong> resumes the most recent session in the current directory. Your conversation history, context, and in-progress work are all restored. <code>claude --resume</code> shows a list of all previous sessions to pick from if you want to go back to an older one."
  },
  {
    question: "You want Claude to always follow your team's coding conventions in every session, without you re-explaining them each time. What's the right tool?",
    choices: [
      "Add the conventions to a text file and paste it at the start of each session",
      "Create a CLAUDE.md file at the project root with the conventions — Claude will load it automatically",
      "Tell Claude to remember it, and it will persist automatically",
      "Set up a hook that runs at session start"
    ],
    answer: 1,
    explanation: "<strong>CLAUDE.md at the project root.</strong> Claude loads this file automatically at the start of every session. You write it once (or run /init to generate it), and every session inherits those conventions. You never paste or re-explain. This is CLAUDE.md's core purpose."
  },
  {
    question: "Scenario: You're a UI/UX designer starting to write your first small script. You ask Claude to write it, it does, but then it breaks when you run it. What's the best next step?",
    choices: [
      "Start over in a new session",
      "Copy the error and paste it back to Claude: 'This error appeared when I ran it. Fix it.'",
      "Delete the script and try a different approach yourself",
      "Google the error separately and try to understand it before telling Claude"
    ],
    answer: 1,
    explanation: "<strong>Paste the error back to Claude.</strong> This is the loop. Claude writes code, you run it, something fails, you show Claude the error. Claude fixes it, you run it again. You don't need to understand the error yourself — just relay it. This back-and-forth is exactly how the CLI is meant to work, and it's why having Claude in your terminal (where it can see the error output directly) is faster than the browser version."
  },
  {
    question: "What persists between Claude Code sessions on the same project?",
    choices: [
      "Nothing — every session starts completely fresh",
      "CLAUDE.md instructions and any memory files Claude has written for the project",
      "The last 10 messages from the previous conversation",
      "Only the files you explicitly told Claude to remember"
    ],
    answer: 1,
    explanation: "<strong>CLAUDE.md and memory files.</strong> Every new session loads the project's CLAUDE.md (your persistent instructions) and any memory files Claude has written. The conversation history itself does NOT persist into new sessions unless you use <code>--continue</code> or <code>--resume</code> to resume a specific session."
  },
  {
    question: "You're an HR professional who has never coded before. You want to use Claude Code to automate a repetitive Excel task. What's the honest assessment?",
    choices: [
      "Claude Code isn't for non-developers — use Claude.ai instead",
      "Claude Code can absolutely help — either via the Code tab in Claude Desktop or a terminal. Start simple.",
      "You need to learn Python first before Claude Code is useful",
      "Only use Claude Code if you already know git"
    ],
    answer: 1,
    explanation: "<strong>Claude Code can help, starting simple.</strong> You don't need to understand code to use Claude Code effectively. You can access it via the Code tab in Claude Desktop (no terminal required) or via a terminal. Describe what you want, Claude writes the code, you run it. Start with a simple, well-defined task ('write a script that reads this CSV and outputs a summary'). Git is helpful but not required for a first project."
  },
  {
    question: "Which command tells you what slash commands and features are available in your current session?",
    choices: [
      "/list",
      "/commands",
      "/help",
      "/options"
    ],
    answer: 2,
    explanation: "<strong>/help</strong> lists all available commands, built-in tools, and current session information. It's the first thing to type when you're not sure what's available. Think of it as the 'what can I do here?' command."
  }
];

// =====================================================
// SHORTER CATECHISM - 40 Questions
// =====================================================
const shorterQuestions = [
  {
    question: "Where does CLAUDE.md need to be placed to affect all sessions working in a repo?",
    choices: [
      "~/.claude/",
      "The repository root directory",
      ".claude/commands/",
      "Anywhere in the project tree"
    ],
    answer: 1,
    explanation: "<strong>The repo root.</strong> CLAUDE.md at the repository root is automatically loaded into every Claude Code session that operates within that repo. It's like <code>.editorconfig</code> or <code>.eslintrc</code> at the project root &mdash; it configures behavior for anyone working in that tree."
  },
  {
    question: "What is a skill (SKILL.md) most like?",
    choices: [
      "A running daemon process",
      "A stored procedure that executes on call",
      "A runbook document loaded into context to inform behavior",
      "A background Windows service"
    ],
    answer: 2,
    explanation: "<strong>A runbook document.</strong> Skills are markdown files that get loaded into Claude's context. They don't execute &mdash; they inform. Think of them like the standard operating procedure (SOP) you hand to a new hire: 'When doing X, follow these steps.' The skill doesn't run; Claude reads it and follows the instructions."
  },
  {
    question: "When you spawn a subagent, what happens to your current conversation?",
    choices: [
      "The subagent joins your conversation and can see everything",
      "Your conversation pauses until the subagent finishes",
      "The subagent runs in its own isolated context and reports back results",
      "The subagent replaces your current session"
    ],
    answer: 2,
    explanation: "<strong>Isolated context.</strong> A subagent is like spawning a child process with its own stack. It gets a brief (the task description) but cannot see your full conversation history. It does its work, returns results, and terminates. Like delegating to a contractor: you give them a scope of work, they deliver, you integrate."
  },
  {
    question: "What is the context window most analogous to?",
    choices: [
      "Hard disk space",
      "RAM &mdash; finite, everything loaded competes for space",
      "CPU cores",
      "Network bandwidth"
    ],
    answer: 1,
    explanation: "<strong>RAM.</strong> The context window is the total working memory of a conversation. CLAUDE.md, skills, conversation history, file contents &mdash; all of it occupies tokens in the window. When it fills up, older content gets summarized (compressed), like virtual memory paging to disk. You have roughly 200K tokens, and every loaded document reduces what's left for actual work."
  },
  {
    question: "Hooks are most similar to which development concept?",
    choices: [
      "Environment variables",
      "Git hooks (pre-commit, post-merge) or MSBuild pre/post-build events",
      "Code comments",
      "Configuration files"
    ],
    answer: 1,
    explanation: "<strong>Git hooks / build events.</strong> Hooks are shell commands that actually execute in response to events (before a tool runs, after a tool runs, on session start). Unlike skills (which are passive documents), hooks are active &mdash; they run real commands. Just like <code>pre-commit</code> runs your linter before every git commit, a Claude hook can run tests after every file edit."
  },
  {
    question: "Where is user-level Claude configuration stored?",
    choices: [
      "C:\\Program Files\\Claude\\",
      "~/.claude/ (the user's home directory)",
      "In the Windows Registry",
      "In the repo's .git/ directory"
    ],
    answer: 1,
    explanation: "<strong>~/.claude/ in the home directory.</strong> This is the Unix convention for user-level config &mdash; a dot-prefixed directory in your home folder. It's analogous to <code>%APPDATA%</code> or <code>%USERPROFILE%\\.vscode</code> on Windows. It stores settings, memory, project configs, and custom commands that apply to you personally, across all repos."
  },
  {
    question: "What happens when you type /my-command in Claude Code?",
    choices: [
      "It runs a shell script called my-command",
      "It loads the prompt from .claude/commands/my-command.md and sends it",
      "It spawns a background agent named my-command",
      "It invokes an MCP server endpoint"
    ],
    answer: 1,
    explanation: "<strong>It loads a prompt file.</strong> Slash commands are prompts stored as markdown files in <code>.claude/commands/</code>. When you type <code>/my-command</code>, Claude reads the file <code>my-command.md</code> and sends its contents as a prompt. It's like a stored procedure you invoke by name, or a PowerShell alias that expands to a longer command."
  },
  {
    question: "An MCP server is most like:",
    choices: [
      "A skill document that informs behavior",
      "A COM object or plugin DLL that extends capabilities via an API",
      "A conversation memory file",
      "A configuration setting"
    ],
    answer: 1,
    explanation: "<strong>A COM object / plugin DLL.</strong> MCP (Model Context Protocol) servers are external processes that expose new tools to Claude. They run as separate processes and provide an API &mdash; like adding a NuGet package that gives you new functions, or registering a COM object that your application can call. They can provide database access, API integration, custom tooling, etc."
  },
  {
    question: "What is the purpose of the .claude/ directory inside a repository?",
    choices: [
      "Storing compiled build artifacts",
      "Repo-level AI configuration (commands, settings, skills) that can be shared with the team",
      "Caching downloaded dependencies",
      "Storing test results"
    ],
    answer: 1,
    explanation: "<strong>Repo-level AI configuration.</strong> The <code>.claude/</code> directory in a repo is like <code>.vscode/</code> &mdash; it holds configuration specific to that project. It can contain repo-specific slash commands, local settings overrides, and skill definitions. Parts of it can be checked into git for team sharing."
  },
  {
    question: "Why does the .claude directory start with a dot?",
    choices: [
      "It's a security feature that encrypts the contents",
      "It's a Unix convention: dot-prefixed entries are hidden config directories (like .git, .vscode)",
      "It indicates the directory is read-only",
      "It means the directory is temporary"
    ],
    answer: 1,
    explanation: "<strong>Unix convention for hidden config.</strong> On Unix/Linux/macOS, files and directories starting with a dot are hidden by default. It's the standard way to store configuration: <code>.git/</code>, <code>.vscode/</code>, <code>.ssh/</code>, <code>.config/</code>. Windows developers are more accustomed to <code>%APPDATA%</code> and the Registry, but the principle is the same: keep config out of the way."
  },
  {
    question: "What is 'Plan Mode' in Claude Code?",
    choices: [
      "A mode where Claude executes commands automatically",
      "A mode for designing and planning before writing code &mdash; output a design document first",
      "A mode that disables all tool use",
      "A mode that runs tests continuously"
    ],
    answer: 1,
    explanation: "<strong>Design before code.</strong> Plan mode is like writing an architecture decision record (ADR) or a design doc before coding. You ask Claude to plan its approach, review the plan, then proceed to implementation. The plan persists in the conversation as a reference. It's the difference between jumping straight into code and drawing a class diagram first."
  },
  {
    question: "Memory files in ~/.claude/projects/*/memory/ are most like:",
    choices: [
      "Compiled binaries",
      "A developer's personal wiki or sticky notes for a project",
      "Source code files",
      "Log files"
    ],
    answer: 1,
    explanation: "<strong>Personal wiki / sticky notes.</strong> Memory files persist across sessions. They're notes Claude writes to itself (or you write for it) that survive session boundaries. Like the sticky notes on your monitor, or your personal OneNote page for a project &mdash; 'Remember: the auth module uses JWT, not sessions' or 'The client hates blue buttons.'"
  },
  {
    question: "If your context window is nearly full, what happens to old conversation messages?",
    choices: [
      "They are deleted permanently",
      "They are compressed/summarized to free up space, like virtual memory paging",
      "The session crashes",
      "They are saved to a database"
    ],
    answer: 1,
    explanation: "<strong>Compressed/summarized.</strong> When the context window fills up, Claude summarizes older messages to reclaim space. It's like virtual memory paging: the most recent and relevant content stays in 'RAM' (the context window), while older content gets compressed to a summary. You lose detail but retain the gist."
  },
  {
    question: "Which of these actually EXECUTES code?",
    choices: [
      "CLAUDE.md",
      "A skill (SKILL.md)",
      "A hook",
      "Memory files"
    ],
    answer: 2,
    explanation: "<strong>Hooks.</strong> This is a critical distinction. CLAUDE.md, skills, and memory files are all passive documents that get loaded into context &mdash; they inform behavior but don't execute anything. Hooks are the only mechanism that runs actual shell commands. They fire on events (tool use, session start) and execute real code on your machine."
  },
  {
    question: "A session in Claude Code persists data at:",
    choices: [
      "In the cloud on Anthropic's servers only",
      "~/.claude/projects/ in per-project directories",
      "In the Windows Registry",
      "In browser localStorage"
    ],
    answer: 1,
    explanation: "<strong>~/.claude/projects/.</strong> Sessions are stored locally on your machine in the <code>~/.claude/projects/</code> directory, organized by project path. Each session has a .jsonl file containing the conversation history. It's your data, on your disk, in a structured directory hierarchy."
  },
  {
    question: "You want your whole team to follow the same AI coding standards. Where do you put the instructions?",
    choices: [
      "~/.claude/settings.json on each person's machine",
      "CLAUDE.md at the repository root, checked into git",
      "In each person's ~/.claude/memory/ directory",
      "In a shared MCP server"
    ],
    answer: 1,
    explanation: "<strong>CLAUDE.md at repo root, checked into git.</strong> CLAUDE.md is designed to be shared &mdash; like <code>.editorconfig</code> or <code>.prettierrc</code>. Check it into the repo and everyone who uses Claude Code in that repo gets the same instructions automatically. Personal preferences go in <code>~/.claude/</code>; team standards go in the repo."
  },
  {
    question: "What does .claude/settings.local.json do?",
    choices: [
      "Overrides cloud settings",
      "Provides local overrides for repo settings, like .env.local overrides .env",
      "Stores MCP server configurations",
      "Contains session history"
    ],
    answer: 1,
    explanation: "<strong>Local overrides.</strong> Just like <code>.env.local</code> overrides <code>.env</code>, or <code>appsettings.Development.json</code> overrides <code>appsettings.json</code>, this file lets you override repo-level settings without changing the shared config. It's typically in <code>.gitignore</code> so your personal tweaks don't affect teammates."
  },
  {
    question: "Slash commands defined in ~/.claude/commands/ are available:",
    choices: [
      "Only in one specific repo",
      "In all repos, for your user account only",
      "For all users on the machine",
      "Only when an MCP server is running"
    ],
    answer: 1,
    explanation: "<strong>All repos, your user only.</strong> Commands in the user-level <code>~/.claude/commands/</code> directory are global to your account &mdash; available in every repo you work in. Like a PowerShell profile function: it's yours, it's everywhere, but it's not shared with teammates. Repo-specific commands go in the repo's <code>.claude/commands/</code>."
  },
  {
    question: "What's the practical difference between a skill and CLAUDE.md?",
    choices: [
      "Skills execute code, CLAUDE.md doesn't",
      "CLAUDE.md is always loaded automatically; skills are loaded only when you explicitly invoke them",
      "Skills are for configuration; CLAUDE.md is for instructions",
      "There is no practical difference"
    ],
    answer: 1,
    explanation: "<strong>Loading behavior differs.</strong> CLAUDE.md is always loaded automatically at the start of every session — always-on, always consuming tokens. Skills are passive documents that load only when you explicitly invoke them via slash command or direct mention. There is no automatic skill-matching. You are always the trigger. This matters for context window management: CLAUDE.md always costs tokens, skills cost nothing until invoked."
  },
  {
    question: "A subagent can see your full conversation history. True or false?",
    choices: [
      "True &mdash; it inherits the full context",
      "False &mdash; it gets only the task description you provide",
      "True &mdash; but only the last 10 messages",
      "It depends on the model being used"
    ],
    answer: 1,
    explanation: "<strong>False.</strong> A subagent is spawned with a clean context containing only the task you assigned. It cannot see your conversation history, your loaded CLAUDE.md, or anything else from the parent. It's like forking a process: the child gets its own address space. It does its job and returns a result string."
  },
  {
    question: "Which is NOT a valid hook trigger event?",
    choices: [
      "Before a tool is used",
      "After a tool is used",
      "When a session starts",
      "When the user presses a keyboard shortcut"
    ],
    answer: 3,
    explanation: "<strong>Keyboard shortcuts are not hook triggers.</strong> Hooks fire on system events: before/after tool use, on session start, on notification send, and similar lifecycle events. They're event-driven like git hooks or MSBuild events &mdash; not user-input-driven like keyboard shortcuts or hotkeys."
  },
  {
    question: "You define a hook that runs <code>npm test</code> after every file edit. Where does <code>npm test</code> run?",
    choices: [
      "Inside Claude's context window as a simulation",
      "On your local machine as a real shell command",
      "On Anthropic's servers",
      "In a sandboxed virtual environment"
    ],
    answer: 1,
    explanation: "<strong>On your local machine.</strong> Hooks execute real shell commands on your machine, in your environment, with your permissions. They're not simulated or sandboxed &mdash; they run just like you typed the command yourself. This is why hooks are powerful but also require care: a badly written hook can do real damage."
  },
  {
    question: "The ~/.claude/ directory should be checked into git. True or false?",
    choices: [
      "True &mdash; it contains important project configuration",
      "False &mdash; it's personal user-level config, like %APPDATA%",
      "True &mdash; but only the commands/ subdirectory",
      "It depends on the project"
    ],
    answer: 1,
    explanation: "<strong>False.</strong> The <code>~/.claude/</code> directory in your home folder is personal configuration &mdash; it's not even inside any repo. It's like <code>%APPDATA%</code> or <code>%USERPROFILE%\\.gitconfig</code>. The repo's <code>.claude/</code> directory (different location!) can optionally have parts checked in, but the user-level one never should be."
  },
  {
    question: "What problem does 'The Prompt Engineering Trap' describe?",
    choices: [
      "Writing prompts that are too long",
      "Knowing how to prompt but not understanding the architecture that makes prompting effective",
      "Using too many slash commands",
      "Having too many MCP servers configured"
    ],
    answer: 1,
    explanation: "<strong>Prompting without architecture.</strong> It's like knowing SQL syntax but not understanding indexes, normalization, or query plans. You can write queries, but you can't make them fast or maintainable. The architecture (skills, hooks, memory, CLAUDE.md) is what separates 'I can use the tool' from 'I can make the tool work for me.'"
  },
  {
    question: "Which of these is stored per-project (not globally)?",
    choices: [
      "~/.claude/settings.json",
      "~/.claude/commands/deploy.md",
      "~/.claude/projects/C--repos-MyApp/memory/",
      "~/.claude/memory/"
    ],
    answer: 2,
    explanation: "<strong>The projects/ memory directory.</strong> Memory is stored per-project under <code>~/.claude/projects/</code>, organized by the project's path (with path separators replaced by double-dashes). So <code>C:\\repos\\MyApp</code> becomes <code>C--repos-MyApp/</code>. Global settings and global commands apply everywhere."
  },
  {
    question: "What format are Claude Code session logs stored in?",
    choices: [
      "SQLite database",
      "JSON Lines (.jsonl) files",
      "Plain text files",
      "XML"
    ],
    answer: 1,
    explanation: "<strong>JSONL (JSON Lines).</strong> Each line in the file is a separate JSON object representing a conversation turn. This is a common format for append-only logs &mdash; easy to write (just append a line), easy to parse (read line by line). It's analogous to a structured log file where each entry is self-contained."
  },
  {
    question: "An MCP server runs as:",
    choices: [
      "A document loaded into Claude's context",
      "A separate process that exposes tools via an API",
      "A browser extension",
      "Part of Claude's core model"
    ],
    answer: 1,
    explanation: "<strong>A separate process with an API.</strong> MCP servers are external processes &mdash; they run alongside Claude Code and communicate via a protocol. Like a COM server or a language server (LSP): a separate process that your tool talks to. They can be written in any language and provide any capability: database queries, API calls, file transformations, etc."
  },
  {
    question: "You want Claude to always check for TypeScript errors before committing. Best approach?",
    choices: [
      "Write it in CLAUDE.md as a reminder",
      "Create a hook that runs <code>tsc --noEmit</code> before the git commit tool",
      "Create a skill document explaining TypeScript checking",
      "Add it to your memory files"
    ],
    answer: 1,
    explanation: "<strong>A hook.</strong> This is an enforcement scenario: you want a command to actually run and block if it fails. CLAUDE.md would be a suggestion Claude might forget. A skill is informational. Memory is for notes. A hook is a shell command that executes on an event &mdash; like a git pre-commit hook. Configure it to run <code>tsc --noEmit</code> before the commit tool fires."
  },
  {
    question: "When Claude 'reads a file' during conversation, what happens to the context window?",
    choices: [
      "Nothing &mdash; file reads are free",
      "The file contents consume tokens in the context window, reducing available space",
      "The file is stored in a separate buffer that doesn't count",
      "Only the file name uses tokens, not the contents"
    ],
    answer: 1,
    explanation: "<strong>File contents consume tokens.</strong> Everything in the conversation &mdash; including file contents Claude reads &mdash; occupies tokens in the context window. A large file can consume thousands of tokens. This is why Claude sometimes reads only parts of files, and why CLAUDE.md should be concise: every token spent on configuration is a token not available for actual work."
  },
  {
    question: "What's the relationship between ~/ and %USERPROFILE% on Windows?",
    choices: [
      "They are completely unrelated",
      "~/ in Claude Code maps to %USERPROFILE% (e.g., C:\\Users\\YourName)",
      "~/ always means C:\\",
      "~/ only works on Linux"
    ],
    answer: 1,
    explanation: "<strong>Same thing, different syntax.</strong> In Unix-land, <code>~/</code> means the user's home directory. On Windows, that's <code>%USERPROFILE%</code> (typically <code>C:\\Users\\YourName</code>). Claude Code uses the Unix convention because it's a Node.js CLI tool with Unix heritage. So <code>~/.claude/</code> translates to <code>C:\\Users\\YourName\\.claude\\</code> on Windows."
  },
  {
    question: "You've installed an MCP server for PostgreSQL. Now Claude can:",
    choices: [
      "Only read the MCP server's documentation",
      "Query your PostgreSQL database directly during conversation using tools the MCP server provides",
      "Automatically optimize your database",
      "Access PostgreSQL without any credentials"
    ],
    answer: 1,
    explanation: "<strong>Query the database via MCP-provided tools.</strong> The MCP server exposes new tools (like 'query_database', 'list_tables') that Claude can call during conversation. It's like adding a COM object that provides methods &mdash; Claude can now call those methods as part of its work. Credentials and access are configured in the MCP server, not by Claude."
  },
  {
    question: "CLAUDE.md is 'run' by Claude Code. True or false?",
    choices: [
      "True &mdash; it's a script that executes",
      "False &mdash; it's a document that's loaded into context and read, not executed",
      "True &mdash; but only the code blocks within it",
      "It depends on the file extension"
    ],
    answer: 1,
    explanation: "<strong>False &mdash; it's read, not run.</strong> CLAUDE.md is a passive document. It gets loaded into the context window where Claude can read it, like environment variables are present in a process's memory. Nothing in it 'executes.' It shapes behavior by informing Claude's responses, the same way <code>.editorconfig</code> informs your editor's behavior without running code."
  },
  {
    question: "If you add a 5,000-token skill to a session that has 190,000 tokens of conversation in a 200K context window, what happens?",
    choices: [
      "The skill is loaded and old conversation is compressed to make room",
      "The skill fails to load with an error",
      "The context window expands to accommodate it",
      "The skill is partially loaded (truncated)"
    ],
    answer: 0,
    explanation: "<strong>Old conversation gets compressed.</strong> The context window is a fixed size. When new content needs space, older conversation turns are summarized/compressed. It's exactly like RAM pressure causing pages to be swapped to disk. The skill loads, but you lose detail from earlier in the conversation. This is why context window management matters."
  },
  {
    question: "How are project paths encoded in the ~/.claude/projects/ directory?",
    choices: [
      "As URL-encoded strings",
      "Path separators are replaced with double-dashes (C:\\repos\\App becomes C--repos-App)",
      "As base64 encoded strings",
      "As hash values"
    ],
    answer: 1,
    explanation: "<strong>Double-dash encoding.</strong> Since directory names can't contain backslashes or colons, Claude encodes paths by replacing separators with double-dashes. So <code>C:\\repos\\MyApp</code> becomes the directory <code>C--repos-MyApp</code> under <code>~/.claude/projects/</code>. It's a simple, readable encoding scheme."
  },
  {
    question: "Which statement about skills is correct?",
    choices: [
      "Skills can only be defined in ~/.claude/skills/",
      "Skills run as background processes",
      "Skills can be defined in ~/.claude/skills/ OR checked into a repo's .claude/skills/",
      "Skills require an MCP server to function"
    ],
    answer: 2,
    explanation: "<strong>Both locations work.</strong> Skills can be personal (in <code>~/.claude/skills/</code>, available in all your repos) or shared (in the repo's <code>.claude/skills/</code>, available to everyone working in that repo). It follows the same user-level vs repo-level pattern as commands and settings."
  },
  {
    question: "What's the key difference between a slash command and a skill?",
    choices: [
      "Slash commands execute code; skills don't",
      "Slash commands are invoked explicitly by name; skills are also invoked explicitly, but as documents rather than prompts",
      "Skills are faster than slash commands",
      "Slash commands only work in specific repos"
    ],
    answer: 1,
    explanation: "<strong>Invocation method.</strong> Both require you to trigger them — neither loads on its own. Slash commands send the .md file contents as a prompt when you type <code>/command-name</code>. Skills load a .md file into context as instructions when you invoke them via slash command or explicit mention ('use the code-review skill'). The key difference: slash commands are prompts you send; skills are reference documents Claude reads. Both require you to pull the trigger."
  },
  {
    question: "A colleague says 'Claude keeps forgetting our project conventions between sessions.' Best solution?",
    choices: [
      "Repeat the conventions at the start of every session",
      "Put them in CLAUDE.md at the repo root so they're auto-loaded every session",
      "Store them in an MCP server",
      "Create a hook that prints the conventions"
    ],
    answer: 1,
    explanation: "<strong>CLAUDE.md.</strong> This is exactly what CLAUDE.md is for: persistent project instructions that are automatically loaded into every session. Write your conventions there once, check it into git, and every session in that repo starts with those instructions already in context. No manual repetition needed."
  },
  {
    question: "In the file system layout, .claude/settings.local.json is typically:",
    choices: [
      "Checked into git for team sharing",
      "Listed in .gitignore for local-only overrides",
      "Stored in the cloud",
      "Auto-generated and read-only"
    ],
    answer: 1,
    explanation: "<strong>In .gitignore.</strong> Just like <code>.env.local</code>, this file contains personal overrides that shouldn't be shared. Your teammate might allow different tools or have different preferences. The base <code>.claude/settings.json</code> can be checked in for team defaults; the <code>.local.json</code> version stays personal."
  },
  {
    question: "What mechanism lets Claude Code edit files, run commands, and search codebases?",
    choices: [
      "Skills",
      "Tools &mdash; built-in capabilities like Read, Edit, Bash, Grep",
      "Hooks",
      "MCP servers exclusively"
    ],
    answer: 1,
    explanation: "<strong>Tools.</strong> Claude Code has built-in tools (Read, Edit, Write, Bash, Grep, Glob, etc.) that are its native capabilities. MCP servers can add MORE tools, but the core file editing, command running, and searching are built-in tools. Skills and hooks don't provide these capabilities &mdash; they configure behavior around them."
  },
  {
    question: "How many CLAUDE.md files can exist in a project, and how are they resolved?",
    choices: [
      "Only one, at the repo root",
      "Multiple: repo root, subdirectories, and ~/.claude/ &mdash; all are merged/loaded",
      "Only two: one global and one local",
      "Unlimited but only the nearest one to the current file is loaded"
    ],
    answer: 1,
    explanation: "<strong>Multiple, all merged.</strong> You can have CLAUDE.md at the repo root, in subdirectories, and at <code>~/.claude/CLAUDE.md</code> for user-level instructions. They're all loaded and merged. It's like CSS cascading: user-level is the base, repo root adds to it, subdirectory-level adds more specific instructions. This lets teams set repo standards while individuals add personal preferences."
  }
];

// =====================================================
// LARGER CATECHISM - 55 Questions
// =====================================================
const largerQuestions = [
  {
    question: "Scenario: You're working on a large monorepo with 3 teams. Team A works in /frontend, Team B in /backend, Team C in /infra. Each team has different coding standards for Claude. What's the best approach?",
    choices: [
      "One massive CLAUDE.md at the repo root with all three teams' rules",
      "A shared CLAUDE.md at the root with common standards, plus team-specific CLAUDE.md files in each subdirectory",
      "Three separate repos with their own CLAUDE.md files",
      "Use memory files for each team's standards"
    ],
    answer: 1,
    explanation: "<strong>Cascading CLAUDE.md files.</strong> Put shared standards (naming conventions, commit message format, code review rules) in the root CLAUDE.md. Put team-specific rules in <code>/frontend/CLAUDE.md</code>, <code>/backend/CLAUDE.md</code>, and <code>/infra/CLAUDE.md</code>. When Claude works in <code>/frontend</code>, it loads both the root and the frontend-specific instructions. This is exactly how <code>.editorconfig</code> inheritance works &mdash; general rules at the top, specific overrides deeper in the tree."
  },
  {
    question: "Scenario: Claude keeps using an old API endpoint that was deprecated last month. You've told it several times this session, but next session it forgets. What should you do?",
    choices: [
      "Tell it again at the start of each session",
      "Add the deprecation notice to CLAUDE.md so it's loaded every session automatically",
      "Create a hook that checks for the old endpoint",
      "Store it as a memory note AND consider adding it to CLAUDE.md"
    ],
    answer: 3,
    explanation: "<strong>Memory + CLAUDE.md.</strong> Memory (<code>~/.claude/projects/*/memory/</code>) persists across sessions and is a good place for project-specific facts like API deprecations. But if the whole team needs to know, CLAUDE.md is better because it's shared via git. The ideal approach depends on scope: personal knowledge goes in memory, team knowledge goes in CLAUDE.md. For a deprecated API that affects everyone, CLAUDE.md is the right long-term home."
  },
  {
    question: "Scenario: You want Claude to automatically run your test suite after every code change it makes, and block further changes if tests fail. What do you use?",
    choices: [
      "A skill that describes the testing workflow",
      "A hook configured to run tests after the file-edit tool, with failure blocking further edits",
      "CLAUDE.md instructions saying 'always run tests after editing'",
      "A slash command called /run-tests"
    ],
    answer: 1,
    explanation: "<strong>A hook.</strong> This requires enforcement, not suggestion. CLAUDE.md is advisory &mdash; Claude might forget or decide not to follow it. A skill is informational. A slash command requires manual invocation. A hook configured on the 'after file edit' event will automatically execute <code>npm test</code> (or equivalent) after every edit, and its exit code can signal whether to proceed. It's the difference between a code review comment saying 'please run tests' vs. a CI gate that blocks the merge."
  },
  {
    question: "Scenario: Your company has a proprietary database that Claude needs to query during conversations. How do you enable this?",
    choices: [
      "Give Claude the database credentials in CLAUDE.md",
      "Create a skill describing the database schema",
      "Set up an MCP server that connects to the database and exposes query tools",
      "Use a hook that runs SQL commands"
    ],
    answer: 2,
    explanation: "<strong>MCP server.</strong> This is the textbook MCP use case. The MCP server runs as a separate process, connects to your database with proper credentials (configured in the server, not exposed to Claude), and exposes tools like <code>query_database</code>, <code>list_tables</code>, <code>describe_table</code>. Claude calls these tools during conversation without needing direct database access. Never put credentials in CLAUDE.md &mdash; it's checked into git."
  },
  {
    question: "Scenario: You want to create a reusable workflow for 'create a new React component with tests and Storybook story.' What's the best mechanism?",
    choices: [
      "A hook that fires on session start",
      "A slash command in .claude/commands/ with the full prompt describing the workflow",
      "An entry in CLAUDE.md",
      "A memory note"
    ],
    answer: 1,
    explanation: "<strong>A slash command.</strong> This is an on-demand, reusable template &mdash; you want it when you ask for it, not all the time. Create <code>.claude/commands/new-component.md</code> with the full prompt: 'Create a new React component at [path] with: a functional component file, a test file using React Testing Library, and a Storybook story. Follow our naming conventions...' Then type <code>/new-component</code> whenever you need it. It's a stored procedure &mdash; defined once, invoked many times."
  },
  {
    question: "Scenario: You have 50 React components, each with similar patterns. Claude sometimes uses old patterns from early components. How do you ensure consistency?",
    choices: [
      "Create a skill document that describes the current component pattern with examples",
      "Put the pattern in memory",
      "Manually correct Claude each time",
      "Create separate sessions for each component"
    ],
    answer: 0,
    explanation: "<strong>A skill document.</strong> Create a skill in <code>.claude/skills/react-component-pattern.md</code> that documents your current component pattern with a concrete example: the file structure, naming conventions, hook patterns, prop types approach, test structure, etc. Claude loads this when working on components and follows the documented pattern. Check it into git so the whole team benefits. Unlike CLAUDE.md, it only costs context tokens when relevant."
  },
  {
    question: "Scenario: A junior developer joins your team. They've never used Claude Code. You want them productive in 30 minutes. What's your setup strategy?",
    choices: [
      "Give them the Claude Code documentation link",
      "Ensure CLAUDE.md is comprehensive, check in .claude/commands/ with team workflows, and tell them to type / to see available commands",
      "Set up all their personal ~/.claude/ configuration for them",
      "Have them watch you use Claude Code for an hour"
    ],
    answer: 1,
    explanation: "<strong>Repo-level config does the heavy lifting.</strong> A well-written CLAUDE.md and shared slash commands in <code>.claude/commands/</code> mean the new developer gets team standards automatically when they clone the repo. They don't need to configure anything &mdash; they just start a session and the instructions are there. Typing <code>/</code> shows them available commands. It's like how <code>.editorconfig</code> and <code>.prettierrc</code> enforce standards without each developer configuring their editor."
  },
  {
    question: "Scenario: You need Claude to handle a complex refactoring that involves renaming a class across 40 files, updating tests, and modifying the database migration. How should you approach this?",
    choices: [
      "Just ask Claude to do it all at once",
      "Use Plan mode to design the approach, review the plan, then execute step by step",
      "Create a hook for each step",
      "Write a bash script and have Claude run it"
    ],
    answer: 1,
    explanation: "<strong>Plan mode.</strong> Complex, multi-step refactorings benefit from planning. Enter plan mode, describe the refactoring, and Claude will outline: (1) what files need changing, (2) the order of operations, (3) potential risks, (4) how to verify each step. Review and adjust the plan, then proceed to execution. It's like writing a migration guide before running <code>ALTER TABLE</code> on production &mdash; you want to know the blast radius before you start."
  },
  {
    question: "Scenario: You're debugging a production issue at 2 AM and need Claude to help. You've fixed the bug but want to remember the root cause for next time. What do you use?",
    choices: [
      "Add it to CLAUDE.md",
      "Write it as a memory note in the project's memory directory",
      "Create a skill about the bug",
      "Hope you remember it tomorrow"
    ],
    answer: 1,
    explanation: "<strong>Memory note.</strong> Memory files persist across sessions and are perfect for project-specific institutional knowledge: 'The auth timeout bug was caused by the Redis connection pool not being closed properly in the middleware. Fixed in commit abc123. If similar symptoms appear, check connection pool management first.' This is your personal project wiki &mdash; it's there next time you (or Claude) need it."
  },
  {
    question: "Scenario: Your CI pipeline requires specific commit message formats. You want Claude to always follow this format. What's the most reliable approach?",
    choices: [
      "A CLAUDE.md instruction describing the format, plus a hook that validates commit messages",
      "A skill document about commit messages",
      "A memory note about the format",
      "Manually editing every commit message Claude creates"
    ],
    answer: 0,
    explanation: "<strong>CLAUDE.md + hook (belt and suspenders).</strong> CLAUDE.md tells Claude the format (so it generates correct messages from the start). The hook validates the result (so malformed messages are caught before they're committed). It's the same principle as: documentation tells developers the coding standard, but the linter enforces it. Instructions inform, hooks enforce."
  },
  {
    question: "What is the Model Context Protocol (MCP) at a technical level?",
    choices: [
      "A REST API specification",
      "A JSON-RPC-based protocol for tools to expose capabilities to AI models via stdin/stdout or HTTP",
      "A binary protocol like gRPC",
      "A file format for storing model weights"
    ],
    answer: 1,
    explanation: "<strong>JSON-RPC over stdin/stdout or HTTP.</strong> MCP is a lightweight protocol where external processes expose 'tools' (functions) that the AI can call. Communication happens via JSON-RPC &mdash; typically over stdin/stdout for local servers or HTTP for remote ones. It's similar to the Language Server Protocol (LSP) used by VS Code &mdash; a standardized way for tools to talk to each other."
  },
  {
    question: "Scenario: Claude suggests installing a suspicious npm package you've never heard of. What architecture feature could have prevented this?",
    choices: [
      "Memory files listing approved packages",
      "CLAUDE.md with an allowed-dependencies list, plus hooks that validate package installs",
      "A skill about package vetting",
      "Using plan mode for all installations"
    ],
    answer: 1,
    explanation: "<strong>CLAUDE.md + hooks.</strong> CLAUDE.md can list approved packages and state a policy ('Only use packages from our approved list. Ask before adding new dependencies.'). A hook on the Bash tool could intercept <code>npm install</code> commands and validate the package name against a whitelist. Together, they provide both guidance (Claude knows the policy) and enforcement (the hook blocks violations)."
  },
  {
    question: "Scenario: You have two projects that use different Node.js versions and different test frameworks. How do you handle this in Claude Code?",
    choices: [
      "Maintain separate ~/.claude/ directories for each project",
      "Each repo has its own CLAUDE.md with project-specific details; Claude auto-loads the right one based on which repo you're in",
      "Use memory files to switch between configurations",
      "Create separate user accounts on your machine"
    ],
    answer: 1,
    explanation: "<strong>Per-repo CLAUDE.md.</strong> Each repo's CLAUDE.md contains its specific configuration: 'This project uses Node 18, Jest for testing, and our API lives at /api/v2.' When you switch repos and start a session, the correct CLAUDE.md loads automatically. No manual switching needed. It's exactly like how <code>.nvmrc</code> tells nvm which Node version to use per-project."
  },
  {
    question: "What happens to skills, CLAUDE.md, and conversation history when the context window is compressed?",
    choices: [
      "CLAUDE.md is dropped first since it's configuration",
      "Everything is compressed equally",
      "Conversation history is summarized first; CLAUDE.md and recently-loaded skills are preserved",
      "Skills are dropped and reloaded on demand"
    ],
    answer: 2,
    explanation: "<strong>Conversation history is summarized first.</strong> CLAUDE.md and recently-loaded content tend to be preserved because they're relevant to ongoing work. Older conversation turns &mdash; especially ones that resulted in completed tasks &mdash; are summarized. The system tries to keep the most actionable content in the window. It's like how an OS pages out least-recently-used memory pages first."
  },
  {
    question: "Scenario: You need Claude to follow a very specific multi-step deployment procedure for your legacy system. The procedure has 30 steps with conditional branches. What's the best mechanism?",
    choices: [
      "Put all 30 steps in CLAUDE.md",
      "Create a detailed skill document with the full procedure, invocable via a slash command",
      "Create 30 separate hooks",
      "Describe it in memory and hope Claude remembers"
    ],
    answer: 1,
    explanation: "<strong>A skill + slash command.</strong> A 30-step procedure is too large and too specific for CLAUDE.md (which should be general project instructions). Create a skill document at <code>.claude/skills/deploy-legacy.md</code> with the full procedure, conditions, and rollback steps. Invoke it with a slash command when needed. This way it only consumes context tokens during deployments, not during every coding session."
  },
  {
    question: "Scenario: You're pair programming with Claude and want to see its plan before it starts coding. You also want to iterate on the plan. What's the workflow?",
    choices: [
      "Ask Claude to 'plan first' in your prompt",
      "Use Plan mode: Claude outlines the approach, you review and refine, then switch to implementation",
      "Create a hook that forces planning",
      "Write the plan yourself in a skill document"
    ],
    answer: 1,
    explanation: "<strong>Plan mode with iteration.</strong> Shift+Tab toggles plan mode. Claude describes what it will do (files to change, approach, risks) without making changes. You can push back, ask questions, suggest alternatives. Once the plan looks good, exit plan mode and Claude executes. It's like a code review before the code is written &mdash; an architecture review, not a code review. Much cheaper to fix a plan than to fix implemented code."
  },
  {
    question: "Scenario: A teammate accidentally deletes CLAUDE.md from the repo. What impact does this have?",
    choices: [
      "Claude Code stops working entirely",
      "Sessions continue but lose all project-specific instructions; Claude reverts to default behavior with no project context",
      "All existing sessions are corrupted",
      "Nothing &mdash; CLAUDE.md is cached permanently"
    ],
    answer: 1,
    explanation: "<strong>Loss of project context.</strong> Claude Code works fine without CLAUDE.md &mdash; it's not required. But without it, Claude loses all the project-specific instructions: coding standards, architecture descriptions, forbidden patterns, etc. It's like deleting <code>.editorconfig</code> &mdash; the editor still works, but it stops enforcing your formatting rules. Since CLAUDE.md should be in git, you can restore it from version history."
  },
  {
    question: "Scenario: You want Claude to always use your company's internal API wrapper instead of making raw HTTP calls. How do you enforce this across all sessions?",
    choices: [
      "Create a hook that blocks HTTP tools",
      "Add to CLAUDE.md: 'Always use our ApiClient class from src/utils/api.ts. Never use fetch() or axios directly. The ApiClient handles auth, retries, and logging.'",
      "Create a memory note about the API client",
      "Build an MCP server that wraps your API"
    ],
    answer: 1,
    explanation: "<strong>CLAUDE.md instruction.</strong> This is a coding standard that applies to all sessions and all team members. CLAUDE.md is the right place for it. Be specific: name the class, its location, and explain why (auth, retries, logging). This way Claude knows not just what to use but why, so it can make good decisions in edge cases. An MCP server would be overkill for this &mdash; you're not adding new capabilities, just directing existing ones."
  },
  {
    question: "Scenario: Your context window is running low (180K of 200K tokens used). You need to load a large file (15K tokens). What are your options?",
    choices: [
      "There's nothing you can do; the session is full",
      "Start a new session to get a fresh context window, or ask Claude to read only the relevant section of the file",
      "Increase the context window size in settings",
      "Delete your CLAUDE.md to free up space"
    ],
    answer: 1,
    explanation: "<strong>New session or partial read.</strong> You can't resize the context window. Your options: (1) Start a new session with a fresh 200K tokens &mdash; use memory to transfer essential context. (2) Ask Claude to read only specific functions or line ranges instead of the whole file. (3) Let the system summarize older conversation to make room. It's like running low on RAM: close some applications, or be more selective about what you load."
  },
  {
    question: "What is the fundamental architectural difference between a hook and a skill?",
    choices: [
      "Hooks are for JavaScript, skills are for Python",
      "Hooks execute shell commands in response to events; skills are documents loaded into context to inform behavior",
      "Skills are newer than hooks",
      "Hooks run in the cloud, skills run locally"
    ],
    answer: 1,
    explanation: "<strong>Execution vs. information.</strong> This is the most important distinction in the Claude Code architecture. Hooks are active: they execute real shell commands on your machine when events occur. Skills are passive: they're documents that get loaded into Claude's context window to inform its behavior. A hook runs <code>npm test</code>. A skill says 'When writing tests, use Jest with React Testing Library and follow the AAA pattern.' One does, the other teaches."
  },
  {
    question: "Scenario: You have a slash command /deploy that's 500 lines of detailed instructions. What's the impact on your context window?",
    choices: [
      "None &mdash; slash commands are free",
      "500 lines of tokens are consumed every time you invoke /deploy, reducing available context",
      "It's cached and only loaded once per session",
      "The slash command is compiled to save space"
    ],
    answer: 1,
    explanation: "<strong>500 lines consumed on each invocation.</strong> Slash commands are prompts injected into the conversation. Every token counts against your context window. If your deploy instructions are 500 lines, that's a significant chunk of context every time you invoke it. Consider: can some of those instructions be in a skill (loaded only when contextually relevant) instead? Or can the slash command be more concise, pointing to a docs file for details?"
  },
  {
    question: "Scenario: You want to prevent Claude from ever modifying files in the /config/production/ directory. Most reliable approach?",
    choices: [
      "Add to CLAUDE.md: 'Never modify files in /config/production/'",
      "Create a hook that intercepts file-edit tool calls and blocks edits to that directory",
      "Set file permissions to read-only",
      "Both A and B together &mdash; instruction plus enforcement"
    ],
    answer: 3,
    explanation: "<strong>Both instruction and enforcement.</strong> CLAUDE.md tells Claude the intent (don't touch production config &mdash; and why). The hook enforces it mechanically (if Claude somehow tries, the edit is blocked). Belt and suspenders. In practice, read-only file permissions (option C) work too, but they're outside Claude's architecture and might cause confusing error messages. The cleanest approach is clear instructions backed by a hook."
  },
  {
    question: "Scenario: You're working on two related tasks in the same repo. Should you use one session or two?",
    choices: [
      "Always one session &mdash; more context is better",
      "It depends: one session if tasks are interdependent, two sessions if they're independent, to preserve context window space",
      "Always two sessions &mdash; isolation is better",
      "It doesn't matter &mdash; sessions are interchangeable"
    ],
    answer: 1,
    explanation: "<strong>It depends on interdependence.</strong> If task A's changes inform task B (like refactoring a module then building a feature that uses it), one session preserves the shared context. If they're independent (fixing a CSS bug and writing a migration script), separate sessions give each task a full context window. It's like the decision between running two services in one process vs. two processes: coupling vs. resource isolation."
  },
  {
    question: "Scenario: You want Claude to remember that your CEO's name is 'Alex' and should always be capitalized correctly in generated content. Where does this go?",
    choices: [
      "CLAUDE.md at the repo root",
      "A memory note, since it's personal institutional knowledge unlikely to need team enforcement",
      "A skill document",
      "A hook that corrects capitalization"
    ],
    answer: 1,
    explanation: "<strong>Memory note.</strong> This is the kind of persistent, project-specific trivia that memory is designed for. It's not a coding standard (CLAUDE.md), not a workflow (skill/slash command), and not something that needs enforcement (hook). It's a fact that Claude should remember across sessions. Write it in memory: 'The CEO is Alex Chen. Always capitalize correctly. She prefers to be referred to as Alex, not Ms. Chen.'"
  },
  {
    question: "What does it mean when we say MCP servers 'extend Claude's capabilities'?",
    choices: [
      "They make Claude smarter",
      "They give Claude new tools it can call, like adding methods to an object via plugins",
      "They increase the context window",
      "They add new slash commands"
    ],
    answer: 1,
    explanation: "<strong>New callable tools.</strong> By default, Claude Code has a fixed set of tools: read files, edit files, run commands, search, etc. An MCP server adds new tools to this set. A Jira MCP server might add <code>create_ticket</code>, <code>search_issues</code>, <code>update_status</code>. A database MCP server adds <code>run_query</code>. It's like adding a DLL that exposes new COM interfaces, or installing a VS Code extension that adds new commands to the command palette."
  },
  {
    question: "Scenario: Your CLAUDE.md is getting unwieldy at 2,000 lines. How do you refactor it?",
    choices: [
      "Split it into multiple CLAUDE.md files in subdirectories, and extract reusable workflow docs into skills",
      "Minify it to reduce tokens",
      "Convert it to JSON for efficiency",
      "Delete the less important sections"
    ],
    answer: 0,
    explanation: "<strong>Split and extract.</strong> Keep the root CLAUDE.md focused on universal project rules (architecture, naming, forbidden patterns). Move directory-specific rules to subdirectory CLAUDE.md files (they only load when Claude works in that directory). Extract detailed workflows into skills (they only load when relevant). This is exactly like refactoring a God class: single responsibility, smaller units, loaded on demand. Every token in CLAUDE.md is always in context; tokens in skills are only in context when needed."
  },
  {
    question: "Scenario: You want Claude to generate code that follows your exact error handling pattern. The pattern is 3 lines of code. Where's the best place for it?",
    choices: [
      "CLAUDE.md with a code example",
      "A skill document with the pattern",
      "A slash command",
      "A hook"
    ],
    answer: 0,
    explanation: "<strong>CLAUDE.md with a code example.</strong> A 3-line error handling pattern is a coding standard that applies everywhere in the project. It's concise enough for CLAUDE.md (won't bloat the context) and universal enough that it should always be loaded. Include a concrete code example &mdash; Claude follows examples better than abstract descriptions. A skill would work too, but for something this short and universal, CLAUDE.md is more appropriate."
  },
  {
    question: "Scenario: You need Claude to help debug a production issue by querying logs, checking metrics, and examining database state. What architecture enables this?",
    choices: [
      "A very detailed CLAUDE.md with all relevant information",
      "Multiple MCP servers: one for log access, one for metrics, one for database queries",
      "A single skill document describing all systems",
      "Multiple hooks that fetch data"
    ],
    answer: 1,
    explanation: "<strong>MCP servers for each system.</strong> Each external system needs its own MCP server that provides appropriate tools. A log MCP server exposes <code>search_logs</code>, <code>get_log_entry</code>. A metrics server exposes <code>query_metrics</code>, <code>get_dashboard</code>. A database server exposes <code>run_query</code>. Claude can then use all these tools together in one conversation: 'Check the error logs from 2 AM, correlate with the latency metrics, and look up the affected user in the database.' It's like having multiple COM objects registered that your application can call."
  },
  {
    question: "What is the 'token cost' of loading CLAUDE.md vs. loading a skill vs. starting a new conversation turn?",
    choices: [
      "CLAUDE.md is free; skills and turns cost tokens",
      "All three consume tokens from the same context window budget",
      "Skills are free because they're cached; CLAUDE.md and turns cost tokens",
      "They all use separate token budgets"
    ],
    answer: 1,
    explanation: "<strong>All from the same budget.</strong> There's one context window, and everything in it costs tokens. CLAUDE.md: loaded every session automatically, always costs tokens. Skills: cost nothing until you invoke them; they only consume tokens when you explicitly load them. Conversation turns: each message costs tokens. There are no free riders. This is why architecture matters: a bloated CLAUDE.md permanently reduces your available context for every session, while skills let you pay only when needed."
  },
  {
    question: "Scenario: You're onboarding a large legacy codebase. You want Claude to understand the architecture but the codebase has no documentation. Best approach?",
    choices: [
      "Let Claude read every file (it has enough context window)",
      "Write a CLAUDE.md that describes the architecture, key modules, naming conventions, and where things live. Let Claude explore from there.",
      "Create MCP servers for every module",
      "Use hooks to auto-document the code"
    ],
    answer: 1,
    explanation: "<strong>Write a CLAUDE.md architecture guide.</strong> The context window can't hold a large codebase. But a well-written CLAUDE.md can describe the forest so Claude knows which trees to look at. 'The auth module is in /src/auth/, uses JWT, talks to Redis for session storage. The API layer is in /src/api/, uses Express middleware pattern. Never modify /src/legacy/ &mdash; it's a black box wrapper around a C++ DLL.' This is the map that makes exploration efficient."
  },
  {
    question: "Scenario: You want different Claude behavior for development vs. staging vs. production branches. How?",
    choices: [
      "Different CLAUDE.md files per branch, checked into git on each branch",
      "Use hooks to detect the branch and change behavior",
      "Use memory to store per-branch configuration",
      "This isn't possible"
    ],
    answer: 0,
    explanation: "<strong>Branch-specific CLAUDE.md files.</strong> Since CLAUDE.md is a file in your repo, it can differ per branch &mdash; just like any other config file. The main branch might say 'full test suite required before commits.' The feature branch might say 'unit tests sufficient, integration tests optional.' Since git manages branches, each branch carries its own CLAUDE.md instructions. Simple, version-controlled, reviewable in PRs."
  },
  {
    question: "When Claude says 'I'll use the Agent tool to search for that', what's actually happening?",
    choices: [
      "Claude is searching the internet",
      "Claude is spawning a subagent &mdash; a separate Claude instance with its own context that will do the search and report back",
      "Claude is using a pre-built search function",
      "Claude is reading from its training data"
    ],
    answer: 1,
    explanation: "<strong>Spawning a subagent.</strong> The Agent tool creates a new Claude instance with a fresh context window. The parent says 'Search the codebase for all usages of the deprecated API.' The subagent does the work (using its own tools: Grep, Read, Glob), compiles results, and returns a summary to the parent. The parent never sees the subagent's intermediate steps &mdash; just the final result. Like delegating to a contractor: you get the deliverable, not the process."
  },
  {
    question: "Scenario: You need Claude to interact with your company's Jira instance to create tickets and update status during coding sessions. What's needed?",
    choices: [
      "A CLAUDE.md with Jira instructions",
      "A Jira MCP server that authenticates with your instance and exposes ticket management tools",
      "A skill about Jira workflows",
      "A slash command that opens Jira in the browser"
    ],
    answer: 1,
    explanation: "<strong>A Jira MCP server.</strong> Claude needs to make API calls to Jira, which requires: (1) authentication credentials (stored securely in the MCP server config, not in CLAUDE.md), (2) tools like <code>create_issue</code>, <code>update_status</code>, <code>search_issues</code>, (3) proper error handling. The MCP server encapsulates all of this and exposes clean tools. Claude can then say 'I'll create a Jira ticket for this bug' and actually do it."
  },
  {
    question: "Scenario: You notice Claude is spending a lot of tokens re-reading the same utility file across multiple turns. How do you optimize this?",
    choices: [
      "Add the file's key functions to CLAUDE.md so Claude doesn't need to read the file",
      "Consider summarizing the utility file's purpose and key functions in CLAUDE.md, or restructure your prompts to be more targeted",
      "Create a skill that duplicates the file contents",
      "There's no way to optimize this"
    ],
    answer: 1,
    explanation: "<strong>Summarize in CLAUDE.md or restructure prompts.</strong> If Claude keeps re-reading the same file, it's likely because the context window compressed it. Solutions: (1) Add a brief summary of the utility file's exports and patterns to CLAUDE.md (always in context, low token cost). (2) Be more targeted in prompts: 'The formatDate function in utils.ts takes an ISO string and returns MM/DD/YYYY' instead of letting Claude re-read the file. Don't duplicate the whole file &mdash; just the knowledge Claude needs to use it."
  },
  {
    question: "What is the difference between ~/.claude/commands/ and .claude/commands/ in a repo?",
    choices: [
      "They're the same directory",
      "~/.claude/commands/ has personal commands available everywhere; repo .claude/commands/ has project-specific commands, optionally shared via git",
      "One is for skills, the other for commands",
      "One is for hooks, the other for commands"
    ],
    answer: 1,
    explanation: "<strong>Scope: global-personal vs. project-shared.</strong> <code>~/.claude/commands/</code> is your personal command library &mdash; available in every repo, like PowerShell profile functions. <code>.claude/commands/</code> in a repo is project-specific and can be checked into git for team sharing, like project-specific VS Code tasks in <code>.vscode/tasks.json</code>. Both are slash commands; they differ in scope and shareability."
  },
  {
    question: "Scenario: Your team uses a custom linting rule that's not in any standard linter. You want Claude to follow it. What's the layered approach?",
    choices: [
      "Just tell Claude in conversation each time",
      "CLAUDE.md describes the rule (inform), a hook runs your custom lint script after edits (enforce), and the slash command /lint can be invoked for manual checks (on-demand)",
      "Create only a hook &mdash; enforcement is enough",
      "Create only a skill &mdash; documentation is enough"
    ],
    answer: 1,
    explanation: "<strong>Layered: inform + enforce + on-demand.</strong> This is defense in depth: (1) CLAUDE.md describes the rule so Claude understands and follows it natively. (2) A hook runs your custom linter after file edits to catch violations Claude's judgment missed. (3) A <code>/lint</code> slash command lets developers manually trigger a lint check when they want. Each layer catches what the others miss. It's the same philosophy as: code review guidelines + CI linter + IDE plugin."
  },
  {
    question: "Scenario: You want Claude to work on your project but you're worried about it accessing sensitive files (credentials, API keys stored in .env files). How do you protect them?",
    choices: [
      "Trust that Claude won't read them",
      "Use .claude/settings.local.json or settings to define file access restrictions, plus CLAUDE.md instructions to never read or display .env files",
      "Delete the sensitive files before starting Claude",
      "Encrypt all sensitive files"
    ],
    answer: 1,
    explanation: "<strong>Settings restrictions + CLAUDE.md instructions.</strong> Claude Code's settings support file access rules that can deny read/write to specific patterns (like <code>*.env</code>, <code>credentials.*</code>). This is mechanical enforcement. CLAUDE.md adds the intent: 'Never read, display, or include contents of .env files in responses. These contain production secrets.' Both together provide enforcement and understanding."
  },
  {
    question: "Why does Claude Code use a CLI (command-line interface) instead of a GUI?",
    choices: [
      "GUIs haven't been invented for AI coding tools yet",
      "CLIs compose better with developer workflows (pipes, scripts, automation), work over SSH, and integrate with terminals where developers already live",
      "It's cheaper to build a CLI",
      "GUIs are slower"
    ],
    answer: 1,
    explanation: "<strong>Composability and developer workflow integration.</strong> CLIs are native to the developer's terminal environment. They compose with other tools (pipes, redirection), can be scripted and automated, work over SSH for remote development, and live alongside git, npm, and other CLI tools. A GUI would be a separate window that interrupts flow. The Unix philosophy: small, composable tools. This is culturally unfamiliar to Windows GUI developers, but the same reason PowerShell exists alongside GUI tools."
  },
  {
    question: "Scenario: Claude created a great solution but you want to explore an alternative approach. You don't want to lose the current work. What's the best approach?",
    choices: [
      "Start a new session from scratch and re-explain everything",
      "Fork the session (or start a new session and use memory to capture key context from the current one)",
      "Use undo to reverse all changes",
      "Create a git branch and manually copy the code"
    ],
    answer: 1,
    explanation: "<strong>Fork the session or use memory for context transfer.</strong> Forking creates a new session that starts with the context of the current one &mdash; like <code>git branch</code> for conversations. You explore the alternative in the fork while the original session retains its work. If forking isn't available, write key context to a memory note, start a new session, and Claude reads the memory automatically. Both approaches avoid re-explaining everything from scratch."
  },
  {
    question: "Scenario: You have a hook that runs tests after every file edit. Tests take 30 seconds. This is slowing down rapid iteration. What do you do?",
    choices: [
      "Remove the hook entirely",
      "Configure the hook to run only on specific file patterns (e.g., only *.ts files, not *.md), or add a slash command to toggle it on/off",
      "Switch to a skill that suggests running tests instead",
      "Accept the 30-second delay"
    ],
    answer: 1,
    explanation: "<strong>Scope the hook or make it togglable.</strong> Hooks support conditions &mdash; you can filter by tool type, file pattern, or other criteria. Configure it to skip tests when editing markdown, config files, or non-code files. Alternatively, create a slash command <code>/toggle-test-hook</code> that enables/disables the hook during rapid iteration phases. You keep the safety net but control when it's active &mdash; like having a CI pipeline that runs full tests on PR but only lint on push."
  },
  {
    question: "Scenario: Claude generates a function but uses a pattern your team deprecated two weeks ago. The deprecation is documented in your wiki but not in any Claude configuration. Whose fault is it?",
    choices: [
      "Claude's fault for not knowing",
      "The architect's fault for not updating CLAUDE.md or creating a skill with current patterns",
      "Nobody's fault &mdash; AI can't keep up with changes",
      "The wiki's fault for not being connected to Claude"
    ],
    answer: 1,
    explanation: "<strong>The architect's fault.</strong> Claude can only follow instructions it can see. If a pattern was deprecated but nobody updated CLAUDE.md, no skill was created, and no memory note was written, Claude has no way to know. This is the 'Prompt Engineering Trap' in action: the tool is only as good as its configuration. Maintaining CLAUDE.md is like maintaining your CI pipeline &mdash; it's an ongoing responsibility, not a one-time setup."
  },
  {
    question: "What analogy best describes the relationship between tools, hooks, skills, and CLAUDE.md?",
    choices: [
      "They're all the same thing with different names",
      "Tools are the hands, CLAUDE.md is the brain's knowledge, skills are the training manuals, hooks are the safety equipment, and the context window is the workbench",
      "They're independent features that don't interact",
      "Tools are for coding, everything else is for configuration"
    ],
    answer: 1,
    explanation: "<strong>A complete workstation analogy.</strong> Tools (Read, Edit, Bash) are Claude's hands &mdash; what it can do. CLAUDE.md is institutional knowledge &mdash; what it should know about your project. Skills are training manuals &mdash; how to do specific tasks. Hooks are safety equipment &mdash; guardrails that prevent mistakes. The context window is the workbench &mdash; finite space where everything must fit. MCP servers are power tools plugged in from outside. Together, they make a productive workspace."
  },
  {
    question: "Scenario: You want to share a set of Claude Code slash commands with the open-source community. How?",
    choices: [
      "Publish them as an MCP server",
      "Check the .claude/commands/ directory into your public repo with documentation",
      "Create a skill document with all commands embedded",
      "You can't share slash commands"
    ],
    answer: 1,
    explanation: "<strong>Check .claude/commands/ into the repo.</strong> Slash commands are just markdown files in a directory. Check them into your public repo's <code>.claude/commands/</code> directory. Anyone who clones the repo gets your commands automatically. Include a README explaining what each command does. It's the same pattern as sharing VS Code tasks or editor configs &mdash; just files in a well-known directory."
  },
  {
    question: "Scenario: You want Claude to generate documentation for your API. The documentation must follow a specific template with sections for endpoint, method, request body, response, and error codes. Best approach?",
    choices: [
      "Describe the template in every prompt",
      "Create a skill with the documentation template and examples, invoked via /doc-api slash command",
      "Create a hook that generates documentation",
      "Add the template to memory"
    ],
    answer: 1,
    explanation: "<strong>Skill + slash command.</strong> Create a skill at <code>.claude/skills/api-docs.md</code> that contains: (1) the exact template structure, (2) a complete example of a well-documented endpoint, (3) rules about tone, detail level, and formatting. Create a slash command <code>/doc-api</code> that loads this skill and prompts Claude to document a specified endpoint. The team can check both into git. Each API endpoint gets consistent documentation with a single command."
  },
  {
    question: "Scenario: You accidentally loaded a massive log file into conversation (50K tokens). Your context window is now tight. What's the fastest recovery?",
    choices: [
      "Wait for it to be compressed automatically",
      "Start a compact new session: transfer essential context via memory, begin fresh with full context window",
      "Delete the log file from your filesystem",
      "Close and reopen the same session"
    ],
    answer: 1,
    explanation: "<strong>New session with memory transfer.</strong> Once tokens are consumed, they're consumed &mdash; even after compression, the summary still takes space. The fastest recovery is: (1) Write essential context to a memory note ('Working on issue #456, approach is X, already completed steps A and B'). (2) Start a new session with a fresh 200K context window. (3) Claude auto-loads the memory note and you continue. It's like rebooting when you've exhausted RAM instead of waiting for the OOM killer."
  },
  {
    question: "Scenario: Your organization requires that all AI-generated code be reviewed by a human before committing. How do you architect this with Claude Code?",
    choices: [
      "Trust developers to review manually",
      "Use Plan mode for design review, then hooks to enforce pre-commit review gates (like requiring a /approve command before git commit tool executes)",
      "Disable Claude's ability to commit",
      "Create a skill about code review"
    ],
    answer: 1,
    explanation: "<strong>Plan mode + hooks for review gates.</strong> Plan mode ensures the approach is reviewed before implementation. A hook on the git commit tool can require human approval: it could check for a <code>.approved</code> marker file, or require a specific slash command to be run first. This creates a mandatory checkpoint &mdash; like a pull request approval gate, but within the Claude Code workflow. The human stays in the loop without slowing down the AI's coding speed."
  },
  {
    question: "Scenario: You have context window anxiety &mdash; you're always worried about running out. What's a healthy management strategy?",
    choices: [
      "Keep sessions short and start new ones frequently",
      "Use a combination: concise CLAUDE.md (always loaded), skills instead of CLAUDE.md for specialized knowledge (loaded on demand), memory for cross-session continuity, and targeted file reads instead of full-file reads",
      "Never use skills or CLAUDE.md to save space",
      "Use one long session for everything"
    ],
    answer: 1,
    explanation: "<strong>Layered context management.</strong> Think of it like memory management in a program: (1) CLAUDE.md is like static globals &mdash; keep it concise since it's always allocated. (2) Skills are like lazy-loaded modules &mdash; only occupy space when needed. (3) Memory is like a database &mdash; persistent storage that doesn't consume context until read. (4) Targeted file reads are like reading specific struct members instead of loading whole files into RAM. Architecture lets you use the context window efficiently."
  },
  {
    question: "Scenario: You're evaluating whether to use Claude Code for your team of 15 developers. What's the minimum viable setup for team-wide consistency?",
    choices: [
      "Just install Claude Code on everyone's machine",
      "Install Claude Code + write a comprehensive CLAUDE.md + create core slash commands in .claude/commands/ + check both into the repo",
      "Set up MCP servers for all team tools first",
      "Each developer configures their own setup independently"
    ],
    answer: 1,
    explanation: "<strong>CLAUDE.md + shared commands = minimum viable team setup.</strong> CLAUDE.md ensures everyone's Claude follows the same coding standards, knows the architecture, and avoids forbidden patterns. Shared slash commands in <code>.claude/commands/</code> give the team reusable workflows. Both checked into git means: clone the repo, install Claude Code, start coding. No per-developer setup required. MCP servers, hooks, and skills can be added incrementally as needs arise. Start simple."
  },
  {
    question: "What is the single most important thing a Windows developer should understand about Claude Code's architecture?",
    choices: [
      "That it runs on Node.js",
      "That everything is a file &mdash; configuration, commands, skills, memory, conversation history &mdash; stored in predictable directories, not in a registry or database",
      "That it uses JSON",
      "That it requires Unix"
    ],
    answer: 1,
    explanation: "<strong>Everything is a file.</strong> This is the Unix philosophy that Windows developers find most foreign. There's no registry, no database, no opaque binary config. CLAUDE.md is a markdown file. Slash commands are markdown files. Skills are markdown files. Memory is markdown files. Settings are JSON files. Sessions are JSONL files. Everything is transparent, editable, version-controllable, and debuggable. Once you internalize 'everything is a file in a known location,' the whole architecture becomes intuitive."
  },
  {
    question: "Scenario: You want Claude to follow a specific Git branching strategy (feature branches from develop, hotfixes from main). You also want it to name branches consistently. Where do you encode these rules?",
    choices: [
      "A hook that enforces branch naming patterns on git checkout",
      "CLAUDE.md with the branching strategy and naming convention, so Claude follows it when creating branches and committing",
      "A skill about Git workflows",
      "Memory notes about your branching history"
    ],
    answer: 1,
    explanation: "<strong>CLAUDE.md.</strong> Branching strategy is a universal project standard that applies to every coding session. CLAUDE.md is the right place: 'We use Git Flow. Feature branches: feature/JIRA-123-short-description. Create from develop, never from main. Hotfix branches: hotfix/JIRA-123-description from main.' Claude reads this every session and follows it. A hook could additionally validate branch names, but the primary guidance belongs in CLAUDE.md."
  },
  {
    question: "Scenario: You're working on a microservices architecture with 8 services, each in its own repo. You want consistent Claude behavior across all 8 repos. What's the most maintainable approach?",
    choices: [
      "Copy the same CLAUDE.md to all 8 repos",
      "Put shared standards in ~/.claude/CLAUDE.md (personal global), and repo-specific details in each repo's CLAUDE.md",
      "Create one master skill that covers all 8 services",
      "Use memory files in each project"
    ],
    answer: 1,
    explanation: "<strong>Layered: global + per-repo.</strong> Put cross-cutting standards in your user-level <code>~/.claude/CLAUDE.md</code>: naming conventions, error handling patterns, commit message format, shared libraries. Each repo's CLAUDE.md adds service-specific context: 'This is the payment service. Uses PostgreSQL. Port 3001. Depends on auth-service and notification-service.' This avoids duplication while preserving specificity. It's the same principle as NuGet packages for shared code + project-specific code in each service."
  },
  {
    question: "Scenario: Your team wants to track which Claude-assisted changes go into production. You want metadata (session ID, model used) attached to commits. How?",
    choices: [
      "Add to CLAUDE.md: 'Include session metadata in commit messages'",
      "A hook on the git commit tool that automatically appends session metadata to commit messages",
      "Manually add metadata to each commit",
      "A skill about commit metadata"
    ],
    answer: 1,
    explanation: "<strong>A hook on the git commit tool.</strong> This is an automation requirement: every commit should have metadata, without relying on Claude (or the developer) remembering. A hook that fires when the git commit tool is used can automatically append session ID, model name, and timestamp to the commit message. It's like the 'Signed-off-by' line that some teams add via git hooks &mdash; automated, consistent, unforgettable."
  },
  {
    question: "Scenario: You notice that Claude's responses are getting slower and less detailed toward the end of long sessions. Why, and what do you do?",
    choices: [
      "Claude is getting tired &mdash; restart the application",
      "The context window is filling up, causing compression of earlier context. Start a new session and use memory to transfer key context.",
      "Your internet connection is degrading",
      "The model is being rate-limited"
    ],
    answer: 1,
    explanation: "<strong>Context window pressure.</strong> As a session grows, older content is summarized to make room. This compression means Claude has less detail about earlier work, which can make responses less precise. The fix is a 'context window refresh': write essential context to memory ('Working on feature X, completed A and B, approach is Y, remaining work is Z'), start a fresh session, and continue with a full 200K tokens. It's like rebooting a process that's accumulated too much state &mdash; start fresh with only the essential state loaded."
  },
  {
    question: "Scenario: You want to create a reusable 'code review' workflow where Claude reviews staged git changes, checks for common issues, and produces a structured review. What combination of features do you use?",
    choices: [
      "A slash command that triggers the review + a skill that defines the review criteria and output format",
      "A hook that runs on every file save",
      "A CLAUDE.md section about code review",
      "An MCP server for code review"
    ],
    answer: 0,
    explanation: "<strong>Slash command + skill.</strong> The slash command (<code>/review</code>) is the trigger &mdash; invoke it when you want a review. The skill (<code>.claude/skills/code-review-criteria.md</code>) defines HOW to review: what to check (security, performance, naming, error handling), what format to use (severity levels, file:line references), and what the team considers acceptable. The command loads the skill and prompts Claude to review staged changes. Check both into git so the whole team has the same review process."
  },
  {
    question: "Scenario: You accidentally put an API key in CLAUDE.md and committed it. Besides rotating the key, what should you do to prevent this from happening again?",
    choices: [
      "Stop using CLAUDE.md",
      "Add a pre-commit hook (git hook, not Claude hook) that scans for secrets, and add clear warnings in CLAUDE.md about never including credentials",
      "Encrypt CLAUDE.md",
      "Move all configuration to MCP servers"
    ],
    answer: 1,
    explanation: "<strong>Git pre-commit hook for secret scanning + CLAUDE.md policy.</strong> This is defense in depth again. A git <code>pre-commit</code> hook can scan for patterns that look like API keys, tokens, or passwords (tools like <code>git-secrets</code> or <code>detect-secrets</code> do this). Add to CLAUDE.md: 'NEVER include credentials, API keys, tokens, or secrets in this file or any configuration file. All secrets must be in environment variables or a vault.' The hook catches mistakes; the policy prevents them."
  }
];

// =====================================================
// PLUGIN QUIZ - MCP Servers, installation, security
// =====================================================
const pluginQuestions = [
  {
    question: "What is the closest thing to a 'plugin system' in Claude Code?",
    choices: [
      "Skills",
      "Hooks",
      "MCP Servers",
      "Slash Commands"
    ],
    answer: 2,
    explanation: "<strong>MCP Servers.</strong> They are the only mechanism that adds entirely new tools to Claude. Skills teach behavior, hooks run shell commands on events, slash commands are stored prompts. MCP servers add new capabilities (database queries, API calls, etc.) that didn't exist before."
  },
  {
    question: "When someone says 'install this Claude Code plugin,' they almost certainly mean:",
    choices: [
      "Copy a SKILL.md file into .claude/skills/",
      "Add an MCP server entry to settings.json",
      "Install a VS Code extension",
      "Add a hook to .claude/hooks/"
    ],
    answer: 1,
    explanation: "<strong>Add an MCP server entry to settings.json.</strong> There is no formal 'plugin' concept in Claude Code. The word 'plugin' informally refers to MCP servers, which are configured in <code>~/.claude/settings.json</code> under the <code>mcpServers</code> key."
  },
  {
    question: "How does an MCP server communicate with Claude Code?",
    choices: [
      "HTTP REST API on a random port",
      "Named pipes (Windows) or Unix domain sockets",
      "JSON-RPC over stdin/stdout (local) or HTTP (remote)",
      "gRPC with protobuf"
    ],
    answer: 2,
    explanation: "<strong>JSON-RPC over stdin/stdout.</strong> Similar to the Language Server Protocol (LSP) that powers IntelliSense in VS Code. The MCP server runs as a child process and communicates via its standard input/output streams using JSON-RPC messages."
  },
  {
    question: "Where do you configure an MCP server that only YOU should use (not your team)?",
    choices: [
      "CLAUDE.md in the repo root",
      "~/.claude/settings.json (user-level)",
      ".claude/settings.json (repo-level, checked in)",
      ".claude/commands/mcp.md"
    ],
    answer: 1,
    explanation: "<strong>~/.claude/settings.json (user-level).</strong> This is your personal settings file, never checked into git. Good for MCP servers that connect to your personal databases, Jira accounts, or other individual tools."
  },
  {
    question: "Where do you configure an MCP server that your whole team should use?",
    choices: [
      "~/.claude/settings.json",
      ".claude/settings.local.json",
      ".claude/settings.json (repo-level, checked in)",
      "package.json"
    ],
    answer: 2,
    explanation: "<strong>.claude/settings.json in the repo (checked in).</strong> When team members clone the repo, the MCP server config comes with it. Use environment variables for any credentials so the config is safe to commit."
  },
  {
    question: "After adding an MCP server to settings.json, what must you do?",
    choices: [
      "Run 'claude mcp install'",
      "Restart Claude Code (start a new session)",
      "Nothing — it hot-reloads automatically",
      "Run 'npm start' in the MCP server directory"
    ],
    answer: 1,
    explanation: "<strong>Restart Claude Code.</strong> MCP servers are loaded at session start. Changes to the <code>mcpServers</code> configuration require starting a new session to take effect."
  },
  {
    question: "An MCP server entry in settings.json requires at minimum:",
    choices: [
      "A name, a Docker image, and a port number",
      "A name and a command (what to execute)",
      "A URL and an API key",
      "A package name and version"
    ],
    answer: 1,
    explanation: "<strong>A name and a command.</strong> The minimal config is a key (the server name) with a <code>command</code> field (what executable to run). Optional: <code>args</code> (command arguments) and <code>env</code> (environment variables like API keys)."
  },
  {
    question: "How does Claude know what tools an MCP server provides?",
    choices: [
      "You list them in CLAUDE.md",
      "The MCP server declares them via the protocol at startup",
      "You define them in settings.json",
      "Claude scans the server's source code"
    ],
    answer: 1,
    explanation: "<strong>The MCP server declares them.</strong> When Claude Code launches an MCP server, the server responds with a list of available tools (name, description, parameter schema). Claude then treats these tools exactly like its built-in tools (Read, Edit, Bash, etc.)."
  },
  {
    question: "Which analogy best describes MCP servers?",
    choices: [
      "Like .gitignore rules — they filter what Claude sees",
      "Like COM objects — separate processes exposing methods via a protocol",
      "Like CSS stylesheets — they change how things look",
      "Like unit tests — they verify behavior"
    ],
    answer: 1,
    explanation: "<strong>COM objects.</strong> A COM server is a separate process that exposes interfaces via a well-defined protocol (COM/DCOM). Your application calls its methods without knowing the implementation. MCP servers work the same way: separate processes exposing tools via the MCP protocol."
  },
  {
    question: "Can a malicious MCP server read your source code and send it to an external server?",
    choices: [
      "No — MCP servers are sandboxed",
      "No — Claude Code blocks network access for MCP servers",
      "Yes — an MCP server runs with your user permissions and has full system access",
      "Only if you grant it explicit file permissions in settings.json"
    ],
    answer: 2,
    explanation: "<strong>Yes.</strong> An MCP server is just a process running on your machine. It has whatever permissions your user account has. There is no sandbox. Treat installing an MCP server like installing any other executable — review the source or publisher before trusting it."
  },
  {
    question: "How do MCP servers handle credentials (API keys, database passwords)?",
    choices: [
      "You put them in CLAUDE.md",
      "Claude stores them in its conversation history",
      "Through environment variables in the MCP server's config, passed at launch",
      "You paste them into the chat when asked"
    ],
    answer: 2,
    explanation: "<strong>Environment variables in the config.</strong> The <code>env</code> field in the MCP server's settings.json entry passes environment variables to the server process at launch. Claude never sees the raw credentials — it just asks the server to 'create a ticket' and the server handles auth internally."
  },
  {
    question: "You want Claude to query your team's PostgreSQL database during conversations. What do you need?",
    choices: [
      "Put the connection string in CLAUDE.md and tell Claude to use psql",
      "Install a database MCP server and configure it with the connection string",
      "Write a skill that explains SQL syntax",
      "Create a hook that runs queries on every message"
    ],
    answer: 1,
    explanation: "<strong>Install a database MCP server.</strong> This adds tools like <code>run_query</code> and <code>list_tables</code> that Claude can call. The connection string goes in the MCP server's <code>env</code> config, not in CLAUDE.md (never put credentials in CLAUDE.md)."
  },
  {
    question: "What language can you write an MCP server in?",
    choices: [
      "Only TypeScript (it's an npm ecosystem tool)",
      "Only Python (Anthropic's SDK is Python-only)",
      "Any language that can read stdin and write stdout",
      "Only languages with an official Anthropic SDK"
    ],
    answer: 2,
    explanation: "<strong>Any language.</strong> MCP is a protocol (JSON-RPC over stdin/stdout). If your program can read from stdin, process JSON, and write to stdout, it's a valid MCP server. Anthropic provides TypeScript and Python SDKs for convenience, but the protocol is language-agnostic."
  },
  {
    question: "What's the difference between an MCP server configured in ~/.claude/settings.json vs .claude/settings.local.json?",
    choices: [
      "No difference — they're the same file",
      "User-level (available everywhere, personal) vs repo-level (this project only, not checked in)",
      "One runs on startup, the other runs on demand",
      "One is for production, the other for development"
    ],
    answer: 1,
    explanation: "<strong>User-level vs repo-level.</strong> <code>~/.claude/settings.json</code> applies to all your sessions everywhere. <code>.claude/settings.local.json</code> is repo-specific and not checked into git (the <code>.local</code> convention, like <code>.env.local</code>). Use user-level for personal tools, repo-level for project-specific tools."
  },
  {
    question: "You install an MCP server but Claude doesn't seem to see its tools. What's the most likely cause?",
    choices: [
      "You need to add the tool names to CLAUDE.md",
      "You haven't restarted Claude Code since adding the config",
      "The MCP server needs a license key",
      "MCP servers only work on Linux"
    ],
    answer: 1,
    explanation: "<strong>You haven't restarted.</strong> MCP servers are loaded at session start. If you added the config mid-session, Claude won't see it until you start a new session."
  },
  {
    question: "A typical MCP server config in settings.json looks like:",
    choices: [
      "<code>{ \"plugins\": [\"database-server\"] }</code>",
      "<code>{ \"mcpServers\": { \"mydb\": { \"command\": \"npx\", \"args\": [\"-y\", \"@example/mcp-db\"], \"env\": { \"DB_URL\": \"...\" } } } }</code>",
      "<code>{ \"extensions\": { \"database\": { \"url\": \"...\" } } }</code>",
      "<code>{ \"tools\": [{ \"name\": \"database\", \"path\": \"/usr/local/bin/mcp-db\" }] }</code>"
    ],
    answer: 1,
    explanation: "<strong>The mcpServers block with command, args, and env.</strong> The key is the server name (you choose it). <code>command</code> is what to execute. <code>args</code> are command-line arguments. <code>env</code> passes environment variables (credentials, config). This is the standard format."
  },
  {
    question: "MCP servers are most analogous to which Visual Studio concept?",
    choices: [
      "Solution files (.sln)",
      "VS Code extensions running in the extension host process",
      "Project references",
      "NuGet package restore"
    ],
    answer: 1,
    explanation: "<strong>VS Code extensions.</strong> They run in a separate process (the extension host), expose commands and capabilities via an API, and the editor calls them when needed. MCP servers are the same: separate processes exposing tools via a standardized protocol."
  },
  {
    question: "You want to share an MCP server with your team WITHOUT including credentials in the repo. Best approach?",
    choices: [
      "Put the full config with credentials in .claude/settings.json and add it to .gitignore",
      "Put the config in .claude/settings.json (checked in) using environment variable references, and document required env vars in the README",
      "Email the config to each team member",
      "Put credentials in CLAUDE.md with a warning not to commit them"
    ],
    answer: 1,
    explanation: "<strong>Checked-in config with env var references.</strong> The MCP server config in <code>.claude/settings.json</code> can reference environment variables via the <code>env</code> field. Check in the config (so teammates get it on clone) but use env vars for secrets. Document in the README which env vars to set."
  },
  {
    question: "Which of these is NOT something an MCP server can do?",
    choices: [
      "Query a database and return results to Claude",
      "Modify Claude's system prompt or personality",
      "Send messages to Slack channels",
      "Create Jira tickets"
    ],
    answer: 1,
    explanation: "<strong>Modify Claude's system prompt.</strong> MCP servers add tools — they give Claude new actions it can take (query, send, create). They cannot modify Claude's instructions, personality, or system prompt. That's what CLAUDE.md and skills do."
  },
  {
    question: "What happens if an MCP server crashes during a conversation?",
    choices: [
      "Claude Code crashes too",
      "The conversation is lost",
      "Claude loses access to that server's tools but the conversation continues",
      "Claude automatically restarts the server"
    ],
    answer: 2,
    explanation: "<strong>Claude loses the tools but continues.</strong> MCP servers are separate processes. If one crashes, Claude can no longer call its tools, but the conversation and all other functionality continue normally. You may need to restart Claude Code to reconnect."
  }
];

// =====================================================
// BONUS FEATURES QUIZ
// =====================================================
const bonusQuestions = [
  {
    question: "What does setting isolation: \"worktree\" do when spawning an agent?",
    choices: [
      "Runs the agent in a Docker container",
      "Creates a temporary git worktree so the agent edits an isolated copy of the repo",
      "Prevents the agent from reading files",
      "Runs the agent on a remote server"
    ],
    answer: 1,
    explanation: "<strong>Creates a temporary git worktree.</strong> The agent gets its own copy of the repo to work in. If it makes no changes, the worktree is cleaned up. If changes are made, you get the branch name to review and merge. Your working tree is never touched."
  },
  {
    question: "The Task tool in Claude Code is most like:",
    choices: [
      "A CI/CD pipeline",
      "A shared Trello board inside the conversation",
      "A cron job scheduler",
      "A git branch manager"
    ],
    answer: 1,
    explanation: "<strong>A shared Trello board inside the conversation.</strong> Tasks are created, tracked as in-progress or complete, and persist within the conversation. Claude can create them to break down complex work, and you can see the status at any time."
  },
  {
    question: "You're planning architecture with Opus, then switching to implementation. What command switches models mid-session?",
    choices: [
      "/switch opus sonnet",
      "/model",
      "claude --model sonnet",
      "You can't — you must start a new session"
    ],
    answer: 1,
    explanation: "<strong>/model</strong> switches between Opus, Sonnet, and Haiku without starting a new session. Your conversation history is preserved. Use Opus for hard thinking, Sonnet for general coding, Haiku for quick tasks."
  },
  {
    question: "What does /compact do?",
    choices: [
      "Minifies your source code",
      "Manually compresses conversation history to free context window space",
      "Deletes old sessions",
      "Compresses files on disk"
    ],
    answer: 1,
    explanation: "<strong>Manually compresses conversation history.</strong> Older messages are summarized to free token space. Doing it manually lets you control the timing and optionally tell it what to prioritize keeping, rather than waiting for unpredictable auto-compression."
  },
  {
    question: "You want /compact to preserve details about the auth refactor but forget the exploratory file reads. How?",
    choices: [
      "You can't control what /compact keeps",
      "/compact focus on the authentication refactor",
      "/compact --keep auth --forget reads",
      "Delete messages manually first, then /compact"
    ],
    answer: 1,
    explanation: "<strong>Pass a summary hint.</strong> <code>/compact focus on the authentication refactor</code> tells the compressor what to prioritize keeping. It's not precise control, but it biases the compression toward preserving what you care about."
  },
  {
    question: "In Claude Code's permission model, pressing 'a' at a tool approval prompt does what?",
    choices: [
      "Aborts the operation",
      "Allows that specific tool type for the rest of the session",
      "Allows all tools permanently",
      "Asks for more details"
    ],
    answer: 1,
    explanation: "<strong>Allows that tool type for the session.</strong> 'a' means 'allow for session' — all future uses of that same tool type are auto-approved until you close the session. It's between 'allow once' (Enter/y) and permanent allowlist (settings.json)."
  },
  {
    question: "Where do you permanently allowlist specific bash commands so Claude never asks permission for them?",
    choices: [
      "CLAUDE.md",
      "settings.json under the permissions/allowlist section",
      "A skill file",
      "Environment variables"
    ],
    answer: 1,
    explanation: "<strong>settings.json.</strong> The permissions section in <code>~/.claude/settings.json</code> or <code>.claude/settings.json</code> lets you define patterns for tools and commands that are always approved. This is the permanent allowlist."
  },
  {
    question: "What is the difference between .claude/settings.json and .claude/settings.local.json in a repo?",
    choices: [
      "No difference — they're aliases",
      "settings.json is for MCP, settings.local.json is for permissions",
      "settings.json can be checked into git (team-shared), settings.local.json is NOT checked in (personal overrides)",
      "settings.json is read-only, settings.local.json is writable"
    ],
    answer: 2,
    explanation: "<strong>Checked-in vs. personal.</strong> <code>.claude/settings.json</code> is meant to be committed to git so your team shares the same config. <code>.claude/settings.local.json</code> is for personal overrides (credentials, personal preferences) and should be in <code>.gitignore</code>. Like <code>.env</code> vs <code>.env.local</code>."
  },
  {
    question: "claude --continue does what?",
    choices: [
      "Continues the most recent session in the current directory",
      "Continues any session you pick from a list",
      "Creates a new session that continues from a template",
      "Resumes a paused background agent"
    ],
    answer: 0,
    explanation: "<strong>Resumes the most recent session in the current directory.</strong> It's the quick 'pick up where I left off' command. <code>--resume</code> (without an ID) shows a list to choose from. <code>--resume &lt;session-id&gt;</code> resumes a specific session by UUID."
  },
  {
    question: "What command shows token usage and cost for the current session?",
    choices: [
      "/tokens",
      "/cost",
      "/usage",
      "/billing"
    ],
    answer: 1,
    explanation: "<strong>/cost</strong> shows token usage breakdown (input, output, cache) and estimated dollar cost for the current session."
  },
  {
    question: "Cache read tokens cost _____ compared to regular input tokens:",
    choices: [
      "The same amount",
      "About 10x less ($0.30/1M vs $3.00/1M for Sonnet)",
      "About 2x more",
      "They're free"
    ],
    answer: 1,
    explanation: "<strong>About 10x less.</strong> Cache reads are $0.30/1M tokens vs $3.00/1M for fresh input (Sonnet pricing). This is why CLAUDE.md and skills are cost-efficient — after the first message, they're read from cache at a fraction of the cost."
  },
  {
    question: "How many CLAUDE.md files can be active at once?",
    choices: [
      "Exactly one — the nearest one wins",
      "Multiple — they stack: global (~/.claude/CLAUDE.md) + repo root + subdirectory",
      "Two — one global and one repo-level",
      "Unlimited, but only the largest one is used"
    ],
    answer: 1,
    explanation: "<strong>Multiple, they stack.</strong> <code>~/.claude/CLAUDE.md</code> (global) + repo root <code>CLAUDE.md</code> + subdirectory <code>CLAUDE.md</code> files all get loaded and composed. They cascade like CSS — all layers are present, more specific ones override on conflict."
  },
  {
    question: "You have a monorepo with different coding standards for frontend/ and backend/. Best CLAUDE.md approach?",
    choices: [
      "Put everything in one CLAUDE.md at the repo root",
      "Repo root CLAUDE.md for shared rules, plus frontend/CLAUDE.md and backend/CLAUDE.md for directory-specific rules",
      "Use separate repos instead",
      "Put all rules in settings.json"
    ],
    answer: 1,
    explanation: "<strong>Layered CLAUDE.md files.</strong> The repo root file covers shared conventions. Subdirectory files add directory-specific rules. When you <code>cd frontend/</code> and start Claude, it loads both the root and frontend CLAUDE.md files. This is exactly what the inheritance chain is designed for."
  },
  {
    question: "Extended thinking is when Claude:",
    choices: [
      "Searches the internet for answers",
      "Generates internal reasoning tokens you don't see before responding",
      "Runs your code to check if it works",
      "Consults other AI models"
    ],
    answer: 1,
    explanation: "<strong>Generates internal reasoning tokens.</strong> Claude does deeper analysis — considering approaches, checking constraints, reasoning through the problem — before generating the visible response. These thinking tokens cost money (they're output tokens) but produce better answers for complex problems."
  },
  {
    question: "Extended thinking tokens are billed as:",
    choices: [
      "Free — they're internal",
      "Input tokens ($3/1M for Sonnet)",
      "Output tokens ($15/1M for Sonnet) — the most expensive kind",
      "Cache tokens ($0.30/1M)"
    ],
    answer: 2,
    explanation: "<strong>Output tokens — the most expensive kind.</strong> Thinking tokens are generated by Claude, so they're billed at output rates. A 30-second thinking pause might generate thousands of tokens you never see but still pay for. This is why Haiku for simple tasks saves real money."
  },
  {
    question: "When should you NOT use Opus with extended thinking?",
    choices: [
      "Complex architecture decisions",
      "Renaming a variable across 3 files",
      "Debugging a race condition",
      "Designing a new module's API"
    ],
    answer: 1,
    explanation: "<strong>Renaming a variable.</strong> That's a mechanical task that doesn't need deep reasoning. Haiku handles it instantly for a fraction of the cost. Save Opus + extended thinking for problems that actually benefit from deeper analysis."
  },
  {
    question: "If a worktree agent makes changes, what do you get back?",
    choices: [
      "A diff file",
      "The worktree path and git branch name to review",
      "An automatic merge into your branch",
      "A pull request"
    ],
    answer: 1,
    explanation: "<strong>The worktree path and branch name.</strong> You can review the changes, test them, and merge the branch if satisfied. Nothing is automatically merged into your working tree — you stay in control."
  },
  {
    question: "What's the most cost-effective session strategy for a typical development task?",
    choices: [
      "Use Opus for everything — quality matters",
      "Use Haiku for everything — save money",
      "Start with Opus for planning, switch to Sonnet for implementation, use Haiku for cleanup",
      "Use Sonnet exclusively — it's the default for a reason"
    ],
    answer: 2,
    explanation: "<strong>Shift gears.</strong> Opus for the hard thinking (architecture, design decisions), Sonnet for general implementation, Haiku for boilerplate and cleanup. <code>/model</code> makes switching instant. Match the model to the complexity of the current task."
  },
  {
    question: "Your context window is 75% full and you're about to start a new phase of work. What should you do?",
    choices: [
      "Start a new session",
      "Run /compact with a hint about what to keep, then continue",
      "Delete old messages manually",
      "Nothing — Claude handles it automatically"
    ],
    answer: 1,
    explanation: "<strong>/compact with a hint.</strong> At 75%, you have room to compress and continue. <code>/compact focus on [current task]</code> frees space while preserving what matters. Starting a new session loses all context. Waiting for auto-compression is unpredictable. At 90%+, starting fresh may be the better call."
  },
  {
    question: "~/.claude/CLAUDE.md is best used for:",
    choices: [
      "Project-specific architecture rules",
      "Universal personal preferences (coding style, response format, things you always want)",
      "Team coding standards",
      "MCP server configuration"
    ],
    answer: 1,
    explanation: "<strong>Universal personal preferences.</strong> This file applies to every session on your machine, across all repos. Things like 'always use TypeScript strict mode' or 'I prefer concise responses' or 'never add emoji' belong here. Project-specific rules go in the repo's CLAUDE.md."
  }
];
