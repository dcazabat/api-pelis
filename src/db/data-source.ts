import 'dotenv/config'
import { User } from '../user/entities/user.entity'
import { DataSource, DataSourceOptions } from "typeorm"
import { SSL_CERT } from './ssl-config'

export const dataSourceOptions: DataSourceOptions = {
    type: process.env.DB_TYPE as any,
    host: process.env.ENVIROMENT === "local" ? process.env.DB_LOCAL_HOST : process.env.DB_PROD_HOST,
    port: process.env.ENVIROMENT === "local" ? Number(process.env.DB_LOCAL_PORT) : Number(process.env.DB_PROD_PORT),
    username: process.env.ENVIROMENT === "local" ? process.env.DB_LOCAL_USERNAME : process.env.DB_PROD_USERNAME,
    password: process.env.ENVIROMENT === "local" ? process.env.DB_LOCAL_PASSWORD : process.env.DB_PROD_PASSWORD,
    database: process.env.ENVIROMENT === "local" ? process.env.DB_LOCAL_DBNAME : process.env.DB_PROD_DBNAME,
    ssl: process.env.ENVIROMENT === "local" ? false : { rejectUnauthorized: true, ca: SSL_CERT, },
    synchronize: process.env.SYNCRONIZE === "Y" ? true : false,
    bigNumberStrings: true,
    entities: [User]
}

// Esto sirve para las Migraciones (Migrañas!!!!!)
const dataSourceOptionsMigrate: DataSourceOptions = {
    type: process.env.DB_TYPE as any,
    host: process.env.ENVIROMENT === "local" ? process.env.DB_LOCAL_HOST : process.env.DB_PROD_HOST,
    port: process.env.ENVIROMENT === "local" ? Number(process.env.DB_LOCAL_PORT) : Number(process.env.DB_PROD_PORT),
    username: process.env.ENVIROMENT === "local" ? process.env.DB_LOCAL_USERNAME : process.env.DB_PROD_USERNAME,
    password: process.env.ENVIROMENT === "local" ? process.env.DB_LOCAL_PASSWORD : process.env.DB_PROD_PASSWORD,
    database: process.env.ENVIROMENT === "local" ? process.env.DB_LOCAL_DBNAME : process.env.DB_PROD_DBNAME,
    ssl: process.env.ENVIROMENT === "local" ? false : { rejectUnauthorized: true, ca: SSL_CERT, },
    synchronize: process.env.SYNCRONIZE === "Y" ? true : false,
    bigNumberStrings: true,
    entities: [User],
    migrations: ['./src/db/migrations/*.ts'],
}

const dataSource = new DataSource(dataSourceOptionsMigrate)
export default dataSource;