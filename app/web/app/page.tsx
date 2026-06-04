'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchMeetings, formatDate } from '@/lib/api'
import type { Meeting } from '@/lib/types'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [meetings, setMeetings] = useState<Meeting[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    // Debounce so we don't fire a request on every keystroke.
    const handle = setTimeout(() => {
      fetchMeetings(query.trim() || undefined)
        .then(setMeetings)
        .catch((e) => setError(e.message))
    }, 300)
    return () => clearTimeout(handle)
  }, [query])

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search title or notes..."
        className="w-full border rounded px-3 py-2"
        aria-label="Search meetings"
      />

      {error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : meetings === null ? (
        <div>Loading...</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {query.trim()
            ? `No meetings match "${query.trim()}".`
            : 'No meetings yet. Create one to get started.'}
        </div>
      ) : (
        <div className="bg-white rounded shadow divide-y">
          {meetings.map((m) => (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
            >
              <span className="font-medium truncate min-w-0">{m.title}</span>
              <span className="text-sm text-gray-500 ml-4 shrink-0">
                {formatDate(m.meetingDate)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
