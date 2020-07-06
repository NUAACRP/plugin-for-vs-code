const vscode = require('vscode');
const util = require('./util');

/**
 * 自动提示实现，这里模拟一个很简单的操作
 * 当输入 this.dependencies.xxx时自动把package.json中的依赖带出来
 * 当然这个例子没啥实际意义，仅仅是为了演示如何实现功能
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 * @param {*} context 
 */
function provideCompletionItems(document, position, token, context) {
    const line        = document.lineAt(position);
    const projectPath = util.getProjectPath(document);

    const lineText = line.text.substring(0, position.character);
    var test = "aaa";
    const simpleCompletion = new vscode.CompletionItem('Hello World!');

    // a completion item that inserts its text as snippet,
    // the `insertText`-property is a `SnippetString` which will be
    // honored by the editor.
    const snippetCompletion = new vscode.CompletionItem('Good part of the day');
    snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
    snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");

    // a completion item that can be accepted by a commit character,
    // the `commitCharacters`-property is set which means that the completion will
    // be inserted and then the character will be typed.
    const commitCharacterCompletion = new vscode.CompletionItem('console');
    commitCharacterCompletion.commitCharacters = ['.'];
    commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

    // a completion item that retriggers IntelliSense when being accepted,
    // the `command`-property is set which the editor will execute after 
    // completion has been inserted. Also, the `insertText` is set so that 
    // a space is inserted after `new`
    const commandCompletion = new vscode.CompletionItem('new');
    commandCompletion.kind = vscode.CompletionItemKind.Keyword;
    commandCompletion.insertText = 'new ';
    commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

    // return all completion items as array
    return [
        simpleCompletion,
        snippetCompletion,
        commitCharacterCompletion,
        commandCompletion
    ];
}


module.exports = function(context) {
	const provider1 = vscode.languages.registerCompletionItemProvider('plaintext', {

		provideCompletionItems(document, position, token, context) {

			// a simple completion item which inserts `Hello World!`
			const simpleCompletion = new vscode.CompletionItem('Hello World!');

			// a completion item that inserts its text as snippet,
			// the `insertText`-property is a `SnippetString` which will be
			// honored by the editor.
			const snippetCompletion = new vscode.CompletionItem('Good part of the day');
			snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
			snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");

			// a completion item that can be accepted by a commit character,
			// the `commitCharacters`-property is set which means that the completion will
			// be inserted and then the character will be typed.
			const commitCharacterCompletion = new vscode.CompletionItem('console');
			commitCharacterCompletion.commitCharacters = ['.'];
			commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

			// a completion item that retriggers IntelliSense when being accepted,
			// the `command`-property is set which the editor will execute after 
			// completion has been inserted. Also, the `insertText` is set so that 
			// a space is inserted after `new`
			const commandCompletion = new vscode.CompletionItem('new');
			commandCompletion.kind = vscode.CompletionItemKind.Keyword;
			commandCompletion.insertText = 'new ';
			commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

			// return all completion items as array
			return [
				simpleCompletion,
				snippetCompletion,
				commitCharacterCompletion,
				commandCompletion
			];
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'plaintext',
		{
			provideCompletionItems(document, position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('console.')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
				];
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(provider1, provider2);
};