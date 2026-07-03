# AGENTS.md

Guidance for AI agents and contributors working in this frontend project.

## Project Context

- This is a Vite frontend using React 19, TypeScript, Tailwind CSS v4, React Query, and Axios.
- Tailwind is loaded through `src/index.css` with `@import "tailwindcss";`.
- Use the scripts in `package.json` for local validation:
  - `npm run lint`
  - `npm run build`
  - `npm run dev`

## AI Operating Rules

- Read this file before making any code changes.
- Follow the nearest applicable `AGENTS.md` file. If nested `AGENTS.md` files are added later, their instructions apply to files under that directory.
- Preserve user work. Do not revert, overwrite, or reformat unrelated changes.
- Keep edits scoped to the requested task and avoid opportunistic refactors.
- Prefer existing project patterns, libraries, naming, and file organization over introducing new abstractions.
- Do not add dependencies unless the task clearly requires them and the reason is documented.
- Be explicit about verification. State which checks were run, which were not run, and why.
- If instructions conflict, follow the higher-priority user or system instruction and mention the conflict clearly.

## React Best Practices

- Use typed functional components with TypeScript. Prefer explicit prop types for exported components.
- Keep render logic pure. Do not perform side effects during render.
- Use hooks according to React rules. Keep dependency arrays correct and avoid disabling lint rules unless there is a documented reason.
- Avoid unnecessary `useEffect`. Derive values during render when possible, and use effects only for synchronization with external systems.
- Keep UI state local when it is only used by one component or small component group.
- Use `@tanstack/react-query` for server state, caching, loading states, and request lifecycle management.
- Keep API access centralized through the existing Axios configuration in `src/config/axios.ts`.
- Model loading, empty, error, and success states explicitly for data-driven UI.
- Split components when it improves readability or reuse, but avoid premature abstraction.
- Keep components accessible:
  - Use semantic HTML before custom roles.
  - Associate labels with form controls.
  - Support keyboard navigation for interactive elements.
  - Preserve visible focus states.
  - Use buttons for actions and links for navigation.

## Tailwind Best Practices

- Follow Tailwind CSS v4 conventions already used by this project.
- Prefer Tailwind utilities over custom CSS for layout, spacing, typography, colors, and states.
- Keep custom CSS minimal and reserve it for reusable base styles, complex selectors, or cases Tailwind cannot express cleanly.
- Build responsive layouts mobile-first, then add breakpoint variants as needed.
- Use consistent spacing, sizing, typography, border radius, color, hover, active, disabled, and focus states.
- Keep class names readable. If a JSX element becomes hard to scan, extract a small component or a well-named local constant.
- Avoid inline styles unless a value is genuinely dynamic at runtime.
- Avoid one-off arbitrary values when a standard Tailwind token works.
- Do not hide accessibility issues with styling. Interactive elements must remain discoverable, reachable, and legible.

## Project Workflow

- Run `npm run lint` for static checks after code changes when feasible.
- Run `npm run build` before completion when behavior, TypeScript types, imports, routing, or build configuration changes.
- Documentation-only edits do not require runtime verification, but the edited file should be read back for correctness.
- Keep source changes within the smallest practical set of files.
- Update documentation when behavior, setup, scripts, or public component usage changes.

## Completion Checklist

- The requested behavior or documentation change is implemented.
- Relevant React, TypeScript, and Tailwind conventions from this file are followed.
- Unrelated user changes are preserved.
- Validation commands are run when appropriate, and the result is reported clearly.
