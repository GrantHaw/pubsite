export default function Footer() {
  return (
    <footer className="border-t-2 border-[var(--plum)]" style={{ background: 'var(--chrome)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 text-[14px]">&copy; {new Date().getFullYear()} Grant Hawerlander</div>
    </footer>
  )
}
