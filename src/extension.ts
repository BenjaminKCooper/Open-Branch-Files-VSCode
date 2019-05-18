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

const compileListOfFiles = (status: SimplGit.StatusResult, diff: SimplGit.DiffResult): string[] => {
  const filesToOpen: string[] = [];

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
  return filesToOpen;
};

export const activate = async (context: vscode.ExtensionContext) => {
  const disposable = vscode.commands.registerCommand('extension.openBranchFiles', async () => {
    const mainBranch = vscode.workspace.getConfiguration('open-branch-files').get('defaultGitBranch');
    const repo = await checkForGitRepo();
    if (repo) {
      const git = SimplGit(repo);
      try {
        const diff = await git.diffSummary([`${mainBranch}...`]);
        const status = await git.status();
        const listOfFiles = compileListOfFiles(status, diff);
        if (status.current === mainBranch) {
          vscode.window.showInformationMessage(`You are currently on ${mainBranch}`);
        } else if (listOfFiles.length === 0) {
          vscode.window.showInformationMessage(`This branch is even with ${mainBranch}`);
        } else {
          listOfFiles.map((filePath) => {
            const uri = vscode.Uri.file(`${repo}/${filePath}`);
            vscode.window.showTextDocument(uri, { preview: false });
          });
        }
      } catch (error) {
        vscode.window.showInformationMessage(`You are attempting to compare against the branch ${mainBranch}, which does not exist.  Please change this in your workspace settings.`);
      }

    } else {
      vscode.window.showInformationMessage('You are not currently working in a Git repository');
    }
  });
  context.subscriptions.push(disposable);
};
