import scaffoldTesting from './testing';

export default async function ({projectRoot, projectName, packageName, tests}) {
  const testingResults = await scaffoldTesting({projectRoot, projectName, packageName, tests});

  return {...testingResults, tags: ['remark-plugin']};
}
