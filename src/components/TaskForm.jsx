import { useState } from 'react'

const empty = { title: '', description: '', priority: 'medium', status: 'todo', due_date: '' }

export default function TaskForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState(initial || empty)
  const [saving, setSaving] = useState(false)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit({ ...form, due_date: form.due_date || null })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <input value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Task title"
        className="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
      <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Description (optional)" rows={2}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
      <div className="flex flex-wrap gap-3">
        <select value={form.priority} onChange={(e) => set('priority', e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" value={form.due_date || ''} onChange={(e) => set('due_date', e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save task'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
