import fs from "fs";
import path from "path";

/**
 * Copies a directory's contents to a destination.
 * @param sourceDir - The source directory path.
 * @param destinationDir - The destination directory path.
 */
const copyDirectory = (sourceDir: string, destinationDir: string): void => {
    if (!fs.existsSync(sourceDir)) {
        console.error(`Source directory "${sourceDir}" does not exist.`);
        return;
    }

    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
    }

    fs.readdirSync(sourceDir).forEach((file: string) => {
        const sourcePath = path.join(sourceDir, file);
        const destinationPath = path.join(destinationDir, file);

        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, destinationPath);
        } else if (fs.lstatSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, destinationPath);
        }
    });
};

/**
 * Copies templates, styles, and fonts to the destination directory.
 */
const copyTemplates = (): void => {
    const templatesSource = path.join(__dirname, "src/templates");
    const templatesDestination = path.join(__dirname, "dist/templates");

    // Copy the templates directory
    copyDirectory(templatesSource, templatesDestination);

    // Copy the styles file
    const stylesSource = path.join(__dirname, "src/assets/styles/main.css");
    const stylesDestinationDir = path.join(templatesDestination, "styles");

    if (!fs.existsSync(stylesDestinationDir)) {
        fs.mkdirSync(stylesDestinationDir, { recursive: true });
    }

    const stylesDestination = path.join(stylesDestinationDir, "main.css");

    if (fs.existsSync(stylesSource)) {
        fs.copyFileSync(stylesSource, stylesDestination);
        console.log(`Stylesheet copied to "${stylesDestination}"`);
    } else {
        console.error(`Stylesheet "${stylesSource}" does not exist.`);
    }

    // Copy the fonts directory
    const fontsSource = path.join(__dirname, "src/assets/fonts");
    const fontsDestination = path.join(templatesDestination, "fonts");

    copyDirectory(fontsSource, fontsDestination);

    console.log(`Templates copied to "${templatesDestination}"`);
    console.log(`Fonts copied to "${fontsDestination}"`);
};

// Execute the function to copy the files
copyTemplates();
