import { generateStaticDataFile } from '../lib/generate-static-data';

async function main() {
    console.log('Generating static data...');
    try {
        await generateStaticDataFile();
        console.log('Static data generated successfully!');
    } catch (error) {
        console.error('Error generating static data:', error);
        process.exit(1);
    }
}

main();
