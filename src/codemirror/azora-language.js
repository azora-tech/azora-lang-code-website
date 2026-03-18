import { StreamLanguage } from '@codemirror/language'

const keywords = new Set([
  'var', 'fin', 'func', 'hook', 'test', 'if', 'else', 'for', 'loop', 'while',
  'in', 'as', 'is', 'when', 'return', 'break', 'continue', 'expose', 'confine',
  'inline', 'enum', 'slot', 'pack', 'impl', 'infx', 'deco', 'scope', 'package',
  'use', 'flip', 'flop', 'by', 'typealias', 'spec', 'where', 'each', 'type',
  'let', 'task', 'suspend', 'flow', 'yield', 'launch', 'async', 'await',
  'assert', 'trace', 'with', 'self', 'prop', 'it',
  'fail', 'try', 'catch', 'defer',
])

const types = new Set([
  'Int', 'Real', 'Bool', 'String', 'Unit', 'Type', 'ReturnType',
])

const builtins = new Set([
  'print', 'println', 'delay', 'hasDeco', 'getDeco', 'platform',
  'toString', 'toInt', 'toReal',
])

const atoms = new Set(['true', 'false', 'null'])

const azoraStreamParser = {
  startState() {
    return { inString: false, inBlockComment: 0, inDocComment: false }
  },

  token(stream, state) {
    // Block/doc comments
    if (state.inBlockComment > 0 || state.inDocComment) {
      while (!stream.eol()) {
        if (stream.match('*/')) {
          if (state.inDocComment) state.inDocComment = false
          else state.inBlockComment--
          return state.inDocComment ? 'comment' : 'comment'
        }
        if (stream.match('/*')) {
          state.inBlockComment++
        } else {
          stream.next()
        }
      }
      return state.inDocComment ? 'meta' : 'comment'
    }

    if (stream.eatSpace()) return null

    // Doc comment start
    if (stream.match('/**')) {
      if (stream.match('/')) return 'comment' // /**/
      state.inDocComment = true
      return 'meta'
    }

    // Block comment start
    if (stream.match('/*')) {
      state.inBlockComment++
      return 'comment'
    }

    // Line comment
    if (stream.match('//')) {
      stream.skipToEnd()
      return 'lineComment'
    }

    // Decorator
    if (stream.match(/@\w+/)) {
      stream.match(/(?::[\w.]+)?(?:\([^)]*\))?/)
      return 'meta'
    }

    // String
    if (stream.match('"')) {
      while (!stream.eol()) {
        const ch = stream.next()
        if (ch === '\\') {
          stream.next()
        } else if (ch === '$') {
          if (stream.peek() === '{') {
            // string interpolation — just color the whole string for simplicity
          }
        } else if (ch === '"') {
          return 'string'
        }
      }
      return 'string'
    }

    // Numbers
    if (stream.match(/\b\d[\d_]*(?:\.[\d_]+)?\b/)) {
      return 'number'
    }

    // Operators
    if (stream.match(/\.\.\.?|->|::|&&|\|\||[<>!=]=?|[+\-*/%]=?|\?\??/)) {
      return 'operator'
    }

    // Punctuation
    if (stream.match(/[{}[\]();:.,<>?]/)) {
      return 'punctuation'
    }

    // Identifiers and keywords
    if (stream.match(/[a-zA-Z_]\w*!?/)) {
      const word = stream.current().replace(/!$/, '')
      if (keywords.has(word)) return 'keyword'
      if (types.has(word)) return 'typeName'
      if (builtins.has(word)) return 'variableName.special'
      if (atoms.has(word)) return 'atom'
      if (/^[A-Z]/.test(word)) return 'typeName'
      // Check if followed by ( — function call
      if (stream.peek() === '(') return 'variableName.function'
      return 'variableName'
    }

    stream.next()
    return null
  },
}

export const azoraLanguage = StreamLanguage.define(azoraStreamParser)
