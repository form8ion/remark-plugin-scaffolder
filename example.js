// #### Import
// remark-usage-ignore-next 2
import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import {scaffold} from './lib/index.cjs';

// remark-usage-ignore-next 4
stubbedFs({
  node_modules: stubbedFs.load(resolve(__dirname, 'node_modules')),
  templates: stubbedFs.load(resolve(__dirname, 'templates')),
  'package.json': JSON.stringify({})
});

// #### Execute

scaffold({
  projectRoot: process.cwd(),
  projectName: 'name-of-the-project',
  packageName: '@scope/name-of-the-package',
  tests: {integration: true}
});
