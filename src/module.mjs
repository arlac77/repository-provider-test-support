import { StringContentEntry } from "content-entry";
import { generateBranchName } from "./util.mjs";

export * from "./group-test.mjs";
export * from "./repository-list-test.mjs";
export * from "./repository-owner-test.mjs";
export * from "./branch-list-test.mjs";
export * from "./tag-list-test.mjs";
export * from "./provider-test.mjs";
export * from "./repository-test.mjs";
export * from "./pull-request-test.mjs";
export * from "./entry-list-test.mjs";
export * from "./messages.mjs";

export const REPOSITORY_NAME = "arlac77/sync-test-repository";
export const REPOSITORY_NAME_GITHUB_HTTP = `https://github.com/${REPOSITORY_NAME}.git`;
export const REPOSITORY_NAME_GITHUB_GIT = `git@github.com:${REPOSITORY_NAME}.git`;
export const REPOSITORY_NAME_WITH_BRANCH = REPOSITORY_NAME + "#preserve-for-test";


export async function assertBranch(t, branch, fixture, url) {
  if (fixture === undefined) {
    t.is(branch, undefined, `no branch at ${url}`);
  } else {
    //    t.truthy(branch, `missing branch ${url}`);

    if (fixture.branch !== undefined) {
      t.is(branch.name, fixture.branch, `branch.name ${url}`);
    }
    if (fixture.provider && branch !== undefined) {
      t.is(branch.provider.constructor, fixture.provider, `provider ${url}`);
    }
  }
}

export async function assertRepo(t, repository, fixture, url) {
  if (fixture === undefined) {
    t.is(repository, undefined, `no repo at ${url}`);
  } else {
    t.truthy(repository, `missing repo '${url}'`);

    for (const [name, e] of Object.entries(fixture)) {
      const r = repository[name];

      switch (name) {
        case "branch":
        case "owner":
        case "hooks":
        case "entries":
          continue;
          break;
        case "provider":
          t.true(r instanceof e);
          continue;
      }

      t.truthy(
        r !== undefined,
        `missing expected repository ${name} in (${Object.keys(
          repository
        )}) ${url}`
      );

      t.is(e, r, `${e} ${url}`);
    }

    if (fixture.owner) {
      if (fixture.owner.name !== undefined) {
        t.is(
          repository.owner.name,
          fixture.owner.name,
          `repository.owner.name ${url}`
        );
      }

      if (fixture.owner.id !== undefined) {
        t.is(
          repository.owner.id,
          fixture.owner.id,
          `repository.owner.id ${url}`
        );
      }
      if (fixture.owner.uuid !== undefined) {
        t.is(
          repository.owner.uuid,
          fixture.owner.uuid,
          `repository.owner.uuid ${url}`
        );
      }
    }

    if (fixture.hooks) {
      for await (const h of repository.hooks()) {
        const fh = fixture.hooks.find(x => x.id === h.id);
        if (fh) {
          t.is(h.id, fh.id, `hooks.id ${url}`);
          t.is(h.url, fh.url, `hooks.url ${url}`);
          t.is(h.active, fh.active, `hooks.active ${url}`);
          t.deepEqual(h.events, fh.events, `hooks.events ${url}`);
        }
      }
    }

    if (fixture.entries) {
      const branch = await repository.branch("master");
      const entries = new Map();
      for await (const entry of branch) {
        entries.set(entry.name, entry);
      }

      for (const [name, content] of Object.entries(fixture.entries)) {
        t.truthy(entries.get(name), `entry ${name}`);
      }
    }
  }
}

export async function assertCommit(t, repository, entryName = "README.md") {
  const branchName = await generateBranchName(repository, "commit-test/*");
  const branch = await repository.createBranch(branchName);
  try {
    const commit = await branch.commit("message text", [
      new StringContentEntry(entryName, `file content #${branchName}`)
    ]);

    t.truthy(commit, "commit present");
    t.is(commit.ref, `refs/heads/${branchName}`);
  } finally {
    await repository.deleteBranch(branchName);
  }
}
