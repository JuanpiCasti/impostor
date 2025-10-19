FROM node:20-alpine3.22 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm deploy --filter=backend --prod /prod/backend
RUN pnpm deploy --filter=frontend --prod /prod/frontend

FROM base AS backend
COPY --from=build /prod/backend /prod/backend
WORKDIR /prod/backend

EXPOSE 3000

CMD ["node", "dist/index.js"]

FROM nginx:alpine AS frontend
WORKDIR /usr/share/nginx/html

COPY --from=build /prod/frontend/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]