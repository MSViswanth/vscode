/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class OpenImageInNewEditorCommand implements Command {
	public readonly id = '_markdown.openImageInNewEditor';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
		private _currentPanel: vscode.WebviewPanel | undefined = undefined
	) { }

	public execute(args: { id: string; resource: string }) {
		const columnToShowIn = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;
		const source = vscode.Uri.parse(args.resource);
		if (this._currentPanel) {
			// If we already have a panel, show it in the target column
			this._currentPanel.reveal(columnToShowIn);
		} else {
			this._currentPanel = vscode.window.createWebviewPanel(
				'opemImage', // Identifies the type of the webview. Used internally
				'Image', // Title of the panel displayed to the user
				vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
				{}
			);
		}
		// console.log(source);
		this._webviewManager.findPreview(source)?.openImageInNewEditor(args.id);
		this._currentPanel.webview.html = getWebviewContent(1);
	}
}
function getWebviewContent(imgId: number): string {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cat Coding</title>
	</head>
	<body>
		<img src="${[imgId]}" width="300" />
	</body>
	</html>`;
}

