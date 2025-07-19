# AIDB Cloud Configuration Guide

This guide explains how to set up your cloud object storage providers and obtain credentials for a production-grade, resilient deployment.

---

## AWS S3

- **Create a bucket** (e.g., `aidb-data`) in your preferred region
- **Generate an IAM user** with programmatic access and attach S3 policies
- Place these in your `.env`:
  AIDB_STORAGE_PROVIDER=s3
  AWS_ACCESS_KEY_ID=...
  AWS_SECRET_ACCESS_KEY=...
  AWS_S3_BUCKET=aidb-data
  AWS_REGION=ap-south-1

## Google Cloud Storage

- **Create a bucket** via GCP Console
- **Create a service account** with storage admin role
- Download the JSON credentials file, place it at `/config/cloud/gcp-service-account.json`
- Set:
  AIDB_STORAGE_PROVIDER=gcs
  GCP_STORAGE_BUCKET=aidb-data
  GOOGLE_APPLICATION_CREDENTIALS=/config/cloud/gcp-service-account.json

## Azure Blob Storage

- **Create a Storage Account** and Container
- Set:
  AIDB_STORAGE_PROVIDER=azure
  AZURE_STORAGE_ACCOUNT=aidbaccount
  AZURE_STORAGE_ACCESS_KEY=...
  AZURE_STORAGE_CONTAINER=aidb

## Local/Minio (for development)

- Use included Docker Compose
- Default access key/secret: `minio`/`minio123`

## Security Practices

- Never commit `.env` or credential files to public repos
- Give minimum IAM permission needed

---

You’re ready to use AIDB for any region or cloud provider!
