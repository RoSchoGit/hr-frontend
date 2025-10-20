// replace-tailwind-colors.mjs
import fs from "fs";
import path from "path";

// === 👉 DEIN MAPPING HIER EINTRAGEN ===
// Du kannst beliebig viele hinzufügen
const colorMap = {
  "bg-blue-500": "bg-primary",
  "hover:bg-blue-600": "hover:bg-primary-hover",
  "active:bg-blue-700": "active:bg-primary-active",
  "text-blue-500": "text-primary",
  "text-gray-700": "text-text",
  "text-gray-500": "text-text-muted",
  "bg-gray-100": "bg-surface",
  "border-gray-200": "border-border",
  "bg-gray-50": "bg-background",
  "disabled:bg-gray-300": "disabled:bg-primary-disabled",
};

// === BASISPFAD, z. B. dein React src-Verzeichnis ===
const SRC_DIR = path.resolve("./src");

// === REKURSIV DATEIEN DURCHSUCHEN ===
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (/\.(js|jsx|ts|tsx|html|css)$/.test(filePath)) {
      callback(filePath);
    }
  });
}

// === DATEIEN BEARBEITEN ===
function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let replaced = false;

  for (const [oldValue, newValue] of Object.entries(colorMap)) {
    const regex = new RegExp(oldValue, "g");
    if (regex.test(content)) {
      content = content.replace(regex, newValue);
      replaced = true;
    }
  }

  if (replaced) {
    // Optional: Backup-Datei speichern
    fs.copyFileSync(filePath, filePath + ".bak");
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✅ Updated:", filePath);
  }
}

// === AUSFÜHREN ===
console.log("🔍 Searching for Tailwind color classes in:", SRC_DIR);
walkDir(SRC_DIR, replaceInFile);
console.log("✨ Done!");
