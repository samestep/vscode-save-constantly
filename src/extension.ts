import * as vscode from "vscode";

export const activate = (context: vscode.ExtensionContext) => {
  const log = vscode.window.createOutputChannel("Save Constantly", {
    log: true,
  });
  log.info("activating Save Constantly extension");

  const save = async (document: vscode.TextDocument) => {
    const { fileName } = document;
    log.trace("saving", fileName);
    if (
      vscode.workspace
        .getConfiguration("saveConstantly")
        .get("saveWithoutFormatting")
    ) {
      const active = vscode.window.activeTextEditor?.document.fileName;
      if (fileName !== active) {
        log.warn(
          "can't save a file different from the active document",
          active,
        );
        return;
      }
      await vscode.commands.executeCommand(
        "workbench.action.files.saveWithoutFormatting",
      );
    } else {
      if (!(await document.save())) log.warn("failed to save", fileName);
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
