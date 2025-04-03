# Save Constantly (VS Code)

This is a VS Code extension that lets you toggle documents to save (without formatting) on every change.

## Usage

After installing, execute the command **Save Constantly: Toggle** (bound to **`alt+s`** by default) to enable for the document associated with the active editor. Repeat to disable.

## Issues

Because VS Code lacks an API to save an arbitrary file without formatting (see [microsoft/vscode#245405](https://github.com/microsoft/vscode/issues/245405)), this extension does the best it can by attempting to temporarily disable the following settings while saving, similar to Gruntfuggly's now-deprecated [Save Without Format](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.save-without-format) extension:

- `editor.formatOnSave`
- `files.insertFinalNewline`
- `files.trimFinalNewlines`
- `files.trimTrailingWhitespace`

However, this has a couple drawbacks:

- The latency is much higher than it should be, negating the benefit of disabling autoformatting.
- It is possible for there to be a race condition in which the configuration is changed while the file is being saved, causing the setting to erroneously revert back to its previous value.
- By modifying the configuration, this extension adds those settings to the `.vscode/settings.json` file in the current workspace, even if that file didn't already exist or contain those settings.

If a change occurs in a file with Save Constantly enabled but not currently associated with the active editor, it will not be saved; see [this Stack Overflow question](https://stackoverflow.com/q/79550924/5044950) for more details.

## Related

Michel Betancourt's [Save Typing](https://marketplace.visualstudio.com/items?itemName=akhail.save-typing) extension is similar, but has a couple drawbacks:

- It autoformats on save, making it unusable with the **Files: Trim Trailing Whitespace** setting enabled.
- It's configured per language, making it inconvenient to toggle.
- It's not open source.

## License

This project is licensed under the [MIT License](LICENSE).
