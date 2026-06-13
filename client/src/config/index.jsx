const { default:axios} = require('axios');


export const BASEEURL='http://localhost:5000';

export const clientServer=axios.create({
    baseURL:BASEEURL
});