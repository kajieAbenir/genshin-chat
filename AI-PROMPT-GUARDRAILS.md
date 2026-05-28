### Project Constraints & Coding Standards
1. **No Global Variables:** Never assign objects or references to the global `window` object. Always use explicit ES Module `import`/`export` syntax.
2. **Dynamic DOM Access:** UI references must use dynamic getters inside the elements module to avoid `null` evaluation errors during initialization.
3. **Event Listener Isolation:** All DOM event listeners must be safely contained inside a single `DOMContentLoaded` block and null-checked before attachment.
4. **CSS Utilities Only:** Avoid injecting inline styles (`element.style.display`) via JavaScript. Use class manipulation (`element.classList.toggle('hidden')`) instead.