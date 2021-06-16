export const generateRandomCharacters = (size) => {
    let generatedOutput = ''
    const storedCharacters = '0123456789';
    const totalCharacterSize = storedCharacters.length
    for (let i = 0; i < size; i++) {
        generatedOutput += storedCharacters.charAt(Math.floor(Math.random() * totalCharacterSize))
    }
    return generatedOutput
}