import {promises as fs} from 'fs';
import {resolve} from 'path';
import mustache from 'mustache';
import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as mkdir from '../thirdparty-wrappers/make-dir';
import * as camelcase from '../thirdparty-wrappers/camelcase';
import scaffoldTesting from './testing';

suite('testing', () => {
  let sandbox;
  const projectRoot = any.string();
  const projectName = any.word();
  const camelizedProjectName = any.word();
  const pathToCreatedDirectory = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(mkdir, 'default');
    sandbox.stub(mustache, 'render');
    sandbox.stub(camelcase, 'default');
    sandbox.stub(cucumberScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that a canary cucumber test is created when the project will be integration tested', async () => {
    const cucumberDevDependencies = any.listOf(any.word);
    const cucumberResults = {...any.simpleObject(), devDependencies: cucumberDevDependencies};
    const renderedContent = any.string();
    const templateContent = any.string();
    mkdir.default
      .withArgs(`${projectRoot}/test/integration/features/step_definitions`)
      .resolves(pathToCreatedDirectory);
    cucumberScaffolder.scaffold
      .withArgs({projectRoot})
      .returns(cucumberResults);
    fs.readFile
      .withArgs(resolve(__dirname, '..', 'templates', 'common-steps.mustache'), 'utf8')
      .resolves(templateContent);
    camelcase.default.withArgs(projectName).returns(camelizedProjectName);
    mustache.render.withArgs(templateContent, {projectName: camelizedProjectName}).returns(renderedContent);

    assert.deepEqual(
      await scaffoldTesting({projectRoot, projectName, tests: {integration: true}}),
      {
        ...cucumberResults,
        devDependencies: ['remark', ...cucumberDevDependencies],
        scripts: {'pretest:integration:base': 'npm run build:js'}
      }
    );
    assert.calledWith(
      fs.writeFile,
      `${pathToCreatedDirectory}/common-steps.js`,
      // resolve(__dirname, '..', 'templates', 'common-steps.mustache'),
      renderedContent
    );
  });

  test('that no canary test is created when the project will not be integration tested', async () => {
    assert.deepEqual(await scaffoldTesting({projectRoot, projectName, tests: {integration: false}}), {});
    assert.notCalled(cucumberScaffolder.scaffold);
  });
});
