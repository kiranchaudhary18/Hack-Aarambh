import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { jwtMiddleware } from "./common/jwt.middleware";
import * as express from "express";
import * as dotenv from "dotenv";
dotenv.config();

let server: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Increase payload limit to 50MB to handle large image uploads from extension
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  app.use(jwtMiddleware);
  app.useGlobalPipes(new ValidationPipe({ whitelist: false }));
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance();
  } else {
    await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
    console.log("Server running on port", process.env.PORT || 3000);
  }
}

if (!process.env.VERCEL) {
  bootstrap();
}

export default async (req: any, res: any) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
};
