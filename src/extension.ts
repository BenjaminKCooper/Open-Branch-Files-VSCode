import * as vscode from 'vscode';
import * as g from 'isomorphic-git';
import * as SimplGit from 'simple-git/promise';
import * as fs from 'fs';

g.plugins.set('fs', fs);

const checkForGitRepo = async(): Promise<string | null> => {

  if (vscode.workspace.workspaceFolders) {
    try {
      const rootFolderPath = await g.findRoot({ filepath: vscode.workspace.workspaceFolders[0].uri.fsPath });

      return rootFolderPath;
    } catch (err) {
      return null;
    }
  }
  return null;
};

export const activate = async (context: vscode.ExtensionContext) => {
  console.log('Congratulations, your extension "open-branch-files" is now active!');
  const disposable = vscode.commands.registerCommand('extension.openBranchFiles', async () => {
    const repo = await checkForGitRepo();
    if (repo) {
      vscode.window.showInformationMessage(`Opening branch files for folder path ${repo}`);
      const filesToOpen: string[] = [];

      const git = SimplGit(repo);
      const diff = await git.diffSummary(['master...']);
      const status = await git.status();

      for (const unstagedFile of status.files) {
        if (!filesToOpen.includes(unstagedFile.path)) {
          filesToOpen.push(unstagedFile.path);
        }
      }

      for (const committedFile of diff.files) {
        if (!filesToOpen.includes(committedFile.file)) {
          filesToOpen.push(committedFile.file);
        }
      }

      filesToOpen.map((filePath) => {
        const uri = vscode.Uri.file(`${repo}/${filePath}`);
        vscode.commands.executeCommand('vscode.open', uri);
        // vscode.workspace.openTextDocument(`${repo}/${filePath}`).then(
        //   (blah) => {
        //     blah.save();
        //     console.log(blah);
        //   },
        // );
      });

    } else {
      vscode.window.showInformationMessage('You are not currently working in a Git repository');
    }

  });

  context.subscriptions.push(disposable);
};

export function deactivate() {}
