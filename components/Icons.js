// lil file icons for the blog explorer
export function FolderIco() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" aria-hidden="true">
      <path d="M1 4a2 2 0 0 1 2-2h7l3 3h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" fill="#ffc2e2" stroke="#3a0a2e" strokeWidth="1.5" />
      <path d="M1 8h26" stroke="#3a0a2e" strokeWidth="1.5" />
    </svg>
  )
}

export function FileIco({ kind }) {
  const c = { md: '#9fe8ff', pdf: '#ff3ea5', img: '#d9dce6', file: '#ffffff' }[kind] || '#fff'
  const t = { md: 'MD', pdf: 'PDF', img: 'IMG', file: '' }[kind] || ''
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" aria-hidden="true">
      <path d="M2 2h13l7 7v17H2z" fill="#fff" stroke="#3a0a2e" strokeWidth="1.5" />
      <path d="M15 2v7h7" fill="none" stroke="#3a0a2e" strokeWidth="1.5" />
      <rect x="2" y="15" width="20" height="9" fill={c} stroke="#3a0a2e" strokeWidth="1.5" />
      <text x="12" y="22.2" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#3a0a2e" fontFamily="sans-serif">{t}</text>
    </svg>
  )
}
