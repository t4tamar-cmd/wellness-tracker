import { useEffect, useState, useCallback } from 'react'
import StatsPanel from './StatsPanel'
import FilterBar from './FilterBar'
import AppCard from './AppCard'

const API = window.location.hostname === 'localhost'
  ? '/api'
  : 'https://wellness-tracker-production-9001.up.railway.app/api'

export default function Dashboard() {
  const [companies, setCompanies] = useState([])
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState({})
  const [scanning, setScanning] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scanMsg, setScanMsg] = useState(null)
  const [reportMsg, setReportMsg] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.business_model) params.set('business_model', filters.business_model)
      if (filters.ai_usage !== undefined) params.set('ai_usage', filters.ai_usage)

      const [cRes, sRes] = await Promise.all([
        fetch(`${API}/companies?${params}`),
        fetch(`${API}/stats`),
      ])

      if (!cRes.ok || !sRes.ok) throw new Error('API error')
      const [cData, sData] = await Promise.all([cRes.json(), sRes.json()])
      setCompanies(cData)
      setStats(sData)
      setError(null)
    } catch (e) {
      setError('Could not reach the backend. Make sure the API server is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleScan = async () => {
    setScanning(true)
    setScanMsg(null)
    try {
      const res = await fetch(`${API}/scan`, { method: 'POST' })
      if (!res.ok) throw new Error()
      setScanMsg('Scan started! Results will appear in a few minutes.')
      // Poll for updates
      setTimeout(() => { fetchData(); setScanning(false) }, 30000)
    } catch {
      setScanMsg('Failed to start scan. Check your API keys in .env.')
      setScanning(false)
    }
  }

  const handleDownloadReport = async () => {
    setDownloading(true)
    setReportMsg(null)
    try {
      const res = await fetch(`${API}/report/weekly`)
      if (res.status === 404) {
        setReportMsg('No companies found this week — nothing to download.')
        return
      }
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `wellness_report_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      setReportMsg('Failed to download report. Try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Wellness Tracker</h1>
          <p className="text-xs text-gray-400">California vitamin & wellness personalization apps</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Scan message */}
        {scanMsg && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${scanMsg.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {scanMsg}
          </div>
        )}

        {/* Report message */}
        {reportMsg && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${reportMsg.includes('Failed') || reportMsg.includes('No companies') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {reportMsg}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Stats */}
        <StatsPanel stats={stats} lastScan={stats?.latest_scan} />

        {/* Filters + scan button */}
        <FilterBar filters={filters} onChange={setFilters} onScan={handleScan} scanning={scanning} onDownloadReport={handleDownloadReport} downloading={downloading} />

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-400">Loading…</div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
            <div className="text-5xl">🔍</div>
            <p className="text-gray-500 font-medium">No companies found yet.</p>
            <p className="text-sm text-gray-400">Click "Run Scan Now" to discover wellness apps in California.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map((c) => (
              <AppCard key={c.id} company={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
