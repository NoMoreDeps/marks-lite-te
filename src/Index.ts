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
function checkOutput(source: string) {
  source = source.replace(/javascript\w*:/g, "");

  return source;
}

function checkInput(source: string) {
  const rules = [
    /require\w*\(/      , // Prevent the use of require
    /import.*?from/     , // Prevent the use of import
    /\$/                , // Prevent the use of $
    /jQuery/            , // Prevent the use of jQuery
    /window/            , // Prevent the use of window
    /global/            , // Prevent the use of global
    /document/          , // Prevent the use of document
    /console/           , // Prevent the use of console
    /Function/          , // Prevent the use of Function
    /localStorage/      , // Prevent the use of sessionStorage
    /sessionStorage/    , // Prevent the use of sessionStorage
    /indexedDB/         , // Prevent the use of indexedDB
    /File/              , // Prevent the use of File
    /FileReader/        , // Prevent the use of FileReader
    /new\s+/            , // Prevent the use new keyword
    /eval\s*\(/         , // Prevent the use of eval
    /fetch\s*\(/        , // Prevent fetching data
    /\.\s*call\s*\(/    , // Prevent calling function with call
    /\.\s*bind\s*\(/    , // Prevent bind function
    /\.\s*apply\s*\(/   , // Prevent calling function with apply
    /\(.*?\)\s*\(.*?\)/ , // Prevent inline function call ex: (() => ...)() or (...)() pattern
    /XMLHttpRequest/    , // Prevent using XMLHttpRequest object
    /\[.*?\]\s*\(/        // Prevent running function from indexed properties like XXX[ZZZ]()
  ];

  rules.forEach(_ => {
    if (_.test(source)) throw Error(`Template cannot be safely parsed, ${_.exec(source)![0]} is not allowed`);
  });
}

export function liteTE(source: string, options?: {
  context           ?: any,
  allowUnsafeSource ?: boolean
}) {

  options                   = options ?? { context: {}, allowUnsafeSource: false} ;
  options.context           = options.context ?? {}                               ;
  options.allowUnsafeSource = !!options.allowUnsafeSource                         ;

  let fctBody = `
  function rmTags(source) {
    var tags = {
      '&': '&amp;' ,
      '<': '&lt;'  ,
      '>': '&gt;'
    };
  
    return source.replace(/[&<>]/g, function(tag) {
      return tags[tag] || "";
    });
  }
  const LF   = "\\n";\n
  let output = "";\n\n`;
  for(let token of LiteTEGenerator(source)) {
    switch(token.type) {
      case TokenType.Text:
        fctBody += `output += \`${token.text}\`;` + "\n";
        break;
      case TokenType.Code:
        if (token.text.startsWith("=")) {
          fctBody += `output += rmTags(${token.text.slice(1)});` + "\n";
          break;
        }
        fctBody += token.text + "\n";
        break;
    }
  }

  fctBody += `return output;`
  !options.allowUnsafeSource && checkInput(fctBody);
  return checkOutput(new Function(fctBody).call(options.context));
}  