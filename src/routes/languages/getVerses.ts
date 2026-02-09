import type { Request, Response } from 'express'
import bibleLanguages from '../../services/bible.js'

/**
 * @openapi
 * /api/languages/{language}/translations/{translation}/books/{book}/chapters/{chapter}/verses:
 *   get:
 *     summary: Retrieve the number of verses in a chapter
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
 *     responses:
 *       200:
 *         description: The number of verses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       404:
 *         description: Language, translation, book, or chapter not found.
 */
const getVerses = (req: Request, res: Response): void => {
  const languageParam = req.params.language
  const translationParam = req.params.translation
  const bookParam = req.params.book
  const chapterParam = req.params.chapter

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

  const verses = Array.from(chapter.verses.values())
  res.json({ count: verses.length })
}

export default getVerses
