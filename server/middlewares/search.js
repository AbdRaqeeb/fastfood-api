export function regExp(word) {
    const regexp = [];
    regexp.push('^');
    regexp.push('[');
    let letters = word.split('');
    for (let i = 0; i < letters.length; i++) {
        regexp.push(letters[i]);
        regexp.push('|');
    }
    regexp.push(']');

    return regexp.join('');
}