const app = document.querySelector("#app");

const SESSION_KEY = "pb-session";
const USERS_KEY = "pb-users";
const PROFILE_KEY = "pb-profile";

const BASE_COURSES = [
  "Calculus I",
  "Calculus II",
  "Linear Algebra",
  "Statistics",
  "Probability",
  "Discrete Mathematics",
  "Differential Equations",
  "Numerical Methods",
];

const SAMPLE_BIO = "I'm a first year cs student. I struggle with maths";

const DEMO_EMAIL = "demo@local.test";
const SEEDED_CONTEXT = "Calculus I";
const SEEDED_FILES = [
  "Calculus I – Lecture 3: Derivatives.pdf",
  "Calculus I – Lecture 4: Applications of derivatives.pdf",
];

const state = {
  screen: "boot",
  bio: SAMPLE_BIO,
  courses: ["Calculus I"],
  extraCourses: [],
  none: false,
  draftCourse: "",
  emailDraft: "",
  masterEmail: null,
  masterNotice: "",
  seeded: false,
  fileNotice: "",
  ratingOpen: false,
  dialog: false,
  contextDraft: "",
  pending: null,
  graphOpen: false,
  graphNode: null,
  graphFile: null,
};

function currentEmail() {
  return localStorage.getItem(SESSION_KEY);
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function readProfile() {
  const email = currentEmail();
  if (email) {
    return readUsers()[email]?.profile || null;
  }
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY));
  } catch {
    return null;
  }
}

