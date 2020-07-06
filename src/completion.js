const vscode = require('vscode');
const util = require('./util');

/**
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 * @param {*} context 
 */
const provider = vscode.languages.registerCompletionItemProvider(
	'java',
	{
		provideCompletionItems(document, position, token, context) {
			
			//get whole document until currect position
			let range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(position.line, position.character)) 
			let source_code = document.getText(range)


			var regex_str = new RegExp("((['\"])(?:(?!\\2|\\\\).|\\\\.){0,}\\2)", "g"); //Replace String Literals
			source_code = source_code.replace(regex_str, '"StringLiteral"');
			
			var regex_comment = new RegExp("//[^\\n]{0,}|/\\*(?:[^\\*]|\\*(?!/)){0,}\\*/", "g"); // Removing Comments
			source_code = source_code.replace(regex_comment, ' ');

			source_code = source_code.replace(/[ \n\t\r]+/g," "); // Replacing blank spaces and new lines

			source_code = source_code.trim().split(' '); //split the tokens stream
			
			let code_context = source_code.slice(Math.max(source_code.length - 20, 0)) // extract the context 
			code_context = code_context.join('<$>') // prepare the context for query
			//console.log(code_context)
				
			const fetch = require("node-fetch");

			// This function returns a promise object 
			const getSuggestions = async url => {
			try {
				const response = await fetch(url);
				const json = await response.json();
				//console.log(json);
				
				//converting json to completionItems 
				var completionItems = [];
				let count = 1
				json.forEach(element => {
					var completionItem = new vscode.CompletionItem(count+": "+String(element));
					completionItem.filterText = String(element);
					completionItem.insertText = String(element);
					completionItems.push(completionItem);
					count += 1
				});

				return completionItems //return completions as Promise object

			} catch (error) {
				//console.log(error);
				//console.log('Server Connection Issue...');
				vscode.window.showInformationMessage('Server Connection Issue...');
			}
			};
			
			const url = "http://127.0.0.1:80/suggestion?code=" + code_context +" "; //for local server
			//vscode.window.showInformationMessage(code_context);
			return  getSuggestions(url)

		}
		
	} //,'.' // triggered whenever a '.' is being typed
);

module.exports = function(context) {

	context.subscriptions.push(provider);
};

