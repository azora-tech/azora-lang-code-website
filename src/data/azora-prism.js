/** Azora language definition for Prism / refractor */
export default function azora(Prism) {
  Prism.languages.azora = {
    'doc-comment': {
      pattern: /\/\*\*(?!\/)[\s\S]*?\*\//,
      greedy: true,
      inside: {
        'doc-tag': /\B@(?:param|return|since|throws|file)\b/,
        'doc-param-name': {
          pattern: /(@param\s+)\w+/,
          lookbehind: true,
        },
      },
    },
    comment: [
      { pattern: /\/\/.*/, greedy: true },
      { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
    ],
    decorator: {
      pattern: /@\w+(?::[\w.]+)?(?:\([^)]*\))?/,
      alias: 'annotation',
    },
    preprocessor: {
      pattern: /\$\w+/,
      alias: 'variable',
    },
    string: {
      pattern: /"(?:[^"\\]|\\[\s\S])*"/,
      greedy: true,
      inside: {
        interpolation: {
          pattern: /\$\{[^}]*\}|\$[a-zA-Z_]\w*/,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\$\{?|\}$/,
              alias: 'punctuation',
            },
            keyword: /\b(?:self|this|it)\b/,
            punctuation: /[.]/,
          },
        },
      },
    },
    number: /\b\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?[fFLlduUsSbB]?\b/,
    'type-keyword': {
      pattern: /\b(?:Int|Real|Bool|String|Unit|Type|ReturnType|Byte|Short|Long|UInt|ULong|UByte|UShort|Float|Decimal|Char|Size|USize|Cent|UCent|Nothing|Any)\b/,
      alias: 'class-name',
    },
    'builtin-fn': {
      pattern: /\b(?:print|println|delay|hasDeco|getDeco|decoTargets|platform|toString|toInt|toReal|toChar|stringLength|charAt|ord|chr|promote)\b/,
      alias: 'builtin',
    },
    boolean: /\b(?:true|false)\b/,
    'null-literal': {
      pattern: /\bnull\b/,
      alias: 'boolean',
    },
    keyword: /\b(?:var|fin|func|hook|test|if|else|for|loop|while|in|as|is|when|return|break|continue|expose|confine|protect|inline|deepinline|noinline|enum|slot|pack|impl|infx|deco|scope|package|use|flip|flop|by|typealias|spec|where|each|type|let|task|suspend|flow|yield|launch|async|await|assert|trace|with|self|this|base|prop|it|fail|try|catch|defer|alloc|drop|node|repl|leaf|ctor|dtor|threadlocal|oper|ref|mut|dyn|out|solo|inject|wrap|bind|lazy|rem|view|effect|guard|throw|rescue|bridge|unsafe|region|isolated|reverse)\b/,
    'type-name': {
      pattern: /\b[A-Z][a-zA-Z0-9_]*\b/,
      alias: 'class-name',
    },
    function: {
      pattern: /\b[a-z_]\w*(?=\s*[\(<])/,
    },
    operator: /\.\.<?|\.\.\.?|->|::|[+\-*/%]=?|&&|\|\||[<>!=]=?|!|\?\?|\?\.|\?=|\?[+\-*/%]=|\?\+\+|\?--|[&|^~]|<<=?|>>=?/,
    punctuation: /[{}[\]();:.,<>?]/,
  }
}
azora.displayName = 'azora'
azora.aliases = []
