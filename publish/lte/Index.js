"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liteTE = void 0;
const START_TOKEN = "{%";
const END_TOKEN = "%}";
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Text"] = 0] = "Text";
    TokenType[TokenType["Code"] = 1] = "Code";
})(TokenType || (TokenType = {}));
function* LiteTEGenerator(source) {
    let nextToken = START_TOKEN; // Next token to look for
    let nbTokens = 0; // Total number of token parsed
    let scanIndex = 0; // Current ursor index in the source
    let targetIndex = 0;
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
        if (targetIndex === -1)
            break;
    } while (true);
    yield {
        type: TokenType.Text,
        text: source.substr(scanIndex)
    };
}
function liteTE(source, context = {}) {
    let fctBody = `
  const LF   = "\\n";\n
  let output = "";\n\n`;
    for (let token of LiteTEGenerator(source)) {
        switch (token.type) {
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
    fctBody += `return output;`;
    return new Function(fctBody).call(context);
}
exports.liteTE = liteTE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLE1BQU0sU0FBUyxHQUFLLElBQUksQ0FBQztBQUV6QixJQUFLLFNBR0o7QUFIRCxXQUFLLFNBQVM7SUFDWix5Q0FBSSxDQUFBO0lBQ0oseUNBQUksQ0FBQTtBQUNOLENBQUMsRUFISSxTQUFTLEtBQVQsU0FBUyxRQUdiO0FBRUQsUUFBUSxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQWM7SUFDdEMsSUFBSSxTQUFTLEdBQUssV0FBVyxDQUFFLENBQUMseUJBQXlCO0lBQ3pELElBQUksUUFBUSxHQUFNLENBQUMsQ0FBWSxDQUFDLCtCQUErQjtJQUMvRCxJQUFJLFNBQVMsR0FBSyxDQUFDLENBQVksQ0FBQyxvQ0FBb0M7SUFDcEUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFZO0lBRS9CLEdBQUc7UUFDRCxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2RCxJQUFJLFdBQVcsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN0QixNQUFNO2dCQUNKLElBQUksRUFBRSxTQUFTLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSTtnQkFDakUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQzthQUMvQyxDQUFDO1lBQ0YsU0FBUyxHQUFHLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDNUIsU0FBUyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsSUFBSSxXQUFXLEtBQUssQ0FBQyxDQUFDO1lBQUUsTUFBTTtLQUMvQixRQUFRLElBQUksRUFBRTtJQUVmLE1BQU07UUFDSixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7UUFDcEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO0tBQy9CLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBZ0IsTUFBTSxDQUFDLE1BQWMsRUFBRSxVQUFlLEVBQUU7SUFDdEQsSUFBSSxPQUFPLEdBQUc7O3VCQUVPLENBQUM7SUFDdEIsS0FBSSxJQUFJLEtBQUssSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDeEMsUUFBTyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssU0FBUyxDQUFDLElBQUk7Z0JBQ2pCLE9BQU8sSUFBSSxlQUFlLEtBQUssQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2pELE1BQU07WUFDUixLQUFLLFNBQVMsQ0FBQyxJQUFJO2dCQUNqQixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUM5QixPQUFPLElBQUksYUFBYSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztvQkFDdEQsTUFBTTtpQkFDUDtnQkFDRCxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQzdCLE1BQU07U0FDVDtLQUNGO0lBRUQsT0FBTyxJQUFJLGdCQUFnQixDQUFBO0lBQ3pCLE9BQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFyQkQsd0JBcUJDIn0=