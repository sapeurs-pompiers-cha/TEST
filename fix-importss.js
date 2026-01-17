const fs = require("fs");
const path = require("path"));

const srcDir = path.join(__dirname, "src");

// Fonction pour calculer le chemin relatif
function getRelativeImport(filePath, target) {
  const fromDir = path.dirname(filePath);
  let relativePath = path.relative(fromDir, target);
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }
  // Remplace \ par / pour compatibilité avec import
  return relativePath.replace(/\\/g, "/");
}

// Fonction pour parcourir tous les fichiers
function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf-8");

      // Remplace @/lib/... par chemin relatif
      content = content.replace(/@\/lib\/([\w/-]+)/g, (_, p1) => {
        const target = path.join(srcDir, "lib", p1);
        return getRelativeImport(fullPath, target);
      });

      // Remplace @/hooks/... par chemin relatif
      content = content.replace(/@\/hooks\/([\w/-]+)/g, (_, p1) => {
        const target = path.join(srcDir, "hooks", p1);
        return getRelativeImport(fullPath, target);
      });

      // Remplace @/components/... par chemin relatif
      content = content.replace(/@\/components\/([\w/-]+)/g, (_, p1) => {
        const target = path.join(srcDir, "components", p1);
        return getRelativeImport(fullPath, target);
      });

      // Remplace @shared/... par chemin relatif (souvent pour schema)
      content = content.replace(/@shared\/([\w/-]+)/g, (_, p1) => {
        const target = path.join(srcDir, "lib", p1);
        return getRelativeImport(fullPath, target);
      });

      fs.writeFileSync(fullPath, content, "utf-8");
    }
  });
}

walk(srcDir);
console.log("Tous les imports @/... et @shared/... ont été corrigés !");
