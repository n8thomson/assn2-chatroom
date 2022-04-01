import {MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddLongAndLat1648798584904 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'chat_room',
            new TableColumn({
              name: 'latitude',
              type: 'text',
              default: "'0'", // default values must include single quotes for text
            }),
          );
          await queryRunner.addColumn(
            'chat_room',
            new TableColumn({
              name: 'longitude',
              type: 'text',
              default: "'0'", // default values must include single quotes for text
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('chat_room', 'longitude');
        await queryRunner.dropColumn('chat_room', 'latitude');

    }

}
