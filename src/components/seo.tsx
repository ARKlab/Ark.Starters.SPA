export default function SEO({
  title,
  description,
  name,
  type,
}: {
  title?: string
  description?: string
  name?: string
  type?: string
}) {
  title ??= import.meta.env.VITE_APP_TITLE;
  if (title !== import.meta.env.VITE_APP_TITLE) title += ' | ' + import.meta.env.VITE_APP_TITLE

  description ??= import.meta.env.VITE_APP_DESCRIPTION;
  name ??= import.meta.env.VITE_APP_COMPANY;

  return (
    <>
      {title ? (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      ) : null}
      {description ? (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      ) : null}
      {name ? (
        <>
          <meta name="twitter:creator" content={name} />
        </>
      ) : null}
      {type ? (
        <>
          <meta property="og:type" content={type} />
          <meta name="twitter:card" content={type} />
        </>
      ) : null}
    </>
  )
}
