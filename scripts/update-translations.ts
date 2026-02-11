import fs from 'node:fs';
import path from 'node:path';

const TRANSLATIONS_DIR = path.join(process.cwd(), 'translations');

interface LanguageMetadata {
  displayName: string;
  abbreviation: string;
}

interface OldTranslationMetadata {
  abbreviation: string;
  uid: string;
  info: string;
}

interface NewTranslationMetadata {
  displayName: string;
  alternativeName: string;
  abbreviation: string;
  description: string;
}

interface TranslationTask {
  langCode: string;
  transDir: string;
  langMeta: LanguageMetadata;
  fullPath: string;
}

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function main() {
  const args = process.argv.slice(2);
  const langIndex = args.indexOf('--lang');
  const targetLang = langIndex !== -1 ? args[langIndex + 1] : null;

  let languages = fs.readdirSync(TRANSLATIONS_DIR).filter(f => 
    fs.statSync(path.join(TRANSLATIONS_DIR, f)).isDirectory()
  );

  if (targetLang) {
    if (languages.includes(targetLang)) {
      languages = [targetLang];
    } else {
      console.error(`Error: Language "${targetLang}" not found in translations directory.`);
      process.exit(1);
    }
  }

  const tasks: TranslationTask[] = [];

  for (const lang of languages) {
    const langPath = path.join(TRANSLATIONS_DIR, lang);
    const langMetaPath = path.join(langPath, 'metadata.json');
    
    if (!fs.existsSync(langMetaPath)) continue;
    
    const langMeta: LanguageMetadata = JSON.parse(fs.readFileSync(langMetaPath, 'utf8'));
    
    const translations = fs.readdirSync(langPath).filter(f => 
      fs.statSync(path.join(langPath, f)).isDirectory()
    );

    for (const trans of translations) {
      const fullPath = path.join(langPath, trans);
      const metaPath = path.join(fullPath, 'metadata.json');
      
      if (!fs.existsSync(metaPath)) continue;

      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

      // Skip if it doesn't have the "old" format (abbreviation, uid, info)
      // or if it already has the "new" format markers (displayName)
      const isOldFormat = 'abbreviation' in meta && 'uid' in meta && 'info' in meta;
      const hasNewFormat = 'displayName' in meta;

      if (!isOldFormat || hasNewFormat) {
        continue;
      }

      tasks.push({
        langCode: lang,
        transDir: trans,
        langMeta,
        fullPath
      });
    }
  }

  shuffle(tasks);

  console.log(`Found ${tasks.length} translations to process.\n`);

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const metaPath = path.join(task.fullPath, 'metadata.json');
    
    if (!fs.existsSync(metaPath)) {
      console.warn(`Skipping ${task.fullPath}, metadata.json not found.`);
      continue;
    }

    const currentMeta: OldTranslationMetadata = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

    console.log(`--- [${i + 1}/${tasks.length}] Processing: ${task.langMeta.displayName} / ${task.transDir} ---`);
    
    const searchQuery = encodeURIComponent(`${currentMeta.abbreviation} bible translation ${task.langMeta.displayName}`);
    const searchLink = `https://www.google.com/search?q=${searchQuery}`;
    
    console.log(`Research Link: ${searchLink}\n`);
    console.log('Enter "skip" to skip this translation, or "exit" to stop the script.');

    const displayName = prompt(`Display Name (Current: ${currentMeta.abbreviation}):`);
    
    if (displayName === 'exit') break;
    if (displayName === 'skip') {
      console.log('Skipping...\n');
      continue;
    }

    const alternativeName = prompt(`Alternative Name:`) || '';
    const abbreviation = prompt(`Abbreviation (Default: ${currentMeta.abbreviation}):`) || currentMeta.abbreviation;
    const description = prompt(`Description:`) || '';

    const newMeta: NewTranslationMetadata = {
      displayName: displayName || '',
      alternativeName,
      abbreviation,
      description
    };

    fs.writeFileSync(metaPath, JSON.stringify(newMeta, null, 2) + '\n');

    if (abbreviation && abbreviation !== task.transDir) {
      const newPath = path.join(TRANSLATIONS_DIR, task.langCode, abbreviation);
      if (fs.existsSync(newPath)) {
        console.error(`Error: Cannot rename to ${abbreviation}, directory already exists.`);
      } else {
        fs.renameSync(task.fullPath, newPath);
        console.log(`Renamed directory to: ${abbreviation}`);
      }
    }

    console.log('Updated metadata successfully.\n');
  }

  console.log('Finished processing all translations.');
}

main().catch(console.error);