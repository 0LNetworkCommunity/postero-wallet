const os = require("node:os");
const builder = require("electron-builder");
const Platform = builder.Platform;

const main = async () => {
  const config = {
    config: {
      appId: "app.postero.postero",
      productName: "Postero",
      files: [
        "web-build/**/*",

        "src/**/*",

        "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
        "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
        "!**/node_modules/*.d.ts",
        "!**/node_modules/.bin",
        "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}",
        "!.editorconfig",
        "!**/._*",
        "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}",
        "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}",
        "!**/{appveyor.yml,.travis.yml,circle.yml}",
        "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}",
      ],
      extraFiles: [
        {
          from: "build/bin",
          to: "Resources/bin",
          filter: ["**/*"],
        },
      ],
      asar: true,
    },
  };

  switch (os.platform()) {
    case "darwin":
      {
        await builder.build({
          ...config,
          targets: Platform.MAC.createTarget(),
        });
      }
      break;
    case "linux":
      {
        await builder.build({
          ...config,
          targets: Platform.LINUX.createTarget("deb"),
        });
      }
      break;
    case "win32":
      {
        await builder.build({
          ...config,
          targets: Platform.WINDOWS.createTarget(),
        });
      }
      break;
  }
};

main().catch((error) => console.error(error));
