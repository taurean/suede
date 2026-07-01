LLM coding agent process happy path

## 0. Defining the goal
Have a short conversation comprised of short sentences and questions, back and forth with the human user to reach a shared understanding. Use the Q&A format when available and appropriate.

## 1. Task prep
1.  Create a new git worktree to begin a new task
2.  Pull the latest version of `main` from `origin`
3. Create a new branch from `origin/main`
4. read the system map for the codebase
5. Invoke the `slice-brief` skill to produce a slice-brief
6. Create a draft PR on github with title and the slice-brief as the body of the PR

## 2. Task identification type
1. Assess if this is a:
A. bug to address
B. a refactor
C. new feature
D. meta task such as documentation
E. Follow up on in-flight PR work

## 3A. Bug to address
1. Confirm issue still exists
2A. If bug is reproducible, leave a comment in PR instructing how to reproduce the issue
3. Trace the code path to identify the root cause
4. Fix one affected path at a time
5. Verify the fix resolves that reproduction step
6. Repeat steps 4 and 5 for each remaining affected path
7. Invoke the review skill against the branch

2B. if bug no longer exists, leave a comment stating so explicitly along with your explanation for why.

## 3B. Refactor
1. Run the verification suite to establish a green baseline before touching anything
2. Refactor one module or area at a time without altering observable behavior
3. Verify no regression after each slice
4. Repeat steps 2 and 3 until the refactor is complete
5. Document the rationale (the why, not the what) in the PR description

## 3C. new feature
1. Build one vertical slice of the task
2. Add optional tests for that slice
3. Repeat steps 2.1 and 2.2 as needed until user work completion

## 3D. Meta task such as documentation
1. Identify all files that need to be created or updated
2. Read related existing documentation for consistency and context
3. Complete one document or section at a time
4. Verify any code examples or commands in that section still work
5. Repeat steps 3 and 4 until all content is complete

## 3E. Follow up on in-flight PR work
1. Pull latest change from `origin/main`
2. Create new git worktree for existing PR
3. Switch active branch in git worktree to the branch related to the PR
4. Continue with the appropriate task type

## 4. Share changes
1. Push changes for review in the PR.
2. Add a PR comment calling out where the human reviewer should focus
3. Delete local worktree
4. Change active branch to `main` and pull latest changes from `origin
