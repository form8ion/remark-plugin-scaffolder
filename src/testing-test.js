import * as cucumberScaffolder from '@form8ion/cucumber-scaffolder';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import scaffoldTesting from './testing';

suite('testing', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(cucumberScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that a canary cucumber test is created when the project will be integration tested', async () => {
    const cucumberResults = any.simpleObject();
    cucumberScaffolder.scaffold
      .withArgs({projectRoot})
      .returns(cucumberResults);

    assert.deepEqual(await scaffoldTesting({projectRoot, tests: {integration: true}}), cucumberResults);
  });

  test('that no canary test is created when the project will not be integration tested', async () => {
    assert.deepEqual(await scaffoldTesting({projectRoot, tests: {integration: false}}), {});
    assert.notCalled(cucumberScaffolder.scaffold);
  });
});
