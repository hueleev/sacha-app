#!/bin/bash
pnpm --filter ui build-storybook
if [ -d packages/ui/storybook-static ]; then
  cp -r packages/ui/storybook-static apps/web/public/storybook
fi
pnpm --filter web build