import scaffoldTesting from './testing';

export default async function ({projectRoot, projectName, tests}) {
  const testingResults = await scaffoldTesting({projectRoot, projectName, tests});

  return {...testingResults, tags: ['remark-plugin']};
}
