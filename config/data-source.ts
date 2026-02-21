import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.model";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",   // یوزرنیم دیتابیس
  password: "yourpassword", // پسورد دیتابیس
  database: "aura_db",     // اسم دیتابیس
  synchronize: true,       // فقط برای توسعه
  logging: true,
  entities: [User],
});