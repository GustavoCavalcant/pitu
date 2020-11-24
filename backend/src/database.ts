import {Sequelize} from 'sequelize';
import app from './app';

const sequelize = new Sequelize('mysql://root:@localhost:3306/pitu');

export default sequelize;