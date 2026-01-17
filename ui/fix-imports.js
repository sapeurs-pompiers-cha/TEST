const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src");

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      content = content.replace(/@\/lib\//g, "../lib/");
      content = content.replace(/@\/hooks\//g, "../hooks/");
      content = content.replace(/@\/components\//g, "../components/");
      content = content.replace(/@shared\//g, "../lib/");
      fs.writeFileSync(fullPath, content, "utf-8");
    }
  });
}

walk(srcDir);
console.log("Tous les imports @/... ont été remplacés par des chemins relatifs !");
