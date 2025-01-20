import { exec } from "node:child_process";

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${cmd}`);
        console.error(stderr);
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

(async () => {
  try {
    // Holen der geänderten Dateien, die für den Commit bereitgestellt wurden
    const stagedChanges = await runCommand("git diff --cached --name-only --diff-filter=ACMR");
    const stagedFiles = stagedChanges.split("\n").filter(Boolean);

    // Prüfen, ob `_*.json`-Dateien geändert wurden
    const modifiedPartials = stagedFiles.filter((file) => /^.*\/_.*\.json$/.test(file));

    if (modifiedPartials.length > 0) {
      console.log("Modifizierte Partial-Dateien erkannt. Build wird ausgeführt...");

      // Führe den Build aus
      const buildOutput = await runCommand("npm run build --silent");
      console.log(buildOutput);

      // Füge den `dist`-Ordner dem Commit hinzu
      await runCommand("git add dist");
      console.log("Build-Artefakte aus dem `dist`-Ordner erfolgreich hinzugefügt.");
    } else {
      console.log("Keine modifizierten Partial-Dateien erkannt. Build wird übersprungen.");
    }
  } catch (error) {
    console.error("Fehler während der Verarbeitung:", error);
    process.exit(1); // Beendet den Prozess mit einem Fehlercode
  }
})();
