#!/bin/bash
echo "DATABASE_URL=$DATABASE_URL" # 디버깅용 출력
pnpm --filter ui build-storybook
if [ -d packages/ui/storybook-static ]; then
  cp -r packages/ui/storybook-static apps/web/public/storybook
fi
pnpm --filter web build