import type { Request, Response } from 'express'
import bibleLanguages from '../../services/bible.js'

/**
 * @openapi
 * /api/languages/{language}/translations/{translation}/books/{book}/chapters/{chapter}/verses/{verse}:
 *   get:
 *     summary: Retrieve a single verse from a specific chapter
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
 *         name: verse
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested verse.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 number:
 *                   type: integer
 *                 text:
 *                   type: string
 *       404:
 *         description: Language, translation, book, chapter, or verse not found.
 */
const getSingleVerse = (req: Request, res: Response): void => {
  const languageParam = req.params.language
  const translationParam = req.params.translation
  const bookParam = req.params.book
  const chapterParam = req.params.chapter
  const verseParam = req.params.verse

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

  const verse = chapter.verses.get(Number(verseParam))
  if (!verse) {
    res.status(404).json({ error: `Verse ${verseParam} not found.` })
    return
  }

  res.json({
    number: Number(verseParam),
    text: verse
  })
}

export default getSingleVerse
