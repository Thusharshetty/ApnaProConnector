const { default:axios} = require('axios');


export const BASEEURL='https://apnaproconnector.onrender.com';

export const clientServer=axios.create({
    baseURL:BASEEURL
});