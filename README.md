# Save Constantly (VS Code)

This is a VS Code extension that lets you toggle documents to save (without formatting) on every change.

## Usage

After installing, execute the command **Save Constantly: Toggle** (bound to **`alt+s`** by default) to enable for the document associated with the active editor. Repeat to disable.

## Issues

If a change occurs in a file with Save Constantly enabled but not currently associated with the active editor, it will not be saved; see [this Stack Overflow question](https://stackoverflow.com/q/79550924/5044950) for more details.

## Related

Michel Betancourt's [Save Typing](https://marketplace.visualstudio.com/items?itemName=akhail.save-typing) extension is similar, but has a couple drawbacks:

- It autoformats on save, making it unusable with the **Files: Trim Trailing Whitespace** setting enabled.
- It's configured per language, making it inconvenient to toggle.
- It's not open source.

## License

This project is licensed under the [MIT License](LICENSE).
