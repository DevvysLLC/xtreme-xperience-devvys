# xTreme xPerience

## Deployments

> [!NOTE]
> See [docs/deployments.md](docs/deployments.md)

## Continuous Integration

> [!NOTE]
> See [docs/ci.md](docs/ci.md)

## Getting Started

> [!NOTE]
> See [docs/development.md](docs/development.md)

> Avoid using the built-in terminal feature in your editor because it usually shuts down or
> restarts with the editor process. Do use a standalone terminal app, e.g.,
> Terminal (Mac), iTerm (Mac), Tilix (Linux), Kitty (Linux).

1. **Install a Docker runtime.** Only Linux and Mac platforms are supported.

   **Recommended:** [OrbStack][orbstack] (Mac) - provides better performance and experience than Docker Desktop.

   **Alternative:** [Docker Desktop][download_docker] - fully compatible but with slower performance on Mac.

1. Create and retrieve store credentials from 1Password vault.

1. Create `.env` from `.env.template` located at project root.
   - Set `SHOPIFY_SHOP` value to the permanent domain of the store, e.g., `my-store.myshopify.com`
   - Set `SHOPIFY_ADMIN_API_TOKEN` value to the app admin API token.
   - Set `SHOPIFY_STOREFRONT_API_TOKEN` value to the app storefront API token.

1. Open a terminal window and change the working directory to the project folder.

   Type `./up` to start the development container.

   The container shell prompt should appear after Docker builds an image and starts the container.

1. Initialize the database structure:

   ```
   bb db-push
   ```

1. To start app in development mode, type in the container shell prompt:

   ```
   bb dev
   ```

1. To run CI tasks locally and ensure your code will pass the PR checks, type in the container shell prompt:

   ```
   bb run ci
   ```

1. Run `./edit` command to [attach VS Code or Cursor IDE to the running container][attach_to_container]
   for full Typescript autocomplete support.

1. After you're done working with the project for the day, type `./down` to stop
   the container

Follow [Github Flow workflow][github_flow] when committing your changes to the project repository.

Anything in the `main` branch should be deployable. The main branch is a staging environment for User Acceptance Testing (UAT).

## Development Environment

### Docker

The Docker container includes required versions of Node.js, and other development dependencies.

You're not expected to install anything on your computer besides Docker engine and Docker Compose.

### Node Modules

This project uses pnpm package manager to manage dependencies. **Do not use npm or Yarn**.

Please use [pnpm CLI commands][pnpm_cli] _within the container_ to manage dependencies.

For performance, the `node_modules` folder is stored inside a Docker volume and the folder
contents are available within the container only.

### Typescript

**This project supports Typescript via [swc compiler][swc].**

The project uses the `tsc` compiler only for type checking.

You can type `bb run typecheck` in the container shell prompt to run the type checking.

# Troubleshooting

## Apple Silicon (M1/M1X) Macs

This project fully supports Macs with Intel and Apple Silicon processors.

## Node Modules

If you're experiencing issues with the `node_modules` or webpack cache, run the following command in your terminal:

```shell
docker compose down --volumes
```

## Docker Performance on Mac

**Recommended Solution:** Switch to [OrbStack][orbstack] for significantly better performance and resource efficiency compared to Docker Desktop.

> **Need to uninstall Docker Desktop?** See this comprehensive guide: [How To Uninstall Docker Desktop Mac](https://www.spyhunter.com/shm/uninstall-docker-desktop-mac/) for complete removal instructions.

If you must use Docker Desktop and experience slowdowns, optimize these settings in the app preferences:

1. Update Docker for Mac to the latest version.
1. Increase the number of CPUs to at least 4.
1. Increase memory to at least 2GB; 4GB or more is preferred, but no more than 30% of your total available memory.
1. In Resources --> File Sharing, keep only `/private` and `/tmp` directory entries; then add the folder where you keep your development code.

> To maximize performance, keep your code in a separate folder outside of Documents, e.g., `~/dev`.

[attach_to_container]: https://code.visualstudio.com/docs/remote/attach-container
[download_docker]: https://www.docker.com/community-edition#/download
[github_flow]: http://scottchacon.com/2011/08/31/github-flow.html
[orbstack]: https://orbstack.dev/
[pnpm_cli]: https://pnpm.js.org/en/cli/install
[swc]: https://swc.rs/

# commit for deployment
