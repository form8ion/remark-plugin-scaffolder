import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import mustache from 'mustache';
import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as mkdir from '../thirdparty-wrappers/make-dir';
import * as camelcase from '../thirdparty-wrappers/camelcase';
import scaffoldTesting from './testing';

vi.mock('node:fs');
vi.mock('mustache');
vi.mock('@form8ion/cucumber-scaffolder');
vi.mock('../thirdparty-wrappers/make-dir');
vi.mock('../thirdparty-wrappers/camelcase');

describe('testing', () => {
  const projectRoot = any.string();
  const projectName = any.word();
  const packageName = any.word();
  const camelizedProjectName = any.word();
  const pathToCreatedDirectory = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a canary cucumber test when the project will be integration tested', async () => {
    const cucumberDevDependencies = any.listOf(any.word);
    const cucumberResults = {...any.simpleObject(), devDependencies: cucumberDevDependencies};
    const renderedContent = any.string();
    const templateContent = any.string();
    when(mkdir.default)
      .calledWith(`${projectRoot}/test/integration/features/step_definitions`)
      .mockResolvedValue(pathToCreatedDirectory);
    when(cucumberScaffolder.scaffold).calledWith({projectRoot}).mockReturnValue(cucumberResults);
    when(fs.readFile)
      .calledWith(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8')
      .mockResolvedValue(templateContent);
    when(camelcase.default).calledWith(projectName).mockReturnValue(camelizedProjectName);
    when(mustache.render)
      .calledWith(templateContent, {projectName: camelizedProjectName, packageName})
      .mockReturnValue(renderedContent);

    expect(await scaffoldTesting({projectRoot, projectName, packageName, tests: {integration: true}}))
      .toEqual({
        ...cucumberResults,
        devDependencies: ['remark', 'package-preview', ...cucumberDevDependencies],
        scripts: {'pretest:integration:base': 'preview'}
      });
    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedDirectory}/common-steps.js`, renderedContent);
  });

  it('should not create a canary test when the project will not be integration tested', async () => {
    expect(await scaffoldTesting({projectRoot, projectName, tests: {integration: false}})).toEqual({});
    expect(cucumberScaffolder.scaffold).not.toHaveBeenCalled();
  });
});
