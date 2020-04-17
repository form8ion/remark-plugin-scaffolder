import {scaffold as scaffoldCucumber} from '@form8ion/cucumber-scaffolder';

export default async function ({projectRoot, tests}) {
  if (tests.integration) {
    return scaffoldCucumber({projectRoot});
  }

  return {};
}
