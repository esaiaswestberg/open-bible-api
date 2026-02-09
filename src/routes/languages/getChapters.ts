import type { Request, Response } from 'express'
import bibleLanguages from '../../services/bible.js'

/**
 * @openapi
 * /api/languages/{language}/translations/{translation}/books/{book}/chapters:
 *   get:
 *     summary: Retrieve the number of chapters in a book
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
 *     responses:
 *       200:
 *         description: The number of chapters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       404:
 *         description: Language, translation, or book not found.
 */
const getChapters = (req: Request, res: Response): void => {
  const languageParam = req.params.language
  const translationParam = req.params.translation
  const bookParam = req.params.book

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

  const chapters = Array.from(book.chapters.values())
  res.json({ count: chapters.length })
}

export default getChapters
