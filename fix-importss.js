import fs from "fs";
import path from "path";

const srcDir = path.join(process.cwd(), "src");

// Fonction pour calculer le chemin relatif
function getRelativeImport(filePath, target) {
  const fromDir = path.dirname(filePath);
  let relativePath = path.relative(fromDir, target);
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }
  return relativePath.replace(/\\/g, "/");
}

// Parcours des fichiers
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf-8");

      content = content.replace(/@\/lib\/([\w/-]+)/g, (_, p1) => {
        const target = path.join(srcDir, "lib", p1);
        return getRelativeImport(fullPath, target);
      });

      content = content.replace(/@\/hooks\/([\w/-]+)/g, (_, p1) => {
        const target = path.join(srcDir, "hooks", p1);
        return getRelativeImport(fullPath, target);
      });

      content = content.replace(/@\/components\/([\w/-]+)/g, (_, p1) => {
        const target = path.join(srcDir, "components", p1);
        return getRelativeImport(fullPath, target);
      });

      content = content.replace(/@shared\/([\w/-]+)/g, (_, p1) => {
        const target = path.join(srcDir, "lib", p1);
        return getRelativeImport(fullPath, target);
      });

      fs.writeFileSync(fullPath, content, "utf-8");
    }
  }
}

walk(srcDir);
console.log("Tous les imports @/... et @shared/... ont été corrigés !");
