import { StringContentEntry } from "content-entry";
import { generateBranchName } from "./util.mjs";

export * from "./group-list-test.mjs";
export * from "./repository-list-test.mjs";
export * from "./provider-test.mjs";
export * from "./repository-equality-test.mjs";
export * from "./pull-request-test.mjs";
export * from "./entry-list-test.mjs";

export async function assertBranch(t, branch, fixture, url) {
  if (fixture === undefined) {
    t.is(branch, undefined, `no branch at ${url}`);
  } else {
    t.truthy(branch, `missing branch ${url}`);

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
    t.truthy(repository, `missing repo ${url}`);

    if (fixture.provider) {
      t.is(
        repository.provider.constructor,
        fixture.provider,
        `provider ${url}`
      );
    }

    if (fixture.name !== undefined) {
      t.is(repository.name, fixture.name, `repository.name ${url}`);
    }

    if (fixture.fullName !== undefined) {
      t.is(repository.fullName, fixture.fullName, `repository.fullName ${url}`);
    }

    if (fixture.condensedName !== undefined) {
      t.is(
        repository.condensedName,
        fixture.condensedName,
        `repository.condensedName ${url}`
      );
    }

    if (fixture.description !== undefined) {
      t.is(
        repository.description,
        fixture.description,
        `repository.description ${url}`
      );
    }

    if (fixture.uuid !== undefined) {
      t.is(repository.uuid, fixture.uuid, `repository.uuid ${url}`);
    }

    if (fixture.id !== undefined) {
      t.is(repository.id, fixture.id, `repository.id ${url}`);
    }

    if (fixture.isArchived !== undefined) {
      t.is(
        repository.isArchived,
        fixture.isArchived,
        `repository.isArchived ${url}`
      );
    }

    if (fixture.isLocked !== undefined) {
      t.is(repository.isLocked, fixture.isLocked, `repository.isLocked ${url}`);
    }

    if (fixture.isDisabled !== undefined) {
      t.is(
        repository.isLocked,
        fixture.isDisabled,
        `repository.isDisabled ${url}`
      );
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

    t.is(commit.ref, `refs/heads/${branchName}`);
  } finally {
    await repository.deleteBranch(branchName);
  }
}
