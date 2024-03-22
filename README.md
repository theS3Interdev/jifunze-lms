# Jifunze Learning Management System Platform

## Introduction

This is the repository for the Jifunze Learning Management System Platform.

## Tech Stack

1. Next.js 14
1. React
1. Typescript
1. Shadcn UI
1. Tailwind
1. Mux
1. Prisma
1. PostgreSQL
1. PayPal

## Key Features

- Browse & filter courses
- Purchase courses using PayPal
- Mark chapters as completed or uncomple
- Progress calculation of each course
- Student dashboard
- Instructor mode
- Create new courses
- Create new chapters
- Easily reorder chapter position with drag and drop
- Upload thumbnails, attachments and videos using UploadThing
- Video processing using Mux
- HLS video player using Mux
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- PostgreSQL database using Neon

## Prerequisites

**Node version 18.x.x**

## Cloning The Repository

```shell
git clone https://github.com/theS3Interdev/jifunze-lms-platform.git
```

## Install Packages

```shell
pnpm install
```

## Setup .env File

```js
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
WEBHOOK_SECRET=

DATABASE_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

NEXT_PUBLIC_PAYPAL_API_URL=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_APP_SECRET=

NEXT_PUBLIC_INSTRUCTOR_ID=
```

## Setup Prisma

Add PostgreSQL Database

```shell
pnpm dlx prisma generate
pnpm dlx prisma db push
```

## Start The Application

```shell
pnpm dev
```

## Available Commands

Running commands with npm `pnpm [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
