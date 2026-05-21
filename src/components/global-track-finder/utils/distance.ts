import { distance } from '@turf/distance'

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const point1: [number, number] = [lon1, lat1]
  const point2: [number, number] = [lon2, lat2]

  return distance(point1, point2, { units: 'kilometers' })
}
