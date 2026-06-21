import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { jwtMiddleware } from "./common/jwt.middleware";
import * as express from "express";
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Increase payload limit to 50MB to handle large image uploads from extension
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  app.use(jwtMiddleware);
  app.useGlobalPipes(new ValidationPipe({ whitelist: false }));
  app.enableCors();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
  console.log("Server running on port", process.env.PORT || 3000);
}

bootstrap();
