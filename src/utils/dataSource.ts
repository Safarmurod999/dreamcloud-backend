import { DataSource } from "typeorm";
import { configuration } from './config';

export const dataSource = new DataSource(configuration.getDataSourceConfig());
