const MODEL_STYLES = {
  subscription: 'bg-blue-100 text-blue-700',
  freemium: 'bg-green-100 text-green-700',
  'one-time': 'bg-yellow-100 text-yellow-700',
  marketplace: 'bg-purple-100 text-purple-700',
  B2B: 'bg-orange-100 text-orange-700',
  unknown: 'bg-gray-100 text-gray-500',
}

export default function AppCard({ company }) {
  const modelStyle = MODEL_STYLES[company.business_model] || MODEL_STYLES.unknown
  const domain = (() => {
    try { return new URL(company.url).hostname.replace('www.', '') }
    catch { return company.url }
  })()

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-md transition p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-800 text-base leading-tight">{company.name}</h3>
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-500 hover:underline"
          >
            {domain}
          </a>
        </div>

        {/* AI badge */}
        {company.ai_usage ? (
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
            AI
          </span>
        ) : (
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-xs">
            No AI
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed flex-1">{company.description}</p>

      {/* AI details */}
      {company.ai_details && (
        <p className="text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">
          {company.ai_details}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${modelStyle}`}>
          {company.business_model || 'unknown'}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(company.scan_date).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}
