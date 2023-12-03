import { randomBytes } from 'crypto';

export default function keygen() {
    return randomBytes(32).toString('hex');
}