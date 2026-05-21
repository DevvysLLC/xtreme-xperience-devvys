export const GlobalSpeculationRules = () => {
  const rules = {
    prefetch: [
      {
        where: {
          and: [
            { href_matches: '/*' },
            { not: { href_matches: '/booking/*' } },
            { not: { href_matches: '/checkout/*' } },
            { not: { href_matches: '/order/*' } }
          ]
        },
        eagerness: 'moderate'
      }
    ]
  }

  return (
    <script
      type="speculationrules"
      // Trusted source: JSON from our own code; skip HTML safety check
      dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }}
    />
  )
}
