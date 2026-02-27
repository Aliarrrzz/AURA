import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string

  @Column({ nullable: true })
  googleId!: string;

  @Column({ type: "date", nullable: true })
  birthdate!: Date;

  @Column({ nullable: true })
  resetToken!: string;

  @Column({ nullable: true })
  resetTokenExpiry!: Date;
}