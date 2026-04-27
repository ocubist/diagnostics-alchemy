# Package-Template

## Initialize Project

**When creating a new package, run these commands**

Note, that you have to manually set the uncommented command to delete the git metadata, depending on the environment. Default is Powershell, but UNIX is available.

```bash
# Clone the template repository into the current directory
git clone https://github.com/ocubist/package-template.git .

# Remove the git metadata
Remove-Item -Recurse -Force .git # For Windows PowerShell
# rm -rf .git # For Unix-like systems (macOS, Linux)

# Initialize Git and create branches
git init
git add .
git commit -m "Setup Environment from Package-Template"
git checkout -b develop

# Install basic packages
npm install --save-dev typescript@latest
npm install --save-dev typedoc@latest
npm install --save-dev ts-node@latest
npm install --save-dev ts-jest @types/jest@latest
npm install --save-dev rimraf@latest
npm install --save-dev typedoc

# Install @ocubist packages
npm install @ocubist/error-alchemy@latest
npm install @ocubist/singleton-manager@latest
npm install @ocubist/http-request-handler@latest
```

## Update template-files from `package-template`

```bash
# Checkout the develop branch
# git checkout develop

# Add the template repository as a remote
git remote add package-template https://github.com/ocubist/package-template.git

# Fetch updates from the template repository
git fetch package-template

# Merge the template repository into your develop branch
git merge package-template/main --allow-unrelated-histories

# Remove the template repository remote
git remote remove package-template
```

> Make sure to solve all Conflicts, otherwise the remote won't be removed again.

> Make sure the remote of `package-template` will be removed

## Publish Documentation to github-pages and/or Package to npm

In `.env.github` set the `GHPW_AUTO_PUBLISH_PROJECT` to `true` to auto-publish the package to npm and publish the docs automatically.

Even if `GHPW_AUTO_PUBLISH_PROJECT` is set to true, if `src/` had no recent changes, it will be ignored.

> Only activate the workflow for _public_ repos or with a subscription-model for _GitHub_ and _npmjs_. It won't work for _private_ repos otherwise.\*\*

> The file `.env.github` must be existent at the root and the variable `GHPW_AUTO_PUBLISH_PROJECT` must be set, otherwise the workflow `publish-to-npm-and-deploy-docs` throws an error.

### Run Tests

In `.env.github` set the `GHPW_RUN_TESTS` to `true` to run jest-tests before publishing the documentation or the package. When enabled, the publishing-workflow will terminate with an error if the tests fail.

> If activated and there are no tests, it will throw an error and terminate the publishing-workflow

### Publish Documentation as _GitHub-Page_

In `.env.github` set the `GHPW_PUBLISH_DOCUMENTATION` to `true` to publish the documentation. It will use a branch `gh-pages-docs` for the docs.

For it to deploy to _GitHub-Page_ you must setup the _Page_ under _Settings_.

> Setup the page at **Repo -> Settings -> Pages -> Deploy from Branch** on _GitHub_. Make sure to choose the branch `gh-pages-docs`s root.

> Note: If you, for whatever reason, don't have the permission to publish the documentation via `gh-pages-docs`, add a _GitHub-Token_ `GH_REPO_TOKEN` with at least all rights for _repo_.

### Publish package to _npmjs_

In `.env.github` set the `GHPW_PUBLISH_TO_NPM` to `true` to bump the _Version_ (if not manually done), add a _Version-Tag_ (again, if not manually done) and publish the packages to _npmjs_.

For it to deploy you must set a `Repo-Secret` in _Actions secrets and variables_ under _Settings_ with the name `NPM_PUBLISH_TOKEN`.

> Setup a Token at _npmjs_, if not already done, that has the permission to publish packages. Then, under **Repo -> Settings -> Actions secrets and variables** set a new Secret with the name `NPM_PUBLISH_TOKEN` and copy the token from _npmjs_ inside. Otherwise this will throw an error and terminate the publishing-process.
>
> Note, that when it terminates here, the version bumping already happened, which might be ignored, but can lead to inconsistent version-publishing.

## src/index.ts

**Works for VSCode-Plugin `Generate Index`**

- Recommended shortcut: _Ctrl + Shift + Alt + I_
- Export everything in `src/`
- Ignores files `*.play.ts` and `*.test.ts`
- Ignores folders `src/tests` and `src/play`

```ts
// @index('./**/!(*.test|*.play).ts', f => `export * from "${f.path}";`, { ignore: ["./tests/**/*", "./play/**/*"] })

// @endindex
```

## Template for `README.MD`

Make sure to replace the placeholders:

- **\<!-- PACKAGE_NAME --\>**
  > For example `Package Template`
- **\<!-- DESCRIPTION --\>**
  > Description of the package
- **\<!-- package-name --\>**
  > The actual name. For example `package-template`.
- **\<!-- BASIC_EXAMPLE --\>**
  > Basic Usage-Example
- **\<!-- ADVANCED_EXAMPLE --\>**
  > Advanced Usage-Example

````markdown
# <!-- PACKAGE_NAME -->

## Description

<!-- DESCRIPTION -->

## Installation

To install the <!-- PACKAGE_NAME -->, use npm or yarn:

```bash
npm install @ocubist/<!-- package-name -->
# or
yarn add @ocubist/<!-- package-name -->
```

## Usage

### Basic Example

<!-- BASIC_EXAMPLE -->

### Advanced Example with POST Request

<!-- ADVANCED_EXAMPLE -->

## API Documentation

[Docs](https://ocubist.github.io/<!-- package-name -->/)

## License

The <!-- PACKAGE_NAME --> is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more information.
````
