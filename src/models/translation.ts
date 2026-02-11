import { readFile, readdir } from 'fs/promises'
import type TranslationMetadata from '../types/TranslationMetadata.d'
import Book from './book.js'

class Translation {
  displayName: string
  alternativeName: string
  abbreviation: string
  description: string
  books: Map<string, Book>

  constructor(metadata: TranslationMetadata, books: Book[]) {
    this.displayName = metadata.displayName
    this.alternativeName = metadata.alternativeName
    this.abbreviation = metadata.abbreviation
    this.description = metadata.description
    this.books = new Map<string, Book>(books.map((book) => [book.abbreviation, book]))
  }

  /**
   * Load all translations from the filesystem.
   *
   * @returns {Promise<Translation[]>} Promise that resolves with the loaded translations.
   */
  static async loadTranslations(languagePath: string): Promise<Translation[]> {
    const dirEntries = await readdir(languagePath, { withFileTypes: true })
    const dirs = dirEntries.filter((dirent) => dirent.isDirectory())
    const dirNames = dirs.map((dirent) => dirent.name)

    return await Promise.all(dirNames.map(async (dirName) => Translation.loadTranslation(languagePath, dirName)))
  }

  /**
   * Load a translation from the filesystem.
   *
   * @param languagePath The path to the language directory.
   * @param name The name of the translation directory.
   * @returns {Promise<Translation>} Promise that resolves with the loaded translation.
   */
  static async loadTranslation(languagePath: string, name: string): Promise<Translation> {
    const translationPath = `${languagePath}/${name}`
    const metadataPath = `${translationPath}/metadata.json`
    const metadata = JSON.parse(await readFile(metadataPath, 'utf-8')) as TranslationMetadata
    const books = await Book.loadBooks(translationPath)

    return new Translation(metadata, books)
  }
}

export default Translation
