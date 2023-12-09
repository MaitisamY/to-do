// import { randomBytes } from 'crypto';

// export default function keygen() {
//     return randomBytes(32).toString('hex');
// }
const { createHmac } = await import('node:crypto');

const secret = 'abcdefghijklmnopqrstuvwxyz' + '0123456789' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const keygen = createHmac('sha256', secret)
               .update('!@#$%^&*()')
               .digest('hex');

export default keygen;



