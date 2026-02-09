import type { Request, Response } from 'express'
import bibleLanguages from '../../services/bible.js'

/**
 * @openapi
 * /api/languages/{language}/translations/{translation}/books:
 *   get:
 *     summary: Retrieve available books for a specific translation
 *     parameters:
 *       - in: path
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *         description: The language abbreviation (e.g., 'en')
 *       - in: path
 *         name: translation
 *         required: true
 *         schema:
 *           type: string
 *         description: The translation UID (e.g., 'eng-WEB')
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   abbreviation:
 *                     type: string
 *       404:
 *         description: Language or translation not found.
 */
const getBooks = (req: Request, res: Response): void => {
  const languageParam = req.params.language
  const translationParam = req.params.translation

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

  const books = Array.from(translation.books.values())
  res.json(books.map((book) => ({ name: book.name, abbreviation: book.abbreviation })))
}

export default getBooks
