import { describe, it, expect } from 'vitest'
import { selectParams } from './selectParams'
import type { ProjectionKey } from './projectionParams'

describe('selectParams', () => {
  it('contains an entry for each ProjectionKey value', () => {
    // Extract all ProjectionKey values
    type PK = ProjectionKey
    // Hardcode expected keys array matching selectParams.value
    const expectedValues: PK[] = [
      'wgs84', 'sweref99tm', 'sweref991200', 'sweref991330', 'sweref991500', 'sweref991630',
      'sweref991800', 'sweref991415', 'sweref991545', 'sweref991715', 'sweref991845',
      'sweref992015', 'sweref992145', 'sweref992315', 'rt9075gonV', 'rt9050gonV',
      'rt9025gonV', 'rt9000gonV', 'rt9025gonO', 'rt9050gonO'
    ]

    const actualValues = selectParams.map(item => item.value)
    // Ensure same length and same elements
    expect(actualValues).toHaveLength(expectedValues.length)
    expect(actualValues).toEqual(expectedValues)
  })

  it('each selectParams entry has non-empty text', () => {
    selectParams.forEach(item => {
      expect(typeof item.text).toBe('string')
      expect(item.text.length).toBeGreaterThan(0)
    })
  })
})
