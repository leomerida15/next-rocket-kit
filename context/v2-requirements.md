# Next-Rocket-Kit V2 Requirements

## Overview

V2 is a major upgrade that focuses on modularity, better developer experience, and automatic documentation generation.

## Core Requirements

### 1. Zod v4 Resolver as Separate Library

-   Extract Zod resolver into a standalone package `@rocket-kit/resolver-zod`
-   Support Zod v4 with all new features
-   Maintain backward compatibility with existing API
-   Provide enhanced type safety and validation

### 2. Automatic Documentation Module

-   CLI tool that scans Next.js app directory
-   Extract schema information from `schema.ts` files
-   Generate OpenAPI 3.1 specification automatically
-   Support for development-time documentation generation
-   Integration with existing OpenAPI module

### 3. Enhanced Architecture

-   Modular design with separate packages
-   Better TypeScript support
-   Improved error handling
-   Enhanced developer experience

## Technical Specifications

### CLI Tool Requirements

-   Command: `rocket-kit docs generate`
-   Scan patterns: `app/**/schema.ts`
-   Output: OpenAPI 3.1 JSON/YAML
-   Watch mode for development
-   Configurable output paths

### Schema Extraction

-   Parse TypeScript files
-   Extract Zod schemas
-   Map to OpenAPI components
-   Support for route metadata
-   Handle imports and dependencies

### Package Structure

```
@rocket-kit/
├── core/           # Main package
├── resolver-zod/   # Zod v4 resolver
├── docs-cli/       # Documentation CLI
└── types/          # Shared types
```

## Migration Path

-   Maintain V1 API compatibility
-   Gradual migration guide
-   Deprecation warnings
-   Feature flags for new functionality
