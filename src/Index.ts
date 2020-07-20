const START_TOKEN = "{%";
const END_TOKEN   = "%}";

enum TokenType {
  Text,
  Code
}

function* LiteTEGenerator(source: string) {
  let nextToken   = START_TOKEN ; // Next token to look for
  let nbTokens    = 0           ; // Total number of token parsed
  let scanIndex   = 0           ; // Current ursor index in the source
  let targetIndex = 0           ;

  do {
    let targetIndex = source.indexOf(nextToken, scanIndex);
    if (targetIndex !== -1) {
      yield {
        type: nextToken === START_TOKEN ? TokenType.Text : TokenType.Code,
        text: source.substring(scanIndex, targetIndex)
      };
      scanIndex = targetIndex + 2;
      nextToken = [START_TOKEN, END_TOKEN][++nbTokens % 2];
    }
    if (targetIndex === -1) break;
  } while (true);

  yield {
    type: TokenType.Text,
    text: source.substr(scanIndex)
  }; 
}

export function liteTE(source: string, context: any = {}) {
  let fctBody = `
  const LF   = "\\n";\n
  let output = "";\n\n`;
  for(let token of LiteTEGenerator(source)) {
    switch(token.type) {
      case TokenType.Text:
        fctBody += `output += \`${token.text}\`;` + "\n";
        break;
      case TokenType.Code:
        if (token.text.startsWith("=")) {
          fctBody += `output += ${token.text.slice(1)};` + "\n";
          break;
        }
        fctBody += token.text + "\n";
        break;
    }
  }

  fctBody += `return output;`
    return new Function(fctBody).call(context);
}