function writeProfile(profile) {
  const email = currentEmail();
  if (email) {
    const users = readUsers();
    users[email] = { ...(users[email] || {}), profile };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return;
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function courseNames() {
  return [...BASE_COURSES, ...state.extraCourses, "None of these"];
}

function isSelected(name) {
  if (name === "None of these") return state.none;
  return !state.none && state.courses.includes(name);
}

function greetingText() {
  if (state.courses.length === 0) {
    return "Hi! I will start from the beginning.";
  }
  const names = state.courses;
  const listed =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `Hi! You have already taken ${listed}, so I will not start from zero.`;
}

function applySaved(profile) {
  state.bio = profile.bio;
  state.courses = profile.courses.filter((name) => name !== "None of these");
  state.none = state.courses.length === 0;
  state.extraCourses = state.courses.filter((name) => !BASE_COURSES.includes(name));
  state.draftCourse = "";
}

function isMaster(email) {
  return Boolean(state.masterEmail) && email === state.masterEmail;
}

function resetProfileDraft() {
  state.bio = SAMPLE_BIO;
  state.courses = ["Calculus I"];
  state.extraCourses = [];
  state.none = false;
  state.draftCourse = "";
}

function ensureDemoSeed(email) {
  const users = readUsers();
  if (users[email]?.profile && Array.isArray(users[email].contexts) && users[email].contexts.length) {
    return;
  }
  const lecture = SEEDED_FILES[1];
  users[email] = {
    profile: {
      bio: SAMPLE_BIO,
      courses: ["Calculus I", "Linear Algebra", "Statistics"],
    },
    activeContext: SEEDED_CONTEXT,
    contexts: [
      {
        name: SEEDED_CONTEXT,
        files: [...SEEDED_FILES],
        topics: [],
        ratings: {
          "Basic derivative rules": 7,
          "Product and quotient rule": 4,
          "Chain rule": 2,
          "Tangent lines": 3,
          Optimization: 2,
        },
        tabs: [lecture],
        activeFile: lecture,
        activeChatId: "demo-chat",
        chats: [
          {
            id: "demo-chat",
            name: "Getting started",
            messages: [
              { role: "user", text: "What is the chain rule?" },
              {
                role: "assistant",
                text: "Differentiate the outside, then multiply by the derivative of the inside. From Calculus I – Lecture 3: Derivatives.pdf.",
              },
            ],
          },
        ],
      },
    ],
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureMasterSeed(email) {
  const users = readUsers();
  const user = { ...(users[email] || {}) };
  const contexts = Array.isArray(user.contexts)
    ? user.contexts.map((context) => ({
        ...context,
        files: [...(context.files || [])],
        topics: context.topics || [],
      }))
    : [];
  let context = contexts.find((item) => item.name === SEEDED_CONTEXT);
  if (!context) {
    context = {
      name: SEEDED_CONTEXT,
      files: [...SEEDED_FILES],
      topics: [],
      ratings: {},
      tabs: [],
      activeFile: null,
    };
    contexts.unshift(context);
  } else {
    for (const name of SEEDED_FILES) {
      if (!context.files.includes(name)) context.files.push(name);
    }
  }
  user.contexts = contexts.map((item) => ({ ...item, ...chatState(item) }));
  if (!user.activeContext) user.activeContext = SEEDED_CONTEXT;
  users[email] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function persistMissingChats() {
  const email = currentEmail();
  const users = readUsers();
  const user = users[email];
  if (!user || !Array.isArray(user.contexts)) return;
  let changed = false;
  user.contexts = user.contexts.map((context) => {
    if (Array.isArray(context.chats) && context.chats.length) return context;
    changed = true;
    return { ...context, ...chatState(context) };
  });
  if (!changed) return;
  users[email] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function chatState(context) {
  const chats =
    Array.isArray(context.chats) && context.chats.length
      ? context.chats.map((chat) => ({
          id: chat.id || crypto.randomUUID(),
          name: chat.name || "Getting started",
          messages: Array.isArray(chat.messages) ? chat.messages : [],
        }))
      : [{ id: crypto.randomUUID(), name: "Getting started", messages: [] }];
  const activeChatId = chats.some((chat) => chat.id === context.activeChatId)
    ? context.activeChatId
    : chats[0].id;
  return { chats, activeChatId };
}

function seededContext() {
  const email = currentEmail();
  const contexts = readUsers()[email]?.contexts || [];
  return contexts.find((context) => context.name === SEEDED_CONTEXT) || null;
}

function lectureFor(name) {
  const lectures = typeof LECTURES === "undefined" ? [] : LECTURES;
  return lectures.find((lecture) => lecture.name === name) || null;
}

function normalizeContext(context) {
  return {
    name: context.name,
    files: [...(context.files || [])],
    ratings: { ...(context.ratings || {}) },
    tabs: [...(context.tabs || [])],
    activeFile: context.activeFile || null,
    ...chatState(context),
  };
}

function activeContext() {
  const email = currentEmail();
  const user = readUsers()[email];
  if (!user || !Array.isArray(user.contexts) || user.contexts.length === 0) return null;
  const found =
    user.contexts.find((context) => context.name === user.activeContext) || user.contexts[0];
  return normalizeContext(found);
}

function saveActiveContext(context) {
  const email = currentEmail();
  if (!email) return;
  const users = readUsers();
  const user = { ...(users[email] || {}) };
  const contexts = Array.isArray(user.contexts) ? user.contexts.map((item) => ({ ...item })) : [];
  const index = contexts.findIndex((item) => item.name === context.name);
  const threads = chatState(context);
  const stored = {
    ...(index === -1 ? {} : contexts[index]),
    name: context.name,
    files: [...context.files],
    ratings: { ...context.ratings },
    tabs: [...context.tabs],
    activeFile: context.activeFile,
    chats: threads.chats.map((chat) => ({ ...chat, messages: [...chat.messages] })),
    activeChatId: threads.activeChatId,
  };
  if (index === -1) contexts.push(stored);
  else contexts[index] = stored;
  user.contexts = contexts;
  user.activeContext = context.name;
  users[email] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureActiveContext() {
  const existing = activeContext();
  if (existing) return existing;
  const created = { name: "Course", files: [], ratings: {}, tabs: [], activeFile: null };
  saveActiveContext(created);
  return created;
}

function topicsFor(context) {
  const topics = [];
  for (const file of context.files) {
    const lecture = lectureFor(file);
    if (!lecture) continue;
    for (const name of lecture.topics) {
      if (topics.some((topic) => topic.name === name)) continue;
      const rating = context.ratings[name];
      topics.push({ name, rating: Number.isInteger(rating) ? rating : null });
    }
  }
  return topics;
}

function addFileNames(names) {
  const context = ensureActiveContext();
  let refused = false;
  for (const name of names) {
    if (!name.toLowerCase().endsWith(".pdf")) {
      refused = true;
      continue;
    }
    if (!context.files.includes(name)) context.files.push(name);
  }
  state.fileNotice = refused ? "Please choose a PDF" : "";
  saveActiveContext(context);
  render();
}

function openFile(name) {
  const context = activeContext();
  if (!context || !context.files.includes(name)) return;
  if (!context.tabs.includes(name)) context.tabs.push(name);
  context.activeFile = name;
  saveActiveContext(context);
  render();
}

function closeTab(name) {
  const context = activeContext();
  if (!context) return;
  context.tabs = context.tabs.filter((tab) => tab !== name);
  if (context.activeFile === name) context.activeFile = context.tabs.at(-1) || null;
  saveActiveContext(context);
  render();
}

function openSaved(email) {
  if (email === DEMO_EMAIL) ensureDemoSeed(email);
  if (isMaster(email)) {
    ensureMasterSeed(email);
    state.seeded = true;
    const profile = readUsers()[email]?.profile;
    if (profile) applySaved(profile);
    else resetProfileDraft();
    state.screen = "workspace";
    return;
  }
  state.seeded = false;
  const profile = readUsers()[email]?.profile || null;
  if (profile) {
    applySaved(profile);
    state.screen = "workspace";
    return;
  }
  resetProfileDraft();
  state.screen = "profile";
}

async function boot() {
  try {
    const response = await fetch("/master");
    if (!response.ok) {
      state.masterNotice = "The master login is not set.";
    } else {
      const data = await response.json();
      state.masterEmail = typeof data.email === "string" ? data.email : null;
      if (!state.masterEmail) state.masterNotice = "The master login is not set.";
    }
  } catch {
    state.masterNotice = "The master login is not set.";
  }
  const email = currentEmail();
  if (email) openSaved(email);
  else state.screen = "login";
  render();
}

const TOPIC_LINKS = [
  ["Chain rule", "Basic derivative rules"],
  ["Tangent lines", "Basic derivative rules"],
  ["Optimization", "Tangent lines"],
];

function graphModel(context) {
  const nodes = [
    ...context.files.map((name) => ({ id: `file:${name}`, kind: "file", name })),
    ...topicsFor(context).map((topic) => ({ id: `topic:${topic.name}`, kind: "topic", name: topic.name })),
  ];
  const ids = new Set(nodes.map((node) => node.id));
  const edges = [];
  for (const file of context.files) {
    const lecture = lectureFor(file);
    if (!lecture) continue;
    for (const topic of lecture.topics) {
      const to = `topic:${topic}`;
      if (ids.has(to)) edges.push([`file:${file}`, to]);
    }
  }
  for (const [fromName, toName] of TOPIC_LINKS) {
    const from = `topic:${fromName}`;
    const to = `topic:${toName}`;
    if (ids.has(from) && ids.has(to)) edges.push([from, to]);
  }
  nodes.forEach((node, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / Math.max(nodes.length, 1);
    node.x = 220 + Math.cos(angle) * 150;
    node.y = 250 + Math.sin(angle) * 150;
  });
  return { nodes, edges };
}

function graphMarkup(context) {
  if (!context.files.length) {
    return `<p class="graph-empty">Add course material to see how the topics connect.</p>`;
  }
  const { nodes, edges } = graphModel(context);
  const selected = state.graphNode;
  const neighborIds = new Set();
  if (selected) {
    neighborIds.add(selected);
    for (const [from, to] of edges) {
      if (from === selected) neighborIds.add(to);
      if (to === selected) neighborIds.add(from);
    }
  }
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const lines = edges
    .map(([from, to]) => {
      const a = byId.get(from);
      const b = byId.get(to);
      const hot = selected && (from === selected || to === selected);
      return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="graph-line${hot ? " hot" : ""}" />`;
    })
    .join("");
  const circles = nodes
    .map((node) => {
      const hot = !selected || neighborIds.has(node.id);
      const label = node.name.length > 22 ? `${node.name.slice(0, 20)}…` : node.name;
      return `
        <g class="graph-hit${hot ? "" : " dim"}${node.id === selected ? " selected" : ""}" data-action="select-node" data-node="${escapeHtml(node.id)}">
          <circle class="graph-node ${node.kind}" cx="${node.x}" cy="${node.y}" r="16" />
          <text class="graph-label" x="${node.x}" y="${node.y + 32}" text-anchor="middle">${escapeHtml(label)}</text>
        </g>
      `;
    })
    .join("");
  const selectedNode = nodes.find((node) => node.id === selected);
  return `
    <div class="graph-view">
      <svg class="graph-svg" viewBox="0 0 440 520" role="img" aria-label="Content graph">
        ${lines}
        ${circles}
      </svg>
      <p class="graph-caption">${selectedNode ? escapeHtml(selectedNode.name) : "Click a node"}</p>
    </div>
  `;
}

function render() {
  if (state.screen === "boot") {
    app.innerHTML = "";
    return;
  }

  if (state.screen === "login") {
    const notice = state.masterNotice
      ? `<p class="notice">${escapeHtml(state.masterNotice)}</p>`
      : "";
    app.innerHTML = `
      <form class="login">
        <h1>Sign in</h1>
        <p class="lede">Enter your email. There is no password and no separate account page. A new email starts a profile.</p>
        ${notice}
        <div class="field">
          <label for="email">Email</label>
          <input class="text-input" id="email" name="email" type="text" autocomplete="username" value="${escapeHtml(state.emailDraft)}" />
        </div>
        <button class="primary" type="submit">Continue</button>
        <button class="secondary demo-login" type="button" data-action="use-demo">Continue as demo@local.test</button>
      </form>
    `;
    return;
  }

  if (state.screen === "workspace") {
    persistMissingChats();
    const context = activeContext() || {
      name: "",
      files: [],
      ratings: {},
      tabs: [],
      activeFile: null,
    };
    const topics = topicsFor(context);
    const files = context.files
      .map(
        (name) => `
          <li>
            <button class="file-row${name === context.activeFile ? " active" : ""}" type="button" data-action="open-file" data-file="${escapeHtml(name)}">${escapeHtml(name)}</button>
          </li>
        `,
      )
      .join("");
    const topicRows = topics
      .map(
        (topic) => `
          <li class="topic-row">
            <span>${escapeHtml(topic.name)}</span>
            <span>${topic.rating === null ? "Not rated" : `${topic.rating}/10`}</span>
          </li>
        `,
      )
      .join("");
    const ratingPanel = state.ratingOpen
      ? `
        <form class="rating-panel" data-action="save-ratings">
          <p class="legend">0 = never seen it</p>
          <p class="legend">10 = could explain it to someone</p>
          ${topics
            .map(
              (topic) => `
                <label class="slider-row">
                  <span class="slider-name">${escapeHtml(topic.name)}</span>
                  <span class="slider-value">${topic.rating ?? 0} / 10</span>
                  <input data-rating="${escapeHtml(topic.name)}" type="range" min="0" max="10" value="${topic.rating ?? 0}" />
                </label>
              `,
            )
            .join("")}
          <button class="primary" type="submit">Save</button>
        </form>
      `
      : "";
    const tabs = context.tabs
      .map(
        (name) => `
          <div class="tab${name === context.activeFile ? " active" : ""}">
            <button class="tab-open" type="button" data-action="open-file" data-file="${escapeHtml(name)}">${escapeHtml(name)}</button>
            <button class="tab-close" type="button" data-action="close-tab" data-file="${escapeHtml(name)}" aria-label="Close ${escapeHtml(name)}">×</button>
          </div>
        `,
      )
      .join("");
    const lecture = lectureFor(context.activeFile);
    let reader = `
      <div class="empty-doc">
        <p class="empty-title">No document open</p>
        <p>Add your course material on the left, then click a file to read it here.</p>
      </div>
    `;
    if (context.activeFile && lecture) {
      reader = `
        <article class="slide">
          ${lecture.slideTitle ? `<h2>${escapeHtml(lecture.slideTitle)}</h2>` : ""}
          <p>${escapeHtml(lecture.note)}</p>
          ${lecture.slideLabel ? `<p class="slide-label">${escapeHtml(lecture.slideLabel)}</p>` : ""}
        </article>
      `;
    } else if (context.activeFile) {
      reader = `
        <article class="slide unknown">
          <h2>${escapeHtml(context.activeFile)}</h2>
          <p>This prototype does not open the file.</p>
        </article>
      `;
    }
    const notice = state.fileNotice ? `<p class="file-notice">${escapeHtml(state.fileNotice)}</p>` : "";
    const greeting = readProfile()
      ? `<p class="greeting">${escapeHtml(greetingText())}</p>`
      : "";
    const email = currentEmail();
    const user = readUsers()[email] || {};
    const contexts = Array.isArray(user.contexts) ? user.contexts : [];
    const options = contexts
      .map(
        (item) =>
          `<option value="${escapeHtml(item.name)}"${item.name === context.name ? " selected" : ""}>${escapeHtml(item.name)}</option>`,
      )
      .join("");
    const chats = context.chats || [];
    const chatOptions = chats
      .map(
        (chat) =>
          `<option value="${escapeHtml(chat.id)}"${chat.id === context.activeChatId ? " selected" : ""}>Chat: ${escapeHtml(chat.name)}</option>`,
      )
      .join("");
    const dialog = state.dialog
      ? `
        <div class="cover">
          <form class="context-dialog">
            <h2>Add a course context</h2>
            <p>Each context keeps its own course material, topics and chats.</p>
            <input class="text-input" id="context-name" type="text" aria-label="Course context name" value="${escapeHtml(state.contextDraft)}" />
            <div class="dialog-actions">
              <button class="secondary" type="button" data-action="cancel-context">Cancel</button>
              <button class="dialog-add" type="submit">Add context</button>
            </div>
          </form>
        </div>
      `
      : "";
    app.innerHTML = `
      <div class="shell">
        <header class="workspace-header">
          <span class="context-label">Context:</span>
          <select class="context-select" id="context-select" aria-label="Context">${options}</select>
          <button class="add-context" type="button" data-action="open-context">+ Add context</button>
          <button class="graph-button" type="button" data-action="toggle-graph" aria-pressed="${state.graphOpen}">Graph</button>
          <button class="profile-button" type="button" data-action="edit-profile">Profile</button>
          <button class="sign-out" type="button" data-action="sign-out">Sign out</button>
        </header>
        <section class="column material">
          <h2>Course material</h2>
          <ul class="files">${files}</ul>
          <div class="drop" data-drop>
            <p class="drop-title">Drag and drop your files here</p>
            <p>PDF, slides or documents</p>
            <button class="secondary" type="button" data-action="choose-files">Choose files</button>
            <input id="file-input" type="file" accept=".pdf" multiple hidden />
          </div>
          ${notice}
          <button class="secondary sample" type="button" data-action="add-samples">Add sample lectures</button>
          <div class="topic-head">
            <h2>Topics found</h2>
            <button class="text-button" type="button" data-action="rate">Rate my knowledge</button>
          </div>
          <ul class="topics">${topicRows}</ul>
          <p class="topic-note">Ratings come from your self-assessment and update as you practice.</p>
          ${ratingPanel}
        </section>
        <section class="column document">
          ${state.graphOpen ? graphMarkup(context) : `<div class="tabs">${tabs}</div>${reader}`}
        </section>
        <section class="column chat-column">
          <div class="chat-toolbar">
            <select class="chat-switcher" id="chat-select" aria-label="Chat">${chatOptions}</select>
            <button class="new-chat" type="button" data-action="new-chat">+ New chat</button>
          </div>
          ${greeting}
          <div class="messages">
            ${(() => {
              const thread = context.chats?.find((chat) => chat.id === context.activeChatId);
              const messages = thread?.messages || [];
              if (!messages.length && !(state.pending && state.pending.chatId === context.activeChatId)) {
                return `<p class="chat-empty">No messages in this chat yet. Write a question below.</p>`;
              }
              return messages
                .map(
                  (message) =>
                    `<p class="bubble ${message.role === "user" ? "user" : "assistant"}">${escapeHtml(message.text)}</p>`,
                )
                .join("");
            })()}
            ${
              state.pending && state.pending.chatId === context.activeChatId
                ? `<p class="waiting">Waiting…</p>`
                : ""
            }
          </div>
          <div class="composer">
            <input class="composer-input" type="text" aria-label="Message" placeholder="Write your attempt or ask a question…" ${state.pending ? "disabled" : ""} />
            <button class="send" type="button" data-action="send" ${state.pending ? "disabled" : ""}>Send</button>
          </div>
        </section>
        <p class="footer-note">Lo-fi prototype · AI answers and confidence scores are scripted</p>
      </div>
      ${dialog}
    `;
    return;
  }

  const chips = courseNames()
    .map(
      (name) => `
        <li>
          <button class="chip" type="button" data-action="toggle-course" data-course="${escapeHtml(name)}" aria-pressed="${isSelected(name)}">${escapeHtml(name)}</button>
        </li>
      `,
    )
    .join("");

  app.innerHTML = `
    <form class="profile">
      <h1>Hey, ready to study?</h1>
      <p class="lede">Tell us a little about you, so the help can start at the right place.</p>
      <div class="field">
        <label for="about">About you</label>
        <textarea id="about" name="about">${escapeHtml(state.bio)}</textarea>
      </div>
      <p class="courses-label" id="courses-label">Math courses you took before</p>
      <ul class="chips" aria-labelledby="courses-label">${chips}</ul>
      <div class="add-row">
        <input class="text-input" id="new-course" type="text" placeholder="Add another course" value="${escapeHtml(state.draftCourse)}" />
        <button class="secondary" type="button" data-action="add-course">Add</button>
      </div>
      <button class="primary" type="submit">Continue</button>
      <button class="text-button sign-link" type="button" data-action="sign-out">Back to sign in</button>
    </form>
  `;
}

function toggleCourse(name) {
  if (name === "None of these") {
    state.none = true;
    state.courses = [];
    return;
  }
  state.none = false;
  if (state.courses.includes(name)) {
    state.courses = state.courses.filter((course) => course !== name);
    if (state.courses.length === 0) state.none = true;
    return;
  }
  state.courses = [...state.courses, name];
}

function addCourse() {
  const input = document.querySelector("#new-course");
  const name = input.value.trim();
  state.bio = document.querySelector("#about").value;
  state.draftCourse = "";
  if (!name || name === "None of these" || courseNames().includes(name)) {
    render();
    return;
  }
  state.extraCourses = [...state.extraCourses, name];
  state.none = false;
  state.courses = [...state.courses, name];
  render();
}

function rememberFields() {
  const about = document.querySelector("#about");
  const draft = document.querySelector("#new-course");
  if (about) state.bio = about.value;
  if (draft) state.draftCourse = draft.value;
}

app.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "toggle-course") {
    rememberFields();
    toggleCourse(button.dataset.course);
    render();
  }
  if (action === "add-course") addCourse();
  if (action === "edit-profile") {
    state.screen = "profile";
    state.ratingOpen = false;
    render();
  }
  if (action === "choose-files") document.querySelector("#file-input")?.click();
  if (action === "add-samples") addFileNames(LECTURES.map((lecture) => lecture.name));
  if (action === "open-file") openFile(button.dataset.file);
  if (action === "close-tab") closeTab(button.dataset.file);
  if (action === "rate") {
    state.ratingOpen = true;
    render();
  }
  if (action === "open-context") {
    state.dialog = true;
    state.contextDraft = "";
    render();
  }
  if (action === "cancel-context") {
    state.dialog = false;
    state.contextDraft = "";
    render();
  }
  if (action === "new-chat") addThread();
  if (action === "send") sendQuestion();
  if (action === "use-demo") {
    localStorage.setItem(SESSION_KEY, DEMO_EMAIL);
    ensureDemoSeed(DEMO_EMAIL);
    openSaved(DEMO_EMAIL);
    render();
  }
  if (action === "sign-out") {
    localStorage.removeItem(SESSION_KEY);
    state.emailDraft = "";
    state.screen = "login";
    state.graphOpen = false;
    state.pending = null;
    render();
  }
  if (action === "toggle-graph") {
    if (state.graphOpen) {
      const file = state.graphFile;
      state.graphOpen = false;
      state.graphNode = null;
      state.graphFile = null;
      if (file) openFile(file);
      else render();
    } else {
      state.graphOpen = true;
      state.graphNode = null;
      state.graphFile = null;
      render();
    }
  }
  if (action === "select-node") {
    const id = button.dataset.node;
    state.graphNode = id;
    state.graphFile = id.startsWith("file:") ? id.slice("file:".length) : null;
    render();
  }
});

app.addEventListener("input", (event) => {
  const input = event.target;
  if (input.type !== "range" || !input.dataset.rating) return;
  const value = input.parentElement?.querySelector(".slider-value");
  if (value) value.textContent = `${input.value} / 10`;
});

app.addEventListener("change", (event) => {
  if (event.target.id === "context-select") {
    selectContext(event.target.value);
    return;
  }
  if (event.target.id === "chat-select") {
    selectChat(event.target.value);
    return;
  }
  if (event.target.id !== "file-input") return;
  addFileNames([...event.target.files].map((file) => file.name));
  event.target.value = "";
});

app.addEventListener("dragover", (event) => {
  if (!event.target.closest("[data-drop]")) return;
  event.preventDefault();
});

app.addEventListener("drop", (event) => {
  if (!event.target.closest("[data-drop]")) return;
  event.preventDefault();
  addFileNames([...event.dataTransfer.files].map((file) => file.name));
});

app.addEventListener("submit", (event) => {
  if (!event.target.matches(".rating-panel")) return;
  event.preventDefault();
  event.stopPropagation();
  const context = activeContext();
  if (!context) return;
  for (const topic of topicsFor(context)) {
    const input = document.querySelector(`[data-rating="${CSS.escape(topic.name)}"]`);
    if (input) context.ratings[topic.name] = Number(input.value);
  }
  saveActiveContext(context);
  state.ratingOpen = false;
  render();
});

function nextChatName(chats) {
  const names = new Set(chats.map((chat) => chat.name));
  if (!names.has("New chat")) return "New chat";
  let number = 2;
  while (names.has(`New chat ${number}`)) number += 1;
  return `New chat ${number}`;
}

function selectContext(name) {
  const email = currentEmail();
  const users = readUsers();
  const user = users[email];
  if (!user?.contexts?.some((context) => context.name === name)) return;
  user.activeContext = name;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  state.ratingOpen = false;
  render();
}

function selectChat(id) {
  const context = activeContext();
  if (!context?.chats?.some((chat) => chat.id === id)) return;
  context.activeChatId = id;
  saveActiveContext(context);
  render();
}

function replyFor(text, id) {
  const marker = `## ${id} reply`;
  const start = text.indexOf(marker);
  if (start === -1) return null;
  const rest = text.slice(start + marker.length).replace(/^\n/, "");
  const next = rest.search(/\n## /);
  const body = (next === -1 ? rest : rest.slice(0, next)).trim();
  return body || null;
}

function contextByName(name) {
  const email = currentEmail();
  const user = readUsers()[email];
  const found = user?.contexts?.find((context) => context.name === name);
  return found ? normalizeContext(found) : null;
}

async function sendQuestion() {
  if (state.pending) return;
  const input = document.querySelector(".composer-input");
  const question = input?.value.trim() || "";
  if (!question) return;
  const context = activeContext();
  if (!context) return;
  const chat = context.chats.find((item) => item.id === context.activeChatId);
  if (!chat) return;
  chat.messages.push({ role: "user", text: question });
  saveActiveContext(context);
  const notes = context.files.map((name) => {
    const lecture = lectureFor(name);
    return { name, note: lecture ? lecture.note : "" };
  });
  state.pending = { id: null, chatId: chat.id, contextName: context.name };
  render();
  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context: context.name, notes }),
    });
    if (!response.ok) throw new Error("ask failed");
    const data = await response.json();
    state.pending = { id: data.id, chatId: chat.id, contextName: context.name };
    pollReply();
  } catch {
    state.pending = null;
    const current = contextByName(context.name);
    const thread = current?.chats.find((item) => item.id === chat.id);
    if (thread) {
      thread.messages.push({ role: "assistant", text: "The question could not be saved." });
      saveActiveContext(current);
    }
    render();
  }
}

function pollReply() {
  const pending = state.pending;
  if (!pending?.id) return;
  fetch("/log")
    .then((response) => response.json())
    .then((data) => {
      if (state.pending?.id !== pending.id) return;
      const reply = replyFor(data.text || "", pending.id);
      if (!reply) {
        setTimeout(pollReply, 1000);
        return;
      }
      const context = contextByName(pending.contextName);
      const chat = context?.chats.find((item) => item.id === pending.chatId);
      if (chat) {
        chat.messages.push({ role: "assistant", text: reply });
        saveActiveContext(context);
      }
      state.pending = null;
      if (state.screen === "workspace") render();
    })
    .catch(() => {
      if (state.pending?.id === pending.id) setTimeout(pollReply, 1000);
    });
}

function addThread() {
  const context = activeContext();
  if (!context) return;
  const chat = { id: crypto.randomUUID(), name: nextChatName(context.chats), messages: [] };
  context.chats.push(chat);
  context.activeChatId = chat.id;
  saveActiveContext(context);
  render();
}

function addContext(name) {
  const email = currentEmail();
  const users = readUsers();
  const user = { ...(users[email] || {}) };
  const contexts = Array.isArray(user.contexts) ? user.contexts.map((item) => ({ ...item })) : [];
  if (contexts.some((item) => item.name === name)) return false;
  contexts.push(
    normalizeContext({ name, files: [], ratings: {}, tabs: [], activeFile: null }),
  );
  user.contexts = contexts;
  user.activeContext = name;
  users[email] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
}

app.addEventListener("submit", (event) => {
  if (event.target.matches(".rating-panel")) return;
  event.preventDefault();
  if (event.target.classList.contains("context-dialog")) {
    const input = document.querySelector("#context-name");
    state.contextDraft = input.value;
    const name = input.value.trim();
    if (!name || !addContext(name)) return;
    state.dialog = false;
    state.contextDraft = "";
    state.ratingOpen = false;
    render();
    return;
  }
  if (state.screen === "login") {
    const input = document.querySelector("#email");
    state.emailDraft = input.value;
    const email = input.value.trim();
    if (!email) return;
    localStorage.setItem(SESSION_KEY, email);
    if (!readUsers()[email]) {
      const users = readUsers();
      users[email] = {};
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    openSaved(email);
    render();
    return;
  }
  state.bio = document.querySelector("#about").value;
  const profile = { bio: state.bio, courses: [...state.courses] };
  writeProfile(profile);
  state.seeded = isMaster(currentEmail());
  state.screen = "workspace";
  render();
});

boot();
