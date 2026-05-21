#### FOUNDATION
FROM ghcr.io/the-vaan-group/theme-starter:5.0.1 AS foundation

ARG GROUP_ID=1000
ARG USER_ID=1000

RUN echo 'Creating "node" user' \
    && groupadd --gid $GROUP_ID node \
    && useradd --uid $USER_ID --gid node --shell /bin/bash --create-home node \
    && echo '==============================' \
    && echo 'Configuring folder permissions' \
    && if [ ! -d "$TMP_DIR" ] ; then mkdir "$TMP_DIR" ; fi \
    && chown -R node:node ${TMP_DIR} ${WORKDIR} \
    && echo '===============================' \
    && echo 'Disabling Shopify CLI telemetry' \
    && mkdir -p /home/node/.config/shopify \
    && printf "[analytics]\nenabled = false\n" > /home/node/.config/shopify/config \
    && chown -R node:node /home/node/.config \
    && echo '====================================================' \
    && echo 'Configuring Shopify CLI environment variable aliases' \
    && printf '\nexport SHOPIFY_FLAG_STORE=$SHOPIFY_SHOP\n' >> /home/node/.bash_aliases \
    && printf '\nexport SHOPIFY_CLI_THEME_TOKEN=$SHOPIFY_CLI_ADMIN_AUTH_TOKEN\n' >> /home/node/.bash_aliases \
    && chown node:node /home/node/.bash_aliases

#### DEVELOPMENT
FROM foundation AS development

RUN echo 'Installing ngrok' \
    && curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
      | tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
    && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
      | tee /etc/apt/sources.list.d/ngrok.list \
    && apt update \
    && apt --assume-yes --no-install-recommends install ngrok \
    && echo 'Smoke test' \
    && ngrok --version \
    && echo 'Cleaning up' \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/cache/apt \
    && echo 'Done'

USER node

ENV IS_INSIDE_CONTAINER=1 \
    XDG_CACHE_HOME=/home/node/.cache \
    XDG_CONFIG_HOME=/home/node/.config

COPY --chown=node:node devops/dotfiles/.bashrc /home/node/.bashrc

RUN echo "Provision XDG cache folder for persisted Shopify CLI sessions" \
    && mkdir ~/.cache \
    && echo 'Done'

ENTRYPOINT ["tini", "-sg", "--"]

#### CI
FROM foundation AS ci

USER node

ENTRYPOINT ["tini", "-sg", "--"]
