# Shared AI workspace on Debian

Both Codex and Antigravity must work in `/home/spotlighter/workspaces/TTV-REC` on branch `ai/shared-workspace`. The production checkout at `/home/spotlighter/TTV-REC` is separate. Do not deploy or modify it without a direct user request.

Before editing, check `git status --short --branch` and call the `ai-handoff` MCP tool `read_handoffs`. Use `post_handoff` when handing work to the other agent. These notes communicate state; they do not make the agents share private chat history or run each other automatically.

Commit coherent changes to this branch. Push only when GitHub authentication is configured and the user has authorized the particular work. Do not merge to `main` or deploy automatically.
