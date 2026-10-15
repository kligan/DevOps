# DevOps learning lab

A hands-on path from a small Node.js service to containers, CI and Kubernetes.
Built for a software engineer who already knows JavaScript and wants to understand how software runs in production.

## Start here

Prerequisite: Node.js 24. Docker is needed for the container exercises.

```sh
npm test
npm start
```

Open http://localhost:3000 and http://localhost:3000/health.
No npm install is needed: the app and tests use Node's built-in modules.

## Run with Docker

```sh
docker build -t devops-lab .
docker run --rm -p 3000:3000 --name devops-lab devops-lab
```

Stop it with Ctrl+C. The container runs as a non-root user and includes a health check.

## Learning roadmap

1. **Linux and networking:** processes, ports, environment variables, curl, DNS and HTTP. Run with PORT=4000 and explain what changes.
2. **Git and CI:** create a branch, change the response, run tests and open a PR. Inspect the GitHub Actions test and Docker build jobs.
3. **Docker:** explain each Dockerfile instruction. Inspect container logs, health and image layers. Break the port mapping and diagnose it.
4. **Kubernetes:** create a local kind or minikube cluster. Apply the manifests below, inspect pods and test readiness/liveness.
5. **Delivery:** add an image registry and an explicit deployment step. Learn immutable image tags, rollback and environment promotion.
6. **Observability and infrastructure:** add metrics, dashboards and alerts, then use Terraform for a small disposable environment.

Complete one stage at a time. For each, record what you changed, what broke, how you diagnosed it and how it relates to production work.

## Local Kubernetes exercise

Build/load the image before applying manifests. For kind's default cluster:

```sh
docker build -t devops-lab:local .
kind load docker-image devops-lab:local
kubectl apply -f k8s/
kubectl rollout status deployment/devops-lab
kubectl port-forward service/devops-lab 8080:80
```

Open http://localhost:8080/health. Clean up with `kubectl delete -f k8s/`.
For minikube, use `minikube image load devops-lab:local` instead of the kind load command.
These manifests are for a local cluster, not a production deployment.

## What CI does

On pushes and pull requests, GitHub Actions runs the Node tests and builds the Docker image.
It does not publish an image or deploy infrastructure. No cloud account or secrets are required.

## References

- [Node test runner](https://nodejs.org/api/test.html)
- [Docker getting started](https://docs.docker.com/get-started/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Kubernetes basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
