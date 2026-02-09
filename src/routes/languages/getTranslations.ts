import type { Request, Response } from 'express'
import bibleLanguages from '../../services/bible.js'

/**
 * @openapi
 * /api/languages/{language}/translations:
 *   get:
 *     summary: Retrieve available translations for a specific language
 *     parameters:
 *       - in: path
 *         name: language
 *         required: true
 *         schema:
 *           type: string
 *         description: The language abbreviation (e.g., 'en')
 *     responses:
 *       200:
 *         description: A list of translations.
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
 *                   uid:
 *                     type: string
 *                   info:
 *                     type: string
 *       404:
 *         description: Language not found.
 */
const getTranslations = (req: Request, res: Response): void => {
  const languageParam = req.params.language

  const language = bibleLanguages.get(languageParam)
  if (!language) {
    res.status(404).json({ error: `Language ${languageParam} not found.` })
    return
  }

  const translations = Array.from(language.translations.values())
  res.json(translations.map((translation) => ({ name: translation.name, abbreviation: translation.abbreviation, uid: translation.uid, info: translation.info })))
}

export default getTranslations
