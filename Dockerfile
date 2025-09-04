root@racknerd-7669da5:~# cd /www/wwwroot/portfolio
root@racknerd-7669da5:/www/wwwroot/portfolio# docker compose down
WARN[0000] /www/wwwroot/portfolio/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
root@racknerd-7669da5:/www/wwwroot/portfolio# docker compose up --build -d
WARN[0000] /www/wwwroot/portfolio/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Building 36.6s (17/22)                                                             docker:default
 => [portfolio-app internal] load build definition from Dockerfile                               0.0s
 => => transferring dockerfile: 1.20kB                                                           0.0s
 => [portfolio-app internal] load metadata for docker.io/library/node:20-alpine                  2.6s
 => [portfolio-app internal] load .dockerignore                                                  0.0s
 => => transferring context: 218B                                                                0.0s
 => [portfolio-app base 1/1] FROM docker.io/library/node:20-alpine@sha256:eabac870db94f7342d6c3  0.0s
 => [portfolio-app internal] load build context                                                  0.0s
 => => transferring context: 10.59kB                                                             0.0s
 => CACHED [portfolio-app runner 1/8] WORKDIR /app                                               0.0s
 => CACHED [portfolio-app runner 2/8] RUN addgroup --system --gid 1001 nodejs                    0.0s
 => CACHED [portfolio-app runner 3/8] RUN adduser --system --uid 1001 nextjs                     0.0s
 => CACHED [portfolio-app deps 1/6] RUN apk add --no-cache libc6-compat                          0.0s
 => CACHED [portfolio-app deps 2/6] WORKDIR /app                                                 0.0s
 => CACHED [portfolio-app deps 3/6] COPY package.json package-lock.json* ./                      0.0s
 => CACHED [portfolio-app deps 4/6] COPY pnpm-lock.yaml* ./                                      0.0s
 => CACHED [portfolio-app deps 5/6] RUN npm install -g pnpm                                      0.0s
 => CACHED [portfolio-app deps 6/6] RUN pnpm install --frozen-lockfile                           0.0s
 => CACHED [portfolio-app builder 1/3] WORKDIR /app                                              0.0s
 => [portfolio-app builder 2/3] COPY . .                                                         0.1s
 => ERROR [portfolio-app builder 3/3] RUN pnpm build                                            33.8s
------
 > [portfolio-app builder 3/3] RUN pnpm build:
1.378 
1.378 > portfolio.com@0.1.0 build /app
1.378 > next build
1.378 
3.439    ▲ Next.js 15.2.3
3.442 
3.491    Creating an optimized production build ...
9.165 
9.165 
9.165 Retrying 1/3...
9.567 
9.567 
9.567 Retrying 2/3...
10.13 
10.13 
10.13 Retrying 3/3...
10.88 [AggregateError: ] { code: 'ETIMEDOUT' }
33.58 Failed to compile.
33.58 
33.59 src/app/layout.tsx
33.59 `next/font` error:
33.59 Failed to fetch `Inter` from Google Fonts.
33.59 
33.60 
33.60 > Build failed because of webpack errors
33.66  ELIFECYCLE  Command failed with exit code 1.
------
failed to solve: process "/bin/sh -c pnpm build" did not complete successfully: exit code: 1
root@racknerd-7669da5:/www/wwwroot/portfolio# 
