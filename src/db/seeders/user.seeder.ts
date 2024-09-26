import { DataSource } from 'typeorm';
import * as bcrypt from "bcryptjs";
import { User } from '../../user/entities/user.entity';

export class UserSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const fs = require('fs');
    const path = require('path');

    const itemRepository = dataSource.getRepository(User);

    // Leer el archivo JSON
    const itemsJsonPath = path.join(__dirname, './users.json'); // Cambiar la ruta si es necesario y el nombre del archivo
    const itemsData = JSON.parse(fs.readFileSync(itemsJsonPath, 'utf8'));

    // Procesar cada usuario para encriptar la contraseña
    const items = await Promise.all(
      itemsData.map(async (item) => ({
        ...item,
        password: await bcrypt.hash(item.password.toString(), 10),
        birthday: new Date(item.birthday),
      }))
    );

    console.log(items)
    // Insertar los datos en la base de datos
    await itemRepository.save(items);

    console.log('Datos agregados correctamente.');
  }
}
