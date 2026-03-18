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
          },
        },
      },
    },
    number: /\b\d[\d_]*(?:\.[\d_]+)?\b/,
    'type-keyword': {
      pattern: /\b(?:Int|Real|Bool|String|Unit|Type|ReturnType)\b/,
      alias: 'class-name',
    },
    'builtin-fn': {
      pattern: /\b(?:print|println|delay|hasDeco|getDeco|platform|toString|toInt|toReal|promote!)\b/,
      alias: 'builtin',
    },
    boolean: /\b(?:true|false)\b/,
    'null-literal': {
      pattern: /\bnull\b/,
      alias: 'boolean',
    },
    keyword: /\b(?:var|fin|func|hook|test|if|else|for|loop|while|in|as|is|when|return|break|continue|expose|confine|inline|enum|slot|pack|impl|infx|deco|scope|package|use|flip|flop|by|typealias|spec|where|each|type|let|task|suspend|flow|yield|launch|async|await|assert|trace|with|self|prop|it|fail|try|catch|defer|alloc|drop)\b/,
    'type-name': {
      pattern: /\b[A-Z][a-zA-Z0-9_]*\b/,
      alias: 'class-name',
    },
    function: {
      pattern: /\b[a-z_]\w*(?=\s*[\(<])/,
    },
    operator: /\.\.\.?|->|::|[+\-*/%]=?|&&|\|\||[<>!=]=?|!|\?\?|\?=|\?[+\-*/%]=|\?\+\+|\?--/,
    punctuation: /[{}[\]();:.,<>?]/,
  }
}
azora.displayName = 'azora'
azora.aliases = []
