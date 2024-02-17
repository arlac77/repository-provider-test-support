[![npm](https://img.shields.io/npm/v/repository-provider-test-support.svg)](https://www.npmjs.com/package/repository-provider-test-support)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript\&label\&labelColor=blue\&color=555555)](https://typescriptlang.org)
[![bundlejs](https://deno.bundlejs.com/?q=repository-provider-test-support\&badge=detailed)](https://bundlejs.com/?q=repository-provider-test-support)
[![downloads](http://img.shields.io/npm/dm/repository-provider-test-support.svg?style=flat-square)](https://npmjs.org/package/repository-provider-test-support)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/repository-provider-test-support.svg?style=flat-square)](https://github.com/arlac77/repository-provider-test-support/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Frepository-provider-test-support%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/repository-provider-test-support/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/repository-provider-test-support/badge.svg)](https://snyk.io/test/github/arlac77/repository-provider-test-support)
[![Coverage Status](https://coveralls.io/repos/arlac77/repository-provider-test-support/badge.svg)](https://coveralls.io/github/arlac77/repository-provider-test-support)

# repository-provider-test-support

test support for repository providers

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [generateBranchName](#generatebranchname)
    *   [Parameters](#parameters)
*   [generateBranchName](#generatebranchname-1)
    *   [Parameters](#parameters-1)

## generateBranchName

### Parameters

*   `repository` &#x20;
*   `pattern` &#x20;

## generateBranchName

find a new branch name for a given pattern
'*' will be replaced by a number
'something/*' will get to something/1 something/2 ...

### Parameters

*   `repository` **Repository**&#x20;
*   `pattern` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**&#x20;

# install

With [npm](http://npmjs.org) do:

```shell
npm install repository-provider-test-support
```

# license

BSD-2-Clause
