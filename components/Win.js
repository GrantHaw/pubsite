// panel chrome. term = dark terminal flavor
export default function Win({ title, term, className, bodyClass, children, as, id }) {
  const Tag = as || 'section'
  return (
    <Tag id={id} className={'win scroll-mt-6 ' + (term ? 'term ' : '') + (className || '')}>
      <div className="win-bar">
        <span className="plus" aria-hidden="true">+</span>
        <span className="truncate">{title}</span>
      </div>
      <div className={(term ? 'term-body ' : 'win-body ') + (bodyClass || '')}>{children}</div>
    </Tag>
  )
}
