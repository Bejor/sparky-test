/* eslint-disable no-console */
import path from 'path';
import { fileURLToPath } from 'url';
import { compileDirectoriesInPlace, watchAndCompile } from './build/sass-util.js';

// Holen des aktuellen Verzeichnisses
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

console.log(import.meta.url);

const IGNORED_FILES = ['_breakpoints.scss', '_typography.scss']; // Liste der zu ignorierenden Dateien bei der Kompilierung
const SASS_FOLDERS = ['styles', 'blocks']; // Liste der Ordner, die kompiliert werden sollen

// Hauptlogik
const args = process.argv.slice(2);

if (args.includes('--watch')) {
  // Überwachen und Kompilieren
  await watchAndCompile(path.join(dirname), IGNORED_FILES);
} else if (args.includes('--compile')) {
  // Direktes Kompilieren der Ordner
  const directories = SASS_FOLDERS.map((folder) => path.join(dirname, folder));
  await compileDirectoriesInPlace(directories, IGNORED_FILES);
} else {
  // Fehler, wenn kein gültiger Flag angegeben wurde
  console.log('Please specify a flag: --watch or --compile');
}
