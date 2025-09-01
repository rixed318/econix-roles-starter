import { runDiagnostics } from '../core/diagnostics'
import { useMemo } from 'react'

export default function HealthPage() {
  const diags = useMemo(() => runDiagnostics(), [])
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Health</h1>
      {diags.length === 0 ? (
        <div className="p-4 rounded bg-green-50 border">Проблем не обнаружено ✅</div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 rounded bg-yellow-50 border">
            Найдено предупреждений/ошибок: <b>{diags.length}</b>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead><tr><th className="text-left p-2">File</th><th className="text-left p-2">Path</th><th className="text-left p-2">Message</th></tr></thead>
              <tbody>
                {diags.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{d.file}</td>
                    <td className="p-2 font-mono">{d.path}</td>
                    <td className="p-2">{d.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="px-3 py-2 rounded border"
            onClick={() => {
              const md = diags.map(d => `- **${d.file}** \`${d.path}\`: ${d.message}`).join('\n')
              navigator.clipboard.writeText(md)
            }}
          >
            Скопировать отчёт
          </button>
        </div>
      )}
    </div>
  )
}
