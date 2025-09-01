import { useEffect, useMemo, useState } from 'react'

export default function PathPage(){
  const [role,setRole]=useState('Frontend Engineer')
  const [data,setData]=useState<any|null>(null)

  useEffect(()=>{
    const url = `${import.meta.env.BASE_URL}data/paths/${encodeURIComponent(role)}.json`
    fetch(url).then(r=>r.ok?r.json():null).then(setData).catch(()=>setData(null))
  },[role])

  const md = useMemo(()=>{
    if(!data) return ''
    const lines = [
      `# Learning Path — ${data.role}`,
      `Срок: ${data.durationDays} дней`,
      ''
    ]
    for (const w of data.weeks) {
      lines.push(`## ${w.title}`)
      for (const it of w.items) lines.push(`- ${it}`)
      lines.push('')
    }
    return lines.join('\n')
  },[data])

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Учебный маршрут</h1>
      <select className="border rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
        {['Frontend Engineer','Backend Engineer','ML Engineer','DevOps/SRE','Security Engineer','Mobile Developer (Flutter)'].map(r=><option key={r}>{r}</option>)}
      </select>

      {data ? (
        <div className="card">
          <div className="space-y-4">
            {data.weeks.map((w:any,i:number)=>(
              <div key={i}>
                <div className="font-semibold">{w.title}</div>
                <ul className="list-disc pl-5 text-sm">{w.items.map((it:string,idx:number)=><li key={idx}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="px-3 py-2 rounded border" onClick={()=>{
              const blob = new Blob([md],{type:'text/markdown;charset=utf-8;'})
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
              a.download = `learning-path-${role.replace(/\s+/g,'-').toLowerCase()}.md`
              a.click(); URL.revokeObjectURL(a.href)
            }}>Скачать как Markdown</button>
          </div>
        </div>
      ) : <div className="card text-sm text-gray-600">Нет данных для роли</div>}
    </div>
  )
}
