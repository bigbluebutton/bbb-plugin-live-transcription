import mount from './mount';

const uuid = document.currentScript?.getAttribute('uuid') || 'root';

mount({ uuid });
