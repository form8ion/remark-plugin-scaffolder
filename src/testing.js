import {resolve, dirname} from 'node:path';
import {promises as fs} from 'node:fs';
import {fileURLToPath} from 'node:url';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import camelcase from 'camelcase';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

const __dirname = dirname(fileURLToPath(import.meta.url));                  // eslint-disable-line no-underscore-dangle

export default async function ({projectRoot, projectName, packageName, tests}) {
  if (tests.integration) {
    const [cucumberResults] = await Promise.all([
      scaffoldCucumber({projectRoot}),
      fs.mkdir(`${projectRoot}/test/integration/features/step_definitions`, {recursive: true})
    ]);

    await fs.writeFile(
      `${projectRoot}/test/integration/features/step_definitions/common-steps.js`,
      mustache.render(
        await fs.readFile(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8'),
        {projectName: camelcase(projectName), packageName}
      )
    );

    return deepmerge(
      {dependencies: {javascript: {development: ['remark']}}, scripts: {'pretest:integration:base': 'run-s build'}},
      cucumberResults
    );
  }

  return {};
}
