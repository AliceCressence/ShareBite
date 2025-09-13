# Contributing to ShearBite

First off, thank you for considering contributing to ShearBite! It's people like you that make ShearBite such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, [make one](https://github.com/AliceCressence/ShareBite/issues/new)! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

### Fork & create a branch

If this is something you think you can fix, then [fork ShearBite](https://github.com/AliceCressence/ShareBite/fork) and create a branch with a descriptive name.

A good branch name would be (where issue #38 is the ticket you're working on):

```bash
git checkout -b 38-add-awesome-new-feature
```

### Get the test suite running

Make sure you're running the test suite locally. This will help you catch any regressions you might introduce.

### Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first :smile_cat:

### Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with ShearBite's master branch:

```bash
git remote add upstream git@github.com:AliceCressence/ShareBite.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```bash
git checkout 38-add-awesome-new-feature
git rebase master
git push --force-with-lease origin 38-add-awesome-new-feature
```

Finally, go to GitHub and [make a Pull Request](https://github.com/AliceCressence/ShareBite/compare) :D

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing and merging, check out this guide on [merging vs. rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing).

## Merging a PR (for maintainers)

A PR can only be merged by a maintainer if:

- It has been approved by at least one other maintainer. If it was a simple fix, it can be approved by the author.
- It has no requested changes.
- It is up to date with current master.
- All CI checks are passing.

If a PR has been sitting for more than a week, the maintainer who approved it should merge it.
