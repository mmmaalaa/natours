import {EventEmitter} from 'events';
import sendEmail from './sendEmail.js';

const emailEmitter = new EventEmitter();

emailEmitter.on('sendEmail',async (to, subject, text) => {
    await sendEmail(to, subject, text);
})

export default emailEmitter;