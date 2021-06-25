import vscode from 'vscode';

import { footnoteRefRegex, buildFootnoteContentRegex } from '../utils';
import createRangeFromFootnoteMatch from '../utils/createRangeFromFootnoteMatch';

export default class FootnoteDeclarationProvider implements vscode.DeclarationProvider {
  provideDeclaration(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Declaration> {
    const range = document.getWordRangeAtPosition(position, footnoteRefRegex);
    if (!range) {
      return null;
    }

    const footnoteRefText = document.getText(range);
    const footnoteName = footnoteRefText.slice(2, footnoteRefText.length - 1);

    const contentRegex = buildFootnoteContentRegex(footnoteName);
    const match = document.getText().match(contentRegex);

    if (!match) {
      return null;
    }

    return new vscode.Location(document.uri, createRangeFromFootnoteMatch(document, match));
  }
}
