import {Client} from 'universal-analytics';

export const visitor = <Client>require('universal-analytics')('UA-43486767-14', { https: true }).debug();
