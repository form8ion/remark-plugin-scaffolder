import {promises as fs} from 'node:fs';
import {resolve} from 'node:path';
import mustache from 'mustache';
import deepmerge from 'deepmerge';
import * as camelcase from 'camelcase';
import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import scaffoldTesting from './testing.js';

vi.mock('node:fs');
vi.mock('mustache');
vi.mock('camelcase');
vi.mock('deepmerge');
vi.mock('@form8ion/cucumber-scaffolder');

describe('testing', () => {
  const projectRoot = any.string();
  const projectName = any.word();
  const packageName = any.word();
  const camelizedProjectName = any.word();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a canary cucumber test when the project will be integration tested', async () => {
    const cucumberResults = any.simpleObject();
    const mergedResults = any.simpleObject();
    const renderedContent = any.string();
    const templateContent = any.string();
    when(cucumberScaffolder.scaffold).calledWith({projectRoot}).thenReturn(cucumberResults);
    when(fs.readFile)
      .calledWith(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8')
      .thenResolve(templateContent);
    when(camelcase.default).calledWith(projectName).thenReturn(camelizedProjectName);
    when(mustache.render)
      .calledWith(templateContent, {projectName: camelizedProjectName, packageName})
      .thenReturn(renderedContent);
    when(deepmerge)
      .calledWith(
        {dependencies: {javascript: {development: ['remark']}}, scripts: {'pretest:integration:base': 'run-s build'}},
        cucumberResults
      )
      .thenReturn(mergedResults);

    expect(await scaffoldTesting({projectRoot, projectName, packageName, tests: {integration: true}}))
      .toEqual(mergedResults);
    expect(fs.mkdir)
      .toHaveBeenCalledWith(`${projectRoot}/test/integration/features/step_definitions`, {recursive: true});
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/test/integration/features/step_definitions/common-steps.js`,
      renderedContent
    );
  });

  it('should not create a canary test when the project will not be integration tested', async () => {
    expect(await scaffoldTesting({projectRoot, projectName, tests: {integration: false}})).toEqual({});
    expect(cucumberScaffolder.scaffold).not.toHaveBeenCalled();
  });
});
