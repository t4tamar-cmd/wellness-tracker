const BUSINESS_MODELS = ['all', 'subscription', 'freemium', 'one-time', 'marketplace', 'B2B', 'unknown']

export default function FilterBar({ filters, onChange, onScan, scanning, onDownloadReport, downloading }) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      {/* Business model filter */}
      <select
        value={filters.business_model || 'all'}
        onChange={(e) => onChange({ ...filters, business_model: e.target.value === 'all' ? '' : e.target.value })}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        {BUSINESS_MODELS.map((m) => (
          <option key={m} value={m}>
            {m === 'all' ? 'All business models' : m.charAt(0).toUpperCase() + m.slice(1)}
          </option>
        ))}
      </select>

      {/* AI usage filter */}
      <select
        value={filters.ai_usage === undefined ? 'all' : String(filters.ai_usage)}
        onChange={(e) => {
          const val = e.target.value
          onChange({ ...filters, ai_usage: val === 'all' ? undefined : val === 'true' })
        }}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="all">All AI usage</option>
        <option value="true">Uses AI</option>
        <option value="false">No AI detected</option>
      </select>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Manual scan button */}
      <button
        onClick={onScan}
        disabled={scanning}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow transition"
      >
        {scanning ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Scanning…
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 104.582 9" />
            </svg>
            Run Scan Now
          </>
        )}
      </button>

      {/* Download weekly report button */}
      <button
        onClick={onDownloadReport}
        disabled={downloading}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-700 text-sm font-semibold px-5 py-2 rounded-lg shadow border border-gray-200 transition"
      >
        {downloading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating…
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Weekly Report
          </>
        )}
      </button>
    </div>
  )
}
