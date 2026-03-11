export default function StatsPanel({ stats, lastScan }) {
  if (!stats) return null

  const aiPct = stats.total > 0 ? Math.round((stats.ai_count / stats.total) * 100) : 0

  const modelColors = {
    subscription: 'bg-blue-100 text-blue-800',
    freemium: 'bg-green-100 text-green-800',
    'one-time': 'bg-yellow-100 text-yellow-800',
    marketplace: 'bg-purple-100 text-purple-800',
    B2B: 'bg-orange-100 text-orange-800',
    unknown: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total found</p>
        <p className="text-4xl font-bold text-gray-800">{stats.total}</p>
        {lastScan && (
          <p className="text-xs text-gray-400">
            Last scan: {new Date(lastScan).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* AI Usage */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Using AI</p>
        <p className="text-4xl font-bold text-indigo-600">{stats.ai_count}</p>
        <p className="text-xs text-gray-400">{aiPct}% of total</p>
      </div>

      {/* Business Models */}
      <div className="bg-white rounded-2xl shadow p-5 col-span-2 flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Business models</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.business_models).map(([model, count]) => (
            <span
              key={model}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${modelColors[model] || 'bg-gray-100 text-gray-600'}`}
            >
              {model}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
