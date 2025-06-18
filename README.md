# Keycloak Configuration and User Creation Guide

docker build -t minha-aplicacao .

docker run -d --name minha-aplicacao \
  --network docker_minha_rede \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e KEYCLOAK_ISSUER_URI=http://saas-user-admin-api:8081/realms/user-api \
  minha-aplicacao


docker run -d --name minha-aplicacao \
  --network docker_minha_rede \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e KEYCLOAK_ISSUER_URI=http://localhost:8081/realms/user-api \
  minha-aplicacao