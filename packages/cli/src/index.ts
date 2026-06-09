import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import prompts from "prompts";
import pc from "picocolors";
import ora from "ora";

const program = new Command();
const CONFIG_FILE = "lerpa.json";

interface Config {
  style: string;
  tailwind: {
    config: string;
    css: string;
  };
  aliases: {
    components: string;
    utils: string;
  };
  packageManager: "npm" | "pnpm" | "yarn" | "bun";
}

// Default Registry resolution
function getLocalRegistryPath(): string | null {
  // 1. Bundled with the published CLI (preferred for `pnpm dlx lerpa-cli`).
  //    The publish step copies `packages/registry/generated/registry.json`
  //    into `packages/cli/registry/registry.json` so the tarball is
  //    self-contained.
  const bundled = path.join(__dirname, "../registry/registry.json");
  if (fs.existsSync(bundled)) {
    return bundled;
  }

  // 2. Local registry inside monorepo context (developer convenience).
  const monorepoPath = path.join(process.cwd(), "packages/registry/generated/registry.json");
  if (fs.existsSync(monorepoPath)) {
    return monorepoPath;
  }

  // 3. Peer registry path if running inside mono packages.
  const peerPath = path.join(__dirname, "../../../registry/generated/registry.json");
  if (fs.existsSync(peerPath)) {
    return peerPath;
  }

  // 4. Locally installed inside node_modules relative path.
  const localNodePath = path.join(__dirname, "../registry/generated/registry.json");
  if (fs.existsSync(localNodePath)) {
    return localNodePath;
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry items are dynamic shadcn JSON; downstream uses heterogeneous fields
function loadRegistry(): any[] {
  const localPath = getLocalRegistryPath();
  if (localPath) {
    try {
      const content = fs.readFileSync(localPath, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.warn(pc.yellow(`⚠️ Warning: Failed to read local registry from ${localPath}. Using fallback.`));
    }
  }

  // Fallback embedded subset registry if registry.json is not generated yet
  return [
    {
      name: "button",
      type: "registry:ui",
      dependencies: ["class-variance-authority"],
      files: [
        {
          path: "components/ui/button.tsx",
          type: "registry:ui",
          content: "import * as React from \"react\";\nimport { Slot } from \"@radix-ui/react-slot\";\nimport { cva, type VariantProps } from \"class-variance-authority\";\nimport { cn } from \"@/lib/utils\";\n\nconst buttonVariants = cva(\n  \"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50\",\n  {\n    variants: {\n      variant: {\n        default: \"bg-primary text-primary-foreground shadow hover:bg-primary/90\",\n        destructive: \"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90\",\n        outline: \"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground\",\n        secondary: \"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80\",\n        ghost: \"hover:bg-accent hover:text-accent-foreground\",\n        link: \"text-primary underline-offset-4 hover:underline\",\n      },\n      size: {\n        default: \"h-9 px-4 py-2\",\n        sm: \"h-8 rounded-md px-3 text-xs\",\n        lg: \"h-10 rounded-md px-8\",\n        icon: \"h-9 w-9\",\n      },\n    },\n    defaultVariants: {\n      variant: \"default\",\n      size: \"default\",\n    },\n  }\n);\n\nexport interface ButtonProps\n  extends React.ButtonHTMLAttributes<HTMLButtonElement>,\n    VariantProps<typeof buttonVariants> {\n  asChild?: boolean;\n}\n\nconst Button = React.forwardRef<HTMLButtonElement, ButtonProps>(\n  ({ className, variant, size, asChild = false, ...props }, ref) => {\n    const Comp = asChild ? Slot : \"button\";\n    return (\n      <Comp\n        className={cn(buttonVariants({ variant, size, className }))}\n        ref={ref}\n        {...props}\n      />\n    );\n  }\n);\nButton.displayName = \"Button\";\n\nexport { Button, buttonVariants };\n"
        }
      ]
    }
  ];
}

function getConfig(): Config | null {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (e) {
    return null;
  }
}

function detectPackageManager(): "npm" | "pnpm" | "yarn" | "bun" {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) return "bun";
  if (fs.existsSync(path.join(cwd, "package-lock.json"))) return "npm";
  return "npm";
}

function getInstallCommand(pm: string, deps: string[]): string {
  const depStr = deps.join(" ");
  switch (pm) {
    case "pnpm":
      return `pnpm add ${depStr}`;
    case "yarn":
      return `yarn add ${depStr}`;
    case "bun":
      return `bun add ${depStr}`;
    default:
      return `npm install ${depStr} --save`;
  }
}

function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function backupFile(targetPath: string) {
  if (fs.existsSync(targetPath)) {
    const backupPath = `${targetPath}.bak`;
    fs.copyFileSync(targetPath, backupPath);
    console.log(pc.gray(`📁 Created backup file at: ${backupPath}`));
  }
}

// -----------------------------------------
// CLI commands implementation
// -----------------------------------------

program
  .name("lerpa")
  .description("Interactive Registry CLI utility for Lerpa UI animated blocks & components")
  .version("0.1.0");

// INIT COMMAND
program
  .command("init")
  .description("Initialize configuration and styling aliases in your project")
  .action(async () => {
    console.log(pc.cyan("\n🚀 Welcome to the Lerpa UI Registry System!\n"));

    const configPath = path.join(process.cwd(), CONFIG_FILE);
    if (fs.existsSync(configPath)) {
      const overwrite = await prompts({
        type: "confirm",
        name: "value",
        message: `${CONFIG_FILE} already exists. Overwrite configuration?`,
        initial: false,
      });
      if (!overwrite.value) {
        console.log(pc.yellow("Initialization aborted."));
        return;
      }
    }

    const detectedPm = detectPackageManager();

    const questions = [
      {
        type: "select" as const,
        name: "packageManager",
        message: "Which package manager do you use?",
        choices: [
          { title: "pnpm", value: "pnpm" },
          { title: "npm", value: "npm" },
          { title: "yarn", value: "yarn" },
          { title: "bun", value: "bun" },
        ],
        initial: ["pnpm", "npm", "yarn", "bun"].indexOf(detectedPm),
      },
      {
        type: "text" as const,
        name: "cssPath",
        message: "Where is your main globals CSS stylesheet located?",
        initial: fs.existsSync("src/app/globals.css")
          ? "src/app/globals.css"
          : fs.existsSync("app/globals.css")
          ? "app/globals.css"
          : "src/index.css",
      },
      {
        type: "text" as const,
        name: "tailwindConfigPath",
        message: "Where is your Tailwind config file located?",
        initial: fs.existsSync("tailwind.config.ts")
          ? "tailwind.config.ts"
          : "tailwind.config.js",
      },
      {
        type: "text" as const,
        name: "componentsAlias",
        message: "What import alias / target folder do you want to use for components?",
        initial: "@/components",
      },
      {
        type: "text" as const,
        name: "utilsAlias",
        message: "What import alias do you use for helper utility functions (e.g. cn)?",
        initial: "@/lib/utils",
      },
    ];

    const answers = await prompts(questions);

    if (
      !answers.packageManager ||
      !answers.cssPath ||
      !answers.tailwindConfigPath ||
      !answers.componentsAlias ||
      !answers.utilsAlias
    ) {
      console.log(pc.red("❌ Initialization cancelled. Missing inputs."));
      return;
    }

    const config: Config = {
      style: "default",
      tailwind: {
        config: answers.tailwindConfigPath,
        css: answers.cssPath,
      },
      aliases: {
        components: answers.componentsAlias,
        utils: answers.utilsAlias,
      },
      packageManager: answers.packageManager,
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log(pc.green(`\n✔ Config successfully saved to ${pc.bold(CONFIG_FILE)}`));

    // Ensure utils path and cn helper exists
    const utilsRoot = answers.utilsAlias.startsWith("@/")
      ? answers.utilsAlias.replace("@/", "")
      : answers.utilsAlias;
    const targetUtilsPath = path.join(process.cwd(), utilsRoot + ".ts");

    if (!fs.existsSync(targetUtilsPath)) {
      ensureDirectoryExists(targetUtilsPath);
      const cnCode = `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`;
      fs.writeFileSync(targetUtilsPath, cnCode, "utf-8");
      console.log(pc.green(`✔ Created helper utility function 'cn' at: ${pc.bold(targetUtilsPath)}`));
    }

    console.log(pc.cyan("\n🎉 Lerpa UI initialized successfully! Run 'lerpa add <name>' to fetch items.\n"));
  });

// ADD COMMAND
program
  .command("add <name>")
  .description("Fetch and install a specific component/block from the registry")
  .option("-y, --yes", "Skip verification prompt", false)
  .action(async (name, options) => {
    const config = getConfig();
    if (!config) {
      console.error(pc.red(`❌ Error: Please initialize Lerpa UI first by running 'lerpa init'`));
      process.exit(1);
    }

    const registry = loadRegistry();
    const item = registry.find((x) => x.name === name);

    if (!item) {
      console.error(pc.red(`❌ Error: Component "${name}" not found in registry.`));
      process.exit(1);
    }

    console.log(pc.cyan(`\n📦 Found item "${pc.bold(item.name)}" [type: ${item.type}]`));

    // Ask to confirm if not --yes
    if (!options.yes) {
      const confirm = await prompts({
        type: "confirm",
        name: "value",
        message: `Install "${item.name}" and all its dependencies into your project?`,
        initial: true,
      });
      if (!confirm.value) {
        console.log(pc.yellow("Installation cancelled."));
        return;
      }
    }

    // Resolve dependencies and install them
    const deps = item.dependencies || [];
    if (deps.length > 0) {
      const spinner = ora(`Installing npm dependencies: ${deps.join(", ")}...`).start();
      try {
        const cmd = getInstallCommand(config.packageManager, deps);
        child_process.execSync(cmd, { stdio: "ignore" });
        spinner.succeed(pc.green(`Dependencies installed successfully via ${config.packageManager}`));
      } catch (e) {
        spinner.fail(pc.red("Failed to install npm dependencies."));
        console.error(e);
        process.exit(1);
      }
    }

    // Handle registry dependencies recursively
    const regDeps = item.registryDependencies || [];
    for (const regDep of regDeps) {
      console.log(pc.blue(`🔗 Component "${item.name}" depends on "${regDep}". Processing automatically...`));
      // Call add function recursively/synchronously
      child_process.execSync(`node ${process.argv[1]} add ${regDep} --yes`, { stdio: "inherit" });
    }

    // Write file components
    for (const file of item.files) {
      // Map file path based on component path alias
      const fileBase = path.basename(file.path);
      const isUi = file.path.includes("components/ui/");
      const isBlock = file.path.includes("components/blocks/");
      
      const compRoot = config.aliases.components.startsWith("@/")
        ? config.aliases.components.replace("@/", "")
        : config.aliases.components;

      let relativeTarget = "";
      if (isUi) {
        relativeTarget = path.join(compRoot, "ui", fileBase);
      } else if (isBlock) {
        relativeTarget = path.join(compRoot, "blocks", fileBase);
      } else {
        relativeTarget = path.join(compRoot, fileBase);
      }

      const targetPath = path.join(process.cwd(), relativeTarget);

      // Process content to replace alias imports if needed (e.g. "@/lib/utils" replaced by actual alias)
      let finalContent = file.content;
      if (config.aliases.utils !== "@/lib/utils") {
        finalContent = finalContent.replaceAll("@/lib/utils", config.aliases.utils);
      }
      if (config.aliases.components !== "@/components") {
        finalContent = finalContent.replaceAll("@/components", config.aliases.components);
      }

      if (fs.existsSync(targetPath)) {
        // Identical (e.g. a shared bundled file like use-animation-hooks re-added by a
        // dependency) — skip silently: no prompt, no .bak clutter.
        if (fs.readFileSync(targetPath, "utf-8") === finalContent) {
          continue;
        }
        // --yes auto-overwrites; otherwise confirm.
        if (!options.yes) {
          const overwrite = await prompts({
            type: "confirm",
            name: "value",
            message: `File already exists: ${pc.bold(relativeTarget)}. Overwrite?`,
            initial: true,
          });
          if (!overwrite.value) {
            console.log(pc.yellow(`Skipped ${relativeTarget}`));
            continue;
          }
        }
        backupFile(targetPath);
      }

      ensureDirectoryExists(targetPath);
      fs.writeFileSync(targetPath, finalContent, "utf-8");
      console.log(pc.green(`✔ Wrote file to: ${pc.bold(relativeTarget)}`));
    }

    console.log(pc.green(`\n🎉 Component "${item.name}" successfully added to your project!\n`));
  });

// LIST COMMAND
program
  .command("list")
  .description("List all available components and blocks in the registry")
  .action(() => {
    const registry = loadRegistry();
    const uis = registry.filter((x) => x.type === "registry:ui");
    const blocks = registry.filter((x) => x.type === "registry:block");

    console.log(pc.cyan("\n✨ Available Atomic UI Components (registry:ui):"));
    if (uis.length === 0) {
      console.log(pc.gray("  (No UI components found. Run build script first)"));
    } else {
      uis.forEach((x) => {
        console.log(`  - ${pc.bold(pc.green(x.name))} ${pc.gray(`(Dependencies: ${x.dependencies?.join(", ") || "none"})`)}`);
      });
    }

    console.log(pc.cyan("\n✨ Available High-Fidelity Interactive Blocks (registry:block):"));
    if (blocks.length === 0) {
      console.log(pc.gray("  (No interactive blocks found. Run build script first)"));
    } else {
      blocks.forEach((x) => {
        const regDepsStr = x.registryDependencies ? ` [requires: ${x.registryDependencies.join(", ")}]` : "";
        console.log(`  - ${pc.bold(pc.blue(x.name))}${pc.gray(regDepsStr)}`);
      });
    }
    console.log("");
  });

// SEARCH COMMAND
program
  .command("search [query]")
  .description("Search registry elements for matches")
  .action((query) => {
    const registry = loadRegistry();
    const matches = registry.filter((x) => {
      if (!query) return true;
      return x.name.toLowerCase().includes(query.toLowerCase());
    });

    console.log(pc.cyan(`\n🔍 Found ${matches.length} matching items in registry:`));
    matches.forEach((x) => {
      console.log(`  [${x.type === "registry:ui" ? pc.green("UI") : pc.blue("Block")}] ${pc.bold(x.name)}`);
    });
    console.log("");
  });

// THEME COMMAND
program
  .command("theme")
  .description("Apply a specific color theme values to tailwind CSS file")
  .action(async () => {
    const config = getConfig();
    if (!config) {
      console.error(pc.red(`❌ Error: Lerpa UI is not initialized yet. Run 'lerpa init'`));
      process.exit(1);
    }

    const cssPath = path.join(process.cwd(), config.tailwind.css);
    if (!fs.existsSync(cssPath)) {
      console.error(pc.red(`❌ Error: Global CSS file not found at: ${cssPath}`));
      process.exit(1);
    }

    const themeResponse = await prompts({
      type: "select",
      name: "theme",
      message: "Select a visual color theme to apply:",
      choices: [
        { title: "Zinc (Modern Slate Minimalist)", value: "zinc" },
        { title: "Slate (Corporate Developer Grey)", value: "slate" },
        { title: "Rose (Immersive Warm Gradient)", value: "rose" },
        { title: "Violet (AI Chat Futuristic Purple)", value: "violet" },
        { title: "Orange (Energetic High-Contrast Glow)", value: "orange" },
      ],
    });

    if (!themeResponse.theme) {
      return;
    }

    const themeVariables: Record<string, string> = {
      zinc: `
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
}
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}`,
      slate: `
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}`,
      rose: `
:root {
  --background: 0 0% 100%;
  --foreground: 343 35% 3.9%;
  --primary: 343 90% 46%;
  --primary-foreground: 0 0% 98%;
  --secondary: 343 20% 96%;
  --secondary-foreground: 343 90% 46%;
  --muted: 343 20% 96%;
  --muted-foreground: 343 10% 46%;
  --border: 343 20% 90%;
  --input: 343 20% 90%;
  --ring: 343 90% 46%;
}
.dark {
  --background: 343 35% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 343 90% 60%;
  --primary-foreground: 343 35% 3.9%;
  --secondary: 343 20% 15%;
  --secondary-foreground: 0 0% 98%;
  --muted: 343 20% 15%;
  --muted-foreground: 343 10% 65%;
  --border: 343 20% 15%;
  --input: 343 20% 15%;
  --ring: 343 90% 60%;
}`,
      violet: `
:root {
  --background: 0 0% 100%;
  --foreground: 262.1 83.3% 2%;
  --primary: 262.1 83.3% 58%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 262.1 83.3% 58%;
}
.dark {
  --background: 224 71.4% 4.1%;
  --foreground: 210 20% 98%;
  --primary: 263.4 70% 50.4%;
  --primary-foreground: 210 20% 98%;
  --secondary: 215 27.9% 16.9%;
  --secondary-foreground: 210 20% 98%;
  --muted: 215 27.9% 16.9%;
  --muted-foreground: 217.9 10.6% 64.9%;
  --border: 215 27.9% 16.9%;
  --input: 215 27.9% 16.9%;
  --ring: 263.4 70% 50.4%;
}`,
      orange: `
:root {
  --background: 0 0% 100%;
  --foreground: 20 14.3% 4.1%;
  --primary: 24.6 95% 53.1%;
  --primary-foreground: 60 9.1% 97.8%;
  --secondary: 60 4.8% 95.9%;
  --secondary-foreground: 24.6 95% 53.1%;
  --muted: 60 4.8% 95.9%;
  --muted-foreground: 25 5.3% 44.7%;
  --border: 20 5.9% 90%;
  --input: 20 5.9% 90%;
  --ring: 24.6 95% 53.1%;
}
.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 60 9.1% 97.8%;
  --primary: 20.5 90.2% 48.2%;
  --primary-foreground: 60 9.1% 97.8%;
  --secondary: 12 6.5% 15.1%;
  --secondary-foreground: 60 9.1% 97.8%;
  --muted: 12 6.5% 15.1%;
  --muted-foreground: 24 5.4% 63.9%;
  --border: 12 6.5% 15.1%;
  --input: 12 6.5% 15.1%;
  --ring: 20.5 90.2% 48.2%;
}`,
    };

    backupFile(cssPath);
    const originalCSS = fs.readFileSync(cssPath, "utf-8");

    // Replace existing :root block or append it
    const chosenThemeVars = themeVariables[themeResponse.theme];
    if (originalCSS.includes(":root")) {
      console.log(pc.yellow("⚠️ A :root section was detected in your CSS file. Appending select Lerpa UI variables."));
    }
    
    fs.writeFileSync(cssPath, originalCSS + "\n" + chosenThemeVars, "utf-8");
    console.log(pc.green(`\n✔ Theme "${pc.bold(themeResponse.theme)}" successfully applied to ${pc.bold(config.tailwind.css)}!\n`));
  });

// DOCTOR COMMAND
program
  .command("doctor")
  .description("Validate current workspace configurations and check dependency health status")
  .action(() => {
    console.log(pc.cyan("\n👨‍⚕️ Running Lerpa UI Doctor diagnostic health check...\n"));

    const config = getConfig();
    if (!config) {
      console.error(pc.red(`❌ Diagnostic Fail: No lerpa.json detected. Run 'lerpa init' to configure.`));
      process.exit(1);
    }

    console.log(`[PASS] Config file lerpa.json detected.`);
    console.log(`       Target Package Manager: ${config.packageManager}`);
    console.log(`       Globals Stylesheet: ${config.tailwind.css}`);
    console.log(`       Tailwind configuration: ${config.tailwind.config}`);

    // Check CSS existence
    if (fs.existsSync(path.join(process.cwd(), config.tailwind.css))) {
      console.log(`[PASS] Globals CSS file exists.`);
    } else {
      console.warn(`[WARN] Globals CSS file not found at matching path: ${config.tailwind.css}`);
    }

    // Check packages
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

        const standardChecks = ["lucide-react", "motion", "clsx", "tailwind-merge"];
        standardChecks.forEach((dep) => {
          if (allDeps[dep]) {
            console.log(`[PASS] Found standard dependency: ${dep} (${allDeps[dep]})`);
          } else {
            console.log(`[INFO] Suggestion: ${dep} is not explicitly specified in package.json root. (CLI automatically installs it when components require it)`);
          }
        });
      } catch (e) {
        console.error(`[FAIL] Could not parse package.json. Check syntax integrity.`);
      }
    } else {
      console.warn(`[WARN] No package.json found at project root directory.`);
    }

    console.log(pc.green(`\n✔ Diagnostics complete! System configurations look healthy and ready to go.\n`));
  });

// UPDATE COMMAND
program
  .command("update [name]")
  .description("Update a specific component or all installed components to latest versions")
  .action(async (name) => {
    const config = getConfig();
    if (!config) {
      console.error(pc.red(`❌ Error: Lerpa UI is not initialized yet. Run 'lerpa init'`));
      process.exit(1);
    }

    const registry = loadRegistry();
    
    if (name) {
      // Update specific component
      const item = registry.find((x) => x.name === name);
      if (!item) {
        console.error(pc.red(`❌ Error: Component "${name}" not found in registry.`));
        process.exit(1);
      }
      console.log(pc.cyan(`Updating component: ${name}...`));
      child_process.execSync(`node ${process.argv[1]} add ${name} --yes`, { stdio: "inherit" });
    } else {
      // Update all components currently installed in components/ui or components/blocks directories
      console.log(pc.cyan("Updating all installed Lerpa UI components and blocks..."));
      const compRoot = config.aliases.components.startsWith("@/")
        ? config.aliases.components.replace("@/", "")
        : config.aliases.components;
      
      const uiDir = path.join(process.cwd(), compRoot, "ui");
      const blockDir = path.join(process.cwd(), compRoot, "blocks");

      const installedNames: string[] = [];

      if (fs.existsSync(uiDir)) {
        fs.readdirSync(uiDir).forEach((file) => {
          if (file.endsWith(".tsx")) {
            const componentName = path.basename(file, ".tsx");
            if (registry.some((x) => x.name === componentName)) {
              installedNames.push(componentName);
            }
          }
        });
      }

      if (fs.existsSync(blockDir)) {
        fs.readdirSync(blockDir).forEach((file) => {
          if (file.endsWith(".tsx")) {
            const componentName = path.basename(file, ".tsx");
            if (registry.some((x) => x.name === componentName)) {
              installedNames.push(componentName);
            }
          }
        });
      }

      if (installedNames.length === 0) {
        console.log(pc.yellow("No standard registry components detected in your components folders."));
        return;
      }

      console.log(pc.blue(`Detected ${installedNames.length} components to update: ${installedNames.join(", ")}`));

      for (const componentName of installedNames) {
        console.log(pc.cyan(`\nUpdating ${componentName}...`));
        try {
          child_process.execSync(`node ${process.argv[1]} add ${componentName} --yes`, { stdio: "inherit" });
        } catch (e) {
          console.error(pc.red(`❌ Failed to update component ${componentName}`));
        }
      }
      
      console.log(pc.green("\n🎉 All detected components successfully updated to latest versions!\n"));
    }
  });

// INFO COMMAND
program
  .command("info")
  .description("Display Lerpa UI monorepo CLI metadata info")
  .action(() => {
    console.log(pc.cyan("\n🔥 Lerpa UI Monorepo developer environment metadata:"));
    console.log(`   CLI tool version: ${pc.bold("0.1.0-alpha")}`);
    console.log(`   License terms   : MIT License`);
    console.log(`   Repository URL  : https://github.com/cuibit-labs/lerpaui`);
    console.log(`   Official docs   : https://lerpaui.com`);

    const config = getConfig();
    if (config) {
      console.log(pc.green("\n✔ Local Project configuration details:"));
      console.log(`   Import components alias : ${config.aliases.components}`);
      console.log(`   Import utility alias    : ${config.aliases.utils}`);
      console.log(`   Global CSS file path    : ${config.tailwind.css}`);
      console.log(`   Package Manager Lock    : ${config.packageManager}`);
    } else {
      console.log(pc.yellow("\n⚠️ Lerpa UI is not initialized yet in this directory. Run 'lerpa init'"));
    }
    console.log("");
  });

program.parse(process.argv);
