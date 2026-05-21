const DATO_PAGE_SIZE = 100

type Pagination = { first: number; skip: number }

/**
 * Paginates through a DatoCMS list query that accepts `first` / `skip`
 * variables and returns all records across every page.
 */
export const fetchAllRecords = async <T>(
  fetchPage: (pagination: Pagination) => Promise<T[]>
): Promise<T[]> => {
  const all: T[] = []
  let skip = 0

  while (true) {
    const batch = await fetchPage({ first: DATO_PAGE_SIZE, skip })
    all.push(...batch)

    if (batch.length < DATO_PAGE_SIZE) {
      break
    }

    skip += DATO_PAGE_SIZE
  }

  return all
}
