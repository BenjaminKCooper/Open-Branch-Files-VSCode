// import * as assert from 'assert';
// import * as SimpleGit from  'simple-git/promise';
// import * as fs from 'fs-extra';

// // You can import and use all API from the 'vscode' module
// // as well as import your extension to test it
// import * as vscode from 'vscode';
// // import * as myExtension from '../extension';

// const PATH_TO_TESTS_FOLDER = './testing-sample-project';
// const git = SimpleGit(PATH_TO_TESTS_FOLDER);

// const initRepo = async (): Promise<boolean> => {
//   git.init();
//   await fs.appendFile(`${PATH_TO_TESTS_FOLDER}/index.js`, "console.log('hiiii')");
//   return true;
// };

// const getNumberOfOpenFiles = async () => {

// };

// const checkIsRepo = async (): Promise<boolean> => {
//   return await git.checkIsRepo();
// };

// const cleanTestProjectUp = async (): Promise<boolean> => {
//   await fs.remove(`${PATH_TO_TESTS_FOLDER}/.git`);
//   return true;
// };

// // Defines a Mocha test suite to group tests of similar kind together
// suite('Extension Tests',  async () => {
//   await initRepo();
//   const blah = await checkIsRepo();
//   console.log(blah);
//   test('Should open no files on master', async (): Promise<any> => {
//     return new Promise(assert.strictEqual(3, 3));
//   });
//   await cleanTestProjectUp();
// });
