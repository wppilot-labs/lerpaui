import * as fs from "fs";
import * as path from "path";
import { z } from "zod";

// Define the Zod schema representing the registry item structure
const FileSchema = z.object({
  path: z.string().min(1, "File path cannot be empty"),
  content: z.string().min(1, "File content cannot be empty"),
  type: z.enum([
    "registry:page",
    "registry:component",
    "registry:ui",
    "registry:block",
    "registry:hook",
    "registry:theme",
    "registry:file",
  ]),
});

const RegistryItemSchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/, "Name must contain only lowercase alphanumeric characters and hyphens"),
  type: z.enum(["registry:ui", "registry:block"]),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(FileSchema).min(1, "Each registry item must contain at least one file definition"),
  cssVars: z.object({
    light: z.record(z.string()).optional(),
    dark: z.record(z.string()).optional(),
  }).optional(),
});

const ITEMS_DIR = path.join(__dirname, "../items");

function validateRegistry() {
  console.log("🔍 Running registry validation checks...");

  if (!fs.existsSync(ITEMS_DIR)) {
    console.error(`❌ Items directory not found at: ${ITEMS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(ITEMS_DIR).filter(file => file.endsWith(".json"));
  let hasErrors = false;

  for (const file of files) {
    const filePath = path.join(ITEMS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(content);

      // Validate using Zod schema
      const result = RegistryItemSchema.safeParse(json);
      if (!result.success) {
        console.error(`❌ Validation failed for file ${file}:`);
        console.error(JSON.stringify(result.error.format(), null, 2));
        hasErrors = true;
      } else {
        // Ensure name matches filename
        const expectedName = path.basename(file, ".json");
        if (json.name !== expectedName) {
          console.error(`❌ Filename / Name mismatch in ${file}: expected name to be "${expectedName}", got "${json.name}"`);
          hasErrors = true;
        } else {
          console.log(`✅ ${file} is valid`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to parse or read JSON inside ${file}:`, error);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error("\n🛑 Registry validation failed with errors. Please fix issues before proceeding.\n");
    process.exit(1);
  } else {
    console.log(`\n🎉 All ${files.length} items passed validation checks successfully!\n`);
  }
}

validateRegistry();
