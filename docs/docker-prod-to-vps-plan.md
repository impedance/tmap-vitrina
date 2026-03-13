# Plan: Production Deployment to Finnish VPS

The goal is to implement an optimized **Production** Docker environment that runs efficiently on a 1GB RAM Finnish VPS. This setup uses multi-stage builds to exclude development tools and source code from the final image, ensuring minimal resource consumption.

## User Review Required

> [!IMPORTANT]
> - **Production Mode:** The app will be served in "production mode," meaning HMR (Hot Module Replacement) will be disabled on the VPS. 
> - **Database:** We will use the existing SQLite database (or you can specify another later).
> - **Build Phase:** The VPS will need to run `npm run build`, which can be CPU-intensive for a minute during deployment.

## Proposed Changes

We will introduce a production-specific configuration while keeping your development setup intact.

### 1. Optimized Containerization

#### [NEW] [Dockerfile.prod](file:///home/spec/work/tmap-vitrina/Dockerfile.prod)
- **Stage 1 (Build):** Installs all dependencies and builds the project (`vite build` and `tsc`).
- **Stage 2 (Runtime):** Copies only the built files (`dist/`) and installs production-only dependencies.

#### [NEW] [docker-compose.prod.yaml](file:///home/spec/work/tmap-vitrina/docker-compose.prod.yaml)
- Orchestrates the production container on the VPS.
- No source code mapping (`volumes`) needed.
- Exposes port 3002 (or 80/443 if you use a reverse proxy).

### 2. Server-side Integration

#### [MODIFY] [server/src/index.ts](file:///home/spec/work/tmap-vitrina/server/src/index.ts)
- Add logic to serve the frontend's static files from the `client/dist` directory when running in production mode.

## Deployment Workflow

1. **Local:** Push your changes to GitHub.
2. **VPS:** Connect via SSH and run:
   ```bash
   git pull
   docker-compose -f docker-compose.prod.yaml up -d --build
   ```

## Verification Plan

### Automated Tests
- Build the production image locally: `docker build -f Dockerfile.prod -t myapp:prod .`
- Check final image size (target: < 200MB).

### Manual Verification
- Run the production container locally and verify that the frontend is served correctly by the backend API.
