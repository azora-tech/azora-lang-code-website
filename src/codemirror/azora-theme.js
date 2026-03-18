import { EditorView } from '@codemirror/view'

export const azoraTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1A1A1A',
    color: '#FBFBFB',
  },
  '.cm-content': {
    caretColor: '#D14EEA',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#D14EEA',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#4E93EA33',
  },
  '.cm-panels': {
    backgroundColor: '#202020',
    color: '#FBFBFB',
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '1px solid #313131',
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: '1px solid #313131',
  },
  '.cm-searchMatch': {
    backgroundColor: '#FFC10744',
    outline: '1px solid #FFC10766',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#4EC96244',
  },
  '.cm-activeLine': {
    backgroundColor: '#262626',
  },
  '.cm-selectionMatch': {
    backgroundColor: '#4E93EA22',
  },
  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: '#4E93EA44',
  },
  '.cm-gutters': {
    backgroundColor: '#1A1A1A',
    color: '#4C4C4C',
    borderRight: '1px solid #262626',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#262626',
    color: '#9B9B9B',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: '#313131',
    border: 'none',
    color: '#818181',
  },
  '.cm-tooltip': {
    backgroundColor: '#262626',
    border: '1px solid #313131',
    color: '#FBFBFB',
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: '#313131',
    borderBottomColor: '#313131',
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: '#262626',
    borderBottomColor: '#262626',
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: '#4E93EA33',
    },
  },
}, { dark: true })

import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const azoraHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#D16B8E' },
  { tag: tags.operator, color: '#D14EEA' },
  { tag: tags.variableName, color: '#FBFBFB' },
  { tag: tags.function(tags.variableName), color: '#5BA3D0' },
  { tag: tags.special(tags.variableName), color: '#5BA3D0' },
  { tag: tags.typeName, color: '#5FA89F' },
  { tag: tags.atom, color: '#D4A574' },
  { tag: tags.number, color: '#D4A574' },
  { tag: tags.string, color: '#7DBF8A' },
  { tag: tags.meta, color: '#E6C96B' },
  { tag: tags.comment, color: '#676767' },
  { tag: tags.lineComment, color: '#676767' },
  { tag: tags.blockComment, color: '#676767' },
  { tag: tags.punctuation, color: '#9B9B9B' },
  { tag: tags.invalid, color: '#E63946' },
])

export const azoraHighlight = syntaxHighlighting(azoraHighlightStyle)
