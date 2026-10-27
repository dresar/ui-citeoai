# UI-CITEOAI: Remote Control & Web TUI for CITEOAI Autonomous Agent

Mobile-First, ultra-responsive, elegant, and minimalist dark web dashboard for CITEOAI autonomous engine.

---

## 1. Design Reference & Invariants

Based on Google Antigravity Mobile Interface (`docs/reference_screen1_projects.jpg` and `docs/reference_screen2_chat_execution.jpg`):

1. **Dark Theme Default (`antislop-ui`)**:
   - Background Base: `#0e0e11` / `#121215`
   - Card Surfaces: `#18181c` / `#1e1e24`
   - Borders: Subtle neutral `#27272a`
   - Text: High contrast `#f4f4f5` (muted text: `#a1a1aa`, `#71717a`)
   - Accent: Restrained emerald `#10b981` or indigo `#6366f1`
   - Zero generic AI purple-blue gradients or glowing neon backgrounds.

2. **Card UI Specification (`card_ui`)**:
   - Strict 4px corner radius (`border-radius: 4px` / `rounded-[4px]`) on cards, dropdowns, code boxes, badges. No pill buttons or oversized 16px/24px rounded corners.

3. **UI Text Brevity (`ui-ux-text`)**:
   - All labels, badges, buttons, headers must strictly not exceed 3 words (target: 1-2 words).

4. **Screen 1: Project & Session Explorer**:
   - **Header**:
     - Logo badge: `CITEOAI` or stylized `A`
     - Profile badge: `agy01-eka.ckp16...` with active green pulse dot
     - Settings icon (gear modal: API key, provider select, system prompt, sandbox mode)
     - Refresh icon
     - User avatar
   - **Projects Accordion (`Projects v`)**:
     - Accordion items for projects (`CITEOAI`, `gowa`, `proskillai`, `CLI Project`)
     - Each project has `+` button to create a new session
     - Session list under each project: title + relative timestamp (`7m`, `2d`, `5d`) + active blue dot indicator
   - **Bottom Chat Bar**:
     - Text input: `Ask anything, @ to mention, / for actions`
     - `+` button for adding files/context
     - Model selector dropdown: `Gemini 3.8 Flash High ^`, `Gemini 3.6 Flash`, `GPT-4o`, `Ollama`
     - Slash command popup support: `/learn`, `/teamwork`, `/boost`, `/model`, `/new`, `/clear`, `/reset`, `/compact`, `/memory`, `/stats`, `/help`
     - Voice/Mic icon and Send arrow button `->`

5. **Screen 2: Chat & Live Execution Stream**:
   - **Header**: Back arrow `<-` (collapses drawer to return to projects), session title (`CITEOAI Engine Implementation Setup`), `⋮` options, chat icon, user avatar.
   - **User message card**: Dark surface `#1e1e24` with 4px rounded borders.
   - **Agent Execution Blocks (Dropdown / Collapsible)**:
     - "Explored file, ran commands v"
     - "Analyzed [go icon] main.go #L80-140"
     - "Thought for 8s >" (collapsible thought disclosure)
     - "Ran test tools execution package v":
       - Terminal execution card:
         - Top bar: path and command `.../home/CITEOAI $ cd ... && go test -v ...` with copy button
         - Output log box with terminal text, PASS checks, exit code
     - Final response: Clean Markdown (`.MD`) formatting with headers, code blocks, lists, and tables.

---

## 2. Real-Time Communication Protocol (WebSocket / REST)

Endpoint: `ws://${window.location.host}/ws` (or `wss://`)

### Client -> Server:
```json
{"type": "prompt", "session_id": "sess_default", "content": "analyze files", "model": "gemini-3.8-flash"}
{"type": "list_projects"}
{"type": "list_sessions"}
{"type": "new_session", "project": "CITEOAI"}
```

### Server -> Client:
```json
{"type": "thought", "delta": "Thinking about sandbox constraints..."}
{"type": "token", "delta": "I will examine the codebase."}
{"type": "tool_start", "name": "run_command", "args": "go test -v ./..."}
{"type": "tool_log", "output": "=== RUN TestNewSandbox\n--- PASS"}
{"type": "tool_end", "name": "run_command", "success": true}
{"type": "done", "final_text": "Completed task."}
```

---

## 3. Build & Deployment Rules

1. **NO NPM START AS DAEMON**:
   - The web app is strictly compiled via `npm run build` producing a standalone `dist/` directory with `index.html`, JS, and CSS bundles.
2. **Go Backend Serving**:
   - The compiled `dist/` is served by CITEOAI Go backend (`citeoai serve --port 8088`).
3. **Public Access**:
   - Exposed via Cloudflare Tunnel at `https://citeoai.agentai.my.id`.
