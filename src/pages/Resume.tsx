import { useState } from 'react'

export default function ResumePage(){
  const [state,set]=useState({ name:'', role:'', location:'', contacts:'', summary:'', skills:'', projects:'', experience:'', education:'' })
  const on = (k:keyof typeof state)=>(e:any)=>set({ ...state, [k]: e.target.value })

  const md = [
    `# ${state.name} — ${state.role}`,
    state.location ? `**Локация:** ${state.location}` : '',
    state.contacts ? `**Контакты:** ${state.contacts}` : '',
    '',
    state.summary ? `## Summary\n${state.summary}\n` : '',
    state.skills ? `## Skills\n${state.skills}\n` : '',
    state.projects ? `## Projects\n${state.projects}\n` : '',
    state.experience ? `## Experience\n${state.experience}\n` : '',
    state.education ? `## Education\n${state.education}\n` : '',
  ].filter(Boolean).join('\n')

  const save = () => {
    const blob = new Blob([md], { type:'text/markdown;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `resume-${(state.name||'me').replace(/\s+/g,'-').toLowerCase()}.md`
    a.click(); URL.revokeObjectURL(a.href)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Resume Builder (Markdown)</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {['name','role','location','contacts','summary','skills','projects','experience','education'].map((k)=> (
          <div key={k} className="card">
            <label className="text-sm font-medium block mb-1">{k}</label>
            <textarea rows={k==='summary'||k==='projects'||k==='experience'||k==='education'?6:2}
              className="w-full border rounded px-3 py-2" value={(state as any)[k]} onChange={on(k as any)} />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="font-semibold mb-2">Preview (Markdown)</div>
        <pre className="whitespace-pre-wrap text-sm">{md}</pre>
        <button className="mt-3 px-3 py-2 rounded border" onClick={save}>Скачать .md</button>
      </div>
    </div>
  )
}
