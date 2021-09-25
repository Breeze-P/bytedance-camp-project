import sequelize from 'sequelize';
import { dbInstance } from '../db/config.js';
import {Base} from '../model/base.js';
export const Page = dbInstance.define('page', {
    baseid: {
        name: 'id',
        type: sequelize.DataTypes.INTEGER,
    },

    pageid: {
        name: 'pageid',
        primaryKey: true,
        autoIncrement: true,
        type: sequelize.DataTypes.INTEGER
    },

    icon: {
        name: 'icon',
        type: sequelize.DataTypes.TEXT
    }
},{
    timestamps:false,
});

Base.hasOne(Page,{foreignKey:'baseid',targetkey:'id',onDelete:'CASCADE',onUpdate:'CASCADE'});