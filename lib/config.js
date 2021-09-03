import fs from 'fs';
import yaml from 'js-yaml';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const configYaml = fs.readFileSync(join(thisDir, '../config.yaml'));

export const config = yaml.load(configYaml);
