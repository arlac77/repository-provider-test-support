
export async function branchListTest(t, provider, pattern, expected, withProviderName=false) {
    const rs = {};
  
    for await (const r of provider.branches(pattern)) {
      rs[withProviderName ? r.provider.name + '/' + r.fullCondensedName : r.fullCondensedName] = r;
    }
  
    if(typeof expected === 'number') {
      const length = Object.keys(rs).length;
      t.truthy(expected <= length, `expected at least ${expected} but got only ${length} entries for ${pattern}`);
      return;
    }
  
    if (expected === undefined) {
      t.is(Object.keys(rs).length, 0, `there should not be any branch for ${pattern}`);
    } else {
      for (const [name,e] of Object.entries(expected)) {
        const r = rs[name];
  
        t.truthy(r !== undefined, `missing expected branch ${name} in (${Object.keys(rs)})`);
  
        for (const key of Object.keys(e)) {
          t.is(r[key], e[key], `${name}.${key}`);
        }
      }
    }
  }
  
  branchListTest.title = (
    providedTitle = "branch list",
    provider,
    pattern,
    expected
  ) =>
    `${providedTitle} ${pattern===undefined?'undefined':'"'+pattern+'"'} ${
      typeof expected === 'number' ? ">=#" + expected : expected ? "["+Object.keys(expected)+']' : "not present"
    }`.trim();
  
