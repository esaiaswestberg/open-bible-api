import { beforeAll, describe, expect, it } from 'bun:test'
import request from 'supertest'
import { createApp } from '../src/services/http'
import { loadTranslations } from '../src/services/bible'

const app = createApp()

beforeAll(async () => {
  await loadTranslations()
})

describe('Open Bible API', () => {
  describe('Global', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/')
      expect(response.status).toBe(404)
    })

    it('should serve swagger documentation', async () => {
      const response = await request(app).get('/api-docs/')
      expect(response.status).toBe(200)
      expect(response.text).toContain('Swagger UI')
    })
  })

  describe('GET /api/languages', () => {
    it('should return a list of languages', async () => {
      const response = await request(app).get('/api/languages')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toHaveProperty('abbreviation')
      expect(response.body[0]).toHaveProperty('displayName')
    })
  })

  describe('GET /api/languages/:lang/translations', () => {
    it('should return translations for a valid language', async () => {
      const response = await request(app).get('/api/languages/en/translations')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
    })

    it('should be case sensitive for language abbreviation', async () => {
      const response = await request(app).get('/api/languages/EN/translations')
      expect(response.status).toBe(404)
    })

    it('should return 404 for an invalid language', async () => {
      const response = await request(app).get('/api/languages/invalid/translations')
      expect(response.status).toBe(404)
    })
  })

  describe('GET /api/languages/:lang/translations/:trans/books', () => {
    it('should return books for a valid translation', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books')
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.some((b: any) => b.abbreviation === 'GEN')).toBe(true)
    })

    it('should return 404 for an invalid translation', async () => {
      const response = await request(app).get('/api/languages/en/translations/invalid/books')
      expect(response.status).toBe(404)
    })
  })

  describe('GET /api/languages/:lang/translations/:trans/books/:book/chapters', () => {
    it('should return chapter count for a valid book', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ count: 50 })
    })

    it('should be case sensitive for book abbreviation', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/gen/chapters')
      expect(response.status).toBe(404)
    })

    it('should return 404 for an invalid book', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/INVALID/chapters')
      expect(response.status).toBe(404)
    })
  })

  describe('GET /api/languages/:lang/translations/:trans/books/:book/chapters/:chapter/verses', () => {
    it('should return verse count for a valid chapter', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/1/verses')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ count: 31 })
    })

    it('should return 404 for an invalid chapter', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/999/verses')
      expect(response.status).toBe(404)
    })

    it('should return 404 for non-numeric chapter', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/abc/verses')
      expect(response.status).toBe(404)
    })
  })

  describe('GET /api/languages/:lang/translations/:trans/books/:book/chapters/:chapter/verses/:verse', () => {
    it('should return a single verse', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/1/verses/1')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        number: 1,
        text: 'In the beginning, God created the heavens and the earth.'
      })
    })

    it('should return 404 for an invalid verse', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/1/verses/999')
      expect(response.status).toBe(404)
    })

    it('should return 404 for verse 0', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/1/verses/0')
      expect(response.status).toBe(404)
    })
  })

  describe('GET /api/languages/:lang/translations/:trans/books/:book/chapters/:chapter/verses/:from-:to', () => {
    it('should return a range of verses', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/1/verses/1-2')
      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
      expect(response.body[0].number).toBe(1)
      expect(response.body[1].number).toBe(2)
    })

    it('should return empty array if range is out of bounds (start too high)', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/1/verses/100-110')
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('should return partial range if end is out of bounds', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/1/verses/30-35')
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(2) // 30 and 31
    })

    it('should return a single verse if from equals to', async () => {
      const response = await request(app).get('/api/languages/en/translations/eng-WEB/books/GEN/chapters/1/verses/5-5')
      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(1)
      expect(response.body[0].number).toBe(5)
    })
  })
})