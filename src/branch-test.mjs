export async function assertBranchUpdateAttributes(t, branch) {
  branch.updateAttributes({ protected: true });
  t.is(branch.isProtected, true);
}
