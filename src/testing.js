import {resolve} from 'path';
import {promises as fs} from 'fs';
import deepmerge from 'deepmerge';
import mustache from 'mustache';
import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';
import camelcase from '../thirdparty-wrappers/camelcase';
import mkdir from '../thirdparty-wrappers/make-dir';

export default async function ({projectRoot, projectName, tests}) {
  if (tests.integration) {
    const [stepDefinitionsDirectory, cucumberResults] = await Promise.all([
      mkdir(`${projectRoot}/test/integration/features/step_definitions`),
      scaffoldCucumber({projectRoot})
    ]);

    await fs.writeFile(
      `${stepDefinitionsDirectory}/common-steps.js`,
      mustache.render(
        await fs.readFile(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8'),
        {projectName: camelcase(projectName)}
      )
    );

    return deepmerge({devDependencies: ['remark']}, cucumberResults);
  }

  return {};
}
