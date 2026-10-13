---
trigger: always_on
---

# Execution & Behavior Rules

1. Scope Enforcement:
   - Focus strictly on the exact files and lines mentioned in the current user prompt.
   - Do NOT review, re-check, or refactor previously resolved tasks, commits, or untouched files unless explicitly instructed.
   - Do not perform codebase-wide audits or explore unrelated directories.

2. Direct Execution (No Overthinking):
   - Do not write lengthy multi-paragraph plans before taking action.
   - State the 1-2 sentence plan, execute the file changes immediately, and stop.
   - If a task is clear, jump straight into implementation without unnecessary deliberation.

3. Minimal Diff:
   - Make the minimal required changes to fulfill the request.
   - Do not reformat code, rewrite comments, or alter adjacent working functions.

4. Termination:
   - Once the requested change or script execution is completed, provide a concise 2-sentence summary of what was done.
   - Do not continue running verification loops unless tests/validation were explicitly requested.
