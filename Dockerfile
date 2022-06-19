# stage build
FROM node:lts-alpine AS builder

WORKDIR /app

# copy everything to the container
COPY . .

# install all dependencies
RUN npm i

# remove potential security issues
RUN npm audit fix
    
RUN npx prisma generate
# build SvelteKit app
RUN npm run build

# stage run
FROM node:lts-alpine

WORKDIR /app

# copy dependency list
COPY --from=builder /app/package*.json /app/build /app/prisma /app/data ./

# clean install dependencies. Note: svelte is a dev dependency, and Prisma needs to run generate
RUN npm ci

# remove potential security issues
RUN npm audit fix
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "./index.js"]