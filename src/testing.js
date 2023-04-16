import {resolve} from 'node:path';
import {promises as fs} from 'node:fs';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import camelcase from '../thirdparty-wrappers/camelcase';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, projectName, packageName, tests}) {
  if (tests.integration) {
    const [stepDefinitionsDirectory, cucumberResults] = await Promise.all([
      mkdir(`${projectRoot}/test/integration/features/step_definitions`),
      scaffoldCucumber({projectRoot})
    ]);

    await fs.writeFile(
      `${stepDefinitionsDirectory}/common-steps.js`,
      mustache.render(
        await fs.readFile(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8'),
        {projectName: camelcase(projectName), packageName}
      )
    );

    return deepmerge(
      {devDependencies: ['remark', 'package-preview'], scripts: {'pretest:integration:base': 'preview'}},
      cucumberResults
    );
  }

  return {};
}
