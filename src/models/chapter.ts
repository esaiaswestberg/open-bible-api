import { readFile, readdir } from 'fs/promises'
import type ChapterMetadata from '../types/ChapterMetadata.d'

class Chapter {
  name: string
  number: number
  verses: Map<number, string>

  constructor(metadata: ChapterMetadata, verses: string[]) {
    this.name = metadata.name
    this.number = metadata.number
    this.verses = new Map<number, string>(verses.map((verse, index) => [index + 1, verse]))
  }

  /**
   * Load all chapters from the filesystem.
   *
   * @param bookPath The path to the book directory.
   * @returns {Promise<Chapter[]>} Promise that resolves with the loaded chapters.
   */
  static async loadChapters(bookPath: string): Promise<Chapter[]> {
    const dirEntries = await readdir(bookPath, { withFileTypes: true })
    const dirs = dirEntries.filter((dirent) => dirent.isDirectory())
    const dirNames = dirs.map((dirent) => dirent.name)

    return await Promise.all(dirNames.map(async (dirName) => Chapter.loadChapter(bookPath, dirName)))
  }

  /**
   * Load a chapter from the filesystem.
   *
   * @param bookPath The path to the book directory.
   * @param name The name of the chapter directory.
   * @returns {Promise<Chapter>} Promise that resolves with the loaded chapter.
   */
  static async loadChapter(bookPath: string, name: string): Promise<Chapter> {
    const chapterPath = `${bookPath}/${name}`
    const metadataPath = `${chapterPath}/metadata.json`
    const metadata = JSON.parse(await readFile(metadataPath, 'utf-8')) as ChapterMetadata
    const verses = await Chapter.loadVerses(chapterPath)

    return new Chapter(metadata, verses)
  }

  /**
   * Load verses from the filesystem.
   *
   * @param chapterPath The path to the chapter directory.
   * @returns {Promise<string[]>} Promise that resolves with the loaded verses.
   */
  static async loadVerses(chapterPath: string): Promise<string[]> {
    const textPath = `${chapterPath}/text.txt`
    const text = await readFile(textPath, 'utf-8')
    return text.split('\n').filter((line) => line.trim() !== '')
  }
}

export default Chapter
