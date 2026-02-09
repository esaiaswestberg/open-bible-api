import Language from '../models/language.js'
import logger from './logger.js'

const bibleLanguages = new Map<string, Language>()

/**
 * Load all bible translations into memory.
 *
 * @returns {Promise<void>} Promise that resolves when all translations are loaded.
 * @throws {Error} If the translations could not be loaded.
 */
export const loadTranslations = async (): Promise<typeof bibleLanguages> => {
  logger.info('Loading translations...')
  ;(await Language.loadLanguages()).forEach((language) => bibleLanguages.set(language.abbreviation, language))

  const translationCount = Array.from(bibleLanguages.values()).reduce((count, language) => count + language.translations.size, 0)
  logger.info(`Finished loading ${translationCount} translation(s) in ${bibleLanguages.size} language(s)!`)

  return bibleLanguages
}

export default bibleLanguages
