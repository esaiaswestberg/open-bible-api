import { readdir, rename, readFile, writeFile, stat } from 'fs/promises';
import { join } from 'path';

const bookMapping: Record<string, string> = {
  'Genesis': 'GEN',
  'Exodus': 'EXO',
  'Leviticus': 'LEV',
  'Numbers': 'NUM',
  'Deuteronomy': 'DEU',
  'Joshua': 'JOS',
  'Judges': 'JDG',
  'Ruth': 'RUT',
  'I Samuel': '1SA',
  'II Samuel': '2SA',
  'I Kings': '1KI',
  'II Kings': '2KI',
  'I Chronicles': '1CH',
  'II Chronicles': '2CH',
  'Ezra': 'EZR',
  'Nehemiah': 'NEH',
  'Esther': 'EST',
  'Job': 'JOB',
  'Psalms': 'PSA',
  'Proverbs': 'PRO',
  'Ecclesiastes': 'ECC',
  'Song of Solomon': 'SNG',
  'Song of Songs': 'SNG',
  'Isaiah': 'ISA',
  'Jeremiah': 'JER',
  'Lamentations': 'LAM',
  'Ezekiel': 'EZK',
  'Daniel': 'DAN',
  'Hosea': 'HOS',
  'Joel': 'JOL',
  'Amos': 'AMO',
  'Obadiah': 'OBA',
  'Jonah': 'JON',
  'Micah': 'MIC',
  'Nahum': 'NAM',
  'Habakkuk': 'HAB',
  'Zephaniah': 'ZEP',
  'Haggai': 'HAG',
  'Zechariah': 'ZEC',
  'Malachi': 'MAL',
  'Matthew': 'MAT',
  'Mark': 'MRK',
  'Luke': 'LUK',
  'John': 'JHN',
  'Acts': 'ACT',
  'Romans': 'ROM',
  'I Corinthians': '1CO',
  'II Corinthians': '2CO',
  'Galatians': 'GAL',
  'Ephesians': 'EPH',
  'Philippians': 'PHP',
  'Colossians': 'COL',
  'I Thessalonians': '1TH',
  'II Thessalonians': '2TH',
  'I Timothy': '1TI',
  'II Timothy': '2TI',
  'Titus': 'TIT',
  'Philemon': 'PHM',
  'Hebrews': 'HEB',
  'James': 'JAS',
  'I Peter': '1PE',
  'II Peter': '2PE',
  'I John': '1JN',
  'II John': '2JN',
  'III John': '3JN',
  'Jude': 'JUD',
  'Revelation of John': 'REV',
  // Apocrypha / Deuterocanon
  'Additions to Esther': 'ESG',
  'Baruch': 'BAR',
  'Bel and the Dragon': 'BEL',
  'I Esdras': '1ES',
  'I Maccabees': '1MA',
  'II Esdras': '2ES',
  'II Maccabees': '2MA',
  'III Maccabees': '3MA',
  'IV Maccabees': '4MA',
  'Judith': 'JDT',
  'Prayer of Azariah': 'S3Y',
  'Prayer of Manasses': 'MAN',
  'Sirach': 'SIR',
  'Susanna': 'SUS',
  'Tobit': 'TOB',
  'Wisdom': 'WIS',
  'Jeremy’s Letter': 'LJE',
  'Letter of Jeremiah': 'LJE',
  'Psalm 151': 'PS2',
  'Additional Psalm': 'PS2',
  'Laodiceans': 'LAO',
  'Psalms of Solomon': 'PSS',
  'Epistle of Jeremiah': 'LJE',
  'I Enoch': 'ENO',
  'Odes': 'ODE',
  'Additions to Daniel': 'DAG',
  'Esther (Greek)': 'ESG'
};

async function main() {
  const translationsDir = 'translations';
  const languages = await readdir(translationsDir);

  for (const language of languages) {
    const languagePath = join(translationsDir, language);
    if (!(await stat(languagePath)).isDirectory()) continue;

    const translations = await readdir(languagePath);
    for (const translation of translations) {
      // Skip WEB as it's already using short names
      if (language === 'english' && translation === 'WEB') continue;

      const translationPath = join(languagePath, translation);
      if (!(await stat(translationPath)).isDirectory()) continue;

      const books = await readdir(translationPath);
      for (const book of books) {
        if (book === 'metadata.json') continue;
        const bookPath = join(translationPath, book);
        const bookStat = await stat(bookPath);
        if (!bookStat.isDirectory()) continue;

        const abbreviation = bookMapping[book];
        if (abbreviation) {
          if (book === abbreviation) {
            // Already renamed? Check metadata anyway
            const metadataPath = join(bookPath, 'metadata.json');
            try {
              const metadataContent = await readFile(metadataPath, 'utf-8');
              const metadata = JSON.parse(metadataContent);
              if (metadata.abbreviation !== abbreviation) {
                metadata.abbreviation = abbreviation;
                await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
                console.log(`Updated metadata abbreviation for ${bookPath}`);
              }
            } catch (e) {
              // ignore if file doesn't exist
            }
            continue;
          }

          const newBookPath = join(translationPath, abbreviation);
          
          // Check if destination exists
          try {
            await stat(newBookPath);
            console.warn(`Destination already exists: ${newBookPath}. Skipping ${bookPath}`);
            continue;
          } catch (e) {
            // Destination does not exist, good
          }

          // Update metadata.json BEFORE renaming directory
          const metadataPath = join(bookPath, 'metadata.json');
          try {
            const metadataContent = await readFile(metadataPath, 'utf-8');
            const metadata = JSON.parse(metadataContent);
            metadata.abbreviation = abbreviation;
            await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
          } catch (e) {
            console.error(`Failed to update metadata for ${bookPath}: ${e}`);
          }

          // Rename directory
          console.log(`Renaming ${bookPath} -> ${abbreviation}`);
          await rename(bookPath, newBookPath);
        } else {
          // If not in mapping, we might want to check the metadata.json's name field
          // but for now, we follow the user's lead on longnames.txt
          // console.warn(`No mapping found for book: ${book} in ${translationPath}`);
        }
      }
    }
  }
}

main().catch(console.error);
