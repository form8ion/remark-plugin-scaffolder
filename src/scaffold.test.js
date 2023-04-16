import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as scaffoldTesting from './testing.js';
import scaffold from './scaffold.js';

vi.mock('./testing.js');

describe('scaffold', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize the plugin', async () => {
    const projectRoot = any.string();
    const projectName = any.string();
    const packageName = any.string();
    const tests = any.simpleObject();
    const testingResults = any.simpleObject();
    when(scaffoldTesting.default)
      .calledWith({projectRoot, projectName, packageName, tests})
      .mockResolvedValue(testingResults);

    expect(await scaffold({projectRoot, projectName, packageName, tests}))
      .toEqual({...testingResults, tags: ['remark-plugin']});
  });
});
