module.exports = {
    arrayPostgreToObject: (postgre) => {
        return postgre.map(postgre => postgre.toObject());
    },
    postgreToObject: (postgre) => {
        return postgre ? postgre.toObject() : postgre;
    }
}