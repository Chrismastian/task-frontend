import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/AuthContext'
import api from '../lib/api'
import TaskForm from '../components/TaskForm'
import TaskCard from '../components/TaskCard'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    const params = {}
    if (filter !== 'all') params.status = filter
    if (search) params.search = search
    const res = await api.get('/tasks', { params })
    setTasks(res.data)
    setLoading(false)
  }, [filter, search])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function createTask(data) {
    const res = await api.post('/tasks', data)
    setTasks((t) => [res.data, ...t])
    setShowForm(false)
  }

  async function updateTask(id, data) {
    const res = await api.put(`/tasks/${id}`, data)
    setTasks((t) => t.map((task) => (task.id === id ? res.data : task)))
  }

  async function deleteTask(id) {
    if (!confirm('Delete this task?')) return
    await api.delete(`/tasks/${id}`)
    setTasks((t) => t.filter((task) => task.id !== id))
  }

  const counts = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:inline">{user?.name}</span>
            <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My tasks</h2>
            <p className="text-sm text-gray-500">{counts.done} of {counts.total} completed</p>
          </div>
          <button onClick={() => setShowForm((s) => !s)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            {showForm ? 'Cancel' : '+ New task'}
          </button>
        </div>

        {showForm && <TaskForm onSubmit={createTask} onCancel={() => setShowForm(false)} />}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg bg-gray-200 p-1">
            {FILTERS.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`rounded-md px-3 py-1 text-sm ${filter === f.key ? 'bg-white font-medium text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
        </div>

        {loading ? (
          <p className="py-12 text-center text-gray-400">Loading…</p>
        ) : tasks.length === 0 ? (
          <p className="py-12 text-center text-gray-400">No tasks yet. Create one to get started.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
