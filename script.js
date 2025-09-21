document.addEventListener('DOMContentLoaded', () => {

    // --- Caesar Cipher Elements ---
    const caesarInput = document.getElementById('caesar-input');
    const caesarOutput = document.getElementById('caesar-output');
    const caesarKey = document.getElementById('caesar-key');
    const caesarEncryptBtn = document.getElementById('caesar-encrypt-btn');
    const caesarDecryptBtn = document.getElementById('caesar-decrypt-btn');

    // --- Monoalphabetic Cipher Elements ---
    const monoInput = document.getElementById('mono-input');
    const monoOutput = document.getElementById('mono-output');
    const monoKey = document.getElementById('mono-key');
    const monoEncryptBtn = document.getElementById('mono-encrypt-btn');
    const monoDecryptBtn = document.getElementById('mono-decrypt-btn');
    
    // --- Transposition Cipher Elements ---
    const transpoInput = document.getElementById('transpo-input');
    const transpoOutput = document.getElementById('transpo-output');
    const transpoKey = document.getElementById('transpo-key');
    const transpoEncryptBtn = document.getElementById('transpo-encrypt-btn');
    const transpoDecryptBtn = document.getElementById('transpo-decrypt-btn');

    // --- Caesar Cipher Logic ---
    function performCaesarCipher(text, shift, encrypt = true) {
        if (!encrypt) shift = -shift;
        return text.replace(/[a-zA-Z]/g, (char) => {
            const base = char.toLowerCase() === char ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
            const shiftedCode = (char.charCodeAt(0) - base + shift) % 26;
            return String.fromCharCode(base + (shiftedCode < 0 ? shiftedCode + 26 : shiftedCode));
        });
    }
    caesarEncryptBtn.addEventListener('click', () => caesarOutput.value = performCaesarCipher(caesarInput.value, parseInt(caesarKey.value, 10), true));
    caesarDecryptBtn.addEventListener('click', () => caesarOutput.value = performCaesarCipher(caesarInput.value, parseInt(caesarKey.value, 10), false));

    // --- Monoalphabetic Cipher Logic ---
    function performMonoalphabeticCipher(text, key, encrypt = true) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const sanitizedKey = key.toUpperCase().replace(/[^A-Z]/g, "");
        
        if (new Set(sanitizedKey).size !== 26) {
            alert("Monoalphabetic key must contain 26 unique letters.");
            return "";
        }

        const from_alphabet = encrypt ? alphabet : sanitizedKey;
        const to_alphabet = encrypt ? sanitizedKey : alphabet;
        
        return text.replace(/[a-zA-Z]/g, (char) => {
            const isLower = char === char.toLowerCase();
            const charIndex = from_alphabet.indexOf(char.toUpperCase());
            if (charIndex === -1) return char;
            
            const substitutedChar = to_alphabet[charIndex];
            return isLower ? substitutedChar.toLowerCase() : substitutedChar;
        });
    }
    monoEncryptBtn.addEventListener('click', () => monoOutput.value = performMonoalphabeticCipher(monoInput.value, monoKey.value, true));
    monoDecryptBtn.addEventListener('click', () => monoOutput.value = performMonoalphabeticCipher(monoInput.value, monoKey.value, false));

    // --- Transposition Cipher Logic ---
    function performTranspositionEncrypt(text, key) {
        if (!key) return alert("Please enter a keyword for the Transposition cipher."), "";
        const keyLen = key.length;
        const textLen = text.length;
        const numRows = Math.ceil(textLen / keyLen);
        const grid = Array(numRows).fill(null).map(() => Array(keyLen).fill(''));

        // Fill grid
        for (let i = 0; i < textLen; i++) {
            grid[Math.floor(i / keyLen)][i % keyLen] = text[i];
        }

        // Get column order
        const sortedKey = key.split('').map((char, index) => ({ char, index })).sort((a, b) => a.char.localeCompare(b.char));
        const colOrder = sortedKey.map(item => item.index);
        
        // Read columns
        let ciphertext = "";
        for (const col of colOrder) {
            for (let row = 0; row < numRows; row++) {
                ciphertext += grid[row][col] || '';
            }
        }
        return ciphertext;
    }

    function performTranspositionDecrypt(ciphertext, key) {
        if (!key) return alert("Please enter a keyword for the Transposition cipher."), "";
        const keyLen = key.length;
        const textLen = ciphertext.length;
        const numRows = Math.ceil(textLen / keyLen);
        const numFullCols = textLen % keyLen || keyLen;
        
        const sortedKey = key.split('').map((char, index) => ({ char, index })).sort((a, b) => a.char.localeCompare(b.char));
        const colOrder = sortedKey.map(item => item.index);
        
        const grid = Array(numRows).fill(null).map(() => Array(keyLen).fill(null));
        let cipherIndex = 0;
        
        for (const originalColIndex of colOrder) {
            const rowsInThisCol = (originalColIndex < numFullCols) ? numRows : numRows - 1;
            for (let row = 0; row < rowsInThisCol; row++) {
                grid[row][originalColIndex] = ciphertext[cipherIndex++];
            }
        }
        
        let plaintext = "";
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < keyLen; col++) {
                plaintext += grid[row][col] || '';
            }
        }
        return plaintext;
    }
    transpoEncryptBtn.addEventListener('click', () => transpoOutput.value = performTranspositionEncrypt(transpoInput.value, transpoKey.value));
    transpoDecryptBtn.addEventListener('click', () => transpoOutput.value = performTranspositionDecrypt(transpoInput.value, transpoKey.value));

});