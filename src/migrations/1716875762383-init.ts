import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1716875762383 implements MigrationInterface {
  name = 'Init1716875762383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`gender\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`phoneNumber\` varchar(255) NOT NULL, \`expoPushNotificationToken\` varchar(255) NULL, \`bio\` varchar(255) NULL DEFAULT '', \`loginToken\` varchar(255) NULL, \`createdOn\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedOn\` timestamp NULL, \`DOB\` datetime NULL, \`walletBalance\` int NULL, \`fee\` int NULL, \`coverImage\` varchar(255) NULL DEFAULT '', \`private\` tinyint NULL DEFAULT 0, \`verified\` tinyint NULL DEFAULT 0, \`active\` tinyint NULL DEFAULT 0, \`online\` tinyint NULL DEFAULT 0, \`disabled\` tinyint NULL DEFAULT 0, \`approved\` tinyint NULL DEFAULT 0, \`location\` varchar(255) NULL DEFAULT '', \`latlong\` varchar(255) NULL DEFAULT '', \`otp\` varchar(255) NULL, \`numberOfRequests\` float NULL DEFAULT '0', \`requestsAccepted\` float NULL DEFAULT '0', \`gender\` int NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_f2578043e491921209f5dadd08\` (\`phoneNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_photos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(255) NOT NULL, \`createdOn\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`order\` int NOT NULL, \`user\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`message_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`subscriptions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`amount\` float NOT NULL DEFAULT '0', \`duration\` float NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_subscriptions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`active\` tinyint NULL DEFAULT 0, \`endDate\` datetime NOT NULL, \`userSubscribing\` int NULL, \`subscription\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`messages_chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdOn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastUpdated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`firstUser\` int NULL, \`secondUser\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`read\` tinyint NULL DEFAULT 0, \`createdOn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`readAt\` timestamp NULL, \`message\` varchar(255) NOT NULL DEFAULT '', \`sender\` int NULL, \`receiver\` int NULL, \`messageType\` int NULL, \`chatLink\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_requests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`accepted\` tinyint NULL DEFAULT 0, \`address\` varchar(255) NULL DEFAULT '', \`paid\` tinyint NULL DEFAULT 0, \`price\` int NULL DEFAULT '0', \`location\` varchar(255) NULL DEFAULT '', \`latlong\` varchar(255) NULL DEFAULT '', \`active\` tinyint NULL DEFAULT 1, \`missed\` tinyint NULL DEFAULT 0, \`rejected\` tinyint NULL DEFAULT 0, \`startDate\` tinyint NOT NULL DEFAULT 0, \`completed\` tinyint NOT NULL DEFAULT 0, \`startTime\` datetime NULL, \`endTime\` datetime NULL, \`meetUpDate\` datetime NOT NULL, \`createdOn\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userRequesting\` int NULL, \`userReceivingRequest\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_a0f3f1de3c7590ddf4299b6596a\` FOREIGN KEY (\`gender\`) REFERENCES \`gender\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_photos\` ADD CONSTRAINT \`FK_2e8a2183ecd6c4efc05282f6a23\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_subscriptions\` ADD CONSTRAINT \`FK_04ad2a469f87f4413134e67c790\` FOREIGN KEY (\`userSubscribing\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_subscriptions\` ADD CONSTRAINT \`FK_2575c331c07d03b43e0cedc7d6e\` FOREIGN KEY (\`subscription\`) REFERENCES \`subscriptions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages_chat\` ADD CONSTRAINT \`FK_76d4cb564a04d0ac45be490f5be\` FOREIGN KEY (\`firstUser\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages_chat\` ADD CONSTRAINT \`FK_b9c7d3142a955afb4bc58814412\` FOREIGN KEY (\`secondUser\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_fc6f083269edb7a7798cdf13b08\` FOREIGN KEY (\`sender\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_58f9656fc8d2a98cd9d6d5d42de\` FOREIGN KEY (\`receiver\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2eeda8980b7f51baed776ede6ad\` FOREIGN KEY (\`messageType\`) REFERENCES \`message_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2048ebf97c85d872d7f8039adae\` FOREIGN KEY (\`chatLink\`) REFERENCES \`messages_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_requests\` ADD CONSTRAINT \`FK_c8b9139ba4f9e223d046d684330\` FOREIGN KEY (\`userRequesting\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_requests\` ADD CONSTRAINT \`FK_c14b223be7f9f5c2c241e12fc81\` FOREIGN KEY (\`userReceivingRequest\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_requests\` DROP FOREIGN KEY \`FK_c14b223be7f9f5c2c241e12fc81\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_requests\` DROP FOREIGN KEY \`FK_c8b9139ba4f9e223d046d684330\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2048ebf97c85d872d7f8039adae\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2eeda8980b7f51baed776ede6ad\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_58f9656fc8d2a98cd9d6d5d42de\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_fc6f083269edb7a7798cdf13b08\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages_chat\` DROP FOREIGN KEY \`FK_b9c7d3142a955afb4bc58814412\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`messages_chat\` DROP FOREIGN KEY \`FK_76d4cb564a04d0ac45be490f5be\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_subscriptions\` DROP FOREIGN KEY \`FK_2575c331c07d03b43e0cedc7d6e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_subscriptions\` DROP FOREIGN KEY \`FK_04ad2a469f87f4413134e67c790\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_photos\` DROP FOREIGN KEY \`FK_2e8a2183ecd6c4efc05282f6a23\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_a0f3f1de3c7590ddf4299b6596a\``,
    );
    await queryRunner.query(`DROP TABLE \`user_requests\``);
    await queryRunner.query(`DROP TABLE \`messages\``);
    await queryRunner.query(`DROP TABLE \`messages_chat\``);
    await queryRunner.query(`DROP TABLE \`user_subscriptions\``);
    await queryRunner.query(`DROP TABLE \`subscriptions\``);
    await queryRunner.query(`DROP TABLE \`message_types\``);
    await queryRunner.query(`DROP TABLE \`user_photos\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f2578043e491921209f5dadd08\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`gender\``);
  }
}
