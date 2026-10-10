#!/usr/bin/env python3
"""Small stdio MCP server for a shared Codex/Antigravity handoff log."""

import fcntl
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG = ROOT / ".agents" / "handoffs.jsonl"


def reply(request_id, result=None, error=None):
    payload = {"jsonrpc": "2.0", "id": request_id}
    payload["error" if error else "result"] = error if error else result
    print(json.dumps(payload, ensure_ascii=False), flush=True)


def content(value):
    return {"content": [{"type": "text", "text": value}]}


def read_handoffs():
    if not LOG.exists():
        return "No handoffs yet."
    return "".join(LOG.read_text(encoding="utf-8").splitlines(keepends=True)[-30:])


def post_handoff(args):
    agent = args.get("agent", "").strip()
    message = args.get("message", "").strip()
    if agent not in ("codex", "antigravity") or not message or len(message) > 4000:
        raise ValueError("agent must be codex or antigravity; message must be 1-4000 characters")
    LOG.parent.mkdir(parents=True, exist_ok=True)
    record = {"time": datetime.now(timezone.utc).isoformat(), "agent": agent, "message": message}
    with LOG.open("a", encoding="utf-8") as stream:
        fcntl.flock(stream, fcntl.LOCK_EX)
        stream.write(json.dumps(record, ensure_ascii=False) + "\n")
        stream.flush()
        fcntl.flock(stream, fcntl.LOCK_UN)
    return "Handoff posted."


def git_status():
    result = subprocess.run(
        ["git", "status", "--short", "--branch"], cwd=ROOT,
        capture_output=True, text=True, check=True, timeout=10,
    )
    return result.stdout or "Clean working tree."


TOOLS = [
    {"name": "read_handoffs", "description": "Read recent notes left by Codex and Antigravity in this shared project.", "inputSchema": {"type": "object", "properties": {}}},
    {"name": "post_handoff", "description": "Leave a short status or request for the other agent in the shared project.", "inputSchema": {"type": "object", "properties": {"agent": {"type": "string", "enum": ["codex", "antigravity"]}, "message": {"type": "string"}}, "required": ["agent", "message"]}},
    {"name": "git_status", "description": "Read branch and uncommitted changes in the shared project.", "inputSchema": {"type": "object", "properties": {}}},
]


for line in sys.stdin:
    try:
        request = json.loads(line)
        if "id" not in request:
            continue
        request_id = request["id"]
        method = request.get("method")
        if method == "initialize":
            reply(request_id, {"protocolVersion": "2025-03-26", "capabilities": {"tools": {}}, "serverInfo": {"name": "ai-handoff", "version": "1.0.0"}})
        elif method == "ping":
            reply(request_id, {})
        elif method == "tools/list":
            reply(request_id, {"tools": TOOLS})
        elif method == "tools/call":
            params = request.get("params", {})
            name = params.get("name")
            if name == "read_handoffs":
                reply(request_id, content(read_handoffs()))
            elif name == "post_handoff":
                reply(request_id, content(post_handoff(params.get("arguments", {}))))
            elif name == "git_status":
                reply(request_id, content(git_status()))
            else:
                reply(request_id, error={"code": -32601, "message": "Unknown tool"})
        else:
            reply(request_id, error={"code": -32601, "message": "Unknown method"})
    except Exception as exc:
        if "request_id" in locals():
            reply(request_id, error={"code": -32603, "message": str(exc)})
