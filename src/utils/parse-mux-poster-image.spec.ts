import test from 'ava'
import {
  type Params,
  parseMuxPosterImage as parse
} from './parse-mux-poster-image.js'

const macro = test.macro<[Params, string]>({
  exec: async (t, input, expected) => {
    const actual = parse(input)
    t.is(actual, expected)
  },
  title: (providedTitle = '', { thumbnailUrl, time, format, width }) => {
    return `given ${thumbnailUrl} at ${time} time in ${format} format with ${width} width ${providedTitle}`.trim()
  }
})

test(
  macro,
  {
    thumbnailUrl: 'https://image.mux.com/xyz/thumbnail.jpg'
  },
  'https://image.mux.com/xyz/thumbnail.webp?time=0'
)

test(
  macro,
  {
    thumbnailUrl: 'https://image.mux.com/xyz/thumbnail.jpg',
    time: 10.1
  },
  'https://image.mux.com/xyz/thumbnail.webp?time=10.1'
)

test(
  macro,
  {
    thumbnailUrl: 'https://image.mux.com/xyz/thumbnail.jpg',
    format: 'png'
  },
  'https://image.mux.com/xyz/thumbnail.png?time=0'
)

test(
  macro,
  {
    thumbnailUrl: 'https://image.mux.com/xyz/thumbnail.jpg',
    format: 'png',
    time: 1
  },
  'https://image.mux.com/xyz/thumbnail.png?time=1'
)

test(
  macro,
  {
    thumbnailUrl: 'https://image.mux.com/xyz/thumbnail.jpg',
    width: 100
  },
  'https://image.mux.com/xyz/thumbnail.webp?time=0&width=100&fit_mode=preserve'
)

test(
  'should ignore zero width input',
  macro,
  {
    thumbnailUrl: 'https://image.mux.com/xyz/thumbnail.jpg',
    width: 0
  },
  'https://image.mux.com/xyz/thumbnail.webp?time=0'
)

test(
  'should round up floating point width input',
  macro,
  {
    thumbnailUrl: 'https://image.mux.com/xyz/thumbnail.jpg',
    width: 100.1
  },
  'https://image.mux.com/xyz/thumbnail.webp?time=0&width=101&fit_mode=preserve'
)

test(
  'should transform only "thumbnail.[ext]" filename',
  macro,
  {
    thumbnailUrl: 'https://image.mux.com/xyz/image.jpg'
  },
  'https://image.mux.com/xyz/image.jpg'
)

test(
  'should process only Mux URLs',
  macro,
  {
    thumbnailUrl: 'https://www.datocms-assets.com/mux/xyz/thumbnail.jpg'
  },
  'https://www.datocms-assets.com/mux/xyz/thumbnail.jpg'
)

test(
  'should process only Mux image URLs',
  macro,
  {
    thumbnailUrl: 'https://stream.mux.com/xyz.m3u8'
  },
  'https://stream.mux.com/xyz.m3u8'
)

test('given unparseable URL should pass it through', (t) => {
  const input =
    '/_next/image?url=https%3A%2F%2Fimage.mux.com%2xyz%2Fthumbnail.jpg&w=3840&q=95' as const

  t.is(parse({ thumbnailUrl: input }), input)
})

test('given empty string', (t) => {
  t.is(parse({ thumbnailUrl: '' }), '')
})
