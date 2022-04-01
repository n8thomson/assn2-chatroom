import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role, RoleKey } from '../entities/role.entity';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../entities/user_role.entity';
dotenv.config();

export default class Seeds implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // CREATE ROLES
    console.log('\nCreating Roles');

    const roleObjects = Role.ROLES.map((key) => ({ key }));
    const roleRepository = connection.getRepository(Role);
    for (const roleObj of roleObjects) {
      // only insert roles if not present already
      const role = await roleRepository.findOne(roleObj);
      if (!role) {
        console.log(`Creating role '${roleObj.key}'`);
        await roleRepository.insert(roleObj);
      } else {
        console.log(`Role '${role.key}' already exists`);
      }
    }

    // CREATE ADMIN USER
    const userRepository = connection.getRepository(User);
    let adminUser = await userRepository.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminUser) {
      const adminRole = await roleRepository.findOne({ key: RoleKey.ADMIN });
      console.log(`\nCreating Admin User with email ${process.env.ADMIN_EMAIL}`);
      console.log(adminRole);
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      adminUser = new User();
      adminUser.email = process.env.ADMIN_EMAIL;
      adminUser.passwordHash = passwordHash;
      adminUser.firstName = 'Admin';
      adminUser.lastName = 'Site';
      const adminUserRole = new UserRole();
      adminUserRole.role = adminRole;
      adminUser.userRoles = [adminUserRole];
      await userRepository.save(adminUser);
    } else {
      console.log(`\nAdmin User with email ${process.env.ADMIN_EMAIL} already exists`);
    }

    // CREATE ADMIN USER 2
    const userRepository2 = connection.getRepository(User);
    let adminUser2 = await userRepository2.findOne({ email: process.env.ADMIN_EMAIL2 });
    if (!adminUser2) {
      const adminRole = await roleRepository.findOne({ key: RoleKey.ADMIN });
      console.log(`\nCreating Admin User with email ${process.env.ADMIN_EMAIL2}`);
      console.log(adminRole);
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD2, 10);
      adminUser2 = new User();
      adminUser2.email = process.env.ADMIN_EMAIL2;
      adminUser2.passwordHash = passwordHash;
      adminUser2.firstName = 'Admin';
      adminUser2.lastName = 'Site';
      const adminUserRole = new UserRole();
      adminUserRole.role = adminRole;
      adminUser2.userRoles = [adminUserRole];
      await userRepository2.save(adminUser2);
    } else {
      console.log(`\nAdmin User with email ${process.env.ADMIN_EMAIL} already exists`);
    }

  }
}
