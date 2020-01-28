import { StringContentEntry } from "content-entry";

export async function pullRequestLivecycle(t, provider, repoName) {
    const repository = await provider.repository(repoName);
  
    const name = await generateBranchName(repository, "pr-test/*");
  
    const destination = await repository.defaultBranch;
    const source = await destination.createBranch(name);
  
    const commit = await source.commit("message text", [
      new StringContentEntry("README.md", `file content #${name}`)
    ]);
  
    const pr = await provider.pullRequestClass.open(source, destination, {
      title: `test pr from ${name}`,
      body: "this is the body\n- a\n- b\n- c"
    });
  
    t.is(pr.source, source, "pull request source");
    t.is(pr.destination, destination, "pull request destination");
    t.true(pr.number !== undefined, "pull request number");
  
    t.is(pr.title, `test pr from ${name}`, "pull request title");
    t.is(pr.body, "this is the body\n- a\n- b\n- c", "pull request body");
    t.is(pr.state, "OPEN", "pull request state");
    t.is(pr.locked, false, "pull request locked");
    t.is(pr.merged, false, "pull request merged");
  
    let foundInList = false;

    for await (const p of provider.pullRequestClass.list(repository)) {
      if(pr.equals(p)) {
        foundInList = true;
      }
      console.log("LIST", p, p.title, pr.number, p.number, pr.equals(p));
    }

    t.true(foundInList,'pr found in list');
    //await pr.decline();
    await source.delete();
  }
  
  /**
 * find a new branch name for a given pattern
 * '*' will be replaced by a number
 * 'something/*' will get to something/1 something/2 ...
 * @param {Repository} repository
 * @param {string} pattern
 */
async function generateBranchName(repository, pattern) {
  let n = 1;

  for await (const b of repository.branches(pattern)) {
    n++;
  }

  const name = pattern.replace(/\*/, n);
  return name;
}
