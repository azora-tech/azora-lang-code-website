import { useRef, useEffect } from 'react'

export default function ConsoleOutput({ messages }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!messages || messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-az-60 text-sm font-mono">
        Run your code to see output here.
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-4 font-mono text-sm leading-relaxed">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={
            msg.type === 'error' ? 'text-pastel-red' :
            msg.type === 'info' ? 'text-pastel-teal' :
            'text-az-15'
          }
        >
          {msg.text}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
