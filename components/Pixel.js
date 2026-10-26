// hand drawn pixel icons. each row is a string, letters map to colors, . = clear
const pal = { k: '#2a0822', p: '#ff3ea5', b: '#ffc2e2', l: '#c6ff3d', v: '#9b5cff', i: '#9fe8ff', w: '#ffffff', s: '#b9bccb' }

const art = {
  home: [
    '....kk....',
    '...kppk...',
    '..kppppk..',
    '.kppppppk.',
    'kkbbbbbbkk',
    '.kbbkkbbk.',
    '.kbbkikbk.',
    '.kbbkikbk.',
    '.kkkkkkkk.',
  ],
  folder: [
    'kkkk......',
    'kbbbk.....',
    'kkkkkkkkkk',
    'kppppppppk',
    'kppppppppk',
    'kppppppppk',
    'kppppppppk',
    'kkkkkkkkkk',
  ],
  floppy: [
    'kkkkkkkkk.',
    'kvsssskvk.',
    'kvsssskvkk',
    'kvvvvvvvvk',
    'kvwwwwwwvk',
    'kvwkkkkwvk',
    'kvwwwwwwvk',
    'kkkkkkkkkk',
  ],
  mail: [
    'kkkkkkkkkk',
    'kpwwwwwwpk',
    'kwpwwwwpwk',
    'kwwppppwwk',
    'kwwwwwwwwk',
    'kwwwwwwwwk',
    'kkkkkkkkkk',
  ],
  term: [
    'kkkkkkkkkk',
    'kssssssssk',
    'kkkkkkkkkk',
    'kklkkkkkkk',
    'kkklkkkkkk',
    'kklkklllkk',
    'kkkkkkkkkk',
  ],
  star: [
    '....k....',
    '...klk...',
    'kkkklkkkk',
    'kllllllk.',
    '.kllllk..',
    '.klkklk..',
    'kkk..kkk.',
  ],
  note: [
    '...kkkkk',
    '...kllllk',
    '...kkkkkk',
    '...k...kk',
    '...k...kk',
    '.kkk..kkk',
    'kllk.kllk',
    'kllk.kllk',
    '.kk...kk.',
  ],
  page: [
    'kkkkkk...',
    'kwwwwkk..',
    'kwkkwwkk.',
    'kwwwwwwk.',
    'kwkkkkwk.',
    'kwwwwwwk.',
    'kwkkkkwk.',
    'kkkkkkkk.',
  ],
}

export default function Pixel({ name, size, className }) {
  const a = art[name] || art.page
  const w = Math.max.apply(null, a.map((r) => r.length))
  const h = a.length
  const px = size || 2 // px per pixel
  const rects = []
  a.forEach((row, y) => row.split('').forEach((c, x) => {
    if (pal[c]) rects.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill={pal[c]} />)
  }))
  return (
    <svg width={w * px} height={h * px} viewBox={'0 0 ' + w + ' ' + h} shapeRendering="crispEdges" aria-hidden="true" className={className}>{rects}</svg>
  )
}
