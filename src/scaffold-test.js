import any from '@travi/any';
import {assert} from 'chai';
import sinon from 'sinon';
import * as scaffoldTesting from './testing';
import scaffold from './scaffold';

suite('scaffold', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(scaffoldTesting, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the plugin is initialized', async () => {
    const projectRoot = any.string();
    const projectName = any.string();
    const tests = any.simpleObject();
    const testingResults = any.simpleObject();
    scaffoldTesting.default.withArgs({projectRoot, projectName, tests}).resolves(testingResults);

    assert.deepEqual(await scaffold({projectRoot, projectName, tests}), testingResults);
  });
});
