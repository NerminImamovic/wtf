FROM node:14.17.1 as base

COPY . .

# Add package file
COPY package*.json ./

# Install deps
RUN npm i

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build release
RUN npm run build

# Start production image build
FROM gcr.io/distroless/nodejs:14

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules
COPY --from=base /release /release

# Expose port 3000
EXPOSE 3000
CMD ["release/src/server.js"]
