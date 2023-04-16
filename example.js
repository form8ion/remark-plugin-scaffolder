// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffold} from './lib/index.js';

// remark-usage-ignore-next 5
stubbedFs({
  node_modules: stubbedFs.load('node_modules'),
  templates: stubbedFs.load('templates'),
  'package.json': JSON.stringify({})
});

// #### Execute

scaffold({
  projectRoot: process.cwd(),
  projectName: 'name-of-the-project',
  packageName: '@scope/name-of-the-package',
  tests: {integration: true}
});
