import en from './en'
import zh from './zh'
import zh_tw from './zh_tw'
import Store from '../store';

export const locales = {en,zh,zh_tw}

function locale(){
    return locales[Store.lang];
}

export default locale;
