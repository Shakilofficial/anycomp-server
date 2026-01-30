import fs from 'fs';
import path from 'path';

// Capitalize utility
const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

// Main module generator
const createModule = (moduleName: string): void => {
    const baseDir = path.join(__dirname, '..', 'modules', moduleName);

    // Files to generate
    const files = [
        `${moduleName}.routes.ts`,
        `${moduleName}.controller.ts`,
        `${moduleName}.service.ts`,
        `${moduleName}.interface.ts`,
        `${moduleName}.validation.ts`,
        `${moduleName}.constant.ts`,
        `${moduleName}.utils.ts`,
    ];

    // Create module folder
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
        console.log(`📁 Created directory: ${baseDir}`);
    } else {
        console.log(`ℹ️ Directory exists: ${baseDir}`);
    }

    // Loop and create files
    files.forEach(file => {
        const filePath = path.join(baseDir, file);

        if (fs.existsSync(filePath)) {
            console.log(`⏭️ Exists: ${file}`);
            return;
        }

        let content = '';

        if (file.endsWith('.routes.ts')) {
            content = `import { Router } from 'express';
import { ${capitalize(moduleName)}Controllers } from './${moduleName}.controller';

const router = Router();

// Define routes

export const ${capitalize(moduleName)}Routes = router;
`;
        } else if (file.endsWith('.controller.ts')) {
            content = `import { Request, Response } from 'express';
import { ${capitalize(moduleName)}Services } from './${moduleName}.service';

export const ${capitalize(moduleName)}Controllers = {};
`;
        } else if (file.endsWith('.service.ts')) {
            content = `import { I${capitalize(moduleName)} } from './${moduleName}.interface';

export const ${capitalize(moduleName)}Services = {};
`;
        } else if (file.endsWith('.interface.ts')) {
            content = `export interface I${capitalize(moduleName)} {
  // Define fields
}
`;
        } else if (file.endsWith('.validation.ts')) {
            content = `import { z } from 'zod';

export const ${capitalize(moduleName)}Validations = {
  // Define schemas
};
`;
        } else if (file.endsWith('.constant.ts')) {
            content = `export const ${capitalize(moduleName)}Constants = {
  // Add constants
};
`;
        } else if (file.endsWith('.utils.ts')) {
            content = `export const ${capitalize(moduleName)}Utils = {
  // Utility functions
};
`;
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`📄 Created: ${file}`);
    });
};

// Read module name
const moduleName = process.argv[2];
if (!moduleName) {
    console.error('❌ Error: Please provide a module name.');
    process.exit(1);
}

createModule(moduleName);
console.log(`\n🎉 Module "${moduleName}" generated successfully!\n`);
