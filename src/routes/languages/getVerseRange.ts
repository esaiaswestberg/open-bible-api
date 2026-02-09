import type { Request, Response } from 'express'
import bibleLanguages from '../../services/bible.js'

/**
 * @openapi
 * /api/languages/{language}/translations/{translation}/books/{book}/chapters/{chapter}/verses/{start}-{end}:
 *   get:
 *     summary: Retrieve a range of verses from a specific chapter
 *     parameters:
 *       - in: path
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: translation
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: book
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: chapter
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: start
 *         required: true
 *         schema:
 *           type: integer
 *         description: Start verse number
 *       - in: path
 *         name: end
 *         required: true
 *         schema:
 *           type: integer
 *         description: End verse number
 *     responses:
 *       200:
 *         description: A range of verses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: integer
 *                   text:
 *                     type: string
 *       404:
 *         description: Language, translation, book, chapter, or verse range not found.
 */
const getVerseRange = (req: Request, res: Response): void => {
  const languageParam = req.params.language
  const translationParam = req.params.translation
  const bookParam = req.params.book
  const chapterParam = req.params.chapter
  const startParam = req.params.start
  const endParam = req.params.end

  const language = bibleLanguages.get(languageParam)
  if (!language) {
    res.status(404).json({ error: `Language ${languageParam} not found.` })
    return
  }

  const translation = language.translations.get(translationParam)
  if (!translation) {
    res.status(404).json({ error: `Translation ${translationParam} not found.` })
    return
  }

  const book = translation.books.get(bookParam)
  if (!book) {
    res.status(404).json({ error: `Book ${bookParam} not found.` })
    return
  }

  const chapter = book.chapters.get(Number(chapterParam))
  if (!chapter) {
    res.status(404).json({ error: `Chapter ${chapterParam} not found.` })
    return
  }

  const start = Number(startParam)
  const end = Number(endParam)
  const verses = Array.from(chapter.verses.values())
  const range = verses.slice(start - 1, end)
  res.json(
    range.map((verse, i) => ({
      number: start + i,
      text: verse
    }))
  )
}

export default getVerseRange
