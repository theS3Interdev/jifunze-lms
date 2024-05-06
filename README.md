# Jifunze Learning Management System

## Introduction

This is the repository for the Jifunze Learning Management System.

## Tech Stack

1. Next.js 14
1. React
1. Typescript
1. Shadcn UI
1. Tailwind
1. Cloudinary
1. Prisma
1. MongoDB
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
- Video processing using Cloudinary
- HLS video player using Cloudinary
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- MongoDB database using MongoDB Atlas

## Prerequisites

**Node version 20.x.x**

## Cloning The Repository

```shell
git clone https://github.com/theS3Interdev/jifunze-lms.git
```

## Install Packages

```shell
pnpm install
```

## Setup .env File

```js
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=

CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

DATABASE_URL=

PAYPAL_APP_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=

UPLOADTHING_APP_ID=
UPLOADTHING_SECRET=

NEXT_PUBLIC_APP_URL=
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
