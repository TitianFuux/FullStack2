export default function VideoEmbebido({ url, titulo }) {
  if (!url) return null
  return (
    <div className="marco-video ratio ratio-16x9">
      <iframe src={url} title={titulo} loading="lazy" allowFullScreen />
    </div>
  )
}
