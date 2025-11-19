Kind Kubernetes Deployment
===============================

OS: ubuntu 24.04 LTS

kind installation:
------------------------
sudo snap install kubectl --classic
curl -Lo ./kind https://github.com/kubernetes-sigs/kind/releases/download/v0.30.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
kind --version

Create kubernetes cluster
----------------------------
kind create cluster
kubectl cluster-info --context kind-kind
kubectl get nodes
kind create cluster --name kind-next --config cluster/kind-cluster.yaml

helm installation
----------------------
sudo snap install helm --classic
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
--namespace ingress-nginx --create-namespace \
--set controller.service.type=NodePort \
--set controller.service.nodePorts.http=30080 \
--set controller.service.nodePorts.https=30443

kubectl -n ingress-nginx rollout status deploy/ingress-nginx-controller
curl "http://localhost" -I


Deploy Apps on kubernetes
----------------------------------
kubectl apply -f k8s/namespace.yaml

kubectl apply -f k8s/postgres/secret.yaml -f k8s/postgres/statefulset.yaml -f k8s/postgres/service.yaml
kubectl -n demo rollout status sts/postgres

kubectl apply -f k8s/redis/deployment.yaml -f k8s/redis/service.yaml
kubectl -n demo rollout status deploy/redis

kubectl apply -f k8s/app/configmap.yaml -f k8s/app/secret.yaml \
-f k8s/app/deployment.yaml -f k8s/app/service.yaml -f k8s/app/ingress.yaml
kubectl -n demo rollout restart  deploy/nextjs
kubectl -n demo rollout status deploy/nextjs


local-kubernetes/k8s/app$ docker build -t local/nextjs-postgres-redis:dev .
kind load docker-image local/nextjs-postgres-redis:dev --name kind-next

kubectl -n demo exec -it deploy/nextjs -- cat /app/runtime/env --> untuk lihat env

