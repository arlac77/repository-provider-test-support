
export async function branchListTest(t, provider, pattern, expected) {
    const rs = {};
  
    for await (const r of provider.branches(pattern)) {
      rs[r.fullCondensedName] = r;
    }
  
    console.log(rs);
    if(typeof expected === 'number') {
      t.truthy(expected < Object.keys(rs).length, `expected at least ${expected} but got only ${Object.keys(rs).length} entries for ${pattern}`);
      return;
    }
  
    if (expected === undefined) {
      t.is(Object.keys(rs).length, 0, `there should not by any branch for ${pattern}`);
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
      typeof expected === 'number' ? ">#" + expected : expected ? "["+Object.keys(expected)+']' : "not present"
    }`.trim();
  