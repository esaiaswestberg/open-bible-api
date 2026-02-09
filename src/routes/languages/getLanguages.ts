import type { Request, Response } from 'express'
import bibleLanguages from '../../services/bible.js'

/**
 * @openapi
 * /api/languages:
 *   get:
 *     summary: Retrieve a list of available languages
 *     responses:
 *       200:
 *         description: A list of languages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   displayName:
 *                     type: string
 *                     example: English
 *                   abbreviation:
 *                     type: string
 *                     example: en
 */
const getLanguages = (_: Request, res: Response): void => {
  const languages = Array.from(bibleLanguages.values())

  res.json(
    languages.map((language) => ({
      displayName: language.displayName,
      abbreviation: language.abbreviation
    }))
  )
}

export default getLanguages
