import * as vscode from "vscode";

const configsToDisable = [
  ["editor", "formatOnSave"],
  ["files", "insertFinalNewline"],
  ["files", "trimFinalNewlines"],
  ["files", "trimTrailingWhitespace"],
];

export const activate = (context: vscode.ExtensionContext) => {
  const log = vscode.window.createOutputChannel("Save Constantly", {
    log: true,
  });
  log.info("activating Save Constantly extension");

  const save = async (document: vscode.TextDocument) => {
    const { fileName } = document;
    log.trace("saving", fileName);
    const changes = configsToDisable.map(() => 0);
    const listener = vscode.workspace.onDidChangeConfiguration((event) => {
      configsToDisable.forEach(([section, name], index) => {
        if (event.affectsConfiguration(`${section}.${name}`, document))
          changes[index] += 1;
      });
    });
    try {
      const before = await Promise.all(
        configsToDisable.map(async ([section, name]) => {
          const config = vscode.workspace.getConfiguration(section, document);
          const value = config.get<boolean>(name);
          await config.update(name, false);
          return value;
        }),
      );
      const saved = await document.save();
      if (!saved) log.warn("failed to save", fileName);
      await Promise.all(
        configsToDisable.map(async ([section, name], index) => {
          const config = vscode.workspace.getConfiguration(section, document);
          await config.update(name, before[index]);
        }),
      );
    } finally {
      listener.dispose();
      configsToDisable.forEach(([section, name], index) => {
        const count = changes[index];
        if (!(count === 0 || count === 2))
          vscode.window.showWarningMessage(
            `tried to change temporarily disable ${section}.${name} while saving, but it changed ${count} times instead of the expected 0 or 2`,
          );
      });
    }
  };

  const files = new Set<string>();

  const statusBarItem = vscode.window.createStatusBarItem();
  statusBarItem.text = "save constantly";
  statusBarItem.tooltip = "Saving this file on every change. Click to disable.";
  statusBarItem.command = "saveConstantly.toggle";
  const updateStatusBar = () => {
    const file = vscode.window.activeTextEditor?.document.fileName;
    if (file !== undefined && files.has(file)) statusBarItem.show();
    else statusBarItem.hide();
  };
  updateStatusBar();

  context.subscriptions.push(
    vscode.commands.registerCommand("saveConstantly.toggle", async () => {
      const document = vscode.window.activeTextEditor?.document;
      if (document === undefined) {
        vscode.window.showErrorMessage("no active editor");
        return;
      }
      const { fileName } = document;
      if (files.has(fileName)) {
        log.debug("toggle off", fileName);
        files.delete(fileName);
        updateStatusBar();
      } else {
        log.debug("toggle on", fileName);
        files.add(fileName);
        updateStatusBar();
        await save(document);
      }
    }),

    vscode.workspace.onDidChangeTextDocument(async (event) => {
      const { document } = event;
      const { fileName, isDirty } = document;
      if (!(files.has(fileName) && isDirty)) return;
      await save(document);
    }),

    statusBarItem,
    vscode.window.onDidChangeActiveTextEditor(updateStatusBar),
  );
};
