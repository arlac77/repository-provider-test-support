export async function assertBranchUpdateAttributes(t, branch) {
  branch.updateAttributes({ protected: true });
  t.is(branch.isProtected, true);

  branch.updateAttributes({ protected: false });
  t.is(branch.isProtected, false);
}
