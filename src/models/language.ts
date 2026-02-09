import { readFile, readdir } from 'fs/promises'
import type LanguageMetadata from '../types/LanguageMetadata.d'
import Translation from './translation.js'

class Language {
  displayName: string
  abbreviation: string
  translations: Map<string, Translation>

  constructor(metadata: LanguageMetadata, translations: Translation[]) {
    this.displayName = metadata.displayName
    this.abbreviation = metadata.abbreviation
    this.translations = new Map<string, Translation>(translations.map((translation) => [translation.uid, translation]))
  }

  /**
   * Load all languages from the filesystem.
   *
   * @returns {Promise<Language[]>} Promise that resolves with the loaded languages.
   */
  static async loadLanguages(): Promise<Language[]> {
    const translationsPath = process.env.TRANSLATIONS_PATH || './translations/'
    const dirEntries = await readdir(translationsPath, { withFileTypes: true })
    const dirs = dirEntries.filter((dirent) => dirent.isDirectory())
    const dirNames = dirs.map((dirent) => dirent.name)

    return await Promise.all(dirNames.map(async (dirName) => Language.loadLanguage(dirName)))
  }

  /**
   * Load a language from the filesystem.
   *
   * @param name The name of the language directory.
   * @returns {Promise<Language>} Promise that resolves with the loaded language.
   */
  static async loadLanguage(name: string): Promise<Language> {
    const translationsPath = process.env.TRANSLATIONS_PATH || './translations/'
    const languagePath = `${translationsPath}/${name}`
    const metadataPath = `${languagePath}/metadata.json`
    const metadata = JSON.parse(await readFile(metadataPath, 'utf-8')) as LanguageMetadata
    const translations = await Translation.loadTranslations(languagePath)

    return new Language(metadata, translations)
  }
}

export default Language
