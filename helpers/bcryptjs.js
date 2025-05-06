const bcryptjs = require('bcryptjs')

const signBcrypt = function (inPassword) {
    try {
        const salt = bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(inPassword, salt);
        return hash
    } catch (error) {
        throw error
    }
}

const verifyBcrypt = async function (inPassword,dbPassword) {
    try {
        return await bcryptjs.compare(inPassword, dbPassword);
    } catch (error) {
        throw error
    }
}

module.exports = {
    signBcrypt,
    verifyBcrypt
}