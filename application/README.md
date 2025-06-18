# 📌 Liquibase - Configuração por Ambiente

Este projeto utiliza **Liquibase** para gerenciar a versão do banco de dados em diferentes ambientes (`dev`, `hmg`, `prd`).

## 🚀 Como Executar o Liquibase para Cada Ambiente

### ✅ **Rodando para `dev`**
```bash
mvn liquibase:diff -Pdev
```
```bash
mvn liquibase:update -Pdev
```

### ✅ **Rodando para `hmg`**
```bash
mvn liquibase:diff -Phmg
```
```bash
mvn liquibase:update -Phmg
```

### ✅ **Rodando para `prd`**
```bash
mvn liquibase:diff -Pprd
```
```bash
mvn liquibase:update -Pprd
```